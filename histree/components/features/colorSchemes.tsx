import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select"
import {
  interpolatePRGn,
  interpolateRdBu,
  interpolateSpectral,
  interpolateBrBG,
  interpolateTurbo,
  interpolateRainbow,
} from "d3-scale-chromatic"

interface ColorSchemesProps {
  selectedScheme: string;
  onSelectChange: (name: string) => void
}


export default function ColorSchemes({ selectedScheme, onSelectChange }: ColorSchemesProps) {

  const handleChange = (name: string) => {
    onSelectChange(name);
  };
 //selected enthält aktuellen Namen, vllt im Context speichern?
  return (
    <Select value={selectedScheme} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px] border-black">
        <SelectValue>{selectedScheme ? selectedScheme : "Select color scheme"}</SelectValue>   
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Schemes</SelectLabel>
          {cSchemes.map(({ name }) => (
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


export const cSchemes = [
  { name: "Violett to Green", fn: interpolatePRGn },
  { name: "Red to Blue", fn: interpolateRdBu },
  { name: "Spectral", fn: interpolateSpectral },
  { name: "Brown to Blue", fn: interpolateBrBG },
  { name: "Turbo", fn: interpolateTurbo },
  { name: "Rainbow", fn: interpolateRainbow },
]
