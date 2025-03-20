import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import colormap from "colormap";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


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
            <Select
                value={selectedColormap}
            >

            </Select>

            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select color theme" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Themes</SelectLabel>
                        {colormaps.map((map, index) => (
                            <SelectItem key={index} value={map}>
                                {map}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>



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
