import { Button } from '@/components/ui/button';
import { FileUp } from 'lucide-react';
import { useRef } from 'react';

interface FileUploadProps {
  onUpload: (data: any, fileName: string) => void;
}


export default function FileUpload({ onUpload }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);   //damit wir auf das Input Element zugreifen können

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // öffnet Dateiauswahlfenster
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0]; // ausgewähltes Objekt und davon das erste --> 0

    if (file) {  // API aufrufen, die den Text ausliest
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContent = e.target?.result as string; // Inhalt der Datei als String

        try {
          const jsonData = JSON.parse(fileContent); // JSON-String in ein Objekt umwandeln
          const cleanFileName = file.name.split(" ")[0];
          onUpload(jsonData, file.name); // Daten und Dateinamen zurückgeben
        } catch (error) {
          console.error('Fehler beim Parsen der JSON-Datei:', error);
        }

      }
      reader.readAsText(file); // startet Lesevorgang, löst dann onload Handler aus, und wir können auf den Inhalt zugreifen (e.target.result), ohne die Zeile passiert NICHTS

    }
  };


  return (
    < div >
    <Button variant="outline" onClick={handleUploadClick} className="transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-800 text-slate-700 hover:text-white">
    <FileUp className="mr-2 h-4 w-4" />
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        style={{ display: 'none' }} // Versteckt das Dateiauswahlfeld
        onChange={handleFileChange}
      />
      Upload JSON
    </Button>
           </div >
    );
}
