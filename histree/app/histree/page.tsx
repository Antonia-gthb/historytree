"use client";

import { useState } from 'react';
import CollaTree from './CollaTree';
import rawdata from '@/app/tonis_orders_tree_2.json';
import Link from 'next/link';

export default function Page() {

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 border">
            <h1 className='inset-x-0 top-0 text-2xl font-bold border border-pink-600'> {/* Macht den Titel oben in zentriert*/}
                MHN Patient Trees
            </h1>
            <div className= " object-center w-full max-w-4xl p-6 rounded-lg shadow-lg mb-8">
                <div className="border border-green-600">
                    <CollaTree treedata={rawdata} />
                </div>
                <div className="border border-red-500"> {/* macht die Flexbox für die rechte Seite */}
                    <div className="text-center font-bold text-2xl p-1 w-full mb-2"> {/* in Flexbox auf rechter Seite wird nun Text geschrieben mit blauem Hintergrund, p legt den Abstand um den Text fest*/}
                        <button className="px-2 py-1 rounded bg-blue-300 hover:bg-blue-500 text-slate-700 hover:text-black">Upload</button>
                    </div>
                </div>


            </div>
        </div>
    );
}