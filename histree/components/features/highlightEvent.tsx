"use client"

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup
} from "@/components/ui/select"



interface HighlightSelectProps {
  items: string[];
  selected: string;
  onChange: (name: string) => void;
}

export function HighlightEvent({
  items,
  selected,
  onChange,
}: HighlightSelectProps) {
  const filteredItems = items.filter(name => name !== "root");
  return (
    <div className="mt-4">
     <Select
        value={selected}
        onValueChange={(v) => onChange(v)}
        aria-label="Highlight Mutation">
        <SelectTrigger className="w-[180px] border-black">
          <SelectValue placeholder="Highlight paths with" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Highlight Mutation</SelectLabel>
            {/* none-Option */}
            <SelectItem className="hover:bg-indigo-800/80 text-slate-700 hover:text-white" value="null">
              -
            </SelectItem>
            {/* alle Mutationsnamen */}
            {filteredItems.map((name) => (
              <SelectItem className="hover:bg-indigo-800/80 text-slate-700 hover:text-white" key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}