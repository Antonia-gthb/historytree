"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface ThetaMatrixProps {
    mutationNames: string[];
    data: { group: string; variable: string; value: number }[];
}

export default function ThetaMatrix({ mutationNames, data }: ThetaMatrixProps) {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!ref.current || !data || data.length === 0) return;

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        const margin = { top: 180, right: 120, bottom: 100, left: 180 };

        const observationRow = data.filter((d) => d.group === "Observation");
        const rowData = data.filter((d) => d.group !== "Observation");

        const groups = Array.from(new Set(rowData.map((d) => d.group)));
        const variables = Array.from(new Set(rowData.map((d) => d.variable)));

        const numCols = variables.length;
        const numRows = groups.length;
        const maxCells = Math.max(numCols, numRows);
        const cellSize = 30;

        const gridWidth = numCols * cellSize;
        const gridHeight = numRows * cellSize;

        const x = d3.scaleBand<string>()
            .domain(variables)
            .range([0, gridWidth])
            .padding(0.01);

        const y = d3.scaleBand<string>()
            .domain(groups)
            .range([0, gridHeight])
            .padding(0.01);

        svg
            .attr("width", gridWidth + margin.left + margin.right)
            .attr("height", gridHeight + margin.top + margin.bottom);

        const g = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const values = data.map((d) => d.value).filter((v) => !isNaN(v));
        const minVal = d3.min(values) ?? 0;
        const maxVal = d3.max(values) ?? 1;
        const absMax = Math.max(...values.map((v) => Math.abs(v)));


        const colorScale = d3.scaleLinear<string>()
            .domain([0, absMax / 2, absMax])
            .range(["white", "blue", "red"]);

        const observationColor = d3.scaleLinear<string>()
            .domain([0, absMax])
            .range(["white", "grey"]);

        // Tooltip
        const container = d3.select(ref.current!.parentElement!);
        const tooltip = container
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "2px solid #999")
            .style("border-radius", "4px")
            .style("padding", "4px")
            .style("pointer-events", "none");

        const onMouseOver = () => tooltip.style("opacity", 1);
        const onMouseMove = (event: MouseEvent, d: any) => {
            tooltip
                .html(`<strong>${d.group} → ${d.variable}</strong><br/>Wert: ${d.value}`)
                .style("left", event.pageX + 4 + "px")
                .style("top", event.pageY - 28 + "px");
        };
        const onMouseLeave = () => tooltip.style("opacity", 0);

        // Y-Achsen-Beschriftung oben (wie X-Achse)
        const observationOffset = -y.bandwidth() - 20;
        const labelOffsetY = observationOffset - 5;

        // X-Achse Labels oben
        g.selectAll(".x-label")
            .data(variables)
            .enter()
            .append("text")
            .attr("class", "x-label")
            .attr("x", (d) => x(d)! + x.bandwidth() / 2)
            .attr("y", labelOffsetY)
            .attr("transform", (d) =>
                `rotate(-45, ${x(d)! + x.bandwidth() / 2}, ${labelOffsetY})`
            )
            .style("font-size", "10px")
            .style("font-family", "sans-serif")
            .attr("text-anchor", "start")
            .text((d) => String(d).split(" ")[0]);

        // Y-Achse Labels links, rotiert nach rechts
        g.selectAll(".y-label")
            .data(groups)
            .enter()
            .append("text")
            .attr("class", "y-label")
            .attr("x", -10)
            .attr("y", (d) => y(d)! + y.bandwidth() / 2)
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "middle")
            .style("font-size", "10px")
            .style("font-family", "sans-serif")
            .text((d) => String(d).split(" ")[0]);

        // Rechtecke (Matrix)
        g.selectAll("rect.matrix")
            .data(rowData)
            .enter()
            .append("rect")
            .attr("class", "matrix")
            .attr("x", (d) => x(d.variable)!)
            .attr("y", (d) => y(d.group)!)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", (d) => d.value === 0 ? "white" : colorScale(Math.abs(d.value)))
            .style("stroke", "black")
            .style("opacity", (d) => d.value === 0 ? 1 : 0.7)
            .on("mouseover", onMouseOver)
            .on("mousemove", onMouseMove)
            .on("mouseleave", onMouseLeave);

        // Wert in Zelle (Text)
        g.selectAll(".value-text")
            .data(rowData)
            .enter()
            .append("text")
            .attr("class", "value-text")
            .attr("x", (d) => x(d.variable)! + x.bandwidth() / 2)
            .attr("y", (d) => y(d.group)! + y.bandwidth() / 2)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("font-size", "8px")
            .text((d) => d.value === 0 ? "" : d.value.toFixed(2))

        // Hintergrund für Observation
        g.append("rect")
            .attr("x", 0)
            .attr("y", observationOffset)
            .attr("width", gridWidth)
            .attr("height", y.bandwidth())
            .attr("fill", "#f0f0f0");

        // Observation-Zellen
        g.selectAll(".observation-cell")
            .data(observationRow)
            .enter()
            .append("rect")
            .attr("class", "observation-cell")
            .attr("x", (d) => x(d.variable)!)
            .attr("y", observationOffset)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", (d) => d.value === 0 ? "white" : observationColor(Math.abs(d.value)))
            .style("stroke", "black")
            .on("mouseover", onMouseOver)
            .on("mousemove", onMouseMove)
            .on("mouseleave", onMouseLeave);

        // Werte in Observation
        g.selectAll(".observation-text")
            .data(observationRow)
            .enter()
            .append("text")
            .attr("x", (d) => x(d.variable)! + x.bandwidth() / 2)
            .attr("y", observationOffset + y.bandwidth() / 2)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("font-size", "8px")
            .text((d) => d.value === 0 ? "" : d.value.toFixed(2))

        // Label "Base Rate"
        g.append("text")
            .attr("x", -10)
            .attr("y", observationOffset + y.bandwidth() / 2)
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "middle")
            .text("Base Rate")
            .style("font-weight", "bold")
            .style("font-size", "13px");
    }, [data, mutationNames.join(",")]);


    return (
        <div>
            <svg ref={ref} />
        </div>
    );
}
