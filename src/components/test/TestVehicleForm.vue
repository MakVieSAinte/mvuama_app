<template>
  <div class="test-vehicle-form">
    <h2>Test d'ajout de véhicule</h2>

    <!-- Section d'authentification -->
    <div v-if="!isAuthenticated" class="auth-container">
      <h3>Connexion nécessaire</h3>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="auth.email" required />
      </div>
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input type="password" id="password" v-model="auth.password" required />
      </div>
      <button @click="login" :disabled="isLoading">
        {{ isLoading ? 'Connexion...' : 'Se connecter' }}
      </button>
      <div v-if="authError" class="error-message">{{ authError }}</div>
    </div>

    <div v-if="isAuthenticated" class="user-info">
      <p>
        Connecté en tant que: <strong>{{ user?.email }}</strong>
      </p>
      <button @click="logout" class="logout-btn">Déconnexion</button>
    </div>

    <div v-if="isAuthenticated" class="form-container">
      <div class="form-group">
        <label for="plate_number">Immatriculation*</label>
        <input type="text" id="plate_number" v-model="vehicle.plate_number" required />
      </div>

      <div class="form-group">
        <label for="brand">Marque*</label>
        <input type="text" id="brand" v-model="vehicle.brand" required />
      </div>

      <div class="form-group">
        <label for="model">Modèle*</label>
        <input type="text" id="model" v-model="vehicle.model" required />
      </div>

      <div class="form-group">
        <label for="year">Année</label>
        <input type="number" id="year" v-model="vehicle.year" />
      </div>

      <div class="form-group">
        <label for="type">Type</label>
        <select id="type" v-model="vehicle.type">
          <option value="Car">Voiture</option>
          <option value="Truck">Camion</option>
          <option value="Utility">Utilitaire</option>
          <option value="Motorcycle">Moto</option>
        </select>
      </div>

      <div class="form-group">
        <label for="mileage">Kilométrage*</label>
        <input type="number" id="mileage" v-model="vehicle.mileage" required />
      </div>
      <button @click="saveVehicle" :disabled="isSaving">
        {{ isSaving ? 'Enregistrement en cours...' : 'Ajouter le véhicule' }}
      </button>
    </div>

    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>

    <div v-if="vehicles.length > 0" class="vehicles-list">
      <h3>Véhicules dans la base de données</h3>
      <table>
        <thead>
          <tr>
            <th>Immatriculation</th>
            <th>Marque</th>
            <th>Modèle</th>
            <th>Année</th>
            <th>Type</th>
            <th>Kilométrage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in vehicles" :key="v.id">
            <td>{{ v.plate_number }}</td>
            <td>{{ v.brand }}</td>
            <td>{{ v.model }}</td>
            <td>{{ v.year }}</td>
            <td>{{ v.type }}</td>
            <td>{{ v.mileage }}</td>
            <td>
              <button @click="deleteVehicle(v.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { VehicleService } from '@/services/vehicules/vehiculesService'
import { AuthService } from '@/services/auth/authService'
import { MembershipService } from '@/services/auth/membershipService'
import { supabase } from '@/services/config/supabaseClient'
import type { IVehicleModel } from '@/interfaces/vehiculesInterface'

