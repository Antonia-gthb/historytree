"use client";

import { useState } from 'react';

import Image from 'next/image';
import { join } from 'path';
import Plot from './Plot';

export default function Page() {

  const [cmap, setCmap] = useState(30);



  return (
    <div className="flex flex-col p-6 md:w-3/5 md:px-28 md:py-12 border"> {/* Ein großes div element mit mehreren div Unterelementen*/}
      <h1 className='text-center mb-6 text-2xl font-bold'> {/* Macht den Titel oben in zentriert*/}
        This is an application to demonstrate MHN Patient Trees
      </h1>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-6"> {/* Bild einfügen*/}
          <Plot cmap={cmap} />
          <Image
            src="/mhn_tree.png"
            width={520}
            height={419}
            alt="Picture showing a Mutual Hazard Network Patient Tree"
          />
        </div>
        <div className="flex flex-col"> {/* macht die Flexbox für die rechte Seite */}
          <div className="text-center font-bold text-2xl p-1 w-full mb-2"> {/* in Flexbox auf rechter Seite wird nun Text geschrieben mit blauem Hintergrund, p legt den Abstand um den Text fest*/}
            <button className="px-2 py-1 rounded bg-blue-300 hover:bg-blue-500 text-slate-700 hover:text-black">Upload</button>
          </div>
          <p className="bg-white text-black p-4 mt-2 text-lg mb-2">
            Platzhalter
          </p>
          <div className="text-center font-bold text-2xl bg-blue-300 p-1 w-full mb-2"> {/* mb-2 macht Abstand nach unten zum Text*/}
            <button className="upload-button p-2 rounded mr-1">Upload Patients</button>
          </div>
          <p className="bg-white text-black p-4 mt-2 text-lg border border-black">
            Platzhalter für Datenfeld
          </p>
        </div>
      </div>
      <div className="mt-6 ">
        <div className="flex">
          <h2 className="text-xl font-bold mr-4">CMAP</h2>
          <input type="range" min="0" max="100" value={cmap} className="w-fit" onChange={(e) => setCmap(e.target.value)} /> {/* Skala */}
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
          <span className="text-black mr-4">Scaling:</span>
          <div className="flex items-center w-full justify-between">
            <span className="text-black mr-2">0</span>
            <input
              type="range"
              min="0"
              max="10"
              className="w-full mx-2"
            />
            <span className="text-black mx-2">10</span>
          </div>
        </div>
        <div className="flex justify-between w-full mt-2"> {/* Beschriftung für 5 */}
          <span className="text-black text-center" style={{ width: '100%' }}>5</span>
        </div>
      </div>
    </div>
  );
}

