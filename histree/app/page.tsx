"use client";

import { useState, useEffect } from 'react';
import { interpolateTurbo } from 'd3-scale-chromatic';
import { Button } from "@/components/ui/button";
import * as d3 from "d3";
import CollaTree from '../components/features/CollaTree';
import rawdata from '@/app/tonis_orders_tree_2.json';
import { AppSidebar } from "@/components/ui/sidebar/appSideBar"
import { Separator } from "@/components/ui/sidebar/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar/sidebar"
import ThetaMatrix from '@/components/features/ThetaMatrix';


export default function Page() {

    const [jsonData, setJsonData] = useState(null); // hochgeladener Datensatz
    const [fileName, setFileName] = useState('Keine Datei ausgewählt');
    const [isExpanded, setIsExpanded] = useState(false);
    const [scalingFactor, setScalingFactor] = useState<number>(1);
    const [scalingEnabled, setScalingEnabled] = useState<boolean>(true);
    const [geneticEventsName, setGeneticEventsName] = useState<string[]>([]);
    const [selectedMutations, setSelectedMutations] = useState<string[]>([]);
    const [threshold, setThreshold] = useState<number>(1);
    const [highlightMutation, setHighlightMutation] = useState<string>("");
    const [resetCount, setResetCount] = useState(0);
    const [thetaData, setThetaData] = useState<any[]>([]);

useEffect(() => {
    fetch('/BREAST_oMHN.csv')
        .then((res) => res.text())
        .then((text) => {
            const raw = d3.csvParseRows(text);
            const headers = raw[0].slice(1); // erste Zeile, ohne erstes leeres Feld

            const longFormat: { group: string; variable: string; value: number }[] = [];

            for (let i = 1; i < raw.length; i++) {
                const rowName = raw[i][0];
                const rowValues = raw[i].slice(1);

                // Parse jede Zeile in longFormat
                for (let j = 0; j < headers.length; j++) {
                    longFormat.push({
                        group: rowName,               // kann auch "Observation" sein
                        variable: headers[j],
                        value: +rowValues[j],         // Zahl umwandeln
                    });
                }
            }

            setThetaData(longFormat);
        });
}, []);


    function handleHighlightChange(v: string) {
        setHighlightMutation(v);
    }
    const [colorScheme, setColorScheme] = useState<string[]>(
        d3.quantize(interpolateTurbo, 13)
    );

    function resetFilters() {
        setIsExpanded(false);
        setScalingEnabled(true);
        setScalingFactor(1);
        setThreshold(1);
        setSelectedMutations(geneticEventsName);
        setColorScheme(d3.quantize(interpolateTurbo, 13));
        setHighlightMutation("");
        setResetCount((c) => c + 1);
    }

    const handleUpload = (data: any, fileName: string) => {
        setJsonData(data); // speichert hochgeladene Daten 
        setFileName(fileName); // dateiname speichern
        setIsExpanded(false);
        setScalingFactor(1);
        setSelectedMutations([]);
        setColorScheme(d3.quantize(interpolateTurbo, 13));
        setHighlightMutation("");
    };


    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-r from-cyan-100 via-blue-300 to-indigo-400 p-6 relative">
            <SidebarProvider>
                <AppSidebar
                    jsonData={jsonData}
                    fileName={fileName}
                    colorScheme={colorScheme}
                    scalingEnabled={scalingEnabled}
                    scalingFactor={scalingFactor}
                    threshold={threshold}
                    geneticEventsName={geneticEventsName}
                    selectedMutations={selectedMutations}
                    highlightMutation={highlightMutation}
                    handleUpload={handleUpload}
                    setColorScheme={setColorScheme}
                    setScalingEnabled={setScalingEnabled}
                    setScalingFactor={setScalingFactor}
                    setThreshold={setThreshold}
                    setSelectedMutations={setSelectedMutations}
                    setHighlightMutation={setHighlightMutation}
                />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <p> {jsonData ? fileName : 'tonis_orders_tree_2.json'}</p>
                        <Button onClick={() => setIsExpanded(!isExpanded)} variant="outline" className="ml-auto transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-800 text-slate-700 hover:text-white">
                            {isExpanded ? ' Collapse All' : ' Expand All'}
                        </Button >
                    </header>
                    <div className="flex flex-1 p-10">
                        <CollaTree key={`${fileName}-${resetCount}`} treedata={jsonData || rawdata} colorScheme={colorScheme} shouldExpand={isExpanded} lineWidthFactor={[scalingFactor]} onMutationNamesReady={(allMutationNames) => {
                            setGeneticEventsName(allMutationNames);
                            setSelectedMutations(allMutationNames);
                        }} selectedMutations={selectedMutations} threshold={threshold} highlightMutation={highlightMutation} onHighlightMutationChange={handleHighlightChange}
                        />
                    </div>
                    <div className="flex justify-between font-bold text-xl p-5 w-full">
                        <Button onClick={resetFilters} className="transition hover:-translate-y-1">Reset Filters</Button>
                    </div>
                </SidebarInset>
            </SidebarProvider>
            <div>
                <ThetaMatrix data={thetaData} mutationNames={geneticEventsName} />
            </div>
        </div>
    );
}

