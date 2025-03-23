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

interface ColorThemesProps {
    onSelectScheme: (scheme: string) => void; // Callback für Elternkomponente
    onSelectColors: (colors: string[]) => void;
  }


const colormaps = ["jet", "viridis", "cool", "hot", "rainbow", "spring"];

const ColorThemes = ({ onSelectScheme, onSelectColors }: ColorThemesProps) => {
  //const { selectedScheme, setSelectedScheme, colors } = useColorScheme();
  const [selectedTheme, setSelectedTheme] = useState("viridis");



    return (
        <div className="p-4">
            <Select
                value={selectedTheme}
                onValueChange={(value) => {setSelectedTheme(value); // Verwende onValueChange
                onSelectScheme(value);
                
                const colors = colormap({
                    colormap: selectedTheme,
                    nshades: 9, // Mindestens 9 Farben generieren
                    format: 'hex',
                });
              
                console.log(colors)// Elternkomponente benachrichtigen
                onSelectColors(colors); // Farben an Elternkomponente übergeben
            }}
            >
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