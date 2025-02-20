'use client'
import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'

const TableBlock = ({ result }: { result: any }) => {
  //   console.log(result)
  //   const [table, setTable] = useState(result.json)

  const table = result.json
  return (
    // <Table>
    //   <TableHeader>
    //     <TableRow>
    //       {Object.keys(JSON.parse(table)[0]).map((key) => (
    //         <TableHead key={key}>{key}</TableHead>
    //       ))}
    //     </TableRow>
    //   </TableHeader>
    //   <TableBody>
    //     {JSON.parse(table).map((row: any, index: number) => (
    //       <TableRow key={index}>
    //         {Object.values(row).map((value, i) => (
    //           <TableCell key={i}>{value as string}</TableCell>
    //         ))}
    //       </TableRow>
    //     ))}
    //   </TableBody>
    // </Table>
    <div className="">
 
    </div>
  )
}

export default TableBlock
