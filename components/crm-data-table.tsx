"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLoader,
  IconTrendingUp,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// CRM Campaign data type
export interface CampaignData {
  id: number
  campaignName: string
  clientName: string
  campaignType: string
  status: "Active" | "Completed" | "Planning"
  dataCollected: string
  conversionRate: string
  revenueGenerated: string
  startDate: string
  endDate: string
}

const columns: ColumnDef<CampaignData>[] = [
  {
    accessorKey: "campaignName",
    header: "Campaign Name",
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.campaignName}</div>
    },
    enableHiding: false,
  },
  {
    accessorKey: "clientName",
    header: "Client",
    cell: ({ row }) => (
      <div className="w-40">
        <Badge variant="secondary" className="text-xs">
          {row.original.clientName}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "campaignType",
    header: "Type",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.campaignType}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      const statusColors = {
        Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        Completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        Planning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      }
      return (
        <Badge
          variant="outline"
          className={`text-xs px-2 py-1 ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
        >
          {status === "Active" && <IconCircleCheckFilled className="w-3 h-3 mr-1 fill-green-600" />}
          {status === "Completed" && <IconCircleCheckFilled className="w-3 h-3 mr-1 fill-blue-600" />}
          {status === "Planning" && <IconLoader className="w-3 h-3 mr-1" />}
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "dataCollected",
    header: () => <div className="text-right">Data Points</div>,
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm">
        {row.original.dataCollected}
      </div>
    ),
  },
  {
    accessorKey: "conversionRate",
    header: () => <div className="text-right">Conversion</div>,
    cell: ({ row }) => {
      const rate = parseFloat(row.original.conversionRate)
      const isGood = rate >= 40
      return (
        <div className="text-right flex items-center justify-end gap-1">
          <span className="font-mono text-sm">{row.original.conversionRate}</span>
          {isGood && <IconTrendingUp className="w-3 h-3 text-green-600" />}
        </div>
      )
    },
  },
  {
    accessorKey: "revenueGenerated",
    header: () => <div className="text-right">Revenue</div>,
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm text-green-600 dark:text-green-400">
        {row.original.revenueGenerated}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
          <DropdownMenuItem>View Analytics</DropdownMenuItem>
          <DropdownMenuItem>Export Data</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            Delete Campaign
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

interface DataTableProps {
  data: CampaignData[]
}

export function DataTable({ data }: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}