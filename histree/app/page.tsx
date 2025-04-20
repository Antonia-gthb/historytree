"use client";

import { useState } from 'react';
import { interpolateRdBu } from 'd3-scale-chromatic';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import * as d3 from "d3";
import CollaTree from '../components/CollaTree';
import rawdata from '@/app/tonis_orders_tree_2.json';
import FileUpload from '../components/upload';
import ColorTheme from '../components/colorSchemes';
import Download from '../components/download';
import SliderScaling from '@/components/lineslider';
import {Eventfilter} from '@/components/eventfilter';




export default function Page() {

    const [jsonData, setJsonData] = useState(null); // hochgeladener Datensatz
    const [fileName, setFileName] = useState('Keine Datei ausgewählt');
    const [isExpanded, setIsExpanded] = useState(false);
    const [maxLineWidth, setMaxLineWidth] = useState([200]);
    const [geneticEventsName, setGeneticEventsName] = useState<string[]>();

    const handleUpload = (data: any, fileName: string) => {
        setJsonData(data); // speichert hochgeladene Daten 
        setFileName(fileName); // dateiname speichern
    };

    const [colorScheme, setColorScheme] = useState<string[]>(
        d3.quantize(interpolateRdBu, 13)
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-r from-cyan-100 via-blue-300 to-indigo-400 p-6">
            <h1 className='text-4xl font-bold -mt-8 mb-4'>
                MHN Patient Tree
            </h1>
            <div className="flex flex-col w-full max-w-4xl p-6 mb-8">
                <ColorTheme onSchemeChange={(colors) => {
                    setColorScheme(colors);
                }} />
                <div className="mx-auto block w-full rounded-lg">
                    <CollaTree treedata={jsonData || rawdata} colorScheme={colorScheme} shouldExpand={isExpanded} lineWidthFactor={maxLineWidth} onMutationNamesReady={(names) => setGeneticEventsName(names)}  />
                    <p> {jsonData ? fileName : 'tonis_orders_tree_2.json'}</p>
                </div>
                <div className="flex justify-between font-bold text-xl p-1 w-full mb-2">
                    <div>
                        <FileUpload onUpload={handleUpload} />
                    </div>
                    <div>
                        <Download downloadName={jsonData ? fileName : 'tonis_orders_tree_2.json'} />
                    </div>
                    <div>
                        <Button onClick={() => setIsExpanded(!isExpanded)} variant="outline" className="transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-800 text-slate-700 hover:text-white">
                            {isExpanded ? ' Collapse All' : ' Expand All'}
                        </Button >
                    </div>
                </div>
                <div className="flex flex-col mt-4">
                <Label className= "text-base font-semibold">Scaling</Label>
                     <div className= "flex flex-row">
                        <SliderScaling value={maxLineWidth} min={25} max={300} step={25} onValueChange={([newValue]) => setMaxLineWidth([newValue])}  />
                    <span className="text-black my-1 mx-3"> {maxLineWidth[0]/100}</span>
                    </div>
                </div>
                <div>
                <Eventfilter items={geneticEventsName}/>
                </div>
            </div>
        </div>
    );
}


  //const [scalingCheckBox, setScalingCheckbox] = useState(true); //ist die Checkbox aktiviert?
    {/*<div className= " text-black my-1">
    <input
        type="checkbox"
        checked={scalingCheckBox}
        onChange={onScalingChange}
        className="w-4 h-4 border cursor-pointer mr-2"
    />
    <p> Scale edges by weight </p>
    </div>
    
    const onScalingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setScalingCheckbox(e.target.checked);
    };*/}