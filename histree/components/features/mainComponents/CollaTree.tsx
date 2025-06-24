import * as d3 from "d3";
import { useRef, useEffect } from "react";

type MyNode = d3.HierarchyPointNode<TreeNode> & {
  x0: number;
  y0: number;
  _children?: MyNode[];
  color?: string;
}

type TreeNode = {
  name: string;
  children?: TreeNode[];
  originalName?: string,  // ? bedeutet hier: eigenschaft muss nicht im JSON Datensatz vorhanden sein und ist optional! 
  value?: number;
  count?: number;
  _children?: TreeNode[];  // _children für die Speicherung der zusammengeklappten Knoten
  color?: string;
};

interface CollaTreeProps {
  treedata: TreeNode;
  width?: number;
  colorScheme: string[];
  shouldExpand: boolean;
  threshold?: number;
  lineWidthFactor: number[];
  onMutationNamesReady?: (names: string[]) => void;
  selectedMutations?: string[] | undefined;
  highlightMutation?: string;
  onHighlightMutationChange?: (value: string) => void;
}

{/* Der Code vom Baum. Hier wird das SVG erstellt und hier ist auch sehr viel funktionaler Code dabei. Der Code ist allerdings extrem lang.*/ }

export default function CollaTree({
  treedata,
  width = 1200,  //Breite vom SVG
  colorScheme,
  threshold,
  shouldExpand,
  lineWidthFactor,
  onMutationNamesReady,
  selectedMutations = [],
  highlightMutation = "",
  onHighlightMutationChange,
}: CollaTreeProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const colorScaleRef = useRef<d3.ScaleOrdinal<string, string, never> | null>(null);
  const nodeSelectionRef = useRef<d3.Selection<SVGGElement, MyNode, SVGGElement, unknown> | null>(null);
  const selectedLinksRef = useRef<d3.Selection<SVGPathElement, d3.HierarchyLink<MyNode>, SVGGElement, unknown> | null>(null);
  const mutationNamesRef = useRef<string[] | null>(null); // wird nur einmal gesetzt
  const factorRef = useRef<number>(lineWidthFactor[0]);
  const maxCountRef = useRef<number>(1);
  const highlightedLinkRef = useRef<d3.HierarchyLink<MyNode> | null>(null);
  const rootRef = useRef<MyNode | null>(null);
  const highlightRef = useRef<string>(highlightMutation);

  //die Refs oben sind dazu da, dass der Baum nicht jedes mal neu rendert, wenn etwas anders eingestellt wird

  //Funktion, um jeden Knoten einzeln zu bennenen, da es sonst Probleme mit der Animation gab
  function numberNodes(node: TreeNode, parentName = "", mutationNames: string[] = []) {

    const orig = node.originalName ?? node.name;
    node.originalName = orig;
    mutationNames.push(orig);

    if (parentName) {
      node.name = `${parentName}_${orig}`;
    }

    if (node.children) {
      node.children.forEach((child, index) =>
        numberNodes(child, `${node.name}_${index + 1}`, mutationNames)
      );
    }
  }

  //Funktion zum Filtern der Daten für den Eventfilter. Nur die Mutationen, die ausgewählt sind, werden herausgefiltert.
  function filterTreeData(tree: TreeNode, selectedMutations: string[]): TreeNode | null {
    const isActive = (name: string | undefined) => {
      if (!name) return false;
      return selectedMutations.includes(name);
    };

    const originalName = tree.originalName || tree.name;
    if (!isActive(originalName)) {
      return null;
    }

    const filteredChildren = tree.children
      ?.map(child => filterTreeData(child, selectedMutations))
      .filter(child => child !== null) as TreeNode[] | undefined;

    return {
      ...tree,
      children: filteredChildren?.length ? filteredChildren : undefined,
    };
  }

  //Funktion zum Filtern, wenn ein Threshold eingestellt ist
  function filterByThreshold(node: TreeNode, thr: number): TreeNode | null {
    if ((node.count ?? 0) < thr) return null;

    const children = node.children
      ?.map(child => filterByThreshold(child, thr))
      .filter((c): c is TreeNode => c !== null);

    return {
      ...node,
      children: children && children.length > 0 ? children : undefined,
    };
  }

  useEffect(() => {
    if (!svgRef.current) return;

    const margin = { top: 20, right: 20, bottom: 20, left: 40 };   //der Abstand um den Baum herum
    const dx = 25;  // sorgt für Abstand zwischen den Knoten


    //hier werden die gefilterten Daten zusammengebracht, wenn nur bestimmte Mutationen ausgewählt sind und ein Threshold gesetzt ist
    const filteredData = selectedMutations && selectedMutations.length > 0
      ? filterTreeData(treedata, selectedMutations) ?? { name: "No mutations selected", children: [] }
      : treedata;
    const filteredWithThreshold = threshold
      ? filterByThreshold(filteredData, threshold) ?? { name: "No genetic events with this threshold available", children: [] }
      : filteredData;

    //mit diesen Daten wird dann die root und der Baum erstellt
    const root = d3.hierarchy(filteredWithThreshold) as MyNode;
    root.sum(d => d.count || 0);
    rootRef.current = root;
    const dy = (width - margin.right - margin.left) / (1 + root.height);   //ermittelt die Position für die Texte der Knoten später
    const tree = d3.tree<TreeNode>().nodeSize([dx, dy]);
    const diagonal = d3.linkHorizontal<MyNode, MyNode>().x(d => d.y).y(d => d.x);   //wichtig für die Linien! 


    d3.select(svgRef.current).selectAll("*").remove();  //SVG wird erst geleert, bevor es neu erstellt wird

    //Hier wird das SVG erstellt
    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current)
      .attr("viewBox", [-margin.left, -margin.top, width, dx])
      .style("height", "auto")
      .style("font", "14px sans-serif")  // hier kann ich die Schriftgröße einstellen
      .style("user-select", "none")
      .attr("id", "histree-chart")

    //Hier wird die Gruppe Link erstellt und wie die Links aussehen sollen festgelegt
    const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.4)
      .attr("stroke", "555")
      .attr("stroke-width", "1.5")
    
    //Erstellen der Gruppe Node
    const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");


    //Funktion zum Highlighten der Paths, Berechnung der Vorfahren des Knotens, damit der gesamte Pfad bis zu dem Knoten lila eingefärbt wird
    function highlightPath(link: d3.HierarchyLink<MyNode> | null, active: boolean) {
      gLink.selectAll<SVGPathElement, d3.HierarchyLink<MyNode>>("path")
        .attr("stroke", d => {
          if (!active || !link) return "#555";
          const ancestors = new Set(link.target.ancestors());
          return ancestors.has(d.target) ? "#372aac" : "#555";
        })
        .attr("stroke-opacity", d => {
          if (!active || !link) return 0.4;
          const ancestors = new Set(link.target.ancestors());
          return ancestors.has(d.target) ? 1 : 0.4;
        });
    }
    // if-Schleife, um die Mutationsnamen zu updaten und an Page.tsx zu übergeben. Mit onMutationNamesReady werden die neuen Mutationsnamen in page.tsx im State gespeichert
    if (!mutationNamesRef.current) {
      const mutationNames: string[] = [];
      numberNodes(treedata, "", mutationNames);
      mutationNamesRef.current = mutationNames;

      if (onMutationNamesReady) {
        onMutationNamesReady([...new Set(mutationNames)]);
      }
    }

    //Farbschema auf den Baum anwenden
    const mutationNames = mutationNamesRef.current!;

    colorScaleRef.current = d3.scaleOrdinal<string, string>()
      .domain(mutationNames)
      .range(colorScheme);
    
    {/*UPDATE FUNKTION */}  //nach dem 1. rendern wird diese Funktion aufgerufen, wenn sich treedata, shouldExpand, selectedMutations oder threshold ändern
    //dann wird der Baum neu gerendert

    function update(source: MyNode) {
      const duration = 1200; //Animationsdauer
      const nodes = root.descendants().reverse();  //holt sich die Nodes, verkehrt herum, damit wir bei den übergeordneten starten
      const links = root.links() as unknown as d3.HierarchyLink<MyNode>[];  //Array von allen Links

      tree(root);  //macht das Layout

      let left = root;
      let right = root;
      

      //Welcher Knoten steht am weitesten oben/unten? Daraus wird dann die Höhe berechnet. x und y sind umgedreht, da der Baum horizontal läuft
      root.eachBefore(node => {
        if (node.x !== undefined && node.x < (left.x ?? Infinity)) left = node;
        if (node.x !== undefined && node.x > (right.x ?? -Infinity)) right = node;
      });

      const height = right.x - left.x + margin.top + margin.bottom;  //Höhe vom Baum berechnen

      // Nodes updaten, durch Aufruf der Gruppe, Auswahla aller Nodes und verbinden mit den Daten (Name und Tiefe, die für die Symbole wichtig ist)
      const node = gNode.selectAll<SVGGElement, MyNode>("g").data(nodes, d => d.data.name + "-" + d.depth);
 
      //Definition der Transition
      const transition: d3.Transition<SVGSVGElement, unknown, null, undefined> = svg.transition()
        .duration(duration)
        .attr("height", height)
        .attr("viewBox", `${-margin.left} ${left.x - margin.top} ${width} ${height}`)  //Dynamische Berechnung der ViewBox 

      //Hier werden die neuen Nodes berechnet
      const nodeEnter = node.enter().append<SVGGElement>("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (_, d) => {
          if (!d._children) return;

          root.eachBefore((node) => {
            node.x0 = node.x;
            node.y0 = node.y;
          })

          d.children = d.children ? undefined : d._children;
          update(d);
        });
      
        //Symbol wird hinzugefügt
      nodeEnter.append("path")
        .attr("d", d => {

          if (d.depth === 0) return "";
          const symbols = [d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle];  //drei verschiedene Symbole

          const hash = (str: string) => {  //hash für die Alterierung, gleiche Namen bekommen das gleiche Symbol
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
              hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            return hash;
          };
          const nodeName = d.data.originalName || d.data.name;
          const symbolIndex = Math.abs(hash(nodeName)) % symbols.length;
          return d3.symbol().type(symbols[symbolIndex]).size(100)();
        })
        .attr("fill", d => {
          const isLeaf = !d.children && !d._children;
          return isLeaf  
            ? "none"                                                       //wenn ein Knoten keine Children hat, soll das Symbol innen transparent sein mit stroke
            : colorScaleRef.current!(d.data.originalName || d.data.name);  
        })
        .attr("stroke", d => {
          return colorScaleRef.current!(d.data.originalName || d.data.name); //Rand
        })
        .attr("stroke-width", 3);  //Dicke des Rands
      
        //Hier wird der Text an die Nodes gebracht
      nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -10 : 10)
        .attr("text-anchor", d => d._children ? "end" : "start")
        .text(d => (d.data.originalName || d.data.name))      //.split(/[ /]/)[0])
        .attr("fill-opacity", 0)
        .transition()
        .duration(100)
        .attr("fill-opacity", 1);

      //hier wird alles gemerged und mit der Transition verbunden
      nodeEnter.merge(node).transition().duration(duration)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);


      //alte Knoten verschwinden
      node.exit().transition(transition as any).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      nodeSelectionRef.current = nodeEnter.merge(node);

      // Links updaten
      const link = gLink.selectAll<SVGPathElement, d3.HierarchyLink<MyNode>>("path")
        .data(links, d => d.target.data.name + "-" + d.target.depth);

      //neue Links erstellen
      const linkEnter = link.enter().append("path")
        .attr("cursor", "pointer")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("d", d => {
          const o = { x: d.source.x0 ?? d.source.x, y: d.source.y0 ?? d.source.y };
          return diagonal({ source: o, target: o });
        });
      
        //Tooltip für Anklicken zum Highlighten
      linkEnter.append("title")
        .text("Highlight this path");
      
      //Links Mergen
      const linkAll = linkEnter.merge(link);

      //Durch Klicken kann ein Link gehighlighted werden in Lila
      linkAll.on("click", (_, d) => {
        onHighlightMutationChange?.("");
        if (onHighlightMutationChange) {
          onHighlightMutationChange("");
        }
        if (highlightedLinkRef.current === d) {
          highlightedLinkRef.current = null;
          highlightPath(null, false);
        } else {
          highlightedLinkRef.current = d;
          highlightPath(d, true);
        }
      });

      {/* SCALING */}

      //Code für die Scale
      const counts = root.descendants().filter(d => d.data.originalName !== root.data.originalName).map(d => d.data.count ?? 0);  //alle Counts außer den von root
      const maxCount = counts.length > 0 ? Math.max(...counts) : 1;  //welcher Count ist der Größte davon?
      const defaultWidth = 1.5;  //normalerweise immer 1.5 px als Standardgröße, bzw. wenn Scaling aus ist
      maxCountRef.current = maxCount;
      const defaultMax = 10 + factorRef.current;  //größer darf die Breite nicht sein
      const baseScale = factorRef.current === 0
        ? () => defaultWidth
        : d3.scaleLinear<number>()
          .domain([0, maxCount])
          .range([factorRef.current, defaultMax]);  //Breite wird verteilt auf den aktuellen Faktor, den wir über die Page bekommen und der Maximalen Breite, abhängig von Count
      
          //
      linkAll.transition(transition as any)
        .attr("d", diagonal as any)
        .attr("stroke-width", d => baseScale(d.target.data.count ?? 0));
      
        //alte Links gehen weg
      link.exit().transition(transition as any).remove()
        .attr("d", d => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        })

      selectedLinksRef.current = linkAll;

      //Tooltip
      nodeEnter.append("title")
        .text(d => {
          const count = d.data.count ?? 0;
          const ancestorNames = d.ancestors()
            .reverse() // von vorne (bei root) starten
            .map(a => a.data.originalName || a.data.name)
            .filter(name => name !== "root")
            .join(" → ");

          return `${ancestorNames} | Patient Count: ${count}`;
        });

      //altes speichern
      root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    // Tree initialisieren
    root.x0 = 0;
    root.y0 = 0;
    if (shouldExpand) {
      root.descendants().forEach(d => {
        d._children = d.children;
        d.children = d._children;
      });
    } else {
      root.descendants().forEach(d => {
        d._children = d.children;
        if (d.depth && d.data.name.length !== 1) d.children = undefined;  //beim ersten Rendern wird nur die erste Ebene angezeigt
      });
    }

    update(root);

  }, [treedata, shouldExpand, selectedMutations, threshold]);


