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
  lineWidthFactor: number[];
  onMutationNamesReady?: (names: string[]) => void;
  selectedMutations?: string[] | undefined,
}

export default function CollaTree({
  treedata,
  width = 1028,
  colorScheme,
  shouldExpand,
  lineWidthFactor,
  onMutationNamesReady, // Optionaler Callback
  selectedMutations = [],
}: CollaTreeProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const colorScaleRef = useRef<d3.ScaleOrdinal<string, string, never> | null>(null);
  const nodeSelectionRef = useRef<d3.Selection<SVGGElement, MyNode, SVGGElement, unknown> | null>(null);
  const selectedLinksRef = useRef<d3.Selection<SVGPathElement, d3.HierarchyLink<MyNode>, SVGGElement, unknown> | null>(null);
  const mutationNamesRef = useRef<string[] | null>(null); // wird nur einmal gesetzt


  function numberNodes(node: TreeNode, parentName = "", mutationNames: string[] = []) {
    if (!node.originalName) {
      node.originalName = node.name; // Speichert den ursprünglichen Namen nur einmal
      mutationNames.push(node.name);
    }

    if (parentName) {
      node.name = `${parentName}_${node.name}`;  // Elternnamen hinzufügen
    }

    if (node.children) {
      node.children.forEach((child, index) => {
        numberNodes(child, `${node.name}_${index + 1}`, mutationNames);  // rekursiv durchlaufen
      });
    }

  }

  function filterTreeData(tree: TreeNode, selectedMutations: string[]): TreeNode | null {
    const isActive = (name: string | undefined) => {
      if (!name) return false;
      return selectedMutations.includes(name);
    };

    // Wenn dieser Knoten eine Mutation ist, die nicht aktiv ist: entfernen
    const originalName = tree.originalName || tree.name;
    if (!isActive(originalName)) {
      return null;
    }

    // Wenn Kinder da sind, werden sie rekursiv geprüft
    const filteredChildren = tree.children
      ?.map(child => filterTreeData(child, selectedMutations))
      .filter(child => child !== null) as TreeNode[] | undefined;

    return {
      ...tree,
      children: filteredChildren?.length ? filteredChildren : undefined,
    };
  }

  console.log("CollaTree Selected Mutations:", selectedMutations);

  useEffect(() => {
    if (!svgRef.current) return;

    // Tree Eckdaten
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const dx = 20;  // sorgt für Abstand zwischen den Knoten

    const filteredData = selectedMutations && selectedMutations.length > 0
      ? filterTreeData(treedata, selectedMutations) ?? { name: "empty", children: [] }
      : treedata;
    console.log("filteredData:", filteredData);
    const root = d3.hierarchy(filteredData) as MyNode;
    root.sum(d => d.count || 0);
    const dy = (width - margin.right - margin.left) / (1 + root.height);

    const tree = d3.tree<TreeNode>().nodeSize([dx, dy]);   // Fehler war hier: muss den Typ 2 Mal definieren (!!!!!!, Quelltyp und Zieltyp)
    const diagonal = d3.linkHorizontal<MyNode, MyNode>().x(d => d.y).y(d => d.x);

    // Clear SVG before re-rendering
    d3.select(svgRef.current).selectAll("*").remove();

    // SVG erstellen
    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current)
      .attr("width", "100%")
      .attr("height", null)
      .attr("viewBox", [-margin.left, -margin.top, width, dx])
      .style("max-width", "100%")
      .style("height", "auto")
      .style("font", "14px sans-serif")  // hier kann ich die Schriftgröße einstellen
      .style("user-select", "none")
      .style("display", "block")  // SVG als Block-Element
      .style("margin", "0 auto")
      .attr("id", "histree-chart")

    const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)

    const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

    if (!mutationNamesRef.current) {
      const mutationNames: string[] = [];
      numberNodes(treedata, "", mutationNames);
      mutationNamesRef.current = mutationNames;

      if (onMutationNamesReady) {
        onMutationNamesReady([...new Set(mutationNames)]);
      }
    }

    const mutationNames = mutationNamesRef.current!;


    colorScaleRef.current = d3.scaleOrdinal<string, string>()
      .domain(mutationNames)
      .range(colorScheme);

    function update(source: MyNode) {
      const duration = 1500;
      const nodes = root.descendants().reverse();
      const links = root.links() as unknown as d3.HierarchyLink<MyNode>[];


      tree(root);


      let left = root;
      let right = root;

      root.eachBefore(node => {
        if (node.x !== undefined && node.x < (left.x ?? Infinity)) left = node;
        if (node.x !== undefined && node.x > (right.x ?? -Infinity)) right = node;
      });


      const height = right.x - left.x + margin.top + margin.bottom;

      // Nodes updaten
      const node = gNode.selectAll<SVGGElement, MyNode>("g").data(nodes, d => d.data.name + "-" + d.depth);

      const transition: d3.Transition<SVGSVGElement, unknown, null, undefined> = svg.transition()
        .duration(duration)
        .attr("height", height)
        .attr("viewBox", `${-margin.left} ${left.x - margin.top} ${width} ${height}`)

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


      nodeEnter.append("path")
        .attr("d", d => {

          if (d.depth === 0) return "";
          const symbols = [d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle];

          const hash = (str: string) => {
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
          //const color = colorScaleRef.current!(d.data.originalName || d.data.name);
          return isLeaf
            ? "none"
            : colorScaleRef.current!(d.data.originalName || d.data.name);
        })
        //const color = colorScaleRef.current!(d.data.originalName || d.data.name);
        //return color;
        .attr("stroke", d => {
          // Umriss immer farbig
          return colorScaleRef.current!(d.data.originalName || d.data.name);
        })
        .attr("stroke-width", 3);

      nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -10 : 10)
        .attr("text-anchor", d => d._children ? "end" : "start")
        .text(d => d.data.originalName || d.data.name)
        .attr("fill-opacity", 0) // Startet unsichtbar
        .transition()
        .duration(300)
        .attr("fill-opacity", 1); // Erscheint sanft

      nodeEnter.merge(node).transition().duration(duration)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1)
        .select("path")
        .attr("fill", d => {
          const isLeaf = !d.children && !d._children;
          return isLeaf
            ? "none"
            : colorScaleRef.current!(d.data.originalName || d.data.name);
        })
        .attr("stroke", d =>
          colorScaleRef.current!(d.data.originalName || d.data.name)
        );

      node.exit().transition(transition as any).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      nodeSelectionRef.current = nodeEnter.merge(node); // Speichert die Auswahl für spätere Updates

      // Links updaten
      const link = gLink.selectAll<SVGPathElement, d3.HierarchyLink<MyNode>>("path").data(links, d => d.target.data.name + "-" + d.target.depth);



      const linkEnter = link.enter().append("path")
        .attr("d", (d: d3.HierarchyLink<MyNode>) => {
          // Fallback auf x und y, falls x0 oder y0 nicht definiert sind
          const o = { x: d.source.x0 ?? d.source.x, y: d.source.y0 ?? d.source.y };
          return diagonal({ source: o, target: o }); // Linien beginnen und enden am gleichen Punkt
        })
        .attr("stroke-width", (d: d3.HierarchyLink<MyNode>) => {
          // Falls count nicht definiert ist, sollte default 1 verwendet werden
          const count = d.target.data.count ?? 0;
          return count as any ? Math.max(1, count as any / lineWidthFactor[0]) : 1;
        });



      link.merge(linkEnter).transition(transition as any)
        .attr("d", diagonal as any);


      link.exit().transition(transition as any).remove()
        .attr("d", d => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        })

      selectedLinksRef.current = link.merge(linkEnter);

      // Altes speichern
      root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    // Tree initialisieren
    root.x0 = 0;
    root.y0 = 0;
    if (shouldExpand) {
      // Alle Knoten aufklappen
      root.descendants().forEach(d => {
        d._children = d.children;
        d.children = d._children; // Alle Kinder zeigen
      });
    } else {
      // Standardverhalten: Nur Wurzel zeigen
      root.descendants().forEach(d => {
        d._children = d.children;
        if (d.depth && d.data.name.length !== 1) d.children = undefined;
      });
    }


    update(root);

  }, [treedata, shouldExpand, selectedMutations]);

  useEffect(() => {
    if (colorScaleRef.current && nodeSelectionRef.current) {
      colorScaleRef.current.range(colorScheme);
      nodeSelectionRef.current
        .select("path") // Nur die Symbole der Nodes
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

  useEffect(() => {

    if (selectedLinksRef.current) {
      selectedLinksRef.current
        .attr("stroke-width", d => {
          const factor = lineWidthFactor[0] || 1;
          return d.target.data.count ? Math.max(1, d.target.data.count / factor) : 1;
        });
    }
  }, [lineWidthFactor]);


  return <svg ref={svgRef}></svg>;
}



