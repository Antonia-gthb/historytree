"use client";

import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import * as d3 from "d3";
import CollaTree from '../components/features/mainComponents/CollaTree';
import rawdata from '@/app/BREAST_shortened_orders_toni.json';
import { AppSideBar } from "@/components/features/mainComponents/AppSideBar"
import { Separator } from "@/components/ui/sidebar/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar/sidebar"
import ThetaMatrix from '@/components/features/mainComponents/ThetaMatrix';
import ThetaUpload from "@/components/features/thetaUpload";
import { AnimatePresence, motion } from "motion/react"
import FileUpload from '@/components/features/upload';
import useGlobalContext from '@/app/Context';
import { TreeNode } from "@/components/features/mainComponents/CollaTree";


export default function App() {
  const {
    jsonFile,
    setJsonFile,
    thetaFile,
    setThetaFile,
    isExpanded,
    setIsExpanded,
    setScalingFactor,
    geneticEventsName,
    setSelectedMutations,
    setHighlightMutation,
    showMatrix,
    setSelectedSchemeName,
  } = useGlobalContext();

  useEffect(() => {
    fetch('/BREAST_oMHN.csv')
      .then((res) => res.text())
      .then((text) => {
        const raw = d3.csvParseRows(text);
        const headers = raw[0].slice(1);
        const longFormat: { row: string; column: string; value: number }[] = [];
        for (let i = 1; i < raw.length; i++) {
          const rowName = raw[i][0];
          const rowValues = raw[i].slice(1);
          for (let j = 0; j < headers.length; j++) {
            longFormat.push({
              row: rowName,
              column: headers[j],
              value: +rowValues[j],
            });
          }
        }
        setThetaFile({ name: "BREAST_oMHN.csv", data: longFormat });
      });
  }, [setThetaFile]);

  const handleThetaUpload = (data: any, name: string) => {
    setThetaFile({ name, data });
  };


  const handleUpload = (data: any, name: string) => {
    setJsonFile({ name, data });
    setIsExpanded(false);
    setScalingFactor(1);
    setSelectedMutations([]);
    setSelectedSchemeName("Turbo");
    setHighlightMutation("");
  };

  return (
    <div className="min-h-screen flex flex-1 overflow-auto items-center justify-center bg-gradient-to-r from-cyan-100 via-blue-300 to-indigo-400 p-6 relative">
      <SidebarProvider>
        <AppSideBar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <p>{jsonFile ? jsonFile.name : "BREAST_orders.json"}</p>
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <p>{thetaFile?.name ?? "BREAST_oMHN.csv"}</p>
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Button
              onClick={() => {
                setHighlightMutation("");
                setIsExpanded(!isExpanded);
              }}
              className="transition hover:-translate-y-1"
            >
              {isExpanded ? 'Collapse All' : 'Expand All'}
            </Button>
          </header>
          <div className="relative flex flex-1 p-5">
            <AnimatePresence>
              {showMatrix && (
                <motion.div
                  key="theta-matrix"
                  initial={{ x: -70, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -70, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <ThetaMatrix data={thetaFile?.data ?? []} mutationNames={geneticEventsName} />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex flex-1">
              {(jsonFile?.data || rawdata) && (
                <CollaTree
                  key={jsonFile?.name || "default-tree"}
                  treedata={(jsonFile?.data as TreeNode) || rawdata}
                  width={1200}
                />
              )}
            </div>
          </div>
          <div className="flex flex-row gap-50 font-bold text-xl p-5 w-full">
            <AnimatePresence>
              {showMatrix && (
                <motion.div
                  key="theta-matrix"
                  initial={{ x: -70, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -70, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <ThetaUpload onThetaUpload={handleThetaUpload} />
                </motion.div>
              )}
            </AnimatePresence>
            <FileUpload onUpload={handleUpload} />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
