<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2>Planning des Entretiens</h2>
      <button
        @click="showAddForm = true"
        class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        <Plus class="h-4 w-4" />
        Planifier un entretien
      </button>
    </div>

    <!-- Filtres -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-card border border-border rounded-lg">
      <div>
        <label class="block text-sm font-medium mb-2">Statut</label>
        <select
          v-model="filters.statut"
          class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Tous les statuts</option>
          <option value="Prévue">Prévue</option>
          <option value="En cours">En cours</option>
          <option value="Terminée">Terminée</option>
          <option value="Annulée">Annulée</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Type</label>
        <select
          v-model="filters.type"
          class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Tous les types</option>
          <option value="Révision">Révision</option>
          <option value="Vidange">Vidange</option>
          <option value="Pneus">Pneus</option>
          <option value="Freins">Freins</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Véhicule</label>
        <select
          v-model="filters.vehicule"
          class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Tous les véhicules</option>
          <option v-for="vehicle in mockVehicles" :key="vehicle.id" :value="vehicle.id">
            {{ vehicle.immatriculation }} - {{ vehicle.marque }} {{ vehicle.modele }}
          </option>
        </select>
      </div>
    </div>

    <!-- Formulaire d'ajout -->
    <div v-if="showAddForm" class="bg-card border border-border rounded-lg p-6">
      <h3 class="mb-4">
        {{ editingMaintenance ? "Modifier l'entretien" : 'Planifier un nouvel entretien' }}
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium mb-2">Véhicule *</label>
          <select
            v-model="newMaintenance.vehiculeId"
            class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Sélectionner un véhicule</option>
            <option v-for="vehicle in mockVehicles" :key="vehicle.id" :value="vehicle.id">
              {{ vehicle.immatriculation }} - {{ vehicle.marque }} {{ vehicle.modele }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Type *</label>
          <select
            v-model="newMaintenance.type"
            class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Sélectionner un type</option>
            <option value="Révision">Révision</option>
            <option value="Vidange">Vidange</option>
            <option value="Pneus">Pneus</option>
            <option value="Freins">Freins</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Description *</label>
          <input
            v-model="newMaintenance.description"
            type="text"
            placeholder="Description de l'entretien"
            class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Date prévue *</label>
          <input
            v-model="newMaintenance.datePrevue"
            type="date"
            class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Garage</label>
          <input
            v-model="newMaintenance.garage"
            type="text"
            placeholder="Nom du garage"
            class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Coût (€)</label>
          <input
            v-model.number="newMaintenance.cout"
            type="number"
            placeholder="0"
            min="0"
            class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div class="flex gap-4">
        <button
          @click="handleMaintenanceSubmit"
          :disabled="!isMaintenanceFormValid"
          :class="[
            'px-4 py-2 rounded-lg transition-colors',
            isMaintenanceFormValid
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-muted text-muted-foreground cursor-not-allowed',
          ]"
        >
          {{ editingMaintenance ? 'Modifier' : 'Planifier' }} l'entretien
        </button>
        <button
          @click="cancelForm"
          class="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
        >
          Annuler
        </button>
      </div>
    </div>

    <!-- Liste des entretiens -->
    <div class="space-y-4">
      <!-- Entretiens urgents -->
      <div v-if="urgentMaintenances.length > 0">
        <h3 class="text-lg font-medium text-red-600 mb-3">⚠️ Entretiens urgents</h3>
        <div class="grid gap-4">
          <div
            v-for="maintenance in urgentMaintenances"
            :key="maintenance.id"
            class="bg-card border border-red-200 rounded-lg p-6"
          ></div>
        </div>
      </div>

      <!-- Entretiens à venir -->
      <div v-if="upcomingMaintenances.length > 0">
        <h3 class="text-lg font-medium text-orange-600 mb-3">📅 Entretiens à venir</h3>
        <div class="grid gap-4">
          <div
            v-for="maintenance in upcomingMaintenances"
            :key="maintenance.id"
            class="bg-card border border-orange-200 rounded-lg p-6"
          ></div>
        </div>
      </div>

      <!-- Autres entretiens -->
      <div v-if="otherMaintenances.length > 0">
        <h3 class="text-lg font-medium mb-3">🔧 Tous les entretiens</h3>
        <div class="grid gap-4">
          <div
            v-for="maintenance in otherMaintenances"
            :key="maintenance.id"
            class="bg-card border border-border rounded-lg p-6"
          ></div>
        </div>
      </div>
    </div>

    <!-- Message si aucun entretien -->
    <div
      v-if="filteredMaintenances.length === 0"
      class="bg-card border border-border rounded-lg p-8 text-center"
    >
      <Wrench class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <p class="text-muted-foreground mb-4">
        {{
          maintenances.length === 0
            ? 'Aucun entretien planifié'
            : 'Aucun entretien ne correspond aux filtres'
        }}
      </p>
      <button
        v-if="maintenances.length === 0"
        @click="showAddForm = true"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        Planifier le premier entretien
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { Plus, Wrench } from 'lucide-vue-next'
import { mockMaintenances, mockVehicles } from '@/data/mockData'
import type { Maintenance } from '@/types/fleet'

