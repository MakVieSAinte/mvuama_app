<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2>Carnet de Parking</h2>
      <button
        @click="showAddForm = true"
        class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        <Plus class="h-4 w-4" />
        Nouvelle sortie
      </button>
    </div>

    <!-- Formulaire d'ajout -->
    <div v-if="showAddForm" class="space-y-6">
      <div class="flex items-center gap-4">
        <button
          @click="showAddForm = false"
          class="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
        >
          Retour
        </button>
        <h2>Nouvelle sortie de véhicule</h2>
      </div>

      <div class="bg-card border border-border rounded-lg p-6">
        <h3 class="mb-4">Enregistrer une sortie</h3>

        <div class="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
          <div class="flex items-center gap-2 text-blue-800 mb-2">
            <Clock class="h-4 w-4" />
            <p class="text-sm font-medium">Information importante</p>
          </div>
          <p class="text-sm text-blue-700">
            L'échéance de parking sera automatiquement fixée à 3 mois après la sortie. Une alerte
            sera déclenchée 10 jours avant l'échéance.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium mb-2">Véhicule *</label>
            <select
              v-model="newEntry.vehiculeId"
              class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="select-vehicle" disabled>Sélectionner un véhicule</option>
              <option v-for="vehicle in availableVehicles" :key="vehicle.id" :value="vehicle.id">
                {{ vehicle.immatriculation }} - {{ vehicle.marque }} {{ vehicle.modele }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Place de parking *</label>
            <input
              v-model="newEntry.place"
              type="text"
              placeholder="A-15, B-08, etc."
              class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Conducteur *</label>
            <input
              v-model="newEntry.conducteur"
              type="text"
              placeholder="Nom du conducteur"
              class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Destination</label>
            <input
              v-model="newEntry.destination"
              type="text"
              placeholder="Destination ou motif"
              class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Kilométrage de sortie</label>
            <input
              v-model.number="newEntry.kilometrageSortie"
              type="number"
              placeholder="Kilométrage actuel"
              class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div class="flex gap-4">
          <button
            @click="handleEntrySubmit"
            :disabled="!isFormValid"
            :class="[
              'px-4 py-2 rounded-lg transition-colors',
              isFormValid
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed',
            ]"
          >
            Enregistrer la sortie
          </button>
          <button
            @click="showAddForm = false"
            class="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>

    <!-- Alertes de parking -->
    <div
      v-if="parkingAlerts.length > 0"
      class="border border-orange-200 bg-orange-50 rounded-lg p-6"
    >
      <div class="flex items-center gap-2 text-orange-800 mb-4">
        <AlertTriangle class="h-5 w-5" />
        <h3>Alertes d'échéance parking</h3>
      </div>
      <div class="space-y-2">
        <div
          v-for="entry in parkingAlerts"
          :key="entry.id"
          class="flex items-center justify-between p-2 bg-white rounded border"
        >
          <div>
            <p class="font-medium">
              {{ getVehicleInfo(entry.vehiculeId)?.immatriculation || 'Véhicule inconnu' }} - Place
              {{ entry.place }}
            </p>
            <p class="text-sm text-muted-foreground">Conducteur: {{ entry.conducteur }}</p>
          </div>
          <span
            :class="[
              'px-2 py-1 rounded text-sm',
              entry.alert?.level === 'expired'
                ? 'bg-red-100 text-red-800'
                : 'bg-orange-100 text-orange-800',
            ]"
          >
            {{ entry.alert?.message }}
          </span>
        </div>
      </div>
    </div>

    <!-- Véhicules en cours d'utilisation -->
    <div v-if="activeEntries.length > 0" class="space-y-4">
      <h3>Véhicules en cours d'utilisation</h3>
      <div class="grid gap-4">
        <div
          v-for="entry in activeEntries"
          :key="entry.id"
          :class="[
            'bg-card border rounded-lg p-6',
            entry.alertStatus?.level === 'expired'
              ? 'border-red-300'
              : entry.alertStatus?.level === 'urgent'
                ? 'border-orange-300'
                : 'border-orange-200',
          ]"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <Car class="h-5 w-5" />
              <span class="font-medium">
                {{ getVehicleInfo(entry.vehiculeId)?.immatriculation || 'Véhicule inconnu' }} -
                {{ getVehicleInfo(entry.vehiculeId)?.marque }}
                {{ getVehicleInfo(entry.vehiculeId)?.modele }}
              </span>
              <AlertTriangle
                v-if="entry.alertStatus"
                :class="[
                  'h-4 w-4',
                  entry.alertStatus.level === 'expired' ? 'text-red-500' : 'text-orange-500',
                ]"
              />
            </div>
            <span class="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">En cours</span>
          </div>

          <div v-if="entry.alertStatus" :class="['text-sm mb-3', entry.alertStatus.color]">
            ⚠️ {{ entry.alertStatus.message }}
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
            <div class="flex items-center gap-2">
              <MapPin class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-muted-foreground">Place</p>
                <p>{{ entry.place }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <User class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-muted-foreground">Conducteur</p>
                <p>{{ entry.conducteur }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-muted-foreground">Sortie</p>
                <p>
                  {{ formatDateTime(entry.dateEntree).date }} à
                  {{ formatDateTime(entry.dateEntree).time }}
                </p>
              </div>
            </div>
            <div>
              <p class="text-muted-foreground">Durée</p>
              <p>{{ calculateUsageDuration(entry.dateEntree) }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2 border-t mb-4">
            <div>
              <p class="text-muted-foreground">Échéance parking</p>
              <p :class="entry.alertStatus ? entry.alertStatus.color : ''">
                {{ formatDateTime(entry.dateEcheance).date }} à
                {{ formatDateTime(entry.dateEcheance).time }}
              </p>
            </div>
            <div v-if="entry.destination">
              <p class="text-muted-foreground">Destination</p>
              <p>{{ entry.destination }}</p>
            </div>
          </div>

          <div v-if="entry.kilometrageSortie && entry.kilometrageSortie > 0" class="mb-4">
            <p class="text-sm text-muted-foreground">Kilométrage de sortie</p>
            <p class="text-sm">{{ entry.kilometrageSortie.toLocaleString() }} km</p>
          </div>

          <div class="flex gap-2 pt-2 border-t">
            <button
              @click="handleReturn(entry.id)"
              class="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors"
            >
              Marquer le retour
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Historique des sorties -->
    <div v-if="completedEntries.length > 0" class="space-y-4">
      <h3>Historique des sorties</h3>
      <div class="grid gap-4">
        <div
          v-for="entry in completedEntries"
          :key="entry.id"
          class="bg-card border border-border rounded-lg p-6"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <Car class="h-5 w-5" />
              <span>
                {{ getVehicleInfo(entry.vehiculeId)?.immatriculation || 'Véhicule inconnu' }} -
                {{ getVehicleInfo(entry.vehiculeId)?.marque }}
                {{ getVehicleInfo(entry.vehiculeId)?.modele }}
              </span>
            </div>
            <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Terminé</span>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
            <div>
              <p class="text-muted-foreground">Conducteur</p>
              <p>{{ entry.conducteur }}</p>
            </div>
            <div>
              <p class="text-muted-foreground">Place</p>
              <p>{{ entry.place }}</p>
            </div>
            <div>
              <p class="text-muted-foreground">Sortie</p>
              <p>
                {{ formatDateTime(entry.dateEntree).date }}
                {{ formatDateTime(entry.dateEntree).time }}
              </p>
            </div>
            <div>
              <p class="text-muted-foreground">Retour</p>
              <p>
                {{
                  entry.dateSortie
                    ? `${formatDateTime(entry.dateSortie).date} ${formatDateTime(entry.dateSortie).time}`
                    : '-'
                }}
              </p>
            </div>
            <div>
              <p class="text-muted-foreground">Durée</p>
              <p>
                {{
                  entry.dateSortie ? calculateUsageDuration(entry.dateEntree, entry.dateSortie) : ''
                }}
              </p>
            </div>
            <div>
              <p class="text-muted-foreground">Distance</p>
              <p>{{ getKmDifference(entry) > 0 ? `${getKmDifference(entry)} km` : '-' }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-3 pt-3 border-t">
            <div>
              <p class="text-muted-foreground">Échéance était prévue</p>
              <p>{{ formatDateTime(entry.dateEcheance).date }}</p>
            </div>
            <div v-if="entry.destination">
              <p class="text-muted-foreground">Destination</p>
              <p>{{ entry.destination }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message si aucune sortie -->
    <div
      v-if="parkingEntries.length === 0"
      class="bg-card border border-border rounded-lg p-8 text-center"
    >
      <Car class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <p class="text-muted-foreground mb-4">Aucune sortie enregistrée</p>
      <button
        @click="showAddForm = true"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        Enregistrer la première sortie
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { Plus, Car, MapPin, User, Calendar, AlertTriangle, Clock } from 'lucide-vue-next'
import { mockParkingEntries, mockVehicles, addThreeMonths } from '../../data/mockData'
import type { ParkingEntry, Vehicle } from '../../types/fleet'

interface NewEntryForm {
  vehiculeId: string
  place: string
  conducteur: string
  destination: string
  kilometrageSortie: number
}

interface ParkingAlertStatus {
  level: 'expired' | 'urgent' | 'warning'
  message: string
  color: string
}

interface ActiveEntry extends ParkingEntry {
  alertStatus: ParkingAlertStatus | null
}

interface ParkingAlertEntry extends ParkingEntry {
  alert: ParkingAlertStatus | null
}

interface DateTimeFormat {
  date: string
  time: string
}

export default defineComponent({
  name: 'ParkingLog',
  setup() {
    const showAddForm = ref<boolean>(false)
    const parkingEntries = ref<ParkingEntry[]>([...mockParkingEntries])

    const newEntry = ref<NewEntryForm>({
      vehiculeId: 'select-vehicle',
      place: '',
      conducteur: '',
      destination: '',
      kilometrageSortie: 0,
    })

    const availableVehicles = computed((): Vehicle[] =>
      mockVehicles.filter((v) => v.statut === 'Disponible'),
    )

    const isFormValid = computed(
      (): boolean =>
        newEntry.value.vehiculeId !== 'select-vehicle' &&
        newEntry.value.place.trim() !== '' &&
        newEntry.value.conducteur.trim() !== '',
    )

    const getVehicleInfo = (vehiculeId: string): Vehicle | undefined => {
      return mockVehicles.find((v) => v.id === vehiculeId)
    }

    const calculateDaysUntilExpiry = (dateEcheance: string): number => {
      const today = new Date()
      const expiryDate = new Date(dateEcheance)
      const diffTime = expiryDate.getTime() - today.getTime()
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const getParkingAlertStatus = (entry: ParkingEntry): ParkingAlertStatus | null => {
      if (entry.dateSortie) return null // Véhicule déjà sorti

      const daysUntilExpiry = calculateDaysUntilExpiry(entry.dateEcheance)

      if (daysUntilExpiry < 0) {
        return {
          level: 'expired',
          message: `Échéance dépassée de ${Math.abs(daysUntilExpiry)} jour(s)`,
          color: 'text-red-600',
        }
      } else if (daysUntilExpiry <= 10) {
        return {
          level: 'urgent',
          message: `Échéance dans ${daysUntilExpiry} jour(s)`,
          color: 'text-orange-600',
        }
      } else if (daysUntilExpiry <= 30) {
        return {
          level: 'warning',
          message: `Échéance dans ${daysUntilExpiry} jour(s)`,
          color: 'text-yellow-600',
        }
      }

      return null
    }

    const formatDateTime = (dateString: string): DateTimeFormat => {
      const date = new Date(dateString)
      return {
        date: date.toLocaleDateString('fr-FR'),
        time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      }
    }

    const calculateUsageDuration = (dateEntree: string, dateSortie?: string): string => {
      const start = new Date(dateEntree)
      const end = dateSortie ? new Date(dateSortie) : new Date()
      const diffMs = end.getTime() - start.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

      return diffHours > 0 ? `${diffHours}h ${diffMinutes}min` : `${diffMinutes}min`
    }

    const getKmDifference = (entry: ParkingEntry): number => {
      return entry.kilometrageRetour && entry.kilometrageSortie
        ? entry.kilometrageRetour - entry.kilometrageSortie
        : 0
    }

    const handleEntrySubmit = (): void => {
      if (!isFormValid.value) return

      const entryDate = new Date()
      const expiryDate = addThreeMonths(entryDate)

      const entry: ParkingEntry = {
        id: Date.now().toString(),
        dateEntree: entryDate.toISOString(),
        dateEcheance: expiryDate.toISOString(),
        ...newEntry.value,
      }

      parkingEntries.value.unshift(entry)

      newEntry.value = {
        vehiculeId: 'select-vehicle',
        place: '',
        conducteur: '',
        destination: '',
        kilometrageSortie: 0,
      }

      showAddForm.value = false
    }

    const handleReturn = (entryId: string): void => {
      const km = prompt('Kilométrage de retour:', '')
      if (km) {
        const index = parkingEntries.value.findIndex((entry) => entry.id === entryId)
        if (index !== -1) {
          parkingEntries.value[index] = {
            ...parkingEntries.value[index],
            dateSortie: new Date().toISOString(),
            kilometrageRetour: parseInt(km),
          }
        }
      }
    }

    const activeEntries = computed((): ActiveEntry[] =>
      parkingEntries.value
        .filter((entry) => !entry.dateSortie)
        .map((entry) => ({
          ...entry,
          alertStatus: getParkingAlertStatus(entry),
        })),
    )

    const completedEntries = computed((): ParkingEntry[] =>
      parkingEntries.value.filter((entry) => entry.dateSortie),
    )

    const parkingAlerts = computed((): ParkingAlertEntry[] =>
      activeEntries.value
        .map((entry) => ({
          ...entry,
          alert: entry.alertStatus,
        }))
        .filter(
          (entry) =>
            entry.alert && (entry.alert.level === 'urgent' || entry.alert.level === 'expired'),
        ),
    )

    return {
      showAddForm,
      parkingEntries,
      newEntry,
      availableVehicles,
      isFormValid,
      activeEntries,
      completedEntries,
      parkingAlerts,
      getVehicleInfo,
      formatDateTime,
      calculateUsageDuration,
      getKmDifference,
      handleEntrySubmit,
      handleReturn,
      Plus,
      Car,
      MapPin,
      User,
      Calendar,
      AlertTriangle,
      Clock,
    }
  },
})
</script>
