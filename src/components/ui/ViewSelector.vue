<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" class="gap-2 min-w-[120px]">
        <SlidersHorizontal class="h-4 w-4 mr-1" />
        Affichage
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" class="w-auto p-2 bg-transparent border-none shadow-none">
      <div class="flex flex-row gap-2 bg-muted rounded-lg p-3 shadow-md">
        <button
          @click="$emit('update:viewType', 'table')"
          :class="[
            'flex flex-col items-center justify-center rounded-md px-4 py-3 min-w-[80px] transition border-2',
            viewType === 'table'
              ? 'bg-background border-primary text-primary'
              : 'bg-muted border-transparent text-muted-foreground hover:border-accent',
          ]"
          style="outline: none"
        >
          <List class="h-6 w-6 mb-1" />
          <span class="font-medium text-sm">Tableau</span>
        </button>
        <button
          @click="$emit('update:viewType', 'card')"
          :class="[
            'flex flex-col items-center justify-center rounded-md px-4 py-3 min-w-[80px] transition border-2',
            viewType === 'card'
              ? 'bg-background border-primary text-primary'
              : 'bg-muted border-transparent text-muted-foreground hover:border-accent',
          ]"
          style="outline: none"
        >
          <LayoutGrid class="h-6 w-6 mb-1" />
          <span class="font-medium text-sm">Cartes</span>
        </button>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { List, LayoutGrid, SlidersHorizontal } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'

defineProps<{
  viewType: 'table' | 'card'
}>()

defineEmits<{
  'update:viewType': [value: 'table' | 'card']
}>()
</script>
