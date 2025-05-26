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
  /** Liste aller verfügbaren Mutations-Namen */
  items: string[];
  /** Aktuell ausgewählter Name zum Highlighten */
  selected: string;
  /** Callback, wenn der User neu auswählt ("" = kein Highlight) */
  onChange: (name: string) => void;
}

export function HighlightEvent({
  items,
  selected,
  onChange,
}: HighlightSelectProps) {
  return (
    <div className="mt-4">
      <label
        htmlFor="highlight-select"
        className="block text-sm font-medium text-gray-700"
      >
        Highlight Mutation
      </label>
      <select
        id="highlight-select"
        className="mt-1 block w-full rounded border px-3 py-2"
        value={selected}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">— none —</option>
        {items.map(name => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}

