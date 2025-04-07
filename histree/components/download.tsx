import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"

interface DownloadProps {
    downloadName: string;
  }


export default function Download ({downloadName} : DownloadProps) {
    const downloadSVG = () => {

        let svgHisTree = document.getElementById("histree-chart");
        if (!svgHisTree) {
            return;
        }
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgHisTree);


        //Data-URL erstellen
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);

        // Download auslösen
        const a = document.createElement('a');
        a.href = url;
        a.download = `${downloadName}.svg`; // Dateiname anpassen
        a.click();

        //Aufräumen
        URL.revokeObjectURL(url);
    };

        return (
            <Button variant="outline" onClick={downloadSVG} className="transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-800 text-slate-700 hover:text-white">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download
            </Button>
        )
    }