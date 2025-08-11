<template>
  <div class="test-setup-workflow">
    <h1>Configuration complète</h1>

    <!-- Étape 1: Création de compte / Connexion -->
    <div class="step-container" :class="{ completed: currentStep > 1 }">
      <h2>Étape 1 : Compte utilisateur</h2>
      <div v-if="currentStep === 1">
        <div class="tabs-container">
          <div class="tabs">
            <button
              class="tab-button"
              :class="{ active: authMode === 'login' }"
              @click="authMode = 'login'"
            >
              Connexion
            </button>
            <button
              class="tab-button"
              :class="{ active: authMode === 'register' }"
              @click="authMode = 'register'"
            >
              Inscription (Nouveau compte admin)
            </button>
          </div>
        </div>

        <!-- Formulaire d'inscription -->
        <div v-if="authMode === 'register'" class="form-container">
          <div class="form-group">
            <label for="register-email">Email</label>
            <input type="email" id="register-email" v-model="auth.email" required />
          </div>
          <div class="form-group">
            <label for="register-password">Mot de passe</label>
            <input type="password" id="register-password" v-model="auth.password" required />
          </div>
          <div class="form-group">
            <label for="first-name">Prénom</label>
            <input type="text" id="first-name" v-model="userProfile.firstName" required />
          </div>
          <div class="form-group">
            <label for="last-name">Nom</label>
            <input type="text" id="last-name" v-model="userProfile.lastName" required />
          </div>
          <button @click="register" :disabled="isLoading">
            {{ isLoading ? 'Inscription en cours...' : "S'inscrire" }}
          </button>
        </div>

        <!-- Formulaire de connexion -->
        <div v-if="authMode === 'login'" class="form-container">
          <div class="form-group">
            <label for="login-email">Email</label>
            <input type="email" id="login-email" v-model="auth.email" required />
          </div>
          <div class="form-group">
            <label for="login-password">Mot de passe</label>
            <input type="password" id="login-password" v-model="auth.password" required />
          </div>
          <button @click="login" :disabled="isLoading">
            {{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}
          </button>
        </div>
      </div>

      <!-- Information utilisateur si connecté -->
      <div v-if="currentStep > 1" class="step-summary">
        <p>
          Connecté en tant que: <strong>{{ user?.email }}</strong>
        </p>
      </div>
    </div>

    <!-- Étape 2: Création d'agence -->
    <div class="step-container" :class="{ completed: currentStep > 2, disabled: currentStep < 2 }">
      <h2>Étape 2 : Création d'agence</h2>
      <div v-if="currentStep === 2" class="form-container">
        <div class="form-group">
          <label for="agency-name">Nom de l'agence</label>
          <input type="text" id="agency-name" v-model="agency.name" required />
        </div>
        <div class="form-group">
          <label for="agency-address">Adresse</label>
          <input type="text" id="agency-address" v-model="agency.address" />
        </div>
        <div class="form-group">
          <label for="agency-phone">Téléphone</label>
          <input type="text" id="agency-phone" v-model="agency.phone" />
        </div>
        <div class="form-group">
          <label for="agency-email">Email</label>
          <input type="email" id="agency-email" v-model="agency.email" />
        </div>
        <button @click="createAgency" :disabled="isLoading">
          {{ isLoading ? 'Création en cours...' : "Créer l'agence" }}
        </button>
      </div>

      <!-- Résumé agence si créée -->
      <div v-if="currentStep > 2" class="step-summary">
        <p>
          Agence: <strong>{{ agency.name }}</strong>
        </p>
      </div>
    </div>

    <!-- Étape 3: Ajout d'un véhicule -->
    <div class="step-container" :class="{ disabled: currentStep < 3 }">
      <h2>Étape 3 : Ajout d'un véhicule</h2>
      <div v-if="currentStep === 3" class="form-container">
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
        <button @click="addVehicle" :disabled="isLoading">
          {{ isLoading ? 'Enregistrement en cours...' : 'Ajouter le véhicule' }}
        </button>
      </div>
    </div>

    <!-- Affichage des véhicules -->
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
              <button @click="deleteVehicle(v.id)" class="delete-btn">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Affichage des messages -->
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { supabase } from '@/services/config/supabaseClient'
import { VehicleService } from '@/services/vehicules/vehiculesService'
import type { IVehicleModel } from '@/interfaces/vehiculesInterface'

export default defineComponent({
  name: 'TestSetupWorkflow',
  setup() {
    // État global
    const currentStep = ref(1)
    const isLoading = ref(false)
    const message = ref('')
    const messageType = ref('success')
    const authMode = ref('login')

    // État utilisateur
    const user = ref<any>(null)
    const auth = ref({
      email: '',
      password: '',
    })
    const userProfile = ref({
      firstName: '',
      lastName: '',
    })

    // État agence
    const agency = ref({
      id: '',
      name: '',
      address: '',
      phone: '',
      email: '',
    })

    // État véhicule
    const vehicle = ref({
      agency_id: '',
      plate_number: '',
      brand: '',
      model: '',
      year: null as number | null,
      type: 'Car',
      status: 'Available',
      mileage: 0,
      created_by: null as string | null,
    })

    // Véhicules chargés
    const vehicles = ref<IVehicleModel[]>([])

    // Fonction d'inscription
    const register = async () => {
      if (
        !auth.value.email ||
        !auth.value.password ||
        !userProfile.value.firstName ||
        !userProfile.value.lastName
      ) {
        showMessage('Veuillez remplir tous les champs obligatoires', 'error')
        return
      }

      isLoading.value = true
      try {
        // 1. Créer le compte utilisateur dans Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: auth.value.email,
          password: auth.value.password,
        })

        if (authError) {
          throw new Error(authError.message)
        }

        if (!authData.user) {
          throw new Error('Erreur lors de la création du compte')
        }

        // 2. Attendre que l'utilisateur soit créé
        user.value = authData.user

        // 3. Créer le profil utilisateur dans la table users
        const { error: profileError } = await supabase.from('users').insert({
          id: authData.user.id,
          email: auth.value.email,
          first_name: userProfile.value.firstName,
          last_name: userProfile.value.lastName,
          created_at: new Date().toISOString(),
        })

        if (profileError) {
          throw new Error(profileError.message)
        }

        showMessage('Compte créé avec succès!', 'success')
        currentStep.value = 2 // Passer à l'étape suivante
      } catch (error: any) {
        console.error("Erreur lors de l'inscription:", error)
        showMessage(error.message || "Erreur lors de l'inscription", 'error')
      } finally {
        isLoading.value = false
      }
    }

    // Fonction de connexion
    const login = async () => {
      if (!auth.value.email || !auth.value.password) {
        showMessage('Veuillez remplir tous les champs', 'error')
        return
      }

      isLoading.value = true
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: auth.value.email,
          password: auth.value.password,
        })

        if (error) {
          throw new Error(error.message)
        }

        if (!data.user) {
          throw new Error('Utilisateur non trouvé')
        }

        user.value = data.user

        // Vérifier si l'utilisateur a déjà une agence
        const { data: agencyData, error: agencyError } = await supabase
          .from('memberships')
          .select('agency_id, role, agencies:agency_id(id, name, address, phone, email)')
          .eq('user_id', user.value.id)
          .eq('role', 'admin')
          .is('deleted_at', null)
          .single()

        if (agencyData && !agencyError) {
          // L'utilisateur a déjà une agence comme admin
          agency.value = {
            id: agencyData.agency_id,
            name: agencyData.agencies.name,
            address: agencyData.agencies.address || '',
            phone: agencyData.agencies.phone || '',
            email: agencyData.agencies.email || '',
          }

          // Mettre à jour l'ID d'agence pour le véhicule
          vehicle.value.agency_id = agencyData.agency_id
          vehicle.value.created_by = user.value.id

          // Charger les véhicules de cette agence
          loadVehicles()

          // Passer directement à l'étape 3
          currentStep.value = 3
        } else {
          // L'utilisateur n'a pas encore d'agence
          currentStep.value = 2
        }

        showMessage('Connexion réussie!', 'success')
      } catch (error: any) {
        console.error('Erreur de connexion:', error)
        showMessage(error.message || 'Identifiants invalides', 'error')
      } finally {
        isLoading.value = false
      }
    }

    // Fonction de création d'agence
    const createAgency = async () => {
      if (!agency.value.name) {
        showMessage("Le nom de l'agence est obligatoire", 'error')
        return
      }

      isLoading.value = true
      try {
        // 1. Créer l'agence
        const { data: agencyData, error: agencyError } = await supabase
          .from('agencies')
          .insert({
            name: agency.value.name,
            address: agency.value.address,
            phone: agency.value.phone,
            email: agency.value.email,
          })
          .select()
          .single()

        if (agencyError) {
          throw new Error(agencyError.message)
        }

        agency.value.id = agencyData.id

        // 2. Ajouter l'utilisateur comme admin de l'agence
        const { error: membershipError } = await supabase.from('memberships').insert({
          user_id: user.value.id,
          agency_id: agency.value.id,
          role: 'admin',
        })

        if (membershipError) {
          throw new Error(membershipError.message)
        }

        // 3. Mettre à jour le véhicule avec l'ID de l'agence
        vehicle.value.agency_id = agency.value.id
        vehicle.value.created_by = user.value.id

        showMessage('Agence créée avec succès!', 'success')
        currentStep.value = 3 // Passer à l'ajout de véhicule
      } catch (error: any) {
        console.error("Erreur lors de la création de l'agence:", error)
        showMessage(error.message || "Erreur lors de la création de l'agence", 'error')
      } finally {
        isLoading.value = false
      }
    }

    // Fonction pour ajouter un véhicule
    const addVehicle = async () => {
      if (!vehicle.value.plate_number || !vehicle.value.brand || !vehicle.value.model) {
        showMessage('Veuillez remplir tous les champs obligatoires du véhicule', 'error')
        return
      }

      isLoading.value = true
      try {
        const result = await VehicleService.createVehicle(vehicle.value)

        if (result === false) {
          throw new Error('Erreur lors de la création du véhicule')
        }

        showMessage('Véhicule ajouté avec succès!', 'success')
        resetVehicleForm()
        loadVehicles()
      } catch (error: any) {
        console.error("Erreur lors de l'ajout du véhicule:", error)
        showMessage(error.message || "Erreur lors de l'ajout du véhicule", 'error')
      } finally {
        isLoading.value = false
      }
    }

    // Fonction pour supprimer un véhicule
    const deleteVehicle = async (id: string) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule?')) {
        try {
          const result = await VehicleService.deleteVehicle(id)
          if (result) {
            showMessage('Véhicule supprimé avec succès', 'success')
            loadVehicles()
          } else {
            showMessage('Erreur lors de la suppression', 'error')
          }
        } catch (error: any) {
          showMessage(error.message || 'Erreur lors de la suppression', 'error')
        }
      }
    }

    // Fonction pour charger les véhicules
    const loadVehicles = async () => {
      if (!agency.value.id) return

      try {
        // Utiliser le service pour charger les véhicules de l'agence
        const result = await VehicleService.getVehiclesByAgency(agency.value.id)

        if (result !== false) {
          vehicles.value = result
        } else {
          console.error('Erreur lors du chargement des véhicules')
        }
      } catch (error) {
        console.error('Erreur lors du chargement des véhicules:', error)
      }
    }

    // Fonction pour réinitialiser le formulaire de véhicule
    const resetVehicleForm = () => {
      vehicle.value = {
        agency_id: agency.value.id,
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

    // Fonction pour afficher un message
    const showMessage = (msg: string, type: 'success' | 'error') => {
      message.value = msg
      messageType.value = type
      setTimeout(() => {
        message.value = ''
      }, 5000)
    }

    // Vérifier si l'utilisateur est déjà connecté au chargement
    onMounted(async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        user.value = data.session.user

        // Vérifier si l'utilisateur a déjà une agence
        const { data: agencyData, error: agencyError } = await supabase
          .from('memberships')
          .select('agency_id, role, agencies:agency_id(id, name, address, phone, email)')
          .eq('user_id', user.value.id)
          .eq('role', 'admin')
          .is('deleted_at', null)
          .single()

        if (agencyData && !agencyError) {
          // L'utilisateur a déjà une agence comme admin
          agency.value = {
            id: agencyData.agency_id,
            name: agencyData.agencies.name,
            address: agencyData.agencies.address || '',
            phone: agencyData.agencies.phone || '',
            email: agencyData.agencies.email || '',
          }

          // Mettre à jour l'ID d'agence pour le véhicule
          vehicle.value.agency_id = agencyData.agency_id
          vehicle.value.created_by = user.value.id

          // Charger les véhicules de cette agence
          loadVehicles()

          // Passer directement à l'étape 3
          currentStep.value = 3
        } else {
          // L'utilisateur n'a pas encore d'agence
          currentStep.value = 2
        }
      }
    })

    return {
      // État global
      currentStep,
      isLoading,
      message,
      messageType,
      authMode,

      // État utilisateur
      user,
      auth,
      userProfile,

      // État agence
      agency,

      // État véhicule
      vehicle,
      vehicles,

      // Fonctions
      register,
      login,
      createAgency,
      addVehicle,
      deleteVehicle,
    }
  },
})
</script>

