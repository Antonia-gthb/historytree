"use client";

import { useState } from 'react';
import Plot from './components/Plot';
import { myEvent } from './components/EventFilter';
import EventCheckboxes from './components/EventFilter';
import ColorScale from './components/cmap';
import BarChart from './plottwo';
import CollaTree from './tree';
import rawdata from './lib/localdata';
import TreeChart from './treechart';


export default function Page() {
  return (
    <div className="flex flex-col p-6 md:w-3/5 md:px-28 md:py-12 border"> {/* Ein großes div element mit mehreren div Unterelementen*/}
      <h1 className='text-center mb-6 text-2xl font-bold'> {/* Macht den Titel oben in zentriert*/}
        This is an application to demonstrate MHN Patient Trees
      </h1>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-6"> {/* Bild und Graph einfügen*/}
          <Plot
            eventColor={eventColor}
            cmap={cmap}
            scaling={scaleFactor}
            threshold={threshold}
            events={events.filter((event) => event.checked)}/> {/* Eingabe von cmap wird geplottet*/}
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
      <div className="flex items-center mt-6">  {/* CMAP */}
        <h2 className="text-xl font-bold mr-6">CMAP</h2>
        <ColorScale setEventColor={setEventColor} />
      </div>
      <div className="mt-6 "> {/* End X-Wert */}
        <div className="flex">
          <h2 className="text-xl font-bold mr-4">End X-Wert </h2>
          <input type="range" min="0" max="100" value={cmap} className="w-fit" onChange={(e) => setCmap(Number(e.target.value))} /> {/* Skala */}
          <div className='px-3'>
            {cmap}
          </div>
          <div>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-6"> {/* Scaling */}
        <div>
          <input
            type="checkbox"
            checked={scaling}
            onChange={onScalingChange}
            className="w-4 h-4 border cursor-pointer mr-2"
          />
          <span className="text-black mr-4">Scale edges by weight</span>
        </div>
        <div className="flex items-center mt-2">
          <span className="text-black font-bold mr-4">Scaling:</span>
          <div className="flex items-center">
            <input
              type="range" min="1" max="10" value={scaleFactor} className="w-fit" onChange={(e) => setScaleFactor(Number(e.target.value))}
              disabled={!scaling}
            />
            <span className='px-3'> {scaleFactor} </span>
          </div>
        </div>
      </div>
      <div className='mt-6'>
        <span style={{ marginRight: '10px' }}>Treshold at</span>
        <input
          className='w-fit'
          type="number"
          min="0"
          max="100"
          value={threshold}
          onChange={handleThresholdChange}
        />
      </div>
      <div className="flex flex-col mt-6">
        <h1 className="text text-xl font-bold"> Eventfilter </h1>
        <EventCheckboxes
          events={events}
          setEvents={setEvents}
        />
      </div>
      <div className="flex flex-col mt-6">
      <h1 className="text-xl font-bold mr-6">Bar Chart Example</h1>
      <BarChart newdata={newdata} width={1000} height={600} />
      </div>
     <div className="flex flex-col mt-6">
     <h1 className="text-xl font-bold mr-6">Collapsible Tree</h1>
     <CollaTree treedata={treedata} />
     </div>
     <div className="flex flex-col mt-6">
     <h1 className="text-xl font-bold mr-6">MHN Patient Tree Draft</h1>
     {/* <CollaTree treedata={rawdata} /> */}
     <TreeChart> data={rawdata}</TreeChart>
     </div>
   </div>
  );
}
