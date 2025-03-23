"use client";

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import colormap from 'colormap'; 

// Typdefinitionen für den Context
type ColorSchemeContextType = {
  selectedScheme: string; // Aktuell ausgewähltes Farbschema
  setSelectedScheme: (scheme: string) => void; // Funktion zum Ändern des Farbschemas
  treeDepth: number; // Aktuelle Tiefe des Baums
  setTreeDepth: (depth: number) => void; // Funktion zum Aktualisieren der Baumtiefe
  colors: string [];
};

// Context erstellen
const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(undefined);

// Custom Hook, um den Context einfach nutzen zu können
export const useColorScheme = () => {
  const context = useContext(ColorSchemeContext);
  console.log('Context in useColorScheme:', context); // Debugging
  if (!context) {
    console.error('useColorScheme must be used within a ColorSchemeProvider'); // Debugging
    throw new Error('useColorScheme must be used within a ColorSchemeProvider');
  }
  return context;
};

type ColorSchemeProviderProps = {
    children: ReactNode; // Typ für children
  };
  
export const ColorSchemeProvider = ({children}: ColorSchemeProviderProps) => {
  // Zustand für das ausgewählte Farbschema
  const [selectedScheme, setSelectedScheme] = useState('viridis'); // Standard-Farbschema

  // Zustand für die aktuelle Baumtiefe
  const [treeDepth, setTreeDepth] = useState(1); // Startwert: 1 Ebene

  const colors = useMemo(() => {
    console.log('Generating colors...');
    return colormap({
      colormap: selectedScheme,
      nshades: Math.max(9, treeDepth), // Mindestens 10 Farben generieren
      format: 'hex',
    });
  }, [selectedScheme, treeDepth]);

  // Wert, der an die Kinderkomponenten weitergegeben wird
  const value = {
    selectedScheme,
    setSelectedScheme,
    treeDepth,
    setTreeDepth,
    colors,
  };

  console.log('Context value:', value);

  return (
    <ColorSchemeContext.Provider value={value}>
      {children}
    </ColorSchemeContext.Provider>
  );
};