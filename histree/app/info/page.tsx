import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
   return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-r from-cyan-100 via-blue-300 to-indigo-400 p-6 relative">
         <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl w-full text-center mt-8">
            <h1 className="text-4xl font-bold mb-4 mt-6">🧬 MHN Patient History Tree Application 🌳</h1>
            <p><i>Visualize Genetic Event Histories in Tumors using Mutual Hazard Networks (MHNs)</i></p>
         </div>

         <div className="flex justify-center mt-10">
            <div className="p-6 bg-indigo-800/40 rounded-lg shadow-md max-w-xl w-full text-center border border-white">
               <Button className="px-6 py-3 transition hover:-translate-y-1">     
                  <Link href="/User_Guide.pdf" target="_blank" rel="noopener noreferrer">
                     Open User Guide
                  </Link>
               </Button>
            </div>
         </div>

         <div className="flex justify-center mt-8">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl text-center">
               <p className="text-base text-gray-800">
                  The <b>Mutual Hazard Networks (MHNs) algorithm</b> is a Cancer Progression Model (CPM) that takes into account both
                  <b> promoting and inhibitory relationships</b> between genetic events as well as
                  <b> cyclic dependencies</b>, enabling the reconstruction of
                  <b> the most likely tumor evolution path for every tumor</b> in patient data. These paths can be visualized in History Trees 🌳.
               </p>
            </div>
         </div>

         <div className="justify-center mt-8">
            <img src="images/tree_modified_schill.png" width="600" alt="History Tree Paper Schill et al" />
            <p><i>Example for a MHN Patient History Tree, Figure 5, Schill et al., 2023, modified</i></p>
         </div>

         <div className="flex justify-center mt-8 px-4">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl text-left text-gray-800 leading-relaxed">
               <p className="text-xl font-bold"><ins>Description</ins></p>
               <p>
                  The white circle in the center of the tree represents the <b> root</b>, which marks the common
                  starting point for all tumor histories in the dataset. From there, each node represents
                  a genetic event, <b>placed in chronological order based on its most likely position of occurrence</b>.
                  The symbols and colors used for each genetic event are unique combinations,
                  which help distinguish them from one another. The name of the genetic event can be
                  taken from the <b>legend</b> on the left. Each branch of the tree represents an individual
                  tumor evolution path, or “history”, observed in the data. The thickness of each <b>edge </b>
                  (path between two genetic events) corresponds to the number of patients who share
                  that specific sequence of genetic events, in this work referred to as <b>count</b>.
               </p>
            </div>
         </div>


         <div className="flex justify-center mt-8">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl text-center">
               <p className="text-base text-gray-800">
                  <ins>The algorithm generates two files:</ins>
               </p>
            </div>
         </div>


         <div className="flex flex-col lg:flex-row justify-center gap-6 mt-8 px-4">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full text-left">
               <h3 className="text-xl font-semibold mb-2">📄 CSV - Theta Matrix - Step 1</h3>
               <p className="mb-2 text-gray-800">The CSV contains:</p>
               <ul className="list-disc list-inside text-gray-800 space-y-1 mb-4">
                  <li><b>multiplicative effects</b> between genetic events (promoting as well as inhibitory)</li>
                  <li><b>base rates</b> or natural rates of occurrence</li>
                  <li><b>observation rates</b> (effect of a genetic event on the observation event (i.e., clinical detection))</li>
               </ul>
               <img src="images/theta_matrix.png" width="500" alt="Theta matrix view in the web application" className="rounded-md" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full text-left">
               <h3 className="text-xl font-semibold mb-2">📄 JSON - History Tree - Step 2</h3>
               <p className="text-gray-800 mb-4">
                  Based on the Theta Matrix, the algorithm infers the <b>order of occurrence</b> of genetic events for the History Tree, which is stored in the corresponding JSON file.
               </p>
               <img src="images/expandedtree.png" width="500" alt="MHN history tree view with nodes expanded" className="rounded-md" />
            </div>
         </div>

         <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl w-full mt-8 text-center">
            <p className="text-xl font-semibold mb-2">📚Learn More</p>
            <p className="font-bold">Modelling Cancer Progression using Mutual Hazard Networks:</p>
            📝 <Link href="https://doi.org/10.1093/bioinformatics/btz513" target="_blank" rel="noopener noreferrer"> Schill et al., 2019 </Link>
            <p className="font-bold">Overcoming Observation Bias for Cancer Progression Modeling:</p>
            📝 <Link href="https://doi.org/10.1101/2023.12.03.569824" target="_blank" rel="noopener noreferrer"> Schill et al., 2023 </Link>
         </div>
      </div>
   )
}
