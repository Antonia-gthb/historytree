"use client";

import { useState, useEffect } from 'react';
import { interpolateRdBu } from 'd3-scale-chromatic';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import * as d3 from "d3";
import CollaTree from '../components/features/CollaTree';
import rawdata from '@/app/tonis_orders_tree_2.json';
import FileUpload from '../components/features/upload';
import ColorTheme from '../components/features/colorSchemes';
import Download from '../components/features/download';
import SliderScaling from '@/components/features/lineslider';
import { Eventfilter } from '@/components/features/eventfilter';
import Threshold from '@/components/features/threshold';
import { HighlightEvent } from '@/components/features/highlightEvent';
import { AppSidebar } from "@/components/ui/sidebar/app-sidebar"
import { Separator } from "@/components/ui/sidebar/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar/sidebar"




export default function Page() {

    const [jsonData, setJsonData] = useState(null); // hochgeladener Datensatz
    const [fileName, setFileName] = useState('Keine Datei ausgewählt');
    const [isExpanded, setIsExpanded] = useState(false);
    const [scalingFactor, setScalingFactor] = useState<number>(1);
    const [scalingEnabled, setScalingEnabled] = useState<boolean>(true);
    const [geneticEventsName, setGeneticEventsName] = useState<string[]>([]);
    const [selectedMutations, setSelectedMutations] = useState<string[]>([]);
    const [threshold, setThreshold] = useState<number>(1);
    const [highlightMutation, setHighlightMutation] = useState<string>("")

    function handleHighlightChange(v: string) {
        setHighlightMutation(v);
    }
    const [colorScheme, setColorScheme] = useState<string[]>(
        d3.quantize(interpolateRdBu, 13)
    );

    const handleUpload = (data: any, fileName: string) => {
        setJsonData(data); // speichert hochgeladene Daten 
        setFileName(fileName); // dateiname speichern
        setIsExpanded(false);
        setScalingFactor(1);
        setSelectedMutations([]);
        setColorScheme(d3.quantize(interpolateRdBu, 13));
        setHighlightMutation("");
    };


    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-r from-cyan-100 via-blue-300 to-indigo-400 p-6 relative">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <p> {jsonData ? fileName : 'tonis_orders_tree_2.json'}</p>
                    </header>
                    <div className="flex flex-1 p-10">
                        <CollaTree key={fileName} treedata={jsonData || rawdata} colorScheme={colorScheme} shouldExpand={isExpanded} lineWidthFactor={[scalingFactor]} onMutationNamesReady={(allMutationNames) => {
                            setGeneticEventsName(allMutationNames);
                            setSelectedMutations(allMutationNames);
                        }} selectedMutations={selectedMutations} threshold={threshold} highlightMutation={highlightMutation} onHighlightMutationChange={handleHighlightChange} />
                    </div>
                    <div className="flex justify-between font-bold text-xl p-5 w-full">
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
                </SidebarInset>
            </SidebarProvider>
            <div className="flex flex-col w-full max-w-4xl p-6 mb-8">
                <ColorTheme key={fileName} onSchemeChange={(colors) => {
                    setColorScheme(colors);
                }} />
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
                <div className=" flex flex-row gap-16">
                    <div className="flex flex-col mt-4">
                        <Label className="text-base font-semibold mb-3">Scaling</Label>
                        <div className="flex items-center space-x-2 mb-2">
                            <Checkbox
                                checked={scalingEnabled}
                                onCheckedChange={(checked) => {
                                    const isOn = checked === true;
                                    setScalingEnabled(isOn);
                                    setScalingFactor(isOn ? 1 : 0);
                                }}
                            />
                            <Label className="font-medium">Scale edges by weight</Label>
                        </div>
                        <div className="flex flex-row mb-4">
                            <SliderScaling value={[scalingFactor]} min={1} max={7} step={0.5} onValueChange={([v]) => {
                                if (scalingEnabled) setScalingFactor(v);
                            }}
                                disabled={!scalingEnabled}
                            />
                            <span className="text-black my-1 mx-3"> {scalingFactor}</span>
                        </div>
                    </div>
                    <div className="flex flex-col mt-4">
                        <Label className="text-base font-semibold ml-4 mb-3">Threshold</Label>
                        <div>
                            <Threshold value={threshold} onChange={setThreshold} />
                        </div>
                    </div>
                    <div>
                        <HighlightEvent items={geneticEventsName} selected={highlightMutation} onChange={setHighlightMutation} />
                    </div>
                </div>
                <div className="flex flex-row items-end space-x-4">
                    <Eventfilter items={geneticEventsName} selectedItems={selectedMutations} onSubmit={setSelectedMutations} />
                    <div className="ease-in-out hover:-translate-y-1 self-end">
                        <Button onClick={() => setSelectedMutations(geneticEventsName)}>Reset</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