//Hier folgen jetzt mehrere useEffects, damit der Baum nicht jedes Mal neu gerendert werden muss

 {/* USEEFFECT FARBSCHEMA */}
  useEffect(() => {
    if (colorScaleRef.current && nodeSelectionRef.current) {
      colorScaleRef.current.range(colorScheme);
      nodeSelectionRef.current
        .select("path")
        .transition()
        .attr("fill", d => {
          const isLeaf = !d.children && !d._children;
          return isLeaf
            ? "none"
            : colorScaleRef.current!(d.data.originalName || d.data.name);
        })
        .attr("stroke", d =>
          colorScaleRef.current!(d.data.originalName || d.data.name)
        );
    }
  }, [colorScheme]);

  {/* USEEFFECT HIGHLIGHT MUTATION*/}

  useEffect(() => {
    highlightRef.current = highlightMutation;
    const selLinks = selectedLinksRef.current;
    const root = rootRef.current;

    if (!selLinks || !root || !highlightMutation) return;

    const matches = root
      .descendants()
      .filter(d => (d.data.originalName || d.data.name) === highlightMutation);

    const highlightSet = new Set<MyNode>();

    matches.forEach((m) => {
      m.ancestors().forEach(a => highlightSet.add(a as MyNode));
      highlightSet.add(m as MyNode);
      m.descendants().forEach(d => highlightSet.add(d as MyNode));
    });

    selLinks
      .transition()
      .duration(100)
      .attr("stroke", (linkData) => {
        const source = linkData.source as any;
        const target = linkData.target as any;
        return highlightSet.has(source) && highlightSet.has(target)
          ? "#372aac"
          : "#555";
      })
      .attr("stroke-opacity", (linkData) => {
        const source = linkData.source as any;
        const target = linkData.target as any;
        return highlightSet.has(source) && highlightSet.has(target)
          ? 1
          : 0.3;
      });
  }, [highlightMutation]);

{/* USEEFFECT SCALING */}
  useEffect(() => {
    if (!selectedLinksRef.current) return;

    factorRef.current = lineWidthFactor[0];

    const defaultMax = 10 + factorRef.current;
    const defaultWidth = 1.5;
    const baseScale = factorRef.current === 0
      ? () => defaultWidth
      : d3.scaleLinear<number>()
        .domain([0, maxCountRef.current])
        .range([factorRef.current, defaultMax])
        .clamp(true);

    selectedLinksRef.current
      .attr("stroke-width", d => baseScale(d.target.data.count ?? 0));
  }, [lineWidthFactor]);


  return <svg ref={svgRef}></svg>;
}





