<template>
  <!-- Conteneur des cartes -->
  <div class="bg-card rounded-xl py-4 px-2 border border-border overflow-hidden">
    <!-- Grille de cartes -->
    <div
      v-if="table.getRowModel().rows?.length"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2"
    >
      <div
        v-for="row in table.getRowModel().rows"
        :key="row.id"
        class="bg-background border border-border rounded-lg overflow-hidden transition-all"
        :class="{ 'ring-2 ring-primary': row.getIsSelected() }"
      >
        <!-- En-tête de la carte avec immatriculation, statut et menu d'actions -->
        <div class="flex items-center justify-between p-3 border-b border-border relative">
          <div class="flex items-center gap-3">
            <Checkbox
              :checked="row.getIsSelected()"
              @update:checked="row.toggleSelected($event)"
              aria-label="Sélectionner ce véhicule"
            />
            <div class="flex flex-col">
              <span class="text-foreground font-medium text-base">{{
                row.original.immatriculation
              }}</span>
              <div v-if="row.original.chauffeur" class="flex items-center gap-2 mt-1">
                <Avatar size="sm">
                  <AvatarImage
                    :src="row.original.chauffeur.avatar || undefined"
                    :alt="row.original.chauffeur.nom"
                  />
                  <AvatarFallback>{{ row.original.chauffeur.nom?.charAt(0) }}</AvatarFallback>
                </Avatar>
                <span class="text-xs text-muted-foreground">{{ row.original.chauffeur.nom }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span
              :class="getStatusClass(row.original.statut)"
              class="px-2 py-0.5 rounded text-xs font-medium"
            >
              {{ row.original.statut }}
            </span>
            <!-- Menu trois points -->
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon" class="ml-1 text-foreground hover:bg-muted/70">
                  <MoreVertical class="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="viewVehicle(row.original)">
                  <Eye class="h-4 w-4 mr-2" /> Aperçu
                </DropdownMenuItem>
                <DropdownMenuItem @click="editVehicle(row.original)">
                  <Pencil class="h-4 w-4 mr-2" /> Modifier
                </DropdownMenuItem>
                <DropdownMenuItem @click="deleteVehicle(row.original)" class="text-destructive">
                  <Trash2 class="h-4 w-4 mr-2" /> Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <!-- Corps de la carte -->
        <div class="p-4">
          <!-- Libellé du véhicule (modèle, année) -->
          <div class="text-foreground font-semibold mb-2">{{ row.original.libelle }}</div>
          <div class="grid grid-cols-2 gap-3">
            <!-- Type -->
            <div>
              <div class="text-xs text-muted-foreground mb-1">Type</div>
              <div class="text-sm text-foreground">{{ row.original.type }}</div>
            </div>
            <!-- Carburant -->
            <div>
              <div class="text-xs text-muted-foreground mb-1">Carburant</div>
              <div class="text-sm text-foreground">{{ row.original.carburant }}</div>
            </div>
            <!-- Kilométrage -->
            <div>
              <div class="text-xs text-muted-foreground mb-1">Kilométrage</div>
              <div class="text-sm text-foreground">{{ row.original.kilometrage }} km</div>
            </div>
            <!-- Prochain entretien -->
            <div>
              <div class="text-xs text-muted-foreground mb-1">Prochain entretien</div>
              <div class="flex items-center gap-1">
                <span class="text-sm text-foreground">{{
                  formatDate(row.original.prochainEntretien)
                }}</span>
                <Badge
                  v-if="isDateLate(row.original.prochainEntretien)"
                  variant="destructive"
                  class="text-xs py-0 h-4"
                >
                  En retard
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions rapides (optionnel, peuvent être retirées si menu trois points suffit) -->
        <!--
        <div class="flex justify-end gap-2 p-3 border-t border-border">
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" size="icon" @click="viewVehicle(row.original)">
                <Eye class="h-4 w-4" />
                <span class="sr-only">Voir</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Voir le véhicule</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" size="icon" @click="editVehicle(row.original)">
                <Pencil class="h-4 w-4" />
                <span class="sr-only">Éditer</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Modifier</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" size="icon" @click="deleteVehicle(row.original)">
                <Trash2 class="h-4 w-4" />
                <span class="sr-only">Supprimer</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Supprimer</TooltipContent>
          </Tooltip>
        </div>
        -->
      </div>
    </div>

    <!-- Message si aucun résultat -->
    <div v-else class="text-center p-10 text-muted-foreground">Aucun véhicule trouvé.</div>

    <!-- Pagination -->
    <div class="p-6 border-t border-border">
      <div class="flex items-center justify-between">
        <div class="flex-1 text-sm text-muted-foreground">
          {{ table.getFilteredSelectedRowModel().rows.length }} de
          {{ table.getFilteredRowModel().rows.length }} véhicule(s) sélectionné(s).
        </div>
        <div class="flex gap-2">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="outline"
                size="sm"
                :disabled="!table.getCanPreviousPage()"
                @click="table.previousPage()"
                class="text-muted-foreground !shadow-none"
              >
                Précédent
              </Button>
            </TooltipTrigger>
            <TooltipContent>Page précédente</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="outline"
                size="sm"
                :disabled="!table.getCanNextPage()"
                @click="table.nextPage()"
                class="text-muted-foreground !shadow-none"
              >
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
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Eye, Trash2, Pencil, MoreVertical } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import type { Vehicle } from './TableConfig'

interface Props {
  table: VueTable<Vehicle>
  columns: ColumnDef<Vehicle>[]
}

defineProps<Props>()

// Emit events for actions (these will be handled by parent component)
const emit = defineEmits<{
  (e: 'view', vehicle: Vehicle): void
  (e: 'edit', vehicle: Vehicle): void
  (e: 'delete', vehicle: Vehicle): void
}>()

function viewVehicle(vehicle: Vehicle) {
  emit('view', vehicle)
}

function editVehicle(vehicle: Vehicle) {
  emit('edit', vehicle)
}

function deleteVehicle(vehicle: Vehicle) {
  emit('delete', vehicle)
}

// Helper functions
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

function isDateLate(dateString: string) {
  const today = new Date()
  const date = new Date(dateString)
  return date < today
}

// Retourne les classes Tailwind pour le statut, identiques à celles du tableau
function getStatusClass(status: string) {
  switch (status) {
    case 'Disponible':
      return 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700'
    case 'En service':
      return 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700'
    case 'Maintenance':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700'
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700'
  }
}
</script>
