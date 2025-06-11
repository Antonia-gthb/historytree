// components/ui/sidebar/appsidebar.tsx
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
import {Button}  from "@/components/ui/button"

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
      <SidebarHeader className="font-semibold">
        MHN Patient History Tree
      </SidebarHeader>

      <SidebarContent>

        {/* COLOR SCHEME */}
        <Collapsible title="Color Scheme" className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild className="group/label text-sm">
              <CollapsibleTrigger className="flex w-full justify-between">
                Color Scheme
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <ColorTheme onSchemeChange={setColorScheme} />
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* SCALING */}
        <Collapsible title="Scaling" className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild className="group/label group-data-[state=open]/collapsible:mb-5 ">
              <CollapsibleTrigger className="flex w-full justify-between">
                Scaling
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent className="flex flex-col space-y-4 ml-2">
                <label className="flex flex-row gap-3 items-center font-semibold">
                <Checkbox
                  checked={scalingEnabled}
                  onCheckedChange={(on) => {
                    setScalingEnabled(on);
                    if (!on) setScalingFactor(0);
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
            <SidebarGroupLabel asChild className="group/label text-sm">
              <CollapsibleTrigger className="flex w-full justify-between">
                Threshold
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <Threshold value={threshold} onChange={setThreshold} />
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* EVENTFILTER */}
        <Collapsible title="Eventfilter" className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild className="group/label text-sm">
              <CollapsibleTrigger className="flex w-full justify-between">
                Event Filter
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <Eventfilter
                  items={geneticEventsName}
                  selectedItems={selectedMutations}
                  onSubmit={setSelectedMutations}
                />
                 <Button className="ease-in-out hover:-translate-y-1 self-end" onClick={() => setSelectedMutations(geneticEventsName)}>Reset</Button>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* HIGHLIGHT MUTATION */}
        <Collapsible title="Highlight Mutation" className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild className="group/label text-sm">
              <CollapsibleTrigger className="flex w-full justify-between">
                Highlight Mutation
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
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
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
