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

        // Clean up old drawing
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        // Margin & dimensions
        const margin = { top: 150, right: 100, bottom: 100, left: 100 };
        const width = 800 - margin.left - margin.right;
        const height = 800 - margin.top - margin.bottom;

        // Create group
        const g = svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const observationRow = data.filter((d) => d.group === "Observation");

        // Extract unique axis values
        const groups = Array.from(new Set(data.map((d) => d.group)));
        const variables = Array.from(new Set(data.map((d) => d.variable)));

        // Scales
        const x = d3.scaleBand<string>()
            .domain(variables)
            .range([0, width])
            .padding(0.01);

        const y = d3.scaleBand<string>()
            .domain(groups)
            .range([0, height]) // Y von unten nach oben
            .padding(0.01);

        // Color scale
        const values = data.map((d) => d.value).filter((v) => !isNaN(v));
        const minVal = d3.min(values) ?? 0;
        const maxVal = d3.max(values) ?? 1;

        const myColor = d3.scaleLinear<string>()
            .domain([minVal, maxVal])
            .range(["white", "#69b3a2"]);

        const observationColor = d3.scaleLinear<string>()
            .domain([minVal, maxVal])
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
                .style("left", "4px")
                .style("top", "4px");
        };
        const onMouseLeave = () => tooltip.style("opacity", 0);

        g.append("g")
            .call(d3.axisLeft(y).tickFormat((d) => d.slice(0, 4)));

        // Draw rectangles
        g.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d) => x(d.variable)!)
            .attr("y", (d) => y(d.group)!)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", (d) => myColor(d.value))
            .on("mouseover", onMouseOver)
            .on("mousemove", onMouseMove)
            .on("mouseleave", onMouseLeave);

        const observationOffset = -y.bandwidth() - 20;

        const labelOffsetY = observationOffset - 17; // leicht oberhalb der Rechtecke

        g.selectAll(".x-label")
            .data(variables)
            .enter()
            .append("text")
            .attr("class", "x-label")
            .attr("x", (d) => x(d)! + x.bandwidth() / 2)
            .attr("y", labelOffsetY)
            .attr("transform", (d) =>
                `rotate(-45, ${x(d)! + x.bandwidth() / 2}, ${labelOffsetY - 5})`
            )
            .style("font-size", "10px")
            .style("font-family", "sans-serif")
            .attr("text-anchor", "middle")
            .text((d) => String(d).split(" ")[0])

        g.append("rect")
            .attr("x", 0)
            .attr("y", observationOffset)
            .attr("width", width)
            .attr("height", y.bandwidth());

        g.selectAll(".observation-cell")
            .data(observationRow)
            .enter()
            .append("rect")
            .attr("class", "observation-cell")
            .attr("x", (d) => x(d.variable)!)
            .attr("y", observationOffset)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", (d) => observationColor(d.value))
            .on("mouseover", onMouseOver)
            .on("mousemove", onMouseMove)
            .on("mouseleave", onMouseLeave);

        g.append("text")
            .attr("x", -10)
            .attr("y", observationOffset + y.bandwidth() / 2)
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "middle")
            .text("Base Rate")
            .style("font-weight", "bold");


    }, [data, mutationNames.join(",")]);



    return (
        <div style={{ position: "relative" }}>
            <svg ref={ref} />
        </div>
    );
}
