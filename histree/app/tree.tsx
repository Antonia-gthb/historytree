import * as d3 from "d3";
import { useRef, useEffect } from "react";


type TreeNode = {
  name: string;
  children?: TreeNode[];
  value?: number;
  _children?: TreeNode[];  // _children für die Speicherung der zusammengeklappten Knoten
  };


export function CollaTree({ treedata, width = 1028 }: { treedata: TreeNode; width?: number }) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Tree Eckdaten
    const margin = { top: 10, right: 10, bottom: 10, left: 40 };
    const dx = 20;  // sorgt für Abstand zwischen den Knoten
    const root = d3.hierarchy(treedata);
    const dy = (width - margin.right - margin.left) / (1 + root.height);

    const tree = d3.tree<TreeNode>().nodeSize([dx, dy]);
    const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

    // Clear SVG before re-rendering
    d3.select(svgRef.current).selectAll("*").remove();

    // SVG erstellen
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", dx)
      .attr("viewBox", [-margin.left, -margin.top, width, dx])
      .style("max-width", "100%")
      .style("height", "auto")
      .style("font", "14px sans-serif")  // hier kann ich die Schriftgröße einstellen
      .style("user-select", "none");

    const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

    const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

    function update(source: any) {
      const duration = 250;
      const nodes = root.descendants().reverse();
      const links = root.links();

      // Neues Tree Layout
      tree(root);

      let left = root;
      let right = root;
      root.eachBefore(node => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      });

      const height = right.x - left.x + margin.top + margin.bottom;

      const transition = svg.transition()
        .duration(duration)
        .attr("height", height)
        .attr("viewBox", [-margin.left, left.x - margin.top, width, height]);

      // Nodes updaten
      const node = gNode.selectAll("g").data(nodes, d => d.data.name);

      const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (_, d) => {
          d.children = d.children ? null : d._children;
          update(d);
        });

      nodeEnter.append("circle")
        .attr("r", 2.5)
        .attr("fill", d => d._children ? "#555" : "#999");

      nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -6 : 6)
        .attr("text-anchor", d => d._children ? "end" : "start")
        .text(d => d.data.name);

      nodeEnter.merge(node).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

      node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      // Links updaten
      const link = gLink.selectAll("path").data(links, d => d.target.data.name);

      const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });

      link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);

      link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        });

      // Altes speichern
      root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    // Tree initialisieren
    root.x0 = dy / 2;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
      // d.id = i;
      // d._children = d.children;
      if (d.depth && d.data.name.length !== 7) d.children = undefined;
    });

    update(root);
  }, [treedata, width]);

  return <svg ref={svgRef}></svg>;
}

export default CollaTree;






