<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4 mb-2">
      <Input v-model="searchQuery" placeholder="Rechercher une place..." class="max-w-xs" />
      <Select v-model="selectedSection">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Section" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les sections</SelectItem>
          <SelectItem v-for="section in sections" :key="section.id" :value="section.id">
            {{ section.name }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Légende -->
    <div class="flex items-center flex-wrap gap-4">
      <div class="flex items-center gap-2">
        <div class="h-4 w-4 rounded-sm bg-green-500/20 border border-green-500"></div>
        <span class="text-sm">Disponible</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="h-4 w-4 rounded-sm bg-orange-500/20 border border-orange-500"></div>
        <span class="text-sm">En cours d'utilisation</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="h-4 w-4 rounded-sm bg-red-500/20 border border-red-500"></div>
        <span class="text-sm">Alerte échéance</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="h-4 w-4 rounded-sm bg-blue-500/20 border border-blue-500"></div>
        <span class="text-sm">Réservé</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="h-4 w-4 rounded-sm bg-gray-200 border border-gray-400"></div>
        <span class="text-sm">Indisponible</span>
      </div>
    </div>

    <!-- Sections du parking -->
    <div v-for="section in filteredSections" :key="section.id" class="mb-8">
      <h3 class="text-lg font-semibold mb-4">{{ section.name }}</h3>

      <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
        <div
          v-for="place in section.places"
          :key="`${section.id}-${place.id}`"
          :class="[
            'border rounded-md p-2 text-center cursor-pointer transition-all transform hover:scale-105 hover:shadow-md',
            getPlaceStatusClasses(place),
            isPlaceFiltered(place) ? 'opacity-40' : 'opacity-100',
          ]"
          @click="handlePlaceClick(place)"
        >
          <div class="font-mono font-semibold">{{ place.id }}</div>
          <div v-if="getPlaceVehicle(place)" class="text-xs mt-1 truncate">
            {{ getPlaceVehicle(place)?.immatriculation }}
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog pour les détails d'une place -->
    <Dialog :open="!!selectedPlace" @update:open="selectedPlace = null">
      <DialogContent class="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Place {{ selectedPlace?.id }}</DialogTitle>
          <DialogDescription> Détails et gestion de la place de parking </DialogDescription>
        </DialogHeader>

        <div v-if="selectedPlace">
          <!-- Place occupée -->
          <div v-if="getPlaceEntry(selectedPlace)" class="space-y-4">
            <div class="flex items-center gap-2">
              <Badge
                :variant="getPlaceStatus(selectedPlace) === 'alert' ? 'destructive' : 'default'"
              >
                {{ getPlaceStatus(selectedPlace) === 'alert' ? 'Alerte échéance' : 'Occupé' }}
              </Badge>
              <span class="text-muted-foreground">
                Depuis {{ formatDate(getPlaceEntry(selectedPlace)?.dateEntree || '') }}
              </span>
            </div>

            <div class="space-y-2">
              <div class="font-semibold">Véhicule :</div>
              <div class="p-3 bg-muted rounded-md flex items-center justify-between">
                <div>
                  <div class="font-mono">
                    {{ getPlaceVehicle(selectedPlace)?.immatriculation }}
                  </div>
                  <div class="text-sm text-muted-foreground">
                    {{ getPlaceVehicle(selectedPlace)?.marque }}
                    {{ getPlaceVehicle(selectedPlace)?.modele }}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Eye class="h-4 w-4 mr-1" />
                  Détails
                </Button>
              </div>
            </div>

            <div class="space-y-2">
              <div class="font-semibold">Conducteur :</div>
              <div class="p-3 bg-muted rounded-md">
                {{ getPlaceEntry(selectedPlace)?.conducteur }}
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <div class="text-sm text-muted-foreground">Date de sortie :</div>
                <div>{{ formatDate(getPlaceEntry(selectedPlace)?.dateEntree || '') }}</div>
              </div>
              <div class="space-y-1">
                <div class="text-sm text-muted-foreground">Échéance :</div>
                <div
                  :class="{
                    'text-destructive': getPlaceStatus(selectedPlace) === 'alert',
                  }"
                >
                  {{ formatDate(getPlaceEntry(selectedPlace)?.dateEcheance || '') }}
                </div>
              </div>
            </div>

            <div v-if="getPlaceEntry(selectedPlace)?.destination" class="space-y-1">
              <div class="text-sm text-muted-foreground">Destination :</div>
              <div>{{ getPlaceEntry(selectedPlace)?.destination }}</div>
            </div>
          </div>

          <!-- Place libre -->
          <div v-else class="space-y-4">
            <div class="flex items-center gap-2">
              <Badge variant="success">Disponible</Badge>
            </div>

            <p class="text-muted-foreground">
              Cette place est actuellement disponible pour une nouvelle sortie de véhicule.
            </p>

            <div class="space-y-2">
              <div class="font-semibold">Dernière utilisation :</div>
              <p class="text-muted-foreground">
                {{ lastUsage(selectedPlace) || 'Aucune donnée disponible' }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-6 flex justify-end gap-2">
            <Button variant="outline" @click="selectedPlace = null"> Fermer </Button>
            <Button v-if="!getPlaceEntry(selectedPlace)">
              <Plus class="mr-2 h-4 w-4" />
              Nouvelle sortie
            </Button>
            <Button v-else variant="default">
              <CornerDownLeft class="mr-2 h-4 w-4" />
              Marquer le retour
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { format, parseISO, differenceInDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { ParkingEntry, Vehicle } from '../../types/fleet'

import { CornerDownLeft, Eye, Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

// Types
interface ParkingPlace {
  id: string
  section: string
  status?: 'available' | 'occupied' | 'alert' | 'reserved' | 'unavailable'
  size?: 'standard' | 'large' | 'compact'
}

interface ParkingSection {
  id: string
  name: string
  places: ParkingPlace[]
}

// Props and Emits
defineProps<{
  activeEntries: any[] // Entries where dateSortie is not defined
  completedEntries: any[] // Entries where dateSortie is defined
}>()

defineEmits<{
  (e: 'place-clicked', placeId: string): void
}>()

// State
const searchQuery = ref('')
const selectedSection = ref('all')
const selectedPlace = ref<ParkingPlace | null>(null)

// Sample data for the parking map
const sections = [
  {
    id: 'A',
    name: 'Section A - Principale',
    places: Array.from({ length: 24 }, (_, i) => ({
      id: `A-${(i + 1).toString().padStart(2, '0')}`,
      section: 'A',
      size: i < 4 ? 'large' : 'standard',
    })),
  },
  {
    id: 'B',
    name: 'Section B - Est',
    places: Array.from({ length: 18 }, (_, i) => ({
      id: `B-${(i + 1).toString().padStart(2, '0')}`,
      section: 'B',
      size: 'standard',
    })),
  },
  {
    id: 'C',
    name: 'Section C - Ouest',
    places: Array.from({ length: 12 }, (_, i) => ({
      id: `C-${(i + 1).toString().padStart(2, '0')}`,
      section: 'C',
      size: 'compact',
    })),
  },
]

// Filtrer les sections selon la recherche et la sélection
const filteredSections = computed(() => {
  let filtered = [...sections]

  if (selectedSection.value !== 'all') {
    filtered = filtered.filter((section) => section.id === selectedSection.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered
      .map((section) => ({
        ...section,
        places: section.places.filter((place) => place.id.toLowerCase().includes(query)),
      }))
      .filter((section) => section.places.length > 0)
  }

  return filtered
})

// Vérifie si une place est filtrée
const isPlaceFiltered = (place: ParkingPlace): boolean => {
  if (!searchQuery.value) return false

  const query = searchQuery.value.toLowerCase()
  return !place.id.toLowerCase().includes(query)
}

// Obtenir l'entrée de parking pour une place donnée
const getPlaceEntry = (place: ParkingPlace): ParkingEntry | undefined => {
  return props.activeEntries.find((entry) => entry.place === place.id)
}

// Obtenir le véhicule associé à une place
const getPlaceVehicle = (place: ParkingPlace): Vehicle | undefined => {
  const entry = getPlaceEntry(place)
  if (!entry) return undefined

  // Ici on simule une recherche de véhicule dans les données
  // Dans une vraie implémentation, on utiliserait une méthode du composant parent ou un store
  return {
    id: entry.vehiculeId,
    immatriculation: `XX-${entry.vehiculeId.substr(-3)}-YY`, // Simulé
    marque: 'Véhicule',
    modele: `Modèle ${entry.vehiculeId.substr(-1)}`,
    type: 'Voiture',
    annee: 2022,
    kilometrage: 15000,
    statut: 'En service',
    dateMiseEnService: '',
    prochainEntretien: '',
    carburant: 'Essence',
  }
}

// Déterminer le statut d'une place
const getPlaceStatus = (
  place: ParkingPlace,
): 'available' | 'occupied' | 'alert' | 'reserved' | 'unavailable' => {
  const entry = getPlaceEntry(place)

  if (!entry) return 'available'

  // Vérifier si l'entrée a une alerte d'échéance
  if (entry.dateEcheance) {
    const now = new Date()
    const expiryDate = parseISO(entry.dateEcheance)
    const daysUntilExpiry = differenceInDays(expiryDate, now)

    if (daysUntilExpiry < 0 || daysUntilExpiry <= 10) {
      return 'alert'
    }
  }

  return 'occupied'
}

// Classes CSS basées sur le statut de la place
const getPlaceStatusClasses = (place: ParkingPlace): string => {
  const status = getPlaceStatus(place)

  switch (status) {
    case 'available':
      return 'bg-green-500/20 border-green-500 hover:bg-green-500/30'
    case 'occupied':
      return 'bg-orange-500/20 border-orange-500 hover:bg-orange-500/30'
    case 'alert':
      return 'bg-red-500/20 border-red-500 hover:bg-red-500/30'
    case 'reserved':
      return 'bg-blue-500/20 border-blue-500 hover:bg-blue-500/30'
    case 'unavailable':
      return 'bg-gray-200 border-gray-400 hover:bg-gray-300'
    default:
      return 'bg-white border-gray-300'
  }
}

// Dernière utilisation d'une place
const lastUsage = (place: ParkingPlace): string | null => {
  const lastEntry = props.completedEntries
    .filter((entry) => entry.place === place.id)
    .sort((a, b) => {
      const dateA = parseISO(a.dateSortie || a.dateEntree)
      const dateB = parseISO(b.dateSortie || b.dateEntree)
      return dateB.getTime() - dateA.getTime()
    })[0]

  if (!lastEntry) return null

  const date = formatDate(lastEntry.dateSortie || lastEntry.dateEntree)
  return `${date} par ${lastEntry.conducteur}`
}

// Formater une date
const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  try {
    return format(parseISO(dateString), 'PPP', { locale: fr })
  } catch (e) {
    return dateString
  }
}

// Gérer le clic sur une place
const handlePlaceClick = (place: ParkingPlace) => {
  selectedPlace.value = place
  emit('place-clicked', place.id)
}
</script>
