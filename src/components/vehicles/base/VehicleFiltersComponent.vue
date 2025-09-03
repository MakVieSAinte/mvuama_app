<template>
  <!-- Filtres et select colonnes sur une seule ligne -->
  <div class="bg-card rounded-xl border border-border px-4 py-6">
    <div class="flex flex-col md:flex-row md:items-end gap-3 md:gap-4 w-full">
      <div class="flex-1 min-w-[120px]">
        <label class="text-sm font-medium text-foreground mb-2 block">Recherche</label>
        <Input
          placeholder="Recherche globale..."
          :model-value="globalFilter"
          @update:model-value="(value) => $emit('update:globalFilter', value)"
          class="w-full !shadow-none border border-border text-gray-500 dark:text-gray-400 placeholder:text-gray-500 dark:placeholder:text-gray-400 hover:bg-accent/60 dark:hover:bg-accent/40 focus:bg-accent/60 dark:focus:bg-accent/40"
        />
      </div>
      <div class="flex-1 min-w-[120px]">
        <label class="text-sm font-medium text-foreground mb-1 block">Type</label>
        <Select
          :model-value="typeFilter"
          @update:model-value="(value) => $emit('update:typeFilter', value)"
          class="w-full h-full"
        >
          <SelectTrigger
            class="w-full h-full !shadow-none border border-border hover:bg-accent/60 dark:hover:bg-accent/40 focus:bg-accent/60 dark:focus:bg-accent/40"
          >
            <SelectValue
              placeholder="Tous les types"
              class="w-full h-full text-gray-900 dark:text-gray-100"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="Voiture">Voiture</SelectItem>
            <SelectItem value="Camion">Camion</SelectItem>
            <SelectItem value="Utilitaire">Utilitaire</SelectItem>
            <SelectItem value="Moto">Moto</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex-1 min-w-[120px]">
        <label class="text-sm font-medium text-foreground mb-2 block">Statut</label>
        <Select
          :model-value="statusFilter"
          @update:model-value="(value) => $emit('update:statusFilter', value)"
          class="w-full h-full"
        >
          <SelectTrigger
            class="w-full h-full !shadow-none border border-border hover:bg-accent/60 dark:hover:bg-accent/40 focus:bg-accent/60 dark:focus:bg-accent/40"
          >
            <SelectValue
              placeholder="Tous les statuts"
              class="w-full h-full text-gray-900 dark:text-gray-100"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="Disponible">Disponible</SelectItem>
            <SelectItem value="En service">En service</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
            <SelectItem value="Hors service">Hors service</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex-1 min-w-[120px]">
        <label class="text-sm font-medium text-foreground mb-2 block">Carburant</label>
        <Select
          :model-value="fuelFilter"
          @update:model-value="(value) => $emit('update:fuelFilter', value)"
          class="w-full h-full"
        >
          <SelectTrigger
            class="w-full h-full !shadow-none border border-border hover:bg-accent/60 dark:hover:bg-accent/40 focus:bg-accent/60 dark:focus:bg-accent/40"
          >
            <SelectValue
              placeholder="Tous les carburants"
              class="w-full h-full text-gray-900 dark:text-gray-100"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les carburants</SelectItem>
            <SelectItem value="Essence">Essence</SelectItem>
            <SelectItem value="Diesel">Diesel</SelectItem>
            <SelectItem value="Électrique">Électrique</SelectItem>
            <SelectItem value="Hybride">Hybride</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex-1 min-w-[120px] flex">
        <Tooltip>
          <TooltipTrigger as-child>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button
                  variant="outline"
                  class="w-full h-full !shadow-none border border-border flex flex-row justify-between items-center text-gray-900 dark:text-gray-100"
                >
                  <span class="text-gray-900 dark:text-gray-100">Colonnes</span>
                  <ChevronDown class="mr-2 h-4 w-4 text-gray-900 dark:text-gray-100" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-48">
                <DropdownMenuCheckboxItem
                  v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
                  :key="column.id"
                  class="capitalize"
                  :model-value="column.getIsVisible()"
                  @update:model-value="
                    (value) => {
                      column.toggleVisibility(!!value)
                    }
                  "
                >
                  {{ getColumnDisplayName(column.id) }}
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent>Afficher/masquer les colonnes</TooltipContent>
        </Tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Table as VueTable } from '@tanstack/vue-table'
import type { Vehicle } from './TableConfig'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ChevronDown } from 'lucide-vue-next'

interface Props {
  globalFilter: string
  typeFilter: string
  statusFilter: string
  fuelFilter: string
  table: VueTable<Vehicle>
}

defineProps<Props>()

defineEmits<{
  'update:globalFilter': [value: string]
  'update:typeFilter': [value: string]
  'update:statusFilter': [value: string]
  'update:fuelFilter': [value: string]
}>()

// Fonction pour obtenir le nom d'affichage des colonnes
function getColumnDisplayName(columnId: string): string {
  const displayNames: Record<string, string> = {
    select: 'Sélection',
    statut: 'Statut',
    vehicle: 'Véhicule',
    immatriculation: 'Immatriculation',
    marque: 'Marque',
    modele: 'Modèle',
    type: 'Type',
    carburant: 'Carburant',
    chauffeur: 'Chauffeur',
    echeanceAssurance: 'Échéance assurance',
    dateControletechnique: 'Contrôle technique',
    actions: 'Actions',
  }
  return displayNames[columnId] || columnId
}
</script>
