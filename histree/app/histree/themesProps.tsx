import { useState } from "react";
import { useColorScheme } from './ColorSchemeContext';
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
  const { selectedScheme, setSelectedScheme, colors } = useColorScheme();
    //const [selectedTheme, setSelectedTheme] = useState("viridis");



    return (
        <div className="p-4">
            <Select
                value={selectedScheme}
                onValueChange={(value) => setSelectedScheme(value)} // Verwende onValueChange
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
            <div style={{ display: 'flex', marginTop: '10px' }}>
        {colors.map((color, index) => (
          <div
            key={index}
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: color,
              margin: '5px',
            }}
          ></div>
        ))}
          </div>
        </div>
    )};


export default ColorThemes