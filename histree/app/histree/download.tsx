import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"
import { useEffect } from "react";

export default function Download() {
    const downloadSVG = () => {

        let svgHisTree = document.getElementById("histree-chart");
        if (!svgHisTree) {
            return;
        }
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgHisTree);


        // 3. Data-URL erstellen
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);

        // 4. Download auslösen
        const a = document.createElement('a');
        a.href = url;
        a.download = 'histree.svg'; // Dateiname anpassen
        a.click();

        // 5. Aufräumen
        URL.revokeObjectURL(url);
    };

        return (
            <Button variant="outline" onClick={downloadSVG} className="transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-800 text-slate-700 hover:text-white">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download
            </Button>
        )
    }