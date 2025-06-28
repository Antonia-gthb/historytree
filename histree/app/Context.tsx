import { createContext, useContext, useEffect, useMemo, useState } from "react";


interface GlobalContextType {
  thetaFile: File | null;
  setThetaFile: (file: File | null) => void;
  jsonFile: File | null;
  setJsonFile: (file: File | null) => void;
}

const GlobalContext = createContext<GlobalContextType>(
  {} as GlobalContextType
);

interface File {
  name: string;
  data: unknown;
}


export function GlobalWrapper({ children }: { children: React.ReactNode }) {

  const [thetaFile, setThetaFile] = useState<File | null>(null);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [threshold, setThreshold] = useState<number>(1);
  const [colorScheme, setColorScheme] = useState<string[]>([]);


  useEffect(() => {
  }, [])

  const value = useMemo(() => ({
    thetaFile,
    setThetaFile,
    jsonFile,
    setJsonFile,
    threshold,
    setThreshold,
    colorScheme,
    setColorScheme
  }), [
    thetaFile,
    jsonFile,
    threshold,
    colorScheme
  ]);





  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}

const useGlobalContext = () => useContext(GlobalContext);
export default useGlobalContext;
