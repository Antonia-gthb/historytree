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

export default function CollaTree({
  treedata,
  width = 1400,
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

    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const dx = 25;  // sorgt für Abstand zwischen den Knoten

    const filteredData = selectedMutations && selectedMutations.length > 0
      ? filterTreeData(treedata, selectedMutations) ?? { name: "No mutations selected", children: [] }
      : treedata;
    const filteredWithThreshold = threshold
      ? filterByThreshold(filteredData, threshold) ?? { name: "No genetic events with this threshold available", children: [] }
      : filteredData;
    const root = d3.hierarchy(filteredWithThreshold) as MyNode;
    root.sum(d => d.count || 0);
    rootRef.current = root;
    const dy = (width - margin.right - margin.left) / (1 + root.height);

    const tree = d3.tree<TreeNode>().nodeSize([dx, dy]);   // Fehler war hier: muss den Typ 2 Mal definieren (!!!!!!, Quelltyp und Zieltyp)
    const diagonal = d3.linkHorizontal<MyNode, MyNode>().x(d => d.y).y(d => d.x);


    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current)
      .attr("width", "100%")
      .attr("viewBox", [-margin.left, -margin.top, width, dx])
      .style("height", "auto")
      .style("font", "14px sans-serif")  // hier kann ich die Schriftgröße einstellen
      .style("user-select", "none")
      .attr("id", "histree-chart")

    const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.4)
      .attr("stroke", "555")
      .attr("stroke-width", "1.5")

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
          return isLeaf
            ? "none"
            : colorScaleRef.current!(d.data.originalName || d.data.name);
        })
        .attr("stroke", d => {
          return colorScaleRef.current!(d.data.originalName || d.data.name);
        })
        .attr("stroke-width", 3);

      nodeEnter.append("title")
        .text(d => {
          const count = d.data.count ?? 0;
          const childCount = d.data.children?.length ?? 0;
          return `${d.data.originalName} | Count: ${count}`;
        });

      nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -10 : 10)
        .attr("text-anchor", d => d._children ? "end" : "start")
        .text(d => (d.data.originalName || d.data.name).split(/[ /]/)[0])
        .attr("fill-opacity", 0)
        .transition()
        .duration(300)
        .attr("fill-opacity", 1);

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

      nodeSelectionRef.current = nodeEnter.merge(node);

      // Links updaten
      const link = gLink.selectAll<SVGPathElement, d3.HierarchyLink<MyNode>>("path")
        .data(links, d => d.target.data.name + "-" + d.target.depth);

      const linkEnter = link.enter().append("path")
        .attr("cursor", "pointer")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("d", d => {
          const o = { x: d.source.x0 ?? d.source.x, y: d.source.y0 ?? d.source.y };
          return diagonal({ source: o, target: o });
        });

      linkEnter.append("title")
        .text("Highlight this path");

      const linkAll = linkEnter.merge(link);

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

      const counts = root.descendants().filter(d => d.data.originalName !== root.data.originalName).map(d => d.data.count ?? 0);
      const maxCount = counts.length > 0 ? Math.max(...counts) : 1;
      const defaultWidth = 1.5;
      maxCountRef.current = maxCount;
      const defaultMax = 10 + factorRef.current;
      const baseScale = factorRef.current === 0
        ? () => defaultWidth
        : d3.scaleLinear<number>()
          .domain([0, maxCount])
          .range([factorRef.current, defaultMax])
          .clamp(true);

      linkAll.transition(transition as any)
        .attr("d", diagonal as any)
        .attr("stroke-width", d => baseScale(d.target.data.count ?? 0));

      link.exit().transition(transition as any).remove()
        .attr("d", d => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        })

      selectedLinksRef.current = linkAll;

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
        if (d.depth && d.data.name.length !== 1) d.children = undefined;
      });
    }

    update(root);

  }, [treedata, shouldExpand, selectedMutations, threshold]);

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
      .duration(300)
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





