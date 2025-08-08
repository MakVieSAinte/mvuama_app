<template>
  <div class="space-y-8 min-h-screen bg-gradient-to-br from-background to-muted p-4 md:p-8">
    <!-- Mini dashboard -->
    <MiniDash />

    <!-- Header avec titre -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-end gap-4 mb-6">
      <div class="flex flex-row gap-2">
        <Button
          v-if="table.getFilteredSelectedRowModel().rows.length > 0"
          variant="destructive"
          class="inline-flex items-center gap-2 text-amber-50"
          @click="deleteSelectedRows"
        >
        <Trash class="h-5 w-5" />
          Supprimer
        </Button>
        <Button class="inline-flex items-center gap-2" @click="openAddModal = true">
          <Plus class="h-5 w-5" />
          Ajouter un véhicule
        </Button>
      </div>
    </div>

    <!-- Modal d'ajout de véhicule -->
    <AjoutVehiculesModal :open="openAddModal" @close="openAddModal = false" />

    <!-- Filtres -->
    <div class="mb-6">
      <VehiculeFilters
        v-model:global-filter="globalFilter"
        v-model:type-filter="typeFilter"
        v-model:status-filter="statusFilter"
        v-model:fuel-filter="fuelFilter"
        :table="table"
      />
    </div>

    <!-- Tableau -->
    <div class="mb-6">
      <VehiculeTable :table="table" :columns="columns" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Fonction pour supprimer les lignes sélectionnées
function deleteSelectedRows() {
  const selected = table.getFilteredSelectedRowModel().rows.map((r) => r.original)
  if (selected.length === 0) return
  if (confirm(`Supprimer ${selected.length} véhicule(s) sélectionné(s) ?`)) {
    // Ici, tu peux remplacer par la logique réelle de suppression
    alert('Suppression de : ' + selected.map((v) => v.immatriculation).join(', '))
  }
}
import { ref, computed, h, type Ref } from 'vue'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Plus, Trash } from 'lucide-vue-next'

// Composants modulaires
import AjoutVehiculesModal from './modal/ajoutVehiculesComponent.vue'
import MiniDash from './base/MiniDashComponent.vue'
import VehiculeFilters from './base/VehiculeFiltersComponent.vue'
import VehiculeTable from './base/VehiculeTableComponent.vue'

// Imports pour le tableau
import type {
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import {
  createColumnHelper,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'

// Types et données
import { vehiclesData, createVehicleColumns, type Vehicle } from './base/vehicleTableConfig'

const openAddModal = ref(false)

// Données filtrées et filtres
const globalFilter = ref('')
const typeFilter = ref('all')
const statusFilter = ref('all')
const fuelFilter = ref('all')

// Données filtrées en temps réel
const filteredData = computed(() => {
  return vehiclesData.filter((vehicle) => {
    const matchesGlobal =
      !globalFilter.value ||
      vehicle.libelle.toLowerCase().includes(globalFilter.value.toLowerCase()) ||
      vehicle.immatriculation.toLowerCase().includes(globalFilter.value.toLowerCase()) ||
      vehicle.marque.toLowerCase().includes(globalFilter.value.toLowerCase()) ||
      vehicle.modele.toLowerCase().includes(globalFilter.value.toLowerCase()) ||
      (vehicle.chauffeur?.nom || '').toLowerCase().includes(globalFilter.value.toLowerCase())

    const matchesType = typeFilter.value === 'all' || vehicle.type === typeFilter.value
    const matchesStatus = statusFilter.value === 'all' || vehicle.statut === statusFilter.value
    const matchesFuel = fuelFilter.value === 'all' || vehicle.carburant === fuelFilter.value

    return matchesGlobal && matchesType && matchesStatus && matchesFuel
  })
})

// Fonction valueUpdater (nécessaire pour ShadCN-Vue)
function valueUpdater<T>(updaterOrValue: T | ((old: T) => T), ref: Ref<T>) {
  ref.value =
    typeof updaterOrValue === 'function'
      ? (updaterOrValue as (old: T) => T)(ref.value)
      : updaterOrValue
}

// Configuration du tableau
const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({
  // Colonnes masquées par défaut
  marque: false,
  modele: false,
  type: false,
})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

// Fonctions d'actions pour les véhicules
function viewVehicle(vehicle: Vehicle) {
  alert('Voir le véhicule : ' + vehicle.immatriculation)
}

function editVehicle(vehicle: Vehicle) {
  alert('Édition du véhicule : ' + vehicle.immatriculation)
}

function deleteVehicle(vehicle: Vehicle) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le véhicule ${vehicle.immatriculation} ?`)) {
    alert('Véhicule supprimé : ' + vehicle.immatriculation)
  }
}

// Création des colonnes avec les fonctions d'actions
const columns = createVehicleColumns({ viewVehicle, editVehicle, deleteVehicle })

const table = useVueTable({
  get data() {
    return filteredData.value
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),
  state: {
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get columnVisibility() {
      return columnVisibility.value
    },
    get rowSelection() {
      return rowSelection.value
    },
    get expanded() {
      return expanded.value
    },
    columnPinning: {
      left: ['statut'],
    },
  },
})
</script>
