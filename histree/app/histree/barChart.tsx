import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import colormap from "colormap";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@radix-ui/react-select";


const data = [
    { name: "A", value: 40 },
    { name: "B", value: 60 },
    { name: "C", value: 30 },
    { name: "D", value: 80 },
];

const colormaps = ["jet", "viridis", "cool", "hot", "rainbow", "spring"];

const ColormapChart = () => {
    const [selectedColormap, setSelectedColormap] = useState("viridis");

    const colors = colormap({
        colormap: selectedColormap,
        nshades: Math.max(9, data.length),
        format: "hex",
    });

    return (
        <div className="p-4">
            <select value={selectedColormap} onChange={(e) => setSelectedColormap(e.target.value)}>
                {colormaps.map((map) => (
                    <option key={map} value={map}>{map}</option>
                ))}
            </select>
            <div className="relative">
                <Select value={selectedColormap} onValueChange={setSelectedColormap}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select a colormap" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                        {colormaps.map((map) => (
                            <SelectItem key={map} value={map}>{map}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>


            <BarChart width={500} height={300} data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {data.map((entry, index) => (
                    <Bar key={entry.name} dataKey="value" fill={colors[index]} />
                ))}
            </BarChart>
        </div>

    );
};

export default ColormapChart;
