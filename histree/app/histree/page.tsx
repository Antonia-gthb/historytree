"use client";

import { useState } from 'react';
import CollaTree from './CollaTree';
import rawdata from '@/app/tonis_orders_tree_2.json';
import Link from 'next/link';
import JSONUpload from '../components/upload';

export default function Page() {

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-blue-200 p-6">
            <h1 className='text-4xl font-bold -mt-8 mb-4'> {/*Überschrift*/}
                MHN Patient Tree
            </h1>
            <div className= "flex flex-col justify-center items-center w-full max-w-4xl p-6 mb-8">
                <div className="mx-auto block w-full bg-slate-100 rounded-lg">
                    <CollaTree treedata={rawdata} />
                </div>
                    <div className="text-center font-bold text-xl p-1 w-full mb-2"> 
                        <JSONUpload />
                    </div>
                </div>
            </div>
    );
}