export default defineComponent({
  name: 'TestVehicleForm',
  setup() {
    // État d'authentification
    const isAuthenticated = ref(false)
    const user = ref<any>(null)
    const isLoading = ref(false)
    const authError = ref('')
    const auth = ref({
      email: '',
      password: '',
    })

    // État de l'autorisation
    const hasManagementRole = ref(false)
    const agencyId = '2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15' // ID de l'agence de test

    // État du formulaire
    const vehicle = ref({
      agency_id: '2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', // ID de l'agence de test
      plate_number: '',
      brand: '',
      model: '',
      year: null as number | null,
      type: 'Car',
      status: 'Available',
      mileage: 0,
      created_by: null as string | null, // Sera défini après l'authentification
    })

    // État des véhicules chargés
    const vehicles = ref<IVehicleModel[]>([])

    // État de l'interface
    const isSaving = ref(false)
    const message = ref('')
    const messageType = ref('success')

    // Fonction pour se connecter
    const login = async () => {
      if (!auth.value.email || !auth.value.password) {
        authError.value = 'Veuillez remplir tous les champs'
        return
      }

      isLoading.value = true
      authError.value = ''

      try {
        const data = await AuthService.signIn(auth.value.email, auth.value.password)
        if (data && data.user) {
          isAuthenticated.value = true
          user.value = data.user
          vehicle.value.created_by = data.user.id // Définir l'ID utilisateur pour les créations

          // Vérifier si l'utilisateur a un rôle d'administration
          const agencyId = vehicle.value.agency_id
          const hasRole = await MembershipService.hasManagementRole(agencyId)
          if (!hasRole) {
            console.warn("L'utilisateur n'a pas les droits admin/gestionnaire pour cette agence")
            showMessage(
              "Votre compte n'a pas les droits d'administration nécessaires pour créer des véhicules",
              'error',
            )
          }

          loadVehicles() // Charger les véhicules après connexion
        } else {
          authError.value = 'Identifiants invalides'
        }
      } catch (error) {
        console.error('Erreur de connexion:', error)
        authError.value = 'Une erreur est survenue lors de la connexion'
      } finally {
        isLoading.value = false
      }
    }

    // Fonction pour se déconnecter
    const logout = async () => {
      await AuthService.signOut()
      isAuthenticated.value = false
      user.value = null
      vehicles.value = []
    }

    // Vérifier si l'utilisateur est déjà connecté
    const checkCurrentSession = async () => {
      const session = await AuthService.getCurrentSession()
      if (session) {
        isAuthenticated.value = true
        user.value = session.user
        vehicle.value.created_by = session.user.id
      }
    }

    // Fonction pour charger les véhicules existants
    const loadVehicles = async () => {
      const result = await VehicleService.getActiveVehicles()
      if (result !== false) {
        vehicles.value = result
      } else {
        showMessage('Erreur lors du chargement des véhicules', 'error')
      }
    }

    // Fonction pour sauvegarder un nouveau véhicule
    const saveVehicle = async () => {
      // Validation basique
      if (!vehicle.value.plate_number || !vehicle.value.brand || !vehicle.value.model) {
        showMessage('Veuillez remplir tous les champs obligatoires', 'error')
        return
      }

      // Vérifier si l'utilisateur a les droits d'administration nécessaires
      const agencyId = vehicle.value.agency_id
      const hasRole = await MembershipService.hasManagementRole(agencyId)

      if (!hasRole) {
        showMessage(
          "Vous n'avez pas les droits nécessaires (admin ou gestionnaire) pour ajouter un véhicule",
          'error',
        )
        return
      }

      isSaving.value = true

      try {
        // S'assurer que le created_by est défini
        if (!vehicle.value.created_by && user.value) {
          vehicle.value.created_by = user.value.id
        }

        const result = await VehicleService.createVehicle(vehicle.value)

        if (result !== false) {
          showMessage('Véhicule ajouté avec succès!', 'success')
          resetForm()
          loadVehicles() // Recharger la liste des véhicules
        } else {
          showMessage("Erreur lors de l'ajout du véhicule", 'error')
        }
      } catch (error) {
        console.error('Erreur:', error)
        showMessage('Une erreur est survenue', 'error')
      } finally {
        isSaving.value = false
      }
    }

    // Fonction pour supprimer un véhicule
    const deleteVehicle = async (id: string) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule?')) {
        const result = await VehicleService.deleteVehicle(id)
        if (result) {
          showMessage('Véhicule supprimé avec succès', 'success')
          loadVehicles() // Recharger la liste
        } else {
          showMessage('Erreur lors de la suppression', 'error')
        }
      }
    }

    // Fonction utilitaire pour afficher un message
    const showMessage = (msg: string, type: 'success' | 'error') => {
      message.value = msg
      messageType.value = type
      setTimeout(() => {
        message.value = ''
      }, 5000) // Effacer le message après 5 secondes
    }

    // Fonction pour réinitialiser le formulaire
    const resetForm = () => {
      vehicle.value = {
        agency_id: '2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15',
        plate_number: '',
        brand: '',
        model: '',
        year: null,
        type: 'Car',
        status: 'Available',
        mileage: 0,
        created_by: user.value ? user.value.id : null,
      }
    }

    // Charger les véhicules au montage du composant
    onMounted(() => {
      checkCurrentSession().then(() => {
        if (isAuthenticated.value) {
          loadVehicles()
        }
      })
    })

    return {
      // Auth props
      auth,
      login,
      logout,
      isAuthenticated,
      isLoading,
      authError,
      user,

      // Vehicle props
      vehicle,
      vehicles,
      isSaving,
      message,
      messageType,
      saveVehicle,
      deleteVehicle,
    }
  },
})
</script>

<style scoped>
.test-vehicle-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.form-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input,
select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  grid-column: span 2;
  padding: 0.75rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.message {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
}

.success {
  background-color: #dff0d8;
  color: #3c763d;
}

.error {
  background-color: #f2dede;
  color: #a94442;
}

.vehicles-list {
  margin-top: 2rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

.auth-container {
  max-width: 400px;
  margin: 0 auto 2rem auto;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.auth-container h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
}

.error-message {
  color: #a94442;
  margin-top: 1rem;
  text-align: center;
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background-color: #e7f3ff;
  border-radius: 4px;
}

.logout-btn {
  background-color: #f44336;
  padding: 0.5rem 1rem;
}

.logout-btn:hover {
  background-color: #d32f2f;
}
</style>
