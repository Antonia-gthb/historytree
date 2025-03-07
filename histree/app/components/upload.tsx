import { useState, useEffect } from 'react';





export default function UploadButton () {

    const handleFileUpload = (event) => {
        const file = event.target.files[0]; // Ausgewählte Datei
        if (file) {
          const reader = new FileReader(); // FileReader-Objekt erstellen
          reader.onload = (e) => {
            try {
              const jsonData = JSON.parse(e.target.result); // JSON-Datei parsen
              console.log('Hochgeladene Daten:', jsonData);
            } catch (error) {
              console.error('Fehler beim Parsen der JSON-Datei:', error);
            }
          };
          reader.readAsText(file); // Datei als Text einlesen
        }
      };

    return (
    <div>
        <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} id="file-upload"/>
        <label htmlFor="file-upload"></label>
    <button className="px-2 py-1 rounded-2xl bg-blue-30 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-800 text-slate-700 hover:text-white">Upload</button>
  </div>

    );}




 