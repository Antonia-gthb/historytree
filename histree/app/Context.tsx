import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import { interpolateTurbo } from "d3";

interface GlobalContextType {
  thetaFile: ThetaFile | null;
  setThetaFile: (file: ThetaFile | null) => void;
  jsonFile: File | null;
  setJsonFile: (file: File | null) => void;
  colorScheme: string[];
  scalingEnabled: boolean;
  scalingFactor: number;
  threshold: number;
  geneticEventsName: string[];
  selectedMutations: string[];
  highlightMutation: string;
  showMatrix: boolean;
  selectedSchemeName: string,
  setColorScheme: (schemes: string[]) => void;
  setScalingEnabled: (on: boolean) => void;
  setScalingFactor: (v: number) => void;
  setThreshold: (v: number) => void;
  setSelectedMutations: (items: string[]) => void;
  setGeneticEventsName: (names: string[]) => void;
  setHighlightMutation: (item: string) => void;
  setShowMatrix: (on: boolean) => void;
  setSelectedSchemeName: (name: string) => void;
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  resetFilters: any
}

const GlobalContext = createContext<GlobalContextType>(
  {} as GlobalContextType
);

interface File {
  name: string;
  data: unknown;
}
interface ThetaDataEntry {
  row: string;
  column: string;
  value: number;
}

interface ThetaFile {
  name: string;
  data: ThetaDataEntry[];
}


export function GlobalWrapper({ children }: { children: React.ReactNode }) {

  const [thetaFile, setThetaFile] = useState<ThetaFile | null>(null);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [threshold, setThreshold] = useState<number>(1);
   const [colorScheme, setColorScheme] = useState<string[]>(
    d3.quantize(interpolateTurbo, 13)
  );
  const [fileName, setFileName] = useState("");  //später noch löschen
  const [thetaFileName, setThetaFileName] = useState("BREAST_oMHN.csv"); //später noch löschen
  const [isExpanded, setIsExpanded] = useState(false);
  const [scalingFactor, setScalingFactor] = useState<number>(1);
  const [scalingEnabled, setScalingEnabled] = useState<boolean>(true);
  const [geneticEventsName, setGeneticEventsName] = useState<string[]>([]);
  const [selectedMutations, setSelectedMutations] = useState<string[]>([]);
  const [highlightMutation, setHighlightMutation] = useState<string>("");
  const [showMatrix, setShowMatrix] = useState(false);
  const [selectedSchemeName, setSelectedSchemeName] = useState("Turbo");


  useEffect(() => {
  }, [])

      function resetFilters() {
      setIsExpanded(false);
      setScalingEnabled(true);
      setScalingFactor(1);
      setThreshold(1);
      setSelectedMutations(geneticEventsName);
      setColorScheme(d3.quantize(interpolateTurbo, 13));
      setHighlightMutation("");
      setSelectedSchemeName("Turbo");
    }

  const value = useMemo(() => ({
    thetaFile,
    setThetaFile,
    jsonFile,
    setJsonFile,
    threshold,
    setThreshold,
    colorScheme,
    setColorScheme,
    fileName,
    setFileName,
    thetaFileName,
    setThetaFileName,
    isExpanded,
    setIsExpanded,
    scalingFactor,
    setScalingFactor,
    scalingEnabled,
    setScalingEnabled,
    geneticEventsName,
    setGeneticEventsName,
    selectedMutations,
    setSelectedMutations,
    highlightMutation,
    setHighlightMutation,
    showMatrix,
    setShowMatrix,
    selectedSchemeName,
    setSelectedSchemeName,
    resetFilters
  }), [
    thetaFile,
    jsonFile,
    threshold,
    colorScheme,
    fileName,
    thetaFileName,
    isExpanded,
    scalingFactor,
    scalingEnabled,
    geneticEventsName,
    selectedMutations,
    highlightMutation,
    showMatrix,
    selectedSchemeName,
    resetFilters
  ]);



  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}

const useGlobalContext = () => useContext(GlobalContext);
export default useGlobalContext;
