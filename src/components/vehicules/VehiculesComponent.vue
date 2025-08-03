<template>
  <div class="space-y-8 min-h-screen bg-gradient-to-br from-background to-muted p-4 md:p-8">
    <!-- Mini dashboard -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-card rounded-xl shadow border border-border p-4 flex items-center gap-4">
        <div class="p-2 rounded-full bg-green-100 dark:bg-green-900">
          <Car class="h-6 w-6 text-green-600 dark:text-green-300" />
        </div>
        <div>
          <div class="text-2xl font-bold">{{ data.length }}</div>
          <div class="text-xs text-muted-foreground">Véhicules au total</div>
        </div>
      </div>
      <div class="bg-card rounded-xl shadow border border-border p-4 flex items-center gap-4">
        <div class="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
          <CheckCircle class="h-6 w-6 text-blue-600 dark:text-blue-300" />
        </div>
        <div>
          <div class="text-2xl font-bold">
            {{ data.filter((v) => v.statut === 'Disponible').length }}
          </div>
          <div class="text-xs text-muted-foreground">Disponibles</div>
        </div>
      </div>
      <div class="bg-card rounded-xl shadow border border-border p-4 flex items-center gap-4">
        <div class="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900">
          <Wrench class="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
        </div>
        <div>
          <div class="text-2xl font-bold">
            {{ data.filter((v) => v.statut === 'Maintenance').length }}
          </div>
          <div class="text-xs text-muted-foreground">En maintenance</div>
        </div>
      </div>
      <div class="bg-card rounded-xl shadow border border-border p-4 flex items-center gap-4">
        <div class="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
          <Gauge class="h-6 w-6 text-purple-600 dark:text-purple-300" />
        </div>
        <div>
          <div class="text-2xl font-bold">{{ totalKilometrage }}</div>
          <div class="text-xs text-muted-foreground">Km cumulés</div>
        </div>
      </div>
    </div>
    <!-- Header avec titre -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-end gap-4">
      <Button class="inline-flex items-center gap-2" @click="openAddModal = true">
        <Plus class="h-5 w-5" />
        Ajouter un véhicule
      </Button>
    </div>
    <!-- Modal d'ajout de véhicule -->
    <AjoutVehiculesComponent :open="openAddModal" @close="openAddModal = false" />
    <br />

    <!-- Filtres et select colonnes sur une seule ligne -->
    <div class="bg-card rounded-xl shadow-sm border border-border p-4">
      <div class="flex flex-col md:flex-row md:items-end gap-3 md:gap-4 w-full">
        <div class="flex-1 min-w-[120px]">
          <label class="text-sm font-medium text-foreground mb-1 block">Recherche</label>
          <Input
            placeholder="Recherche globale..."
            :model-value="globalFilter"
            @update:model-value="setGlobalFilter"
            class="w-full"
          />
        </div>
        <div class="flex-1 min-w-[120px]">
          <label class="text-sm font-medium text-foreground mb-1 block">Type</label>
          <Select v-model="typeFilter" class="w-full h-full">
            <SelectTrigger class="w-full h-full">
              <SelectValue placeholder="Tous les types" class="w-full h-full" />
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
          <label class="text-sm font-medium text-foreground mb-1 block">Statut</label>
          <Select v-model="statusFilter" class="w-full h-full">
            <SelectTrigger class="w-full h-full">
              <SelectValue placeholder="Tous les statuts" class="w-full h-full" />
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
          <label class="text-sm font-medium text-foreground mb-1 block">Carburant</label>
          <Select v-model="fuelFilter" class="w-full h-full">
            <SelectTrigger class="w-full h-full">
              <SelectValue placeholder="Tous les carburants" class="w-full h-full" />
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
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                variant="outline"
                class="w-full h-full flex flex-row justify-between items-center"
              >
                <span>Colonnes</span>
                <ChevronDown class="mr-2 h-4 w-4" />
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
        </div>
      </div>
    </div>

    <br />

    <!-- Carte contenant le tableau -->
    <div class="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
      <!-- Tableau avec scroll horizontal -->
      <div class="overflow-x-auto max-w-full">
        <div class="min-w-full">
          <Table>
            <TableHeader>
              <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                <TableHead
                  v-for="header in headerGroup.headers"
                  :key="header.id"
                  :data-pinned="header.column.getIsPinned()"
                  :class="
                    cn(
                      { 'sticky bg-background/95': header.column.getIsPinned() },
                      header.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
                    )
                  "
                >
                  <FlexRender
                    v-if="!header.isPlaceholder"
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="table.getRowModel().rows?.length">
                <template v-for="row in table.getRowModel().rows" :key="row.id">
                  <TableRow :data-state="row.getIsSelected() && 'selected'">
                    <TableCell
                      v-for="cell in row.getVisibleCells()"
                      :key="cell.id"
                      :data-pinned="cell.column.getIsPinned()"
                      :class="
                        cn(
                          { 'sticky bg-background/95': cell.column.getIsPinned() },
                          cell.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
                        )
                      "
                    >
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

      <!-- Pagination -->
      <div class="p-6 border-t border-border">
        <div class="flex items-center justify-between">
          <div class="flex-1 text-sm text-muted-foreground">
            {{ table.getFilteredSelectedRowModel().rows.length }} de
            {{ table.getFilteredRowModel().rows.length }} véhicule(s) sélectionné(s).
          </div>
          <div class="space-x-2">
            <Button
              variant="outline"
              size="sm"
              :disabled="!table.getCanPreviousPage()"
              @click="table.previousPage()"
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              :disabled="!table.getCanNextPage()"
              @click="table.nextPage()"
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AjoutVehiculesComponent from './AjoutVehiculesComponent.vue'
import { ref } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

