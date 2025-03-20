import { useState } from "react";
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




const colormaps = ["jet", "viridis", "cool", "hot", "rainbow", "spring"];

const ColorThemes = () => {
    const [selectedTheme, setSelectedTheme] = useState("viridis");

    const colors = colormap({
        colormap: selectedTheme,
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
          </div>
    )};
    export default ColorThemes