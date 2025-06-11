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
    onSchemeChange: (colors: string[]) => void; // Farben werden direkt übergeben
  }


const ColorThemes = ({ onSchemeChange }: ColorThemesProps) => {
  const [selectedScheme, setSelectedScheme] = useState("");

  const handleChange = (schemeName: keyof typeof colorSchemes) => {
    setSelectedScheme(schemeName);
    // 13 Farben als Standard
    const colors = colorSchemes[schemeName](13);
   onSchemeChange(colors);
  };

  return (
    <div className="mt-4">
        <Select defaultValue="Turbo" onValueChange={handleChange}>
        <SelectTrigger className="w-[180px] border-black">
          <SelectValue> {selectedScheme
              ? selectedScheme
              : "Select color theme"}
              </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Themes</SelectLabel>
            {Object.keys(colorSchemes).map((schemeName) => (
              <SelectItem className="hover:bg-indigo-800/80 text-slate-700 hover:text-white" key={schemeName} value={schemeName}>
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