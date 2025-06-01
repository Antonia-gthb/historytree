"use client"

import React from "react"
import {
    Table,
    TableHeader,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from "@/components/ui/table"

interface ThetaMatrixProps {
    mutationNames: string[]
}

export default function ThetaMatrix({ mutationNames }: ThetaMatrixProps) {
    // alle außer "root"
    const names = mutationNames.filter(n => n !== "root")
    const n = names.length

    return (

        <Table className="table-fixed border-collapse w-fit">

            <TableHeader>
                <TableRow>
                    <TableCell className="w-13 p-0 border-0" />
                    {names.map(name => (
                        <TableCell
                            key={name}
                            className="w-6 h-10 px-2 text-[0.625rem] whitespace-nowrap">
                            <div
                                className="text-[0.625rem] text-right whitespace-nowrap transform translate-y-3 translate-x-1 -rotate-45 origin-bottom-left overflow-visible">
                                {name}
                            </div>
                        </TableCell>
                    ))}
                </TableRow>

                <TableRow key="Base Rate">
                     <TableCell className=" w-10 text-[0.625rem] text-right whitespace-nowrap">
                            Base Rate
                        </TableCell>
                      {names.map((_, i) => (
                            <TableCell key={i} className=" bg-white border border-black" />
                        ))}
                           </TableRow>
            </TableHeader>

            <TableBody>

                <TableRow key="spacer">
                    <TableCell colSpan={names.length} className="h-2 p-0" />
                </TableRow>


                {names.map(row => (
                    <TableRow key={row}>
                         <TableCell className="w-10 text-[0.625rem] text-right whitespace-nowrap">
                            {row}
                        </TableCell>
                        {names.map((_, j) => (
                            <TableCell key={j} className=" bg-white border border-black" />
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
