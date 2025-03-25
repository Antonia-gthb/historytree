import { useState } from "react";
import colormap from "colormap";
import * as select from "@/components/ui/select"

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
            <select.Select
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
                <select.SelectTrigger className="w-[180px]">
                    <select.SelectValue placeholder="Select color theme" />
                </select.SelectTrigger>
                <select.SelectContent>
                    <select.SelectGroup>
                        <select.SelectLabel>Themes</select.SelectLabel>
                        {colormaps.map((map, index) => (
                            <select.SelectItem key={index} value={map}>
                                {map}
                            </select.SelectItem>
                        ))}
                    </select.SelectGroup>
                </select.SelectContent>
            </select.Select>
        </div>
    )};


export default ColorThemes