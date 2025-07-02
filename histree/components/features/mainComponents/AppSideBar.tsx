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

import Download from "@/components/features/download";
import ColorTheme from "@/components/features/colorSchemes";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import Threshold from "@/components/features/threshold";
import { Eventfilter } from "@/components/features/eventFilter";
import { HighlightEvent } from "@/components/features/highlightEvent";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useGlobalContext from "@/app/Context";

export function AppSideBar() {
  const {
    jsonFile,
    scalingEnabled,
    scalingFactor,
    threshold,
    geneticEventsName,
    selectedMutations,
    highlightMutation,
    showMatrix,
    selectedSchemeName,
    setScalingEnabled,
    setScalingFactor,
    setThreshold,
    setSelectedMutations,
    setHighlightMutation,
    setShowMatrix,
    setSelectedSchemeName,
    resetFilters,
    openMenus,
    setOpenMenus
  } = useGlobalContext();

  return (
    <Sidebar>
      <SidebarHeader className="font-semibold p-5 mb-3 bg-indigo-800/90 text-white/95">
        MHN Patient History Tree
      </SidebarHeader>

      <SidebarContent>
        {/* RESET */}
        <div className="ml-15 mt-3">
          <Button onClick={resetFilters} className="transition hover:-translate-y-1">
            Reset All
          </Button>
        </div>

        {/* COLOR SCHEME */}
        <Collapsible title="Color Scheme" open={openMenus.colorScheme}
          onOpenChange={(val) =>
            setOpenMenus((prev) => ({ ...prev, colorScheme: val }))
          } className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full justify-between">
                Color Scheme
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent className="p-3 mb-2">
              <SidebarGroupContent>
                <ColorTheme
                  onSelectChange={setSelectedSchemeName}
                  selectedScheme={selectedSchemeName}
                />
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* SCALING */}
        <Collapsible title="Scaling" open={openMenus.scaling}
          onOpenChange={(val) =>
            setOpenMenus((prev) => ({ ...prev, scaling: val }))
          } className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
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
                      if (isChecked && scalingFactor === 0) {
                        setScalingFactor(1);
                      } else if (!isChecked) {
                        setScalingFactor(0);
                      }
                    }}
                  />
                  <span>Scale edges by weight</span>
                </label>
                <Slider
                  className="w-[60%]"
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
        <Collapsible title="Threshold" open={openMenus.threshold}
          onOpenChange={(val) =>
            setOpenMenus((prev) => ({ ...prev, threshold: val }))
          } className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full justify-between">
                Threshold
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent className="p-3">
              <p className="text-sm mb-3 text-gray-700">
                Only paths found in at least {threshold} patients/tumors will be shown
              </p>
              <SidebarGroupContent className="ml-5 mb-1">
                <Threshold value={threshold} onChange={setThreshold} />
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* EVENTFILTER */}
        <Collapsible title="Eventfilter" open={openMenus.eventfilter}
          onOpenChange={(val) =>
            setOpenMenus((prev) => ({ ...prev, eventfilter: val }))
          } className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
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
                  onReset={() => setSelectedMutations([])}
                />
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* HIGHLIGHT */}
        <Collapsible title="Highlight Mutation" open={openMenus.highlight}
          onOpenChange={(val) =>
            setOpenMenus((prev) => ({ ...prev, highlight: val }))
          } className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
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
        <div className="ml-13 mt-3">
          <Download downloadName={jsonFile ? jsonFile.name : "BREAST_orders_toni.json"} />
        </div>

        {/* THETAMATRIX TOGGLE */}
        <div className="ml-10 mt-3">
          <Button className="transition hover:-translate-y-1" onClick={() => setShowMatrix(!showMatrix)}>
            {showMatrix ? "Hide Theta Matrix" : "Show Theta Matrix"}
          </Button>
        </div>

        {/* INFO */}
        <Collapsible title="Info" className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full justify-between">
                More Information
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent className="p-3 mb-2">
              <SidebarGroupContent className="flex flex-col">
                <Button className="ml-1 mt-2 transition hover:-translate-y-1">
                  <Link href="/info" target="_blank" rel="noopener noreferrer">Tutorial</Link>
                </Button>
                <Button className="ml-1 mt-2 transition hover:-translate-y-1">
                  <Link href="https://www.overleaf.com/project/67c5947a93babe7ce8dafd44" target="_blank" rel="noopener noreferrer">Master Thesis</Link>
                </Button>
                <Button className="ml-1 mt-2 transition hover:-translate-y-1">
                  <Link href="https://miro.com/app/board/uXjVIxUGLv0=/?share_link_id=356747018988" target="_blank" rel="noopener noreferrer">Miro</Link>
                </Button>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
