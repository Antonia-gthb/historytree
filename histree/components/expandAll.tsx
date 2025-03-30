import { Button } from "@/components/ui/button";
import CollaTree from "./CollaTree";

export default function expandAllButton () {

    const expandAll () => {
        if (!root) return; // Sicherheitsprüfung
      
        // Alle Knoten durchlaufen und Kinder wiederherstellen
        root.descendants().forEach((d) => {
          if (d._children) {
            d.children = d._children; // Kinder aus Backup zurückholen
            d._children = undefined; // Backup leeren (optional)
          }
        });
      
        // D3.js-Update auslösen (Neuzeichnen des Baums)
        update(root);
      };






return (
    <Button variant="outline" onClick={} className="transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-800 text-slate-700 hover:text-white">
        Expand All
    </Button>
)

}