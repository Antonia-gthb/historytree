import * as d3 from "d3";
import { useRef, useEffect } from "react";


interface HierarchyPointNode extends d3.HierarchyNode<TreeNode> {
  x: number;
  y: number;
  x0?: number;
  depth: number;
  data: TreeNode;
  y0?: number;
  _children?: HierarchyPointNode[];
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
  // Neue Prop: Callback, der die Mutation-Namen zurückgibt
  onMutationNamesReady?: (names: string[]) => void;
}

export default function CollaTree({
  treedata,
  width = 1028,
  colorScheme,
  shouldExpand,
  lineWidthFactor,
  onMutationNamesReady, // Optionaler Callback
}: CollaTreeProps) { 
  const svgRef = useRef<SVGSVGElement | null>(null);
  const colorScaleRef = useRef<d3.ScaleOrdinal<string, string, never> | null>(null);
  const nodeSelectionRef = useRef<d3.Selection<SVGGElement, HierarchyPointNode, SVGGElement, unknown> | null>(null);
  const lineWidthFactorRef = useRef<number>(200)
  const selectedLinksRef = useRef<d3.Selection<SVGPathElement, d3.HierarchyLink<HierarchyPointNode>, SVGGElement, unknown> | null>(null);



  useEffect(() => {
    if (!svgRef.current) return;

    // Tree Eckdaten
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const dx = 20;  // sorgt für Abstand zwischen den Knoten
    const root = d3.hierarchy(treedata) as HierarchyPointNode;
    root.sum(d => d.count || 0);
    const dy = (width - margin.right - margin.left) / (1 + root.height);

    const tree = d3.tree<TreeNode>().nodeSize([dx, dy]);   // Fehler war hier: muss den Typ 2 Mal definieren (!!!!!!, Quelltyp und Zieltyp)
    const diagonal = d3.linkHorizontal<d3.HierarchyPointNode<TreeNode>,
      d3.HierarchyPointNode<TreeNode>>().x(d => d.y).y(d => d.x);

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

    let mutationNames: string[] = [];
    numberNodes(treedata, "", mutationNames);
    console.log("Name", mutationNames)


    colorScaleRef.current = d3.scaleOrdinal<string, string>()
      .domain(mutationNames)
      .range(colorScheme);

    const nameGeneticEventCB = Array.from(d3.union(mutationNames));
    console.log(nameGeneticEventCB)

    if (onMutationNamesReady) {
      onMutationNamesReady(nameGeneticEventCB);
    }

    lineWidthFactorRef.current = lineWidthFactor[0];

    function update(source: HierarchyPointNode) {
      const duration = 1500;
      const nodes = root.descendants().reverse();
      const links = root.links() as unknown as d3.HierarchyLink<HierarchyPointNode>[];


      tree(root);


      let left = root;
      let right = root;
      const center = (right.x + left.y) / 2;

      const shiftAmount = width / 10;

      // Setzt die Wurzel so, dass sie horizontal in der Mitte des Containers ist
      //root.eachBefore((d) => {
      // d.y = d.y - center + width / 4;  // Verschiebt alle Knoten im SVG
      //});

      root.eachBefore(node => {
        if (node.x !== undefined && node.x < (left.x ?? Infinity)) left = node;
        if (node.x !== undefined && node.x > (right.x ?? -Infinity)) right = node;
      });


      const height = right.x - left.x + margin.top + margin.bottom;

      // Nodes updaten
      const node = gNode.selectAll<SVGGElement, HierarchyPointNode>("g").data(nodes, d => d.data.name + "-" + d.depth);

      const transition: d3.Transition<SVGSVGElement, unknown, null, undefined> = svg.transition()
        .duration(duration)
        .attr("height", null)
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
          const symbols = [
            d3.symbolCircle,
            d3.symbolSquare,
            d3.symbolTriangle,
          ];

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
          const color = colorScaleRef.current!(d.data.originalName || d.data.name);
          return color;
        });

      nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -6 : 6)
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
        .attr("fill", d => colorScaleRef.current!(d.data.originalName || d.data.name)); // 🔥

      node.exit().transition(transition as any).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      nodeSelectionRef.current = nodeEnter.merge(node); // Speichert die Auswahl für spätere Updates

      // Links updaten

      const link = gLink.selectAll<SVGPathElement, d3.HierarchyLink<HierarchyPointNode>>("path").data(links, d => d.target.data.name + "-" + d.target.depth);


      const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = { x: d.source.x0, y: d.source.y0 }; // Startpunkt = alter Punkt
          return diagonal({ source: o, target: o });  // Linien beginnen und enden am gleichen Punkt
        })
        .attr("stroke-width", d => {
          return d.target.data.count ? Math.max(1, d.target.data.count / lineWidthFactorRef.current) : 1;
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
    root.x0 = dy / 2;
    root.y0 = 2;
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

  }, [treedata, shouldExpand]);



  useEffect(() => {
    if (colorScaleRef.current && nodeSelectionRef.current) {
      colorScaleRef.current.range(colorScheme);
      nodeSelectionRef.current
        .select("path") // Nur die Symbole der Nodes
        .transition()
        .attr("fill", d => colorScaleRef.current!(d.data.originalName || d.data.name));
    }
  }, [colorScheme]);

  useEffect(() => {

    lineWidthFactorRef.current = lineWidthFactor[0];

    if (selectedLinksRef.current) {
      selectedLinksRef.current
        .attr("stroke-width", d => {
          const factor = lineWidthFactorRef.current || 1;
          return d.target.data.count ? Math.max(1, d.target.data.count / factor) : 1;
        });
    }
  }, [lineWidthFactor]);


  return <svg ref={svgRef}></svg>;

  
}



