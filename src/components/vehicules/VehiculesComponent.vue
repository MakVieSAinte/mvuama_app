<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2>Gestion des Véhicules</h2>
      <button
        @click="showAddForm = true"
        class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        <Plus class="h-4 w-4" />
        Ajouter un véhicule
      </button>
    </div>

    <!-- Filtres -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-card border border-border rounded-lg">
      <div>
        <label class="block text-sm font-medium mb-2">Type</label>
        <select
          v-model="filters.type"
          class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Tous les types</option>
          <option value="Voiture">Voiture</option>
          <option value="Camion">Camion</option>
          <option value="Utilitaire">Utilitaire</option>
          <option value="Moto">Moto</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Statut</label>
        <select
          v-model="filters.statut"
          class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Tous les statuts</option>
          <option value="Disponible">Disponible</option>
          <option value="En service">En service</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Hors service">Hors service</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Carburant</label>
        <select
          v-model="filters.carburant"
          class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Tous les carburants</option>
          <option value="Essence">Essence</option>
          <option value="Diesel">Diesel</option>
          <option value="Électrique">Électrique</option>
          <option value="Hybride">Hybride</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Recherche</label>
        <input
          v-model="filters.search"
          type="text"
          placeholder="Immatriculation, marque..."
          class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>

    <!-- Formulaire d'ajout -->
    <div v-if="showAddForm" class="bg-card border border-border rounded-lg p-6">
      <h3 class="mb-4">
        {{ editingVehicle ? 'Modifier le véhicule' : 'Ajouter un nouveau véhicule' }}
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium mb-2">Immatriculation *</label>
          <input
            v-model="newVehicle.immatriculation"
            type="text"
            placeholder="AB-123-CD"
            class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Marque *</label>
          <input
            v-model="newVehicle.marque"
            type="text"
            placeholder="Peugeot, Renault..."
            class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Modèle *</label>
          <input
            v-model="newVehicle.modele"
            type="text"
            placeholder="308, Master..."
            class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Année *</label>
          <input
            v-model.number="newVehicle.annee"
            type="number"
            placeholder="2023"
            min="1900"
            max="2030"
            class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Type *</label>
          <select
            v-model="newVehicle.type"
            class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Sélectionner un type</option>
            <option value="Voiture">Voiture</option>
            <option value="Camion">Camion</option>
            <option value="Utilitaire">Utilitaire</option>
            <option value="Moto">Moto</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Carburant *</label>
          <select
            v-model="newVehicle.carburant"
            class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Sélectionner un carburant</option>
            <option value="Essence">Essence</option>
            <option value="Diesel">Diesel</option>
            <option value="Électrique">Électrique</option>
            <option value="Hybride">Hybride</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Kilométrage</label>
          <input
            v-model.number="newVehicle.kilometrage"
            type="number"
            placeholder="25000"
            min="0"
            class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Date de mise en service</label>
          <input
            v-model="newVehicle.dateMiseEnService"
            type="date"
            class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div class="flex gap-4">
        <button
          @click="handleVehicleSubmit"
          :disabled="!isVehicleFormValid"
          :class="[
            'px-4 py-2 rounded-lg transition-colors',
            isVehicleFormValid
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-muted text-muted-foreground cursor-not-allowed',
          ]"
        >
          {{ editingVehicle ? 'Modifier' : 'Ajouter' }} le véhicule
        </button>
        <button
          @click="cancelForm"
          class="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
        >
          Annuler
        </button>
      </div>
    </div>

    <!-- Liste des véhicules -->
    <div class="grid gap-4">
      <div
        v-for="vehicle in filteredVehicles"
        :key="vehicle.id"
        class="bg-card border border-border rounded-lg p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <Car class="h-6 w-6" />
            <div>
              <h3 class="font-medium">{{ vehicle.immatriculation }}</h3>
              <p class="text-sm text-muted-foreground">
                {{ vehicle.marque }} {{ vehicle.modele }} ({{ vehicle.annee }})
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span :class="['px-2 py-1 rounded text-sm', getStatusColor(vehicle.statut)]">
              {{ vehicle.statut }}
            </span>
            <button
              @click="editVehicle(vehicle)"
              class="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <Edit class="h-4 w-4" />
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <p class="text-muted-foreground">Type</p>
            <p>{{ vehicle.type }}</p>
          </div>
          <div>
            <p class="text-muted-foreground">Carburant</p>
            <p>{{ vehicle.carburant }}</p>
          </div>
          <div>
            <p class="text-muted-foreground">Kilométrage</p>
            <p>{{ vehicle.kilometrage.toLocaleString() }} km</p>
          </div>
          <div>
            <p class="text-muted-foreground">Mise en service</p>
            <p>{{ formatDate(vehicle.dateMiseEnService) }}</p>
          </div>
          <div>
            <p class="text-muted-foreground">Prochain entretien</p>
            <p :class="getMaintenanceUrgency(vehicle.prochainEntretien)">
              {{ formatDate(vehicle.prochainEntretien) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Message si aucun véhicule -->
    <div
      v-if="filteredVehicles.length === 0"
      class="bg-card border border-border rounded-lg p-8 text-center"
    >
      <Car class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <p class="text-muted-foreground mb-4">
        {{
          vehicles.length === 0
            ? 'Aucun véhicule enregistré'
            : 'Aucun véhicule ne correspond aux filtres'
        }}
      </p>
      <button
        v-if="vehicles.length === 0"
        @click="showAddForm = true"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        Ajouter le premier véhicule
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { Plus, Car, Edit } from 'lucide-vue-next'
import { mockVehicles } from '../../data/mockData'
import type { Vehicle } from '../../types/fleet'

interface VehicleFilters {
  type: string
  statut: string
  carburant: string
  search: string
}

interface NewVehicleForm {
  immatriculation: string
  marque: string
  modele: string
  annee: number
  type: Vehicle['type'] | ''
  carburant: Vehicle['carburant'] | ''
  kilometrage: number
  dateMiseEnService: string
  statut: Vehicle['statut']
  prochainEntretien: string
}

export default defineComponent({
  name: 'VehicleList',
  setup() {
    const showAddForm = ref<boolean>(false)
    const editingVehicle = ref<Vehicle | null>(null)
    const vehicles = ref<Vehicle[]>([...mockVehicles])

    const filters = ref<VehicleFilters>({
      type: 'all',
      statut: 'all',
      carburant: 'all',
      search: '',
    })

    const newVehicle = ref<NewVehicleForm>({
      immatriculation: '',
      marque: '',
      modele: '',
      annee: new Date().getFullYear(),
      type: '',
      carburant: '',
      kilometrage: 0,
      dateMiseEnService: new Date().toISOString().split('T')[0],
      statut: 'Disponible',
      prochainEntretien: '',
    })

    const isVehicleFormValid = computed(
      (): boolean =>
        newVehicle.value.immatriculation.trim() !== '' &&
        newVehicle.value.marque.trim() !== '' &&
        newVehicle.value.modele.trim() !== '' &&
        newVehicle.value.annee > 0 &&
        newVehicle.value.type !== '' &&
        newVehicle.value.carburant !== '',
    )

    const filteredVehicles = computed((): Vehicle[] => {
      return vehicles.value.filter((vehicle) => {
        const matchesType = filters.value.type === 'all' || vehicle.type === filters.value.type
        const matchesStatut =
          filters.value.statut === 'all' || vehicle.statut === filters.value.statut
        const matchesCarburant =
          filters.value.carburant === 'all' || vehicle.carburant === filters.value.carburant
        const matchesSearch =
          !filters.value.search ||
          vehicle.immatriculation.toLowerCase().includes(filters.value.search.toLowerCase()) ||
          vehicle.marque.toLowerCase().includes(filters.value.search.toLowerCase()) ||
          vehicle.modele.toLowerCase().includes(filters.value.search.toLowerCase())

        return matchesType && matchesStatut && matchesCarburant && matchesSearch
      })
    })

    const formatDate = (dateString: string): string => {
      return new Date(dateString).toLocaleDateString('fr-FR')
    }

    const getStatusColor = (statut: Vehicle['statut']): string => {
      const colors: Record<Vehicle['statut'], string> = {
        Disponible: 'bg-green-100 text-green-800',
        'En service': 'bg-blue-100 text-blue-800',
        Maintenance: 'bg-yellow-100 text-yellow-800',
        'Hors service': 'bg-red-100 text-red-800',
      }
      return colors[statut] || 'bg-gray-100 text-gray-800'
    }

    const getMaintenanceUrgency = (dateString: string): string => {
      const today = new Date()
      const maintenanceDate = new Date(dateString)
      const diffTime = maintenanceDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 0) return 'text-red-600'
      if (diffDays <= 7) return 'text-orange-600'
      if (diffDays <= 30) return 'text-yellow-600'
      return ''
    }

    const handleVehicleSubmit = (): void => {
      if (!isVehicleFormValid.value) return

      // Calculer la date du prochain entretien (1 an après la mise en service)
      const serviceDate = new Date(newVehicle.value.dateMiseEnService)
      const nextMaintenance = new Date(serviceDate)
      nextMaintenance.setFullYear(nextMaintenance.getFullYear() + 1)

      const vehicleData: Omit<Vehicle, 'id'> = {
        ...newVehicle.value,
        type: newVehicle.value.type as Vehicle['type'],
        carburant: newVehicle.value.carburant as Vehicle['carburant'],
        prochainEntretien: nextMaintenance.toISOString().split('T')[0],
      }

      if (editingVehicle.value) {
        const index = vehicles.value.findIndex((v) => v.id === editingVehicle.value!.id)
        if (index !== -1) {
          vehicles.value[index] = { ...vehicleData, id: editingVehicle.value.id }
        }
      } else {
        vehicles.value.push({
          id: Date.now().toString(),
          ...vehicleData,
        })
      }

      cancelForm()
    }

    const editVehicle = (vehicle: Vehicle): void => {
      editingVehicle.value = vehicle
      newVehicle.value = { ...vehicle }
      showAddForm.value = true
    }

    const cancelForm = (): void => {
      showAddForm.value = false
      editingVehicle.value = null
      newVehicle.value = {
        immatriculation: '',
        marque: '',
        modele: '',
        annee: new Date().getFullYear(),
        type: '',
        carburant: '',
        kilometrage: 0,
        dateMiseEnService: new Date().toISOString().split('T')[0],
        statut: 'Disponible',
        prochainEntretien: '',
      }
    }

    return {
      showAddForm,
      editingVehicle,
      vehicles,
      filters,
      newVehicle,
      isVehicleFormValid,
      filteredVehicles,
      formatDate,
      getStatusColor,
      getMaintenanceUrgency,
      handleVehicleSubmit,
      editVehicle,
      cancelForm,
      Plus,
      Car,
      Edit,
    }
  },
})
</script>
