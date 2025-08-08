<template>
  <!-- Carte contenant le tableau -->
  <div class="bg-card rounded-xl py-1 border border-border overflow-hidden">
    <!-- Tableau avec scroll horizontal -->
    <div class="overflow-x-auto max-w-full">
      <div class="min-w-full">
        <Table>
          <TableHeader>
            <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
              <TableHead v-for="header in headerGroup.headers" :key="header.id"
                :data-pinned="header.column.getIsPinned()" :class="cn(
                  { 'sticky bg-background/95': header.column.getIsPinned() },
                  header.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
                )
                  ">
                <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                  :props="header.getContext()" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="table.getRowModel().rows?.length">
              <template v-for="row in table.getRowModel().rows" :key="row.id">
                <TableRow :data-state="row.getIsSelected() && 'selected'">
                  <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id"
                    :data-pinned="cell.column.getIsPinned()" :class="cn(
                      { 'sticky bg-background/95': cell.column.getIsPinned() },
                      cell.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
                    )
                      ">
                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                  </TableCell>
                </TableRow>
                <TableRow v-if="row.getIsExpanded()">
                  <TableCell :colspan="row.getAllCells().length">
                    {{ JSON.stringify(row.original) }}
                  </TableCell>
                </TableRow>
              </template>
            </template>

            <TableRow v-else>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                Aucun résultat.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>


    <div class="p-6 border-t border-border">
      <div class="flex items-center justify-between">
        <div class="flex-1 text-sm text-muted-foreground">
          {{ table.getFilteredSelectedRowModel().rows.length }} de
          {{ table.getFilteredRowModel().rows.length }} véhicule(s) sélectionné(s).
        </div>
        <div class="flex gap-2">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()"
                class="text-muted-foreground !shadow-none">
                Précédent
              </Button>
            </TooltipTrigger>
            <TooltipContent>Page précédente</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()"
                class="text-muted-foreground !shadow-none">
                Suivant
              </Button>
            </TooltipTrigger>
            <TooltipContent>Page suivante</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Table as VueTable, ColumnDef } from '@tanstack/vue-table'
import { FlexRender } from '@tanstack/vue-table'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Vehicle } from './vehicleTableConfig'

interface Props {
  table: VueTable<Vehicle>
  columns: ColumnDef<Vehicle>[]
}

defineProps<Props>()
</script>
