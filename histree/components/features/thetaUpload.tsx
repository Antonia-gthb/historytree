"use client";

import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import { useRef } from "react";
import * as d3 from "d3";

interface FileUploadProps {
  onThetaUpload: (data: any, fileName: string) => void;
}

export default function ThetaUpload({ onThetaUpload }: FileUploadProps) {
  const thetaInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    thetaInputRef.current?.click();
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = (await file.text()).replace(/^\uFEFF/, "");
    const raw = d3.csvParseRows(text);
    const headers = raw[0].slice(1).map(h => h.trim());
    const longFormat: { row: string; column: string; value: number }[] = [];

    for (let i = 1; i < raw.length; i++) {
      const rowName = raw[i][0].trim();
      const rowValues = raw[i].slice(1);
      for (let j = 0; j < headers.length; j++) {
        const val = +rowValues[j];
        if (!isNaN(val)) {
          longFormat.push({
            row: rowName,
            column: headers[j],
            value: val,
          });
        }
      }
    }

    onThetaUpload(longFormat, file.name);
  };

  return (
    <div className="mb-5">
      <input
        type="file"
        accept=".csv"
        ref={thetaInputRef}
        onChange={handleCSVUpload}
        style={{ display: "none" }}
      />
      <Button
        variant="outline"
        onClick={handleUploadClick}
        className="transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-800 text-slate-700 hover:text-white"
      >
        <FileUp className=" mr-2 h-4 w-4" />
        Upload Effects CSV
      </Button>
    </div>
  );
}

