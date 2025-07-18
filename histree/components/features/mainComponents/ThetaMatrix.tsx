"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface ThetaMatrixProps {
    mutationNames: string[];
    data: { row: string; column: string; value: number }[];
}

export default function ThetaMatrix({ mutationNames, data }: ThetaMatrixProps) {
    const ref = useRef<SVGSVGElement | null>(null);
    const mutationNamesKey = mutationNames.join(",");

    useEffect(() => {
        if (!ref.current || !data || data.length === 0) return;

        {/* Ref erstellen, um mit D3 DOM manipulieren zu können */ }

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        const margin = { top: 60, right: 40, bottom: 60, left: 70 };  //Abstand der Matrix

        const observationRow = data.filter((d) => d.row === "Observation");  //Observation Daten
        const matrixData = data.filter((d) => d.row !== "Observation");   //alle Daten ohne Observation
        const baseRate = matrixData.filter((d) => d.row === d.column); //die Diagonalen Daten für die Base Rate
        const coloredData = matrixData.filter((d) => d.row !== d.column);  // alle außer Diagonale


        const rows = Array.from(new Set(matrixData.map((d) => d.row)));
        const columns = Array.from(new Set(matrixData.map((d) => d.column)));

        const numCols = columns.length;
        const numRows = rows.length;
        const cellSize = 20;

        const gridWidth = numCols * cellSize;
        const gridHeight = (numRows + 2) * cellSize; // +1 für Base Rate, +1 für Observation

        const x = d3.scaleBand<string>()
            .domain(columns)
            .range([0, gridWidth])
            .padding(0.01);

        const y = d3.scaleBand<string>()
            .domain(["BaseRate", ...rows, "Observation"])  // alle Zeilen inklusive BaseRate + Observation
            .range([0, gridHeight])
            .padding(0.01);

        const baseRateOffset = -10; // Abstand über Matrix
        const observationOffset = gridHeight - 10;  // Abstand unter Matrix

        svg
            .attr("width", gridWidth + margin.left + margin.right)
            .attr("height", gridHeight + margin.top + margin.bottom);

        const g = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const values = coloredData.map((d) => d.value).filter((v) => !isNaN(v));
        const maxVal = Math.max(...values);
        const minVal = Math.min(...values);

        const colorScale = d3.scaleLinear<string>()
            .domain([minVal, 0, maxVal])
            .range(["blue", "white", "red"]);

        const baseRateColor = d3.scaleLinear<string>()
            .domain([0, maxVal])
            .range(["white", "grey"]);

        // Tooltip
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("opacity", 0)
            .style("background", "white")
            .style("border", "1px solid #ccc")
            .style("padding", "4px")
            .style("font-size", "12px");

        const onMouseOver = () => tooltip.style("opacity", 1);
        const onMouseMove = (event: MouseEvent, d: any) => {
            tooltip
                .html(`<strong>${d.column} ➞ ${d.row}</strong><br/>`)
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY + 10 + "px");
        };
        const onMouseLeave = () => tooltip.style("opacity", 0);

        const labelOffsetY = -y.bandwidth() + 8;

        g.selectAll(".x-label")
            .data(columns)
            .enter()
            .append("text")
            .attr("class", "x-label")
            .attr("x", (d) => x(d)! + x.bandwidth() / 2)
            .attr("y", labelOffsetY)
            .attr("transform", (d) =>
                `rotate(-45, ${x(d)! + x.bandwidth() / 2}, ${labelOffsetY})`
            )
            .style("font-size", "6px")
            .style("font-family", "sans-serif")
            .attr("text-anchor", "start")
            .text((d) => d);

        g.selectAll(".y-label")
            .data(rows)
            .enter()
            .append("text")
            .attr("class", "y-label")
            .attr("x", -5)
            .attr("y", (d) => y(d)! + y.bandwidth() / 2)
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "middle")
            .style("font-size", "6px")
            .style("font-family", "sans-serif")
            .text((d) => d)

        // Matrixzellen
        g.selectAll("rect.matrix")
            .data(matrixData)
            .enter()
            .append("rect")
            .attr("class", "matrix-bg")
            .attr("x", (d) => x(d.column)!)
            .attr("y", (d) => y(d.row)!)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", "white")
            .style("stroke", "black")
            .style("cursor", "default")
            .style("user-select", "none");

        g.selectAll("rect.matrix")
            .data(coloredData)
            .enter()
            .append("rect")
            .attr("class", "matrix")
            .attr("x", (d) => x(d.column)!)
            .attr("y", (d) => y(d.row)!)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", (d) => colorScale(d.value))
            .style("stroke", "black")
            .style("opacity", 0.7)
            .on("mouseover", onMouseOver)
            .on("mousemove", onMouseMove)
            .on("mouseleave", onMouseLeave)
            .style("cursor", "default")
            .style("user-select", "none");

        g.selectAll(".value-text")
            .data(coloredData)
            .enter()
            .append("text")
            .attr("class", "value-text")
            .attr("x", (d) => x(d.column)! + x.bandwidth() / 2)
            .attr("y", (d) => y(d.row)! + y.bandwidth() / 2)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("font-size", "6px")
            .text((d) => d.value === 0 ? "" : d.value.toFixed(2))
            .style("cursor", "default")
            .style("user-select", "none");
            

        // Base Rate Zellen (Diagonale)
        g.selectAll(".baserate-cell")
            .data(baseRate)
            .enter()
            .append("rect")
            .attr("class", "baserate-cell")
            .attr("x", (d) => x(d.column)!)
            .attr("y", baseRateOffset)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", (d) => d.value === 0 ? "white" : baseRateColor(d.value))
            .style("stroke", "black")
            .style("cursor", "default")
            .style("user-select", "none");


        g.selectAll(".baserate-text")
            .data(baseRate)
            .enter()
            .append("text")
            .attr("x", (d) => x(d.column)! + x.bandwidth() / 2)
            .attr("y", baseRateOffset + y.bandwidth() / 2)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("font-size", "6px")
            .text((d) => d.value === 0 ? "" : d.value.toFixed(2))
            .style("cursor", "default")
            .style("user-select", "none");

        g.append("text")
            .attr("x", -10)
            .attr("y", baseRateOffset + y.bandwidth() / 2)
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "middle")
            .style("font-size", "6px")
            .style("font-family", "sans-serif")
            .style("font-weight", "bold")
            .text("Base Rate")
            .style("cursor", "default")
            .style("user-select", "none");

        // Observation Zellen
        g.selectAll(".observation-cell")
            .data(observationRow)
            .enter()
            .append("rect")
            .attr("class", "observation-cell")
            .attr("x", (d) => x(d.column)!)
            .attr("y", observationOffset)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", (d) => d.value === 0 ? "white" : colorScale(d.value))
            .style("stroke", "black")
            .style("cursor", "default")
            .style("user-select", "none");

        g.selectAll(".observation-text")
            .data(observationRow)
            .enter()
            .append("text")
            .attr("x", (d) => x(d.column)! + x.bandwidth() / 2)
            .attr("y", observationOffset + y.bandwidth() / 2)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("font-size", "6px")
            .text((d) => d.value === 0 ? "" : d.value.toFixed(2))
            .style("cursor", "default")
            .style("user-select", "none");


        g.append("text")
            .attr("x", -10)
            .attr("y", observationOffset + y.bandwidth() / 2)
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "middle")
            .style("font-size", "6px")
            .style("font-family", "sans-serif")
            .style("font-weight", "bold")
            .text("Observation")
            .style("cursor", "default")
            .style("user-select", "none");
    }, [data, mutationNamesKey]);



    return (
        <div>
            <svg ref={ref} />
        </div>
    );
}
