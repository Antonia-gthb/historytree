import { useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select"
import * as d3 from "d3"
import {
  interpolatePRGn,
  interpolateRdBu,
  interpolateSpectral,
  interpolateBrBG,
  interpolateTurbo,
  interpolateRainbow,
} from "d3-scale-chromatic"
import useGlobalContext from "@/app/Context"

const colorSchemes = [
  { name: "Violett to Green", fn: interpolatePRGn },
  { name: "Red to Blue", fn: interpolateRdBu },
  { name: "Spectral", fn: interpolateSpectral },
  { name: "Brown to Blue", fn: interpolateBrBG },
  { name: "Turbo", fn: interpolateTurbo },
  { name: "Rainbow", fn: interpolateRainbow },
]

interface ColorSchemesProps {
  selected: string;
  onSchemeChange: (colors: string[]) => void
  onSelectChange: (name: string) => void
}


export default function ColorSchemes({ selected, onSchemeChange, onSelectChange }: ColorSchemesProps) {
  const { geneticEventsName } = useGlobalContext();

  const handleChange = (name: string) => {
    onSelectChange(name);
    const scheme = colorSchemes.find(s => s.name === name);
    if (scheme) {
      const n = geneticEventsName.length;
      console.log('Anzahl', n)
      const colors = d3.quantize(scheme.fn, n);
      onSchemeChange(colors);
    }
  };

  return (
    <Select value={selected} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px] border-black">
        <SelectValue>{selected ? selected : "Select color scheme"}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Schemes</SelectLabel>
          {colorSchemes.map(({ name }) => (
            <SelectItem
              key={name}
              value={name}
              className="hover:bg-indigo-800/80 text-slate-700 hover:text-white"
            >
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
