<template>
  <div class="vehicle-display">
    <h1>Véhicules de l'agence</h1>

    <div v-if="isLoading" class="loading">
      <p>Chargement des véhicules...</p>
    </div>

    <div v-else>
      <!-- Affichage des véhicules -->
      <div v-if="vehicles.length > 0" class="vehicles-list">
        <table>
          <thead>
            <tr>
              <th>Immatriculation</th>
              <th>Marque</th>
              <th>Modèle</th>
              <th>Année</th>
              <th>Type</th>
              <th>Kilométrage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in vehicles" :key="v.id">
              <td>{{ v.plate_number }}</td>
              <td>{{ v.brand }}</td>
              <td>{{ v.model }}</td>
              <td>{{ v.year }}</td>
              <td>{{ v.status || v.type }}</td>
              <td>{{ v.mileage }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="no-vehicles">
        <p>Aucun véhicule trouvé dans la base de données.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { supabase } from '@/services/config/supabaseClient'
import type { IVehicleModel } from '@/interfaces/vehiculesInterface'

export default defineComponent({
  name: 'VehicleDisplay',
  setup() {
    const vehicles = ref<IVehicleModel[]>([])
    const isLoading = ref(true)
    const error = ref('')

    // Fonction pour charger tous les véhicules
    const loadVehicles = async () => {
      isLoading.value = true
      try {
        // Charger directement depuis la table vehicles
        const { data, error: err } = await supabase
          .from('vehicles')
          .select('*')
          .eq('is_active', true)

        if (err) {
          throw new Error(err.message)
        }

        vehicles.value = (data as IVehicleModel[]) || []
      } catch (err: unknown) {
        console.error('Erreur lors du chargement des véhicules:', err)
        error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
      } finally {
        isLoading.value = false
      }
    }

    // Charger les véhicules au montage du composant
    onMounted(() => {
      loadVehicles()
    })

    return {
      vehicles,
      isLoading,
      error,
    }
  },
})
</script>

<style scoped>
.vehicle-display {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.no-vehicles {
  text-align: center;
  padding: 2rem;
  color: #666;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.vehicles-list {
  margin-top: 2rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

th,
td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

th {
  background-color: #2196f3;
  color: white;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #e3f2fd;
}
</style>
