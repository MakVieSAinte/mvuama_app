<template>
  <div class="space-y-6">
    <h2>Tableau de Bord - Gestion de Flotte</h2>

    <!-- Alertes importantes -->
    <div
      v-if="
        overdueMaintenances.length > 0 || urgentMaintenances.length > 0 || parkingAlerts.length > 0
      "
      class="border border-orange-200 bg-orange-50 rounded-lg p-6"
    >
      <div class="flex items-center gap-2 text-orange-800 mb-4">
        <AlertTriangle class="h-5 w-5" />
        <h3>Alertes importantes</h3>
      </div>
      <div class="space-y-2">
        <div v-if="overdueMaintenances.length > 0" class="text-red-700">
          <p>⚠️ {{ overdueMaintenances.length }} entretien(s) en retard</p>
        </div>
        <div v-if="urgentMaintenances.length > 0" class="text-orange-700">
          <p>🔔 {{ urgentMaintenances.length }} entretien(s) prévu(s) dans les 7 prochains jours</p>
        </div>
        <div v-if="expiredParkingEntries.length > 0" class="text-red-700">
          <p>🚗 {{ expiredParkingEntries.length }} véhicule(s) avec échéance parking dépassée</p>
        </div>
        <div v-if="urgentParkingEntries.length > 0" class="text-orange-700">
          <p>
            🅿️ {{ urgentParkingEntries.length }} véhicule(s) avec échéance parking dans les 10
            prochains jours
          </p>
        </div>
      </div>
    </div>

    <!-- Statistiques principales -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div class="bg-card border border-border rounded-lg p-6">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-sm">Total Véhicules</h4>
          <Car class="h-4 w-4 text-muted-foreground" />
        </div>
        <div class="text-2xl font-bold mb-1">{{ vehicleStats.total }}</div>
        <p class="text-xs text-muted-foreground">{{ vehicleStats.disponible }} disponibles</p>
      </div>

      <div class="bg-card border border-border rounded-lg p-6">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-sm">En cours d'utilisation</h4>
          <Clock class="h-4 w-4 text-muted-foreground" />
        </div>
        <div class="text-2xl font-bold mb-1">{{ vehiclesInUse.length }}</div>
        <p class="text-xs text-muted-foreground">véhicules sortis du parking</p>
      </div>

      <div class="bg-card border border-border rounded-lg p-6">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-sm">Maintenance</h4>
          <Wrench class="h-4 w-4 text-muted-foreground" />
        </div>
        <div class="text-2xl font-bold mb-1">{{ vehicleStats.maintenance }}</div>
        <p class="text-xs text-muted-foreground">véhicules en maintenance</p>
      </div>

      <div class="bg-card border border-border rounded-lg p-6">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-sm">Alertes Parking</h4>
          <MapPin class="h-4 w-4 text-muted-foreground" />
        </div>
        <div class="text-2xl font-bold mb-1">{{ parkingAlerts.length }}</div>
        <p class="text-xs text-muted-foreground">échéances proches/dépassées</p>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <!-- Statut des véhicules -->
      <div class="bg-card border border-border rounded-lg p-6">
        <h3 class="mb-4">Statut des Véhicules</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Disponibles</span>
            </div>
            <span class="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
              {{ vehicleStats.disponible }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>En service</span>
            </div>
            <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
              {{ vehicleStats.enService }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>En maintenance</span>
            </div>
            <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm">
              {{ vehicleStats.maintenance }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Hors service</span>
            </div>
            <span class="px-2 py-1 bg-red-100 text-red-800 rounded-md text-sm">
              {{ vehicleStats.horsService }}
            </span>
          </div>
        </div>
      </div>

      <!-- Répartition par type -->
      <div class="bg-card border border-border rounded-lg p-6">
        <h3 class="mb-4">Répartition par Type</h3>
        <div class="space-y-3">
          <div
            v-for="[type, count] in Object.entries(vehicleTypeStats)"
            :key="type"
            class="flex items-center justify-between"
          >
            <span>{{ type }}s</span>
            <span class="px-2 py-1 border border-border rounded-md text-sm">{{ count }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Alertes de parking urgentes -->
    <div v-if="parkingAlerts.length > 0" class="bg-card border border-border rounded-lg p-6">
      <div class="flex items-center gap-2 mb-4">
        <MapPin class="h-5 w-5" />
        <h3>Alertes Échéances Parking</h3>
      </div>
      <div class="space-y-3">
        <div
          v-for="entry in sortedParkingAlerts.slice(0, 5)"
          :key="entry.id"
          class="flex items-center justify-between p-3 border border-border rounded-lg"
        >
          <div>
            <p class="font-medium">
              {{ getVehicleInfo(entry.vehiculeId)?.immatriculation }} - Place {{ entry.place }}
            </p>
            <p class="text-sm text-muted-foreground">Conducteur: {{ entry.conducteur }}</p>
            <p class="text-sm text-muted-foreground">
              Échéance: {{ formatDate(entry.dateEcheance) }}
            </p>
          </div>
          <span
            :class="[
              'px-2 py-1 rounded-md text-sm',
              entry.daysUntilExpiry < 0
                ? 'bg-red-100 text-red-800'
                : 'bg-orange-100 text-orange-800',
            ]"
          >
            {{
              entry.daysUntilExpiry < 0
                ? `Dépassé: ${Math.abs(entry.daysUntilExpiry)}j`
                : entry.daysUntilExpiry === 0
                  ? "Aujourd'hui"
                  : `${entry.daysUntilExpiry}j`
            }}
          </span>
        </div>
      </div>
    </div>

    <!-- Prochains entretiens -->
    <div class="bg-card border border-border rounded-lg p-6">
      <h3 class="mb-4">Prochains Entretiens</h3>
      <div v-if="urgentMaintenances.length > 0 || overdueMaintenances.length > 0" class="space-y-3">
        <div
          v-for="maintenance in [...overdueMaintenances, ...urgentMaintenances].slice(0, 5)"
          :key="maintenance.id"
          class="flex items-center justify-between p-3 border border-border rounded-lg"
        >
          <div>
            <p class="font-medium">
              {{ getVehicleInfo(maintenance.vehiculeId)?.immatriculation }} - {{ maintenance.type }}
            </p>
            <p class="text-sm text-muted-foreground">{{ maintenance.description }}</p>
            <p class="text-sm">{{ formatDate(maintenance.datePrevue) }}</p>
          </div>
          <span
            :class="[
              'px-2 py-1 rounded-md text-sm',
              calculateDaysUntilMaintenance(maintenance.datePrevue) < 0
                ? 'bg-red-100 text-red-800'
                : 'bg-orange-100 text-orange-800',
            ]"
          >
            {{ getMaintenanceLabel(maintenance.datePrevue) }}
          </span>
        </div>
      </div>
      <div v-else class="text-center py-4">
        <CheckCircle class="h-8 w-8 mx-auto text-green-600 mb-2" />
        <p class="text-muted-foreground">Aucun entretien urgent</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { Car, Wrench, AlertTriangle, CheckCircle, Clock, MapPin } from 'lucide-vue-next'
import { mockVehicles, mockMaintenances, mockParkingEntries } from '@/data/mockData'
import type { Vehicle, Maintenance, ParkingEntry } from '@/types/fleet'

interface VehicleStats {
  total: number
  disponible: number
  enService: number
  maintenance: number
  horsService: number
}

interface ParkingAlert extends ParkingEntry {
  daysUntilExpiry: number
}

export default defineComponent({
  name: 'Dashboard',
  setup() {
    const calculateDaysUntilMaintenance = (datePrevue: string): number => {
      const today = new Date()
      const maintenanceDate = new Date(datePrevue)
      const diffTime = maintenanceDate.getTime() - today.getTime()
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const calculateDaysUntilParkingExpiry = (dateEcheance: string): number => {
      const today = new Date()
      const expiryDate = new Date(dateEcheance)
      const diffTime = expiryDate.getTime() - today.getTime()
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const getVehicleInfo = (vehiculeId: string): Vehicle | undefined => {
      return mockVehicles.find((v) => v.id === vehiculeId)
    }

    const formatDate = (dateString: string): string => {
      return new Date(dateString).toLocaleDateString('fr-FR')
    }

    const getMaintenanceLabel = (datePrevue: string): string => {
      const days = calculateDaysUntilMaintenance(datePrevue)
      const isOverdue = days < 0

      if (isOverdue) {
        return `Retard: ${Math.abs(days)}j`
      } else if (days === 0) {
        return "Aujourd'hui"
      } else {
        return `${days}j`
      }
    }

    // Statistiques des véhicules
    const vehicleStats = computed(
      (): VehicleStats => ({
        total: mockVehicles.length,
        disponible: mockVehicles.filter((v) => v.statut === 'Disponible').length,
        enService: mockVehicles.filter((v) => v.statut === 'En service').length,
        maintenance: mockVehicles.filter((v) => v.statut === 'Maintenance').length,
        horsService: mockVehicles.filter((v) => v.statut === 'Hors service').length,
      }),
    )

    // Entretiens urgents (dans les 7 prochains jours)
    const urgentMaintenances = computed((): Maintenance[] => {
      return mockMaintenances.filter((m) => {
        if (m.statut !== 'Prévue') return false
        const days = calculateDaysUntilMaintenance(m.datePrevue)
        return days <= 7 && days >= 0
      })
    })

    // Entretiens en retard
    const overdueMaintenances = computed((): Maintenance[] => {
      return mockMaintenances.filter((m) => {
        if (m.statut !== 'Prévue') return false
        const days = calculateDaysUntilMaintenance(m.datePrevue)
        return days < 0
      })
    })

    // Alertes de parking (échéances proches ou dépassées)
    const parkingAlerts = computed((): ParkingAlert[] => {
      return mockParkingEntries
        .filter((entry) => !entry.dateSortie) // Seulement les véhicules encore sortis
        .map((entry) => ({
          ...entry,
          daysUntilExpiry: calculateDaysUntilParkingExpiry(entry.dateEcheance),
        }))
        .filter((entry) => entry.daysUntilExpiry <= 10) // Alertes à 10 jours ou moins
    })

    const expiredParkingEntries = computed((): ParkingAlert[] =>
      parkingAlerts.value.filter((entry) => entry.daysUntilExpiry < 0),
    )

    const urgentParkingEntries = computed((): ParkingAlert[] =>
      parkingAlerts.value.filter(
        (entry) => entry.daysUntilExpiry >= 0 && entry.daysUntilExpiry <= 10,
      ),
    )

    const sortedParkingAlerts = computed((): ParkingAlert[] =>
      [...parkingAlerts.value].sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry),
    )

    // Véhicules actuellement en cours d'utilisation
    const vehiclesInUse = computed((): ParkingEntry[] =>
      mockParkingEntries.filter((entry) => !entry.dateSortie),
    )

    // Répartition par type de véhicule
    const vehicleTypeStats = computed((): Record<string, number> => {
      return mockVehicles.reduce(
        (acc, vehicle) => {
          acc[vehicle.type] = (acc[vehicle.type] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )
    })

    return {
      vehicleStats,
      urgentMaintenances,
      overdueMaintenances,
      parkingAlerts,
      expiredParkingEntries,
      urgentParkingEntries,
      sortedParkingAlerts,
      vehiclesInUse,
      vehicleTypeStats,
      calculateDaysUntilMaintenance,
      getVehicleInfo,
      formatDate,
      getMaintenanceLabel,
      AlertTriangle,
      Car,
      Clock,
      Wrench,
      MapPin,
      CheckCircle,
    }
  },
})
</script>
