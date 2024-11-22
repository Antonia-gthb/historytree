"use client";

import { useState } from 'react';
import Image from 'next/image';
import { join } from 'path';
import Plot from './Plot';

export default function Page() {

  const [cmap, setCmap] = useState(30);
  const [scaling, setScaling] = useState(5);



  return (
    <div className="flex flex-col p-6 md:w-3/5 md:px-28 md:py-12 border"> {/* Ein großes div element mit mehreren div Unterelementen*/}
      <h1 className='text-center mb-6 text-2xl font-bold'> {/* Macht den Titel oben in zentriert*/}
        This is an application to demonstrate MHN Patient Trees
      </h1>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-6 border border-red-700"> {/* Bild und Graph einfügen*/}
          <Plot cmap={cmap} scaling={scaling}/> {/* Eingabe von cmap wird geplottet*/}
        </div>
        <div className="flex flex-col"> {/* macht die Flexbox für die rechte Seite */}
          <div className="text-center font-bold text-2xl p-1 w-full mb-2"> {/* in Flexbox auf rechter Seite wird nun Text geschrieben mit blauem Hintergrund, p legt den Abstand um den Text fest*/}
            <button className="px-2 py-1 rounded bg-blue-300 hover:bg-blue-500 text-slate-700 hover:text-black">Upload</button> {/* Mit hover verändert sich Bildfarbe*/}
          </div>
          <p className="bg-white text-black p-4 mt-2 text-lg mb-2">
            Platzhalter
          </p>
          <div className="text-center font-bold text-2xl p-1 w-full mb-2"> {/* mb-2 macht Abstand nach unten zum Text*/}
            <button className="px-2 py-1 rounded bg-blue-300 hover:bg-blue-500 text-slate-700 hover:text-black">Upload Patients</button>
          </div>
          <p className="bg-white text-black p-4 mt-2 text-lg border border-black">
            Platzhalter für Datenfeld
          </p>
        </div>
      </div>
      <div className="mt-6 ">
        <div className="flex">
          <h2 className="text-xl font-bold mr-4">CMAP</h2>
          <input type="range" min="0" max="100" value={cmap} className="w-fit" onChange={(e) => setCmap(Number(e.target.value))} /> {/* Skala */}
          <div className='px-3'>
            {cmap}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start mt-6"> {/* Flexbox für Checkbox und Skala */}
        <div className="flex items-center"> {/* Checkbox und Text */}
          <input
            type="checkbox"
            className="w-4 h-4 border border-black cursor-pointer mr-2"
          />
          <span className="text-black mr-4">Scale edges by weight</span>
        </div>
        <div className="flex items-center mt-2">
          <span className="text-black font-bold mr-4">Scaling:</span>
          <div className="flex items-center w-full justify-between">
            <input
              type="range" min="1" max="10" value={scaling} className="w-fit" onChange={(e) => setScaling(Number(e.target.value))}
            />
            <span className='px-3'> {scaling} </span>
          </div>
        </div>
      </div>
      <div className='mt-6'>
        <span style={{ marginRight: '10px' }}>Treshold at</span>
        <input type="number" placeholder="Gib eine Zahl ein" />
      </div>
      <div className='flex flex-col mt-6'>
        <h1 className="text text-xl"> Eventfilter </h1>
        <span> Event A </span>
        <input type="checkbox" />
        <span> Event B </span>
        <input type="checkbox" />
        <span> Event C </span>
        <input type="checkbox" />
        <span> Event D </span>
        <input type="checkbox" />
      </div> 
    </div>
  );
}

