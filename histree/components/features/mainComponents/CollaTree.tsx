import * as d3 from "d3";
import { useRef, useEffect } from "react";
import useGlobalContext from "@/app/Context";
import { cSchemes } from "../colorSchemes";

type MyNode = d3.HierarchyPointNode<TreeNode> & {
  x0: number;
  y0: number;
  _children?: MyNode[];
  color?: string;
}

export type TreeNode = {
  name: string;
  children?: TreeNode[];
  originalName?: string,  // ? means: property does not have to be present in the JSON data set and is optional!
  value?: number;
  count?: number;
  _children?: TreeNode[];  // _children for storing the collapsed nodes
  color?: string;
};

interface CollaTreeProps {
  treedata: TreeNode;
  width: number;
}

{/* The code from the tree. This is where the SVG is created and the logic for the visualization is written */ }

export default function CollaTree({
  treedata,
  width,  //width from SVG
}: CollaTreeProps) {
  const {
    selectedSchemeName,
    isExpanded,
    threshold,
    scalingFactor,
    selectedMutations,
    highlightMutation,
    geneticEventsName,
    setGeneticEventsName,
    setSelectedMutations,
    setHighlightMutation,
  } = useGlobalContext();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const colorScaleRef = useRef<d3.ScaleOrdinal<string, string, never> | null>(null);
  const nodeSelectionRef = useRef<d3.Selection<SVGGElement, MyNode, SVGGElement, unknown> | null>(null);
  const selectedLinksRef = useRef<d3.Selection<SVGPathElement, d3.HierarchyLink<MyNode>, SVGGElement, unknown> | null>(null);
  const mutationNamesRef = useRef<string[] | null>(null);
  const factorRef = useRef<number>(scalingFactor);
  const maxCountRef = useRef<number>(1);
  const highlightedLinkRef = useRef<d3.HierarchyLink<MyNode> | null>(null);
  const rootRef = useRef<MyNode | null>(null);
  const highlightRef = useRef<string>(highlightMutation);
  const finalOrderRef = useRef<string[]>([]);



  //the refs above are used to save data, so that the tree does not re-render every time a prop changes, the code for the useEffects is found at the end

  //function to name each node individually, otherwise there were problems with the animation
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
  //function for filtering the data for the event filter. Only the mutations that are selected are filtered out.  
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


  //function for filtering when a threshold is set
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

  //function to save all of the names of the genetic events in an array
  function collectAllNames(node: TreeNode, out: string[] = []): string[] {
    const name = node.originalName ?? node.name;
    if (name !== "root") out.push(name);
    if (node.children) {
      node.children.forEach(child => collectAllNames(child, out));
    }
    const allNames = [...new Set(out)]
    return allNames;
  }

  useEffect(() => {
    if (!svgRef.current) return;

    const margin = { top: 20, right: 20, bottom: 20, left: 40 };   //the margin around the tree
    const dx = 35;  //distance between the nodes

    // if-loop to update mutation names
    if (!mutationNamesRef.current) {
      const mutationNames: string[] = [];
      numberNodes(treedata, "", mutationNames); // collect mutation names
      mutationNamesRef.current = mutationNames;

      setSelectedMutations(mutationNames);
    }
    //if the array of selectedMutations equals zero and the geneticEventsName array is bigger than zero, update the selectedMutations array to the mutationNamesRef
    if (selectedMutations.length === 0 && geneticEventsName.length > 0) {
      setSelectedMutations(mutationNamesRef.current);
      return;
    }
    //here the filtered data is defined 
    const filteredData = selectedMutations && selectedMutations.length > 0
      ? filterTreeData(treedata, selectedMutations) ?? { name: "No mutations selected", children: [] }
      : treedata;
    const filteredWithThreshold = threshold
      ? filterByThreshold(filteredData, threshold) ?? { name: "No genetic events with this threshold available", children: [] }
      : filteredData;

    const allGeneticEvents = collectAllNames(treedata);
    setGeneticEventsName(allGeneticEvents)



    //this data is then used to create the root and the tree
    const root = d3.hierarchy(filteredWithThreshold) as MyNode;
    root.sum(d => d.count || 0);
    rootRef.current = root;
    const dy = (width - margin.right - margin.left) / (1 + root.height);   //determines the position for the node texts 
    const tree = d3.tree<TreeNode>().nodeSize([dx, dy]);
    const diagonal = d3.linkHorizontal<MyNode, MyNode>().x(d => d.y).y(d => d.x);   //important for the edges!

    d3.select(svgRef.current).selectAll("*").remove();  //SVG is emptied before creating a new one

    //creating the SVG
    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current)
      .attr("viewBox", [-margin.left, -margin.top, width, dx])
      .attr("width", "100%")
      .style("height", "auto")
      .style("font", "12px sans-serif")  // adapt font size
      .style("user-select", "none")
      .attr("id", "histree-chart")

    //creates link group and styles them
    const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.4)
      .attr("stroke", "555")
      .attr("stroke-width", "1.5")

    //creates node group
    const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");


    //function for highlighting the paths, calculation of the ancestors of the node so that the entire path up to the node is colored purple
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


    {/*UPDATE FUNKTION */ }
    // this function is called again if treedata, isExpanded, selectedMutations or threshold change
    //then the tree is re-rendered
    //it is also called at node expansion or collapse without a re-render

    function update(source: MyNode) {
      const duration = 1200; //animation length
      const nodes = root.descendants().reverse();  //fetches the nodes, upside down, so that we start at the parent nodes
      const links = root.links() as unknown as d3.HierarchyLink<MyNode>[];  //array of all links

      tree(root);  //creates the layout

      const firstOrders = root
        .descendants()
        .filter(d => d.depth === 1)
        .map(d => d.data.originalName)
        .filter((n): n is string => typeof n === "string" && n !== "root");

      const finalOrder = [
        ...new Set([
          ...firstOrders,
          ...allGeneticEvents
        ])
      ];

      let left = root;
      let right = root;


      //which node is furthest up/down? The height is then calculated from this. x and y are reversed, as the tree runs horizontally
      root.eachBefore(node => {
        if (node.x !== undefined && node.x < (left.x ?? Infinity)) left = node;
        if (node.x !== undefined && node.x > (right.x ?? -Infinity)) right = node;
      });

      const height = right.x - left.x + margin.top + margin.bottom;  //calculates the height of the tree

      //update nodes by calling the group, selecting all nodes and connecting them with the data (name and depth, which is important for the symbols)
      const node = gNode.selectAll<SVGGElement, MyNode>("g").data(nodes, d => d.data.name + "-" + d.depth);

      //defining the transition
      const transition: d3.Transition<SVGSVGElement, unknown, null, undefined> = svg.transition()
        .duration(duration)
        .attr("height", height)
        .attr("viewBox", `${-margin.left} ${left.x - margin.top} ${width} ${height}`)  //dynamic calculation of the view box


      //calculating new nodes
      const nodeEnter = node.enter().append<SVGGElement>("g")
        .attr("transform", () => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (_, d) => {
          if (d._children || d.children) {

            root.eachBefore((node) => {
              node.x0 = node.x;
              node.y0 = node.y;
            })

            d.children = d.children ? undefined : d._children;
            update(d);
          }
        });

      {/* COLOR SCHEME */ }
      const schemeFn = cSchemes.find(s => s.name === selectedSchemeName)!.fn;

      finalOrderRef.current = finalOrder; // the correct order of the events leading to the spectrum implemented by d3 chromatic on the first render

      colorScaleRef.current = d3.scaleOrdinal<string, string>() //assign colors to events names
        .domain(finalOrder)
        .range(d3.quantize(schemeFn, allGeneticEvents.length));

      //Adding symbols
      const symbols = [d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle];
      const shapeScale = d3.scaleOrdinal<string, d3.SymbolType>()
        .domain(finalOrder)
        .range(symbols);

      nodeEnter.append("path")
        .attr("d", d => {
          if (d.depth === 0) return "";
          const type = shapeScale(d.data.originalName!);
          return d3.symbol().type(type).size(100)();
        })
        .attr("fill", d => {
          const isLeaf = !d.children && !d._children;
          return isLeaf
            ? "none"
            : colorScaleRef.current!(d.data.originalName!);             // fetches the specified color, if no children are there, no color is assigned (leaves only have the stroke)
        })
        .attr("stroke", d => colorScaleRef.current!(d.data.originalName!))  // Stroke also from d.data.color


      const textEnter = nodeEnter.append("text")  //determines the text position dynamically and keeps the root at its position at all times
        .attr("text-anchor", d => {
          if (d.depth === 0) return "start";
          return Array.isArray(d.children) && d.children.length > 0 ? "middle" : "start";
        })
        .attr("x", d => {
          if (d.depth === 0) return -25;
          return Array.isArray(d.children) && d.children.length > 0 ? 0 : 12;
        })
        .attr("y", d => {
          if (d.depth === 0) return 4;
          return Array.isArray(d.children) && d.children.length > 0 ? -12 : 4;
        });

      textEnter.each(function (d) {
        const full = d.data.originalName || d.data.name;
        const [main, rest] = full.split(" (");
        const text = d3.select(this);

        text.append("tspan")
          .text(main)
          .style("font-size", "11px");

        if (rest) {
          text.append("tspan")
            .text(` (${rest}`)
            .style("font-size", "8px");
        }
      });

      //everything is merged here and linked to the transition
      nodeEnter.merge(node).transition().duration(duration)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);


      //old nodes disappear
      node.exit().transition(transition as any).remove()
        .attr("transform", () => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      nodeSelectionRef.current = nodeEnter.merge(node);

      // updating links
      const link = gLink.selectAll<SVGPathElement, d3.HierarchyLink<MyNode>>("path")
        .data(links, d => d.target.data.name + "-" + d.target.depth);

      //create new links
      const linkEnter = link.enter().append("path")
        .attr("cursor", "pointer")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("d", d => {
          const o = {
            x: (d.source as any).x0 ?? d.source.x,
            y: (d.source as any).y0 ?? d.source.y
          };
          return (diagonal as any)({ source: o, target: o });
        });


      //Tooltip for clicking to highlight
      linkEnter.append("title")
        .text("Highlight this path");

      //Merging Links
      const linkAll = linkEnter.merge(link);

      //A link can be highlighted in purple by clicking on it
      linkAll.on("click", (_, d) => {
        if (highlightedLinkRef.current === d) {
          highlightedLinkRef.current = null;
          highlightPath(null, false);
          setHighlightMutation("");
        } else {
          highlightedLinkRef.current = d;
          highlightPath(d, true);
          setHighlightMutation("");
        }
      });

      {/* SCALING */ }

      //code for mapping the stroke width linearly to the count
      const counts = root.descendants().filter(d => d.data.originalName !== root.data.originalName).map(d => d.data.count ?? 0);  //all counts except for root
      const maxCount = counts.length > 0 ? Math.max(...counts) : 1;  //which count is the highest?
      const defaultWidth = 1.5;  //normally always 1.5 px as default size, or when scaling is off
      maxCountRef.current = maxCount;
      const defaultMax = 10 + factorRef.current;  //the width must not be greater
      const baseScale = factorRef.current === 0
        ? () => defaultWidth
        : d3.scaleLinear<number>()
          .domain([0, maxCount])
          .range([factorRef.current, defaultMax]);  //stroke width is distributed over the current factor that we get from the page and the maximum width, depending on count

      //link transition
      linkAll.transition(transition as any)
        .attr("d", diagonal as any)
        .attr("stroke-width", d => baseScale(d.target.data.count as any ?? 0));

      //old links disappear
      link.exit().transition(transition as any).remove()
        .attr("d", () => {
          const o = { x: source.x, y: source.y };
          return (diagonal as any)({ source: o, target: o });
        })

      selectedLinksRef.current = linkAll;

      //tooltip
      nodeEnter.append("title")
        .text(d => {
          const count = d.data.count ?? 0;
          const ancestorNames = d.ancestors()
            .reverse() // start at root
            .map(a => a.data.originalName || a.data.name)
            .filter(name => name !== "root")
            .join(" → ");

          return `${ancestorNames} | Patient Count: ${count}`;
        });

      //save old
      root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    //initialize tree
    root.x0 = 0;
    root.y0 = 0;
    if (isExpanded) {
      root.descendants().forEach(d => {
        d._children = d.children;
        d.children = d._children;
      });
    } else {
      root.descendants().forEach(d => {
        d._children = d.children;
        if (d.depth && d.data.name.length !== 1) d.children = undefined;  //on the first render only the first depth will be displayed
      });
    }

    update(root);

  }, [treedata, selectedMutations, threshold, isExpanded]);


  //in the following lines there are several useEffects so that the tree does not have to be re-rendered each time a dependency changes

  {/* USEEFFECT COLOR SCHEME */ }

  useEffect(() => {
    const scale = colorScaleRef.current;
    const node = nodeSelectionRef.current!
    const domain = finalOrderRef.current;

    if (!scale || !node) return;

    const fn = cSchemes.find(s => s.name === selectedSchemeName)!.fn;
    // generate as many colors as in the domain length
    const newColors = d3.quantize(fn, domain.length);

    scale.range(newColors);

    node
      .selectAll<SVGPathElement, MyNode>("path")
      .transition()
      .duration(600)
      .attr("fill", d =>
        !d.children && !d._children
          ? "none"
          : scale(d.data.originalName || d.data.name)
      )
      .attr("stroke", d =>
        scale(d.data.originalName || d.data.name)
      );
  }, [selectedSchemeName]);


  {/* USEEFFECT HIGHLIGHT MUTATION*/ }

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


  {/* USEEFFECT SCALING */ }
  useEffect(() => {
    if (!selectedLinksRef.current) return;

    factorRef.current = scalingFactor;

    const defaultMax = 10 + factorRef.current;
    const defaultWidth = 1.5;
    const baseScale = factorRef.current === 0
      ? () => defaultWidth
      : d3.scaleLinear<number>()
        .domain([0, maxCountRef.current])
        .range([factorRef.current, defaultMax]);

    selectedLinksRef.current
      .attr("stroke-width", d => baseScale(d.target.data.count as any ?? 0));
  }, [scalingFactor]);

  return <svg ref={svgRef}></svg>;
}





