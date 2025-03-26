import { useState } from "react";
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
  import * as d3 from "d3";

interface ColorThemesProps {
    onSelectScheme: (scheme: string) => void; // Callback für Elternkomponente
    onSelectColors: (colors: string[]) => void;
  }

const ColorThemes = ({ onSelectScheme, onSelectColors }: ColorThemesProps) => {
  const [selectedTheme, setSelectedTheme] = useState("");

  const colorSchemes = [
    { name: "VioletttoGreen", interpolator: interpolatePRGn },
    { name: "RedtoBlue", interpolator: interpolateRdBu },
    { name: "Spectral", interpolator: interpolateSpectral },
    { name: "BrowntoBlue", interpolator: interpolateBrBG }
  ];

  const handleThemeChange = (value: string) => {
    const selectedScheme = colorSchemes.find(scheme => scheme.name === value);
    
    if (selectedScheme) {
      setSelectedTheme(value);
      onSelectScheme(value);
      
      // Generiere 9 Farben mit d3.quantize
      const colors = d3.quantize(selectedScheme.interpolator, 9);
      onSelectColors(colors);
      
      console.log("Selected colors:", colors);
    }
  };

    return (
        <div className="p-6">
            <Select
                value={selectedTheme}
                onValueChange= {handleThemeChange}
            >
                <SelectTrigger className="w-[180px] border-black">
                    <SelectValue placeholder="Select color theme" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Themes</SelectLabel>
                        {colorSchemes.map((scheme) => (
                            <SelectItem key={scheme.name} value={scheme.name}>
                                {scheme.name}
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