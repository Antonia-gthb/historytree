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
import { interpolatePRGn, interpolateRdBu, interpolateSpectral, interpolateBrBG, interpolateTurbo, interpolateRainbow } from 'd3-scale-chromatic'
import * as d3 from "d3";


const colorSchemes = {
  VioletttoGreen: (n: number) => d3.quantize(interpolatePRGn, n),
  RedtoBlue: (n: number) => d3.quantize(interpolateRdBu, n),
  Spectral: (n: number) => d3.quantize(interpolateSpectral, n),
  BrowntoBlue: (n: number) => d3.quantize(interpolateBrBG, n),
  Turbo: (n: number) => d3.quantize(interpolateTurbo, n),
  Rainbow: (n: number) => d3.quantize(interpolateRainbow, n)
};

  interface ColorThemesProps {
    onSchemeChange: (colors: string[]) => void; // Jetzt übergeben wir direkt die Farben
  }


const ColorThemes = ({ onSchemeChange }: ColorThemesProps) => {
  const [selectedScheme, setSelectedScheme] = useState<keyof typeof colorSchemes>("RedtoBlue");

  const handleChange = (schemeName: keyof typeof colorSchemes) => {
    setSelectedScheme(schemeName);
    // Generiere 12 Farben als Standard (kann später angepasst werden)
    const colors = colorSchemes[schemeName](12);
   onSchemeChange(colors);
  };

  return (
    <div className="p-6">
        <Select value={selectedScheme} onValueChange={handleChange}>
        <SelectTrigger className="w-[180px] border-black">
          <SelectValue placeholder="Select color theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Themes</SelectLabel>
            {Object.keys(colorSchemes).map((schemeName) => (
              <SelectItem key={schemeName} value={schemeName}>
                {schemeName}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
};


export default ColorThemes


//Mutation Namen in Array speichern
//zählen wie viele VERSCHIEDENE Namen es gibt
//domain erstellen
//damit die Anzahl an verschiedenen Farben benötigt
//dann mit scale ordinal beide Arrays zusammen bringen und in variable color speichern
// color dann verwenden
//Farbschema muss variabel sein