<style scoped>
.test-setup-workflow {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.step-container {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.step-container h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
}

.completed {
  border-left: 5px solid #4caf50;
  background-color: #f9fff9;
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.tabs-container {
  position: relative;
  margin-bottom: 2rem;
}

.tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #ddd;
  justify-content: center;
  width: 100%;
}

.tab-button {
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  margin: 0 0.5rem;
  cursor: pointer;
  color: #666;
  font-weight: 600;
  transition: all 0.2s ease;
  border-radius: 4px 4px 0 0;
  flex: 1;
  max-width: 250px;
  text-align: center;
}

.tab-button:hover {
  background-color: #f0f8ff;
}

.tab-button.active {
  border-bottom: 3px solid #2196f3;
  background-color: #e3f2fd;
  color: #2196f3;
}

.form-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

label {
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

input,
select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus,
select:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

button {
  grid-column: span 2;
  padding: 0.75rem 1.5rem;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #0b7dda;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.step-summary {
  padding: 0.75rem;
  background-color: #e3f2fd;
  border-radius: 4px;
  color: #0d47a1;
}

.message {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  text-align: center;
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
  margin-top: 1rem;
}

th,
td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

.delete-btn {
  padding: 0.5rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.delete-btn:hover {
  background-color: #d32f2f;
}

@media (max-width: 768px) {
  .form-container {
    grid-template-columns: 1fr;
  }

  button {
    grid-column: span 1;
  }
}
</style>