const openAddModal = ref(false)

// Formulaire d'ajout de véhicule (doit être défini AVANT usage dans le template)
const form = ref({
  marque: '',
  modele: '',
  annee: '',
  immatriculation: '',
  type: '',
  statut: '',
  dateMiseEnService: '',
  photo: null,
  vin: '',
  moteur: '',
  kilometrage: '',
  carburant: '',
  transmission: '',
  puissance: '',
  couleur: '',
  carteGriseNum: '',
  carteGriseScan: null,
  assuranceNum: '',
  assuranceCompagnie: '',
  assuranceExpiration: '',
  assuranceDoc: null,
  controleTechniqueDate: '',
  controleTechniqueValidite: '',
  vignette: '',
  autresDocs: null,
  prixAchat: '',
  modeAcquisition: '',
  fraisAnnexes: '',
  chauffeur: '',
  lieuAffectation: '',
  etat: '',
  accessoires: '',
  notes: '',
})

function onFileChange(event: Event, key: string) {
  const target = event.target as HTMLInputElement
  const files = target.files
  form.value[key] = files && files.length > 1 ? Array.from(files) : files?.[0] || null
}
import type {
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import {
  ChevronDown,
  ChevronsUpDown,
  Edit,
  Car,
  Plus,
  Settings,
  Eye,
  Trash2,
  MoreHorizontal,
  Truck,
  User,
  CheckCircle,
  Wrench,
  Gauge,
} from 'lucide-vue-next'
// Calcul du kilométrage total
const totalKilometrage = computed(() => {
  return data
    .reduce((acc, v) => acc + (typeof v.kilometrage === 'number' ? v.kilometrage : 0), 0)
    .toLocaleString('fr-FR')
})
import { h, computed, watch, type Ref } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

// Fonction valueUpdater (nécessaire pour ShadCN-Vue)
function valueUpdater<T>(updaterOrValue: T | ((old: T) => T), ref: Ref<T>) {
  ref.value =
    typeof updaterOrValue === 'function'
      ? (updaterOrValue as (old: T) => T)(ref.value)
      : updaterOrValue
}

// Interface Vehicle étendue
export interface Vehicle {
  id: string
  immatriculation: string
  libelle: string
  marque: string
  modele: string
  annee: number
  type: 'Voiture' | 'Camion' | 'Utilitaire' | 'Moto'
  statut: 'Disponible' | 'En service' | 'Maintenance' | 'Hors service'
  kilometrage: number
  carburant: 'Essence' | 'Diesel' | 'Électrique' | 'Hybride'
  dateMiseEnService: string
  prochainEntretien: string
  chauffeur?: {
    nom: string
    avatar?: string
  }
  echeanceAssurance: string
  dateControletechnique: string
}

// Données mockées étendues
const data: Vehicle[] = [
  {
    id: '1',
    immatriculation: 'AB-123-CD',
    libelle: 'Berline compacte fiable',
    marque: 'Toyota',
    modele: 'Corolla',
    annee: 2022,
    type: 'Voiture',
    statut: 'Disponible',
    dateMiseEnService: '2022-03-15',
    prochainEntretien: '2025-09-01',
    kilometrage: 32000,
    carburant: 'Essence',
    chauffeur: {
      nom: 'Ahmed Ben Ali',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
    echeanceAssurance: '2026-03-15',
    dateControletechnique: '2025-12-15',
  },
  {
    id: '2',
    immatriculation: 'EF-456-GH',
    libelle: 'Fourgon grande capacité',
    marque: 'Renault',
    modele: 'Master',
    annee: 2020,
    type: 'Utilitaire',
    statut: 'En service',
    dateMiseEnService: '2020-07-10',
    prochainEntretien: '2025-08-10',
    kilometrage: 87000,
    carburant: 'Diesel',
    chauffeur: {
      nom: 'Fatima Zahra',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b123?w=100&h=100&fit=crop&crop=face',
    },
    echeanceAssurance: '2025-12-31',
    dateControletechnique: '2025-11-20',
  },
  {
    id: '3',
    immatriculation: 'IJ-789-KL',
    libelle: 'Camion longue distance',
    marque: 'Mercedes',
    modele: 'Actros',
    annee: 2019,
    type: 'Camion',
    statut: 'Maintenance',
    dateMiseEnService: '2019-11-20',
    prochainEntretien: '2025-08-05',
    kilometrage: 210000,
    carburant: 'Diesel',
    chauffeur: {
      nom: 'Mohamed Tounsi',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    echeanceAssurance: '2025-10-01',
    dateControletechnique: '2025-09-15',
  },
  {
    id: '4',
    immatriculation: 'MN-012-OP',
    libelle: 'Citadine électrique',
    marque: 'Peugeot',
    modele: '208',
    annee: 2023,
    type: 'Voiture',
    statut: 'Hors service',
    dateMiseEnService: '2023-01-05',
    prochainEntretien: '2026-01-05',
    kilometrage: 12000,
    carburant: 'Électrique',
    echeanceAssurance: '2026-01-05',
    dateControletechnique: '2026-02-10',
  },
]

// Données filtrées et filtres
const globalFilter = ref('')
const typeFilter = ref('all')
const statusFilter = ref('all')
const fuelFilter = ref('all')

// Données filtrées en temps réel
const filteredData = computed(() => {
  return data.filter((vehicle) => {
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

// Fonction pour mettre à jour le filtre global
function setGlobalFilter(value: string) {
  globalFilter.value = value
}

const columnHelper = createColumnHelper<Vehicle>()

// Fonction pour obtenir l'icône du véhicule
function getVehicleIcon(type: string) {
  const icons = {
    Voiture: Car,
    Camion: Truck,
    Utilitaire: Truck,
    Moto: Car,
  }
  return icons[type as keyof typeof icons] || Car
}

// Fonction pour formater les dates
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

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

const columns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        modelValue:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate'),
        'onUpdate:modelValue': (value) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Tout sélectionner',
      }),
    cell: ({ row }) => {
      return h(Checkbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value) => row.toggleSelected(!!value),
        ariaLabel: 'Sélectionner la ligne',
      })
    },
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('statut', {
    enablePinning: true,
    header: 'Statut',
    cell: ({ row }) => {
      const statut = row.getValue('statut') as string
      const colors: Record<string, string> = {
        Disponible: 'bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30',
        'En service': 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30',
        Maintenance:
          'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30',
        'Hors service': 'bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30',
      }
      return h(
        'div',
        {
          class: `capitalize px-1.5 py-0.5 rounded text-xs font-semibold flex items-center justify-center ${colors[statut] || 'bg-muted text-muted-foreground border border-muted'}`,
        },
        statut,
      )
    },
  }),
  columnHelper.display({
    id: 'vehicle',
    header: 'Véhicule',
    cell: ({ row }) => {
      const vehicle = row.original
      return h('div', { class: 'min-w-0 flex-1' }, [
        h('div', { class: 'text-sm font-semibold text-foreground truncate' }, vehicle.libelle),
        h(
          'div',
          { class: 'text-xs text-muted-foreground truncate' },
          `${vehicle.marque} ${vehicle.modele}`,
        ),
      ])
    },
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('immatriculation', {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Immatriculation', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) =>
      h('div', { class: 'font-semibold text-foreground' }, row.getValue('immatriculation')),
  }),
  columnHelper.accessor('marque', {
    header: 'Marque',
    cell: ({ row }) => h('div', { class: 'text-foreground' }, row.getValue('marque')),
  }),
  columnHelper.accessor('modele', {
    header: 'Modèle',
    cell: ({ row }) => h('div', { class: 'text-foreground' }, row.getValue('modele')),
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: ({ row }) => h('div', { class: 'text-foreground' }, row.getValue('type')),
  }),
  columnHelper.accessor('carburant', {
    header: 'Carburant',
    cell: ({ row }) => {
      const carburant = row.getValue('carburant') as string
      return h('div', { class: 'font-medium text-muted-foreground' }, carburant)
    },
  }),
  columnHelper.display({
    id: 'chauffeur',
    header: 'Chauffeur',
    cell: ({ row }) => {
      const chauffeur = row.original.chauffeur
      const vehicle = row.original
      if (!chauffeur) {
        return h('div', { class: 'flex items-center gap-2 text-gray-500' }, [
          h('div', { class: 'flex-shrink-0' }, [
            h(Avatar, { class: 'h-8 w-8' }, () => [
              h(AvatarFallback, { class: 'bg-gray-200' }, () => h(User, { class: 'h-4 w-4' })),
            ]),
          ]),
          h('span', { class: 'text-sm' }, 'Non assigné'),
        ])
      }
      return h(HoverCard, {}, () => [
        h(HoverCardTrigger, {}, () =>
          h('div', { class: 'flex items-center gap-2 cursor-pointer' }, [
            h('div', { class: 'flex-shrink-0' }, [
              h(Avatar, { class: 'h-8 w-8' }, () => [
                chauffeur.avatar
                  ? h(AvatarImage, { src: chauffeur.avatar, alt: chauffeur.nom })
                  : null,
                h(AvatarFallback, {}, () =>
                  chauffeur.nom
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase(),
                ),
              ]),
            ]),
            h('span', { class: 'text-sm font-medium' }, chauffeur.nom),
          ]),
        ),
        h(HoverCardContent, { class: 'w-80 p-4 flex flex-row items-start gap-4' }, () => [
          h(Avatar, { class: 'h-16 w-16 flex-shrink-0' }, () => [
            chauffeur.avatar ? h(AvatarImage, { src: chauffeur.avatar, alt: chauffeur.nom }) : null,
            h(AvatarFallback, {}, () =>
              chauffeur.nom
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase(),
            ),
          ]),
          h('div', { class: 'flex flex-col flex-1 gap-1' }, [
            h('div', { class: 'text-lg font-semibold text-foreground' }, chauffeur.nom),
            h('div', { class: 'text-sm text-muted-foreground' }, 'email@email.com'),
            h('div', { class: 'text-sm text-muted-foreground' }, '+212 600 000 000'),
            h(
              Button,
              {
                size: 'sm',
                variant: 'ghost',
                class: 'mt-2 flex items-center gap-2 w-fit',
                onClick: () => viewVehicle(vehicle),
              },
              () => [h(Eye, { class: 'h-4 w-4' }), 'Voir plus'],
            ),
          ]),
        ]),
      ])
    },
    enableSorting: false,
  }),
  columnHelper.accessor('echeanceAssurance', {
    header: 'Échéance assurance',
    cell: ({ row }) => {
      const date = formatDate(row.getValue('echeanceAssurance'))
      return h('div', { class: 'text-sm text-muted-foreground' }, date)
    },
  }),
  columnHelper.accessor('dateControletechnique', {
    header: 'Contrôle technique',
    cell: ({ row }) => {
      const date = formatDate(row.getValue('dateControletechnique'))
      return h('div', { class: 'text-sm text-muted-foreground' }, date)
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const vehicle = row.original
      return h('div', { class: 'relative' }, [
        h(DropdownMenu, {}, () => [
          h(DropdownMenuTrigger, { asChild: true }, () =>
            h(Button, { variant: 'ghost', size: 'icon' }, () =>
              h(MoreHorizontal, { class: 'h-4 w-4' }),
            ),
          ),
          h(DropdownMenuContent, { align: 'end', class: 'w-48' }, () => [
            h(DropdownMenuItem, { onClick: () => viewVehicle(vehicle) }, () => [
              h(Eye, { class: 'mr-2 h-4 w-4' }),
              'Aperçu',
            ]),
            h(DropdownMenuItem, { onClick: () => editVehicle(vehicle) }, () => [
              h(Edit, { class: 'mr-2 h-4 w-4' }),
              'Éditer',
            ]),
            h(DropdownMenuSeparator),
            h(
              DropdownMenuItem,
              {
                onClick: () => deleteVehicle(vehicle),
                class: 'text-red-600 focus:text-red-600',
              },
              () => [h(Trash2, { class: 'mr-2 h-4 w-4 text-red-600' }), 'Supprimer'],
            ),
          ]),
        ]),
      ])
    },
    enableSorting: false,
    enableHiding: false,
  }),
]

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

// Fonctions d'actions
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
</script>
