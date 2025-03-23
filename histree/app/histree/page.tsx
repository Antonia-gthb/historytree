"use client";

import { useState } from 'react';
import CollaTree from './CollaTree';
import rawdata from '@/app/tonis_orders_tree_2.json';
import FileUpload from './upload';
import ColorTheme from './themesProps';


export default function Page() {

  const [jsonData, setJsonData] = useState(null); // hochgeladener Datensatz
  const [fileName, setFileName] = useState('Keine Datei ausgewählt');

  const handleUpload = (data: any ,fileName: string) => {
    setJsonData(data); // speichert hochgeladene Daten 
    setFileName(fileName); // dateiname speichern
  };

  const [selectedScheme, setSelectedScheme] = useState("viridis");
  const [colors, setColors] = useState<string[]>([]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-r from-cyan-100 via-blue-300 to-indigo-400 p-6">
            <h1 className='text-4xl font-bold -mt-8 mb-4'> {/*Überschrift*/}
                MHN Patient Tree
            </h1>
            <div className= "flex flex-col justify-center items-center w-full max-w-4xl p-6 mb-8">
                <ColorTheme onSelectScheme={setSelectedScheme} onSelectColors={setColors}/>
                <div className="mx-auto block w-full rounded-lg">
                    <CollaTree treedata={jsonData || rawdata} colorScheme={selectedScheme}  colors={colors} />
                    <p> {jsonData ? fileName : 'tonis_orders_tree_2.json'}</p>
                </div>
                    <div className="text-center font-bold text-xl p-1 w-full mb-2"> 
                        <FileUpload onUpload={handleUpload}/>
                    </div>
                </div>
            </div>
    );
}