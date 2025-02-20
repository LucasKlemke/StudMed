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

  const table = result.json
  console.log(table)
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Object.keys(JSON.parse(table)[0]).map((key) => (
            <TableHead key={key}>{key}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {JSON.parse(table).map((row: any, index: number) => (
          <TableRow key={index}>
            {Object.values(row).map((value, i) => (
              <TableCell key={i}>{value as string}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TableBlock
