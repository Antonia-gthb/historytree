"use client";
import CollapsibleTree from "@/lib/CollapsableTree";
import treedata from "@/data/tonis_orders_tree_2.json";
import Link from "next/link";

export default function Page() {
  return (
    <div className="bg-gray-100 h-screen p-10">
      <div className="container mx-auto bg-white border p-10">
        <h1>Page Hello</h1>
        <Link className="text-blue-600 hover:underline" href="/">Home</Link>
        <CollapsibleTree treedata={treedata} width={1028} />
      </div>
    </div>
  );
}