interface MaintenanceFilters {
  statut: string
  type: string
  vehicule: string
}

interface NewMaintenanceForm {
  vehiculeId: string
  type: Maintenance['type'] | ''
  description: string
  datePrevue: string
  garage: string
  cout: number
  statut: Maintenance['statut']
}

export default defineComponent({
  name: 'MaintenanceSchedule',
  components: {},
  setup() {
    const showAddForm = ref<boolean>(false)
    const editingMaintenance = ref<Maintenance | null>(null)
    const maintenances = ref<Maintenance[]>([...mockMaintenances])

    const filters = ref<MaintenanceFilters>({
      statut: 'all',
      type: 'all',
      vehicule: 'all',
    })

    const newMaintenance = ref<NewMaintenanceForm>({
      vehiculeId: '',
      type: '',
      description: '',
      datePrevue: '',
      garage: '',
      cout: 0,
      statut: 'Prévue',
    })

    const isMaintenanceFormValid = computed(
      (): boolean =>
        newMaintenance.value.vehiculeId.trim() !== '' &&
        newMaintenance.value.type !== '' &&
        newMaintenance.value.description.trim() !== '' &&
        newMaintenance.value.datePrevue.trim() !== '',
    )

    const calculateDaysUntilMaintenance = (datePrevue: string): number => {
      const today = new Date()
      const maintenanceDate = new Date(datePrevue)
      const diffTime = maintenanceDate.getTime() - today.getTime()
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const filteredMaintenances = computed((): Maintenance[] => {
      return maintenances.value.filter((maintenance) => {
        const matchesStatut =
          filters.value.statut === 'all' || maintenance.statut === filters.value.statut
        const matchesType = filters.value.type === 'all' || maintenance.type === filters.value.type
        const matchesVehicule =
          filters.value.vehicule === 'all' || maintenance.vehiculeId === filters.value.vehicule

        return matchesStatut && matchesType && matchesVehicule
      })
    })

    const urgentMaintenances = computed((): Maintenance[] => {
      return filteredMaintenances.value.filter((m) => {
        if (m.statut !== 'Prévue') return false
        const days = calculateDaysUntilMaintenance(m.datePrevue)
        return days < 0 || days <= 7
      })
    })

    const upcomingMaintenances = computed((): Maintenance[] => {
      return filteredMaintenances.value.filter((m) => {
        if (m.statut !== 'Prévue') return false
        const days = calculateDaysUntilMaintenance(m.datePrevue)
        return days > 7 && days <= 30
      })
    })

    const otherMaintenances = computed((): Maintenance[] => {
      return filteredMaintenances.value.filter((m) => {
        if (m.statut !== 'Prévue') return true
        const days = calculateDaysUntilMaintenance(m.datePrevue)
        return days > 30
      })
    })

    const handleMaintenanceSubmit = (): void => {
      if (!isMaintenanceFormValid.value) return

      const maintenanceData: Omit<Maintenance, 'id'> = {
        ...newMaintenance.value,
        type: newMaintenance.value.type as Maintenance['type'],
      }

      if (editingMaintenance.value) {
        const index = maintenances.value.findIndex((m) => m.id === editingMaintenance.value!.id)
        if (index !== -1) {
          maintenances.value[index] = { ...maintenanceData, id: editingMaintenance.value.id }
        }
      } else {
        maintenances.value.push({
          id: Date.now().toString(),
          ...maintenanceData,
        })
      }

      cancelForm()
    }

    const editMaintenance = (maintenance: Maintenance): void => {
      editingMaintenance.value = maintenance
      newMaintenance.value = { ...maintenance }
      showAddForm.value = true
    }

    const updateMaintenanceStatus = (
      maintenanceId: string,
      newStatus: Maintenance['statut'],
    ): void => {
      const index = maintenances.value.findIndex((m) => m.id === maintenanceId)
      if (index !== -1) {
        maintenances.value[index] = {
          ...maintenances.value[index],
          statut: newStatus,
          dateRealisee:
            newStatus === 'Terminée' ? new Date().toISOString().split('T')[0] : undefined,
        }
      }
    }

    const cancelForm = (): void => {
      showAddForm.value = false
      editingMaintenance.value = null
      newMaintenance.value = {
        vehiculeId: '',
        type: '',
        description: '',
        datePrevue: '',
        garage: '',
        cout: 0,
        statut: 'Prévue',
      }
    }

    return {
      showAddForm,
      editingMaintenance,
      maintenances,
      filters,
      newMaintenance,
      mockVehicles,
      isMaintenanceFormValid,
      filteredMaintenances,
      urgentMaintenances,
      upcomingMaintenances,
      otherMaintenances,
      handleMaintenanceSubmit,
      editMaintenance,
      updateMaintenanceStatus,
      cancelForm,
      Plus,
      Wrench,
    }
  },
})
</script>
