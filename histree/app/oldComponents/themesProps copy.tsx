import { useState } from "react";
import colormap from "colormap";
//import * as select from "@/components/ui/select"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectLabel,
    SelectGroup
  } from "@/components/ui/select"
  import {interpolatePRGn, interpolateRdBu, interpolateSpectral, interpolateBrBG} from 'd3-scale-chromatic'

interface ColorThemesProps {
    onSelectScheme: (scheme: string) => void; // Callback für Elternkomponente
    onSelectColors: (colors: string[]) => void;
  }


const colormaps = ["interpolatePRGn", "interpolateRdBu", "interpolateSpectral", "interpolateBrBG", "rainbow", "spring"];

const ColorThemes = ({ onSelectScheme, onSelectColors }: ColorThemesProps) => {
  const [selectedTheme, setSelectedTheme] = useState("");



    return (
        <div className="p-6">
            <Select
                value={selectedTheme}
                onValueChange={(value) => {setSelectedTheme(value);
                onSelectScheme(value);
                
                const colors = colormap({
                    colormap: selectedTheme,
                    nshades: 9, // Mindestens 9 Farben generieren
                    format: 'hex',
                });
              
                console.log(colors)
                onSelectColors(colors); // Farben an Elternkomponente übergeben
            }}
            >
                <SelectTrigger className="w-[180px] border-black">
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


//Mutation Namen in Array speichern
//zählen wie viele VERSCHIEDENE Namen es gibt
//domain erstellen
//damit die Anzahl an verschiedenen Farben benötigt
//dann mit scale ordinal beide Arrays zusammen bringen und in variable color speichern
// color dann verwenden
//Farbschema muss variabel sein