import * as d3 from "d3";
import { useRef, useEffect } from "react";

  

export function BarChart ({
    // Declare the chart dimensions and margins.
    newdata,
    width = 928,
    height = 500,
    marginTop = 30,
    marginRight = 0,
    marginBottom = 30,
    marginLeft = 40,
}: {
    newdata: { letter: string; frequency: number }[],
    width? : number;
    height? : number ;
    marginTop? : number;
    marginRight? : number;
    marginBottom? : number;
    marginLeft? : number;
}) {
    const svgRef = useRef<SVGSVGElement | null>(null);


useEffect(() => {
    console.log("Datenarray", newdata);
    console.log("SVG Ref:", svgRef.current);  // Überprüfe, ob das ref korrekt auf das SVG verweist.
 
  
    // Declare the x (horizontal position) scale.
    const x = d3.scaleBand()
        .domain(d3.groupSort(newdata, ([d]) => -d.frequency, (d) => d.letter)) // descending frequency
        .range([marginLeft, width - marginRight])
        .padding(0.1);
    
    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()
        .domain([0, d3.max(newdata, (d) => d.frequency) || 0])   //auch wieder hier Problem mit Rückgabe. Wenn Array ungefüllt wird undefined zurückgegeben, deswegen hier wieder sagen: wenn Array ungefüllt 0 zurückgeben
        .range([height - marginBottom, marginTop]);
        
    // Create the SVG container.
    const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");
  
    // Add a rect for each bar.
    svg.append("g")
        .attr("fill", "steelblue")
      .selectAll()
      .data(newdata)
      .join("rect")
      .attr("x", (d) => {
        const xValue = x(d.letter);
        return xValue !== undefined ? xValue : 0;  // Fallback auf 0, wenn x(d.letter) undefined ist
      })
        .attr("y", (d) => y(d.frequency))
        .attr("height", (d) => y(0) - y(d.frequency))
        .attr("width", x.bandwidth());
  
    // Add the x-axis and label.
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));
  
    // Add the y-axis and label, and remove the domain line.
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).tickFormat((yValue) => {
            // TypeScript-assertion für sicherzustellen, dass yValue ein number ist
            const value = +yValue; // Das "+" hier wandelt den Wert in eine Zahl um
            return value ? (value * 100).toFixed() : "0"; // Falls der Wert 0 oder NaN ist, gebe "0" zurück
        }))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("↑ Frequency (%)"));

}, [newdata, width, height, marginTop, marginRight, marginBottom, marginLeft]);
  
    // Return the SVG element.

    return <svg ref={svgRef}></svg>;
  }

  export default BarChart;


