import { createContext, useContext, useMemo, useState, useCallback } from "react";


interface GlobalContextType {
  thetaFile: ThetaFile | null;
  setThetaFile: (file: ThetaFile | null) => void;
  jsonFile: File | null;
  setJsonFile: (file: File | null) => void;
  scalingEnabled: boolean;
  scalingFactor: number;
  threshold: number;
  geneticEventsName: string[];
  selectedMutations: string[];
  highlightMutation: string;
  showMatrix: boolean;
  selectedSchemeName: string,
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
  resetFilters: any;
  openMenus: {
    colorScheme: boolean;
    scaling: boolean;
    threshold: boolean;
    eventfilter: boolean;
    highlight: boolean;
  };
  setOpenMenus: React.Dispatch<React.SetStateAction<GlobalContextType["openMenus"]>>;
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [scalingFactor, setScalingFactor] = useState<number>(1);
  const [scalingEnabled, setScalingEnabled] = useState<boolean>(true);
  const [geneticEventsName, setGeneticEventsName] = useState<string[]>([]);
  const [selectedMutations, setSelectedMutations] = useState<string[]>([]);
  const [highlightMutation, setHighlightMutation] = useState<string>("");
  const [showMatrix, setShowMatrix] = useState(false);
  const [selectedSchemeName, setSelectedSchemeName] = useState("Turbo");  //Standard Einstellung

  const resetFilters = useCallback(() => {
    setIsExpanded(false);
    setScalingEnabled(true);
    setScalingFactor(1);
    setThreshold(1);
    setSelectedMutations([]);
    setHighlightMutation("");
    setSelectedSchemeName("Turbo");
    setOpenMenus({
    colorScheme: false,
    scaling: false,
    threshold: false,
    eventfilter: false,
    highlight: false,
  });
  }, []);

  const [openMenus, setOpenMenus] = useState({
    colorScheme: false,
    scaling: false,
    threshold: false,
    eventfilter: false,
    highlight: false,
  });

  
  const value = useMemo(() => ({
    thetaFile,
    setThetaFile,
    jsonFile,
    setJsonFile,
    threshold,
    setThreshold,
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
    resetFilters,
    openMenus, 
    setOpenMenus
  }), [
    thetaFile,
    jsonFile,
    threshold,
    isExpanded,
    scalingFactor,
    scalingEnabled,
    geneticEventsName,
    selectedMutations,
    highlightMutation,
    showMatrix,
    selectedSchemeName,
    resetFilters,
    openMenus
  ]
  );



  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}

const useGlobalContext = () => useContext(GlobalContext);
export default useGlobalContext;
