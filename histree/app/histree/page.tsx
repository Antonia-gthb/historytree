"use client";

import { useState } from 'react';
import CollaTree from './CollaTree';
import rawdata from '@/app/tonis_orders_tree_2.json';
import FileUpload from './upload';
import ColorTheme from './colorSchemes';
import Download from './download';


export default function Page() {

  const [jsonData, setJsonData] = useState(null); // hochgeladener Datensatz
  const [fileName, setFileName] = useState('Keine Datei ausgewählt');
  //const [mutationNames, setMutationNames] = useState(null)

  const handleUpload = (data: any ,fileName: string) => {
    setJsonData(data); // speichert hochgeladene Daten 
    setFileName(fileName); // dateiname speichern
    // hier noch Namen von Mutationen in hochgeladener Datei speichern
  };

  const handleSchemeChange = (scheme: string) => {
    console.log("Selected scheme:", scheme);
  };
  

  const [selectedScheme, setSelectedScheme] = useState("");
  const [colors, setColors] = useState<string[]>([]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-r from-cyan-100 via-blue-300 to-indigo-400 p-6">
            <h1 className='text-4xl font-bold -mt-8 mb-4'> {/*Überschrift*/}
                MHN Patient Tree
            </h1>
            <div className= "flex flex-col w-full max-w-4xl p-6 mb-8">
                <ColorTheme/>
                <div className="mx-auto block w-full rounded-lg">
                    <CollaTree treedata={jsonData || rawdata} colorScheme={selectedScheme} colors={colors} />
                    <p> {jsonData ? fileName : 'tonis_orders_tree_2.json'}</p>
                </div>
                 <div className="flex justify-between font-bold text-xl p-1 w-full mb-2">
                    <div> 
                        <FileUpload onUpload={handleUpload}/>
                    </div>
                    <div> 
                        <Download downloadName={jsonData ? fileName : 'tonis_orders_tree_2.json'}  />
                    </div>
                    </div>
                </div>
            </div>
    );
}

//<ColorTheme onSelectScheme={setSelectedScheme} onSelectColors={setColors}/>