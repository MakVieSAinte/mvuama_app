<template>
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-center gap-3">
      <Wrench class="h-6 w-6" />
      <div>
        <h3 class="font-medium">
          {{ getVehicleInfo(maintenance.vehiculeId)?.immatriculation }} - {{ maintenance.type }}
        </h3>
        <p class="text-sm text-muted-foreground">{{ maintenance.description }}</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <span :class="['px-2 py-1 rounded text-sm', getStatusColor(maintenance.statut)]">
        {{ maintenance.statut }}
      </span>
      <button
        @click="$emit('edit', maintenance)"
        class="p-2 hover:bg-accent rounded-lg transition-colors"
      >
        <Edit class="h-4 w-4" />
      </button>
    </div>
  </div>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
    <div>
      <p class="text-muted-foreground">Date prévue</p>
      <p :class="getDateUrgency(maintenance.datePrevue)">
        {{ formatDate(maintenance.datePrevue) }}
      </p>
    </div>
    <div v-if="maintenance.dateRealisee">
      <p class="text-muted-foreground">Date réalisée</p>
      <p>{{ formatDate(maintenance.dateRealisee) }}</p>
    </div>
    <div v-if="maintenance.garage">
      <p class="text-muted-foreground">Garage</p>
      <p>{{ maintenance.garage }}</p>
    </div>
    <div v-if="maintenance.cout">
      <p class="text-muted-foreground">Coût</p>
      <p>{{ maintenance.cout }}€</p>
    </div>
  </div>

  <div v-if="maintenance.statut === 'Prévue'" class="flex gap-2 pt-2 border-t">
    <button
      @click="$emit('update-status', maintenance.id, 'En cours')"
      class="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200 transition-colors"
    >
      Commencer
    </button>
    <button
      @click="$emit('update-status', maintenance.id, 'Terminée')"
      class="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200 transition-colors"
    >
      Terminer
    </button>
    <button
      @click="$emit('update-status', maintenance.id, 'Annulée')"
      class="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 transition-colors"
    >
      Annuler
    </button>
  </div>

  <div v-else-if="maintenance.statut === 'En cours'" class="flex gap-2 pt-2 border-t">
    <button
      @click="$emit('update-status', maintenance.id, 'Terminée')"
      class="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200 transition-colors"
    >
      Terminer
    </button>
    <button
      @click="$emit('update-status', maintenance.id, 'Annulée')"
      class="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 transition-colors"
    >
      Annuler
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Wrench, Edit } from 'lucide-vue-next'
import { mockVehicles } from '@/data/mockData'
import type { Maintenance, Vehicle } from '@/types/fleet'

export default defineComponent({
  name: 'MaintenanceCard',
  props: {
    maintenance: {
      type: Object as () => Maintenance,
      required: true,
    },
  },
  emits: ['edit', 'update-status'],
  setup() {
    const getVehicleInfo = (vehiculeId: string): Vehicle | undefined => {
      return mockVehicles.find((v) => v.id === vehiculeId)
    }

    const formatDate = (dateString: string): string => {
      return new Date(dateString).toLocaleDateString('fr-FR')
    }

    const getStatusColor = (statut: Maintenance['statut']): string => {
      const colors: Record<Maintenance['statut'], string> = {
        Prévue: 'bg-blue-100 text-blue-800',
        'En cours': 'bg-yellow-100 text-yellow-800',
        Terminée: 'bg-green-100 text-green-800',
        Annulée: 'bg-red-100 text-red-800',
      }
      return colors[statut] || 'bg-gray-100 text-gray-800'
    }

    const getDateUrgency = (dateString: string): string => {
      const today = new Date()
      const maintenanceDate = new Date(dateString)
      const diffTime = maintenanceDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 0) return 'text-red-600 font-medium'
      if (diffDays <= 7) return 'text-orange-600 font-medium'
      return ''
    }

    return {
      getVehicleInfo,
      formatDate,
      getStatusColor,
      getDateUrgency,
      Wrench,
      Edit,
    }
  },
})
</script>
