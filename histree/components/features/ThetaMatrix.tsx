"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface ThetaMatrixProps {
    mutationNames: string[];
    csvUrl: "@/app/BREAST_oMHN.csv";
}

export default function ThetaMatrix({ mutationNames, csvUrl }: ThetaMatrixProps) {
    // alle außer "root"
    const names = mutationNames.filter((n) => n !== "root");
    const ref = useRef<SVGSVGElement | null>(null);


    useEffect(() => {
        if (!ref.current) return;

        // Aufräumen vor Neu-Zeichnen
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        // Dimensionen
        const margin = { top: 30, right: 30, bottom: 30, left: 30 };
        const width = 450 - margin.left - margin.right;
        const height = 450 - margin.top - margin.bottom;

        // Gruppe zum Zeichnen
        const g = svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        d3.csv<{ group: string; variable: string; value: string }>(
            csvUrl,
            (d) => ({
                group: d.group!,              // Spaltenname anpassen, falls nötig
                variable: d.variable!,
                value: d.value!              // in Number umwandeln
            })
        ).then((data) => {
            // === Domains dynamisch aus den Daten ziehen ===
            const groups = Array.from(new Set(data.map((d) => d.group)));
            const variables = Array.from(new Set(data.map((d) => d.variable)));

            // Skalen
            const x = d3
                .scaleBand<string>()
                .domain(groups)
                .range([0, width])
                .padding(0.01);

            const y = d3
                .scaleBand<string>()
                .domain(variables)
                .range([height, 0])
                .padding(0.01);

            g.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x));

            g.append("g").call(d3.axisLeft(y));

            // Color-Scale
            const maxVal = d3.max(data, (d) => d.value)!;
            const myColor = d3
                .scaleLinear<string>()
                .domain([1, 100])
                .range(["white", "#69b3a2"]);

            // CSV laden und zeichnen
            const container = d3.select(ref.current!.parentElement!);
            const tooltip = container
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "2px solid #999")
                .style("border-radius", "4px")
                .style("padding", "4px")
                .style("pointer-events", "none");

            const onMouseOver = () => tooltip.style("opacity", 1);
            const onMouseMove = (event: MouseEvent, d: any) => {
                tooltip
                    .html(`Wert: <strong>${d.value}</strong>`)
                    .style("left", event.pageX + 8 + "px")
                    .style("top", event.pageY + 8 + "px");
            };
            const onMouseLeave = () => tooltip.style("opacity", 0);

            // Rechtecke
            g.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", (d) => x(d.group)!)
                .attr("y", (d) => y(d.variable)!)
                .attr("width", x.bandwidth())
                .attr("height", y.bandwidth())
                .style("fill", (d) => myColor(+d.value)!)  // +d.value in Zahl umwandeln
                .on("mouseover", onMouseOver)
                .on("mousemove", onMouseMove)
                .on("mouseleave", onMouseLeave);
        });
        // kein return ⇒ kein Cleanup nötig
    }, [csvUrl, mutationNames.join(",")]);

    return (
        <div style={{ position: "relative" }}>
            <svg ref={ref} />
        </div>
    );
}
