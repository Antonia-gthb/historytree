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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar/sidebar"

interface AppSidebarProps {
  children: React.ReactNode;
}

const data = {
  navMain: [
    {
      title: "Upload",
      items: [
        {
          title: "Upload"
        },
        {
          title: "Download"
        },
      ],
    },
    {
      title: "Highlight",
      items: [
        {
          title: "Highlight Path with"
        },
      ],
    },
  ]
}

export function AppSidebar({ children }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="font-semibold">MHN Patient History Tree</SidebarHeader>
      <SidebarContent className="gap-0">
        {children}
      </SidebarContent>
    </Sidebar>
  );
}
