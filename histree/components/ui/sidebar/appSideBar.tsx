"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/sidebar/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar/sidebar";

import FileUpload from "@/components/features/upload";
import Download from "@/components/features/download";
import ColorTheme from "@/components/features/colorSchemes";
import { Checkbox } from "@/components/ui/checkbox";
import SliderScaling from "@/components/features/lineslider";
import Threshold from "@/components/features/threshold";
import { Eventfilter } from "@/components/features/eventfilter";
import { HighlightEvent } from "@/components/features/highlightEvent";
import { Button } from "../button";

export interface AppSidebarProps {
  jsonData: any;
  fileName: string;
  colorScheme: string[];
  scalingEnabled: boolean;
  scalingFactor: number;
  threshold: number;
  geneticEventsName: string[];
  selectedMutations: string[];
  highlightMutation: string;
  handleUpload: (data: any, name: string) => void;
  setColorScheme: (schemes: string[]) => void;
  setScalingEnabled: (on: boolean) => void;
  setScalingFactor: (v: number) => void;
  setThreshold: (v: number) => void;
  setSelectedMutations: (items: string[]) => void;
  setHighlightMutation: (item: string) => void;
}

export function AppSidebar({
  jsonData,
  fileName,
  scalingEnabled,
  scalingFactor,
  threshold,
  geneticEventsName,
  selectedMutations,
  highlightMutation,
  handleUpload,
  setColorScheme,
  setScalingEnabled,
  setScalingFactor,
  setThreshold,
  setSelectedMutations,
  setHighlightMutation,
}: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="font-semibold p-5 mb-3 bg-indigo-800/90 text-white/95">
        MHN Patient History Tree
      </SidebarHeader>

      <SidebarContent>

        {/* UPLOAD */}
        <div className="ml-10 mt-3">
          <FileUpload onUpload={handleUpload} />
        </div>

        {/* COLOR SCHEME */}
        <Collapsible title="Color Scheme" className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild className="group/label group-data-[state=open]/collapsible:mb-1 ">
              <CollapsibleTrigger className="flex w-full justify-between">
                Color Scheme
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent className="p-3 mb-2">
              <SidebarGroupContent>
                <ColorTheme onSchemeChange={setColorScheme} />
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* SCALING */}
        <Collapsible title="Scaling" className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild className="group/label group-data-[state=open]/collapsible:mb-1 ">
              <CollapsibleTrigger className="flex w-full justify-between">
                Scaling
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent className="p-5">
              <SidebarGroupContent className="flex flex-col space-y-4 ml-2">
                <label className="flex flex-row gap-3 items-center font-semibold">
                  <Checkbox
                    checked={scalingEnabled}
                    onCheckedChange={(on) => {
                      const isChecked = on === true;
                      setScalingEnabled(isChecked);
                      if (!isChecked) setScalingFactor(0);
                    }}
                  />
                  <span>Scale edges by weight</span>
                </label>
                <SliderScaling
                  value={[scalingFactor]}
                  min={1}
                  max={7}
                  step={0.5}
                  onValueChange={([v]) => {
                    if (scalingEnabled) setScalingFactor(v);
                  }}
                  disabled={!scalingEnabled}
                />
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* THRESHOLD */}
        <Collapsible title="Threshold" className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild className="group/label group-data-[state=open]/collapsible:mb-1 ">
              <CollapsibleTrigger className="flex w-full justify-between">
                Threshold
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent className="p-3">
              <p className="block text-gray-700 text-sm mb-3 "> Select how many patients share the same path </p>
              <SidebarGroupContent className="ml-5 mb-1">
                <Threshold value={threshold} onChange={setThreshold} />
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* EVENTFILTER */}
        <Collapsible title="Eventfilter" className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild className="group/label group-data-[state=open]/collapsible:mb-1 ">
              <CollapsibleTrigger className="flex w-full justify-between">
                Eventfilter
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent className="p-3">
              <SidebarGroupContent>
                <Eventfilter
                  items={geneticEventsName}
                  selectedItems={selectedMutations}
                  onSubmit={setSelectedMutations}
                  onReset={() => setSelectedMutations(geneticEventsName)}
                />
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* HIGHLIGHT MUTATION */}
        <Collapsible title="Highlight Mutation" className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild className="group/label group-data-[state=open]/collapsible:mb-1">
              <CollapsibleTrigger className="flex w-full justify-between">
                Highlight Mutation
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent className="p-3 mb-2">
              <SidebarGroupContent>
                <HighlightEvent
                  items={geneticEventsName}
                  selected={highlightMutation}
                  onChange={setHighlightMutation}
                />
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* DOWNLOAD */}
        <div className="ml-10 mt-3">
          <Download downloadName={jsonData ? fileName : 'tonis_orders_tree_2.json'} />
        </div>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
