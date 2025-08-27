<template>
  <div class="register-vehicule-container">
    <h2 class="text-2xl font-bold mb-6">Enregistrement d'un nouveau véhicule</h2>

    <!-- Message de succès -->
    <div
      v-if="formState.successMessage"
      class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
    >
      Véhicule enregistré avec succès !
    </div>

    <!-- Message d'erreur général -->
    <div
      v-if="formState.errorMessage"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      Veuillez corriger les erreurs dans le formulaire.
    </div>

    <form @submit.prevent="registerVehicule" class="space-y-4">
      <!-- Informations de base du véhicule -->
      <div class="section-title font-bold text-lg mb-2">Informations de base</div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Agence -->
        <div class="form-group">
          <label for="agency_id" class="block mb-1">Agence *</label>
          <select
            id="agency_id"
            v-model="vehiculeModel.agency_id"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': formBuilder?.errorAgencyId }"
          >
            <option value="">Sélectionner une agence</option>
            <option v-for="agency in agencies" :key="agency.id" :value="agency.id">
              {{ agency.name }}
            </option>
          </select>
          <div v-if="formBuilder?.errorAgencyId" class="text-red-500 text-sm mt-1">
            Veuillez sélectionner une agence.
          </div>
        </div>

        <!-- Numéro d'immatriculation -->
        <div class="form-group">
          <label for="plate_number" class="block mb-1">Numéro d'immatriculation *</label>
          <input
            type="text"
            id="plate_number"
            v-model="vehiculeModel.plate_number"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': formBuilder?.errorPlateNumber }"
            placeholder="Ex: AB-123-CD"
          />
          <div v-if="formBuilder?.errorPlateNumber" class="text-red-500 text-sm mt-1">
            Veuillez entrer un numéro d'immatriculation valide.
          </div>
        </div>

        <!-- Marque -->
        <div class="form-group">
          <label for="brand" class="block mb-1">Marque *</label>
          <input
            type="text"
            id="brand"
            v-model="vehiculeModel.brand"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': formBuilder?.errorBrand }"
            placeholder="Ex: Toyota"
          />
          <div v-if="formBuilder?.errorBrand" class="text-red-500 text-sm mt-1">
            Veuillez entrer une marque valide.
          </div>
        </div>

        <!-- Modèle -->
        <div class="form-group">
          <label for="model" class="block mb-1">Modèle *</label>
          <input
            type="text"
            id="model"
            v-model="vehiculeModel.model"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': formBuilder?.errorModel }"
            placeholder="Ex: Corolla"
          />
          <div v-if="formBuilder?.errorModel" class="text-red-500 text-sm mt-1">
            Veuillez entrer un modèle valide.
          </div>
        </div>

        <!-- Année -->
        <div class="form-group">
          <label for="year" class="block mb-1">Année</label>
          <input
            type="number"
            id="year"
            v-model="vehiculeModel.year"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': formBuilder?.errorYear }"
            placeholder="Ex: 2020"
          />
          <div v-if="formBuilder?.errorYear" class="text-red-500 text-sm mt-1">
            Veuillez entrer une année valide (entre 1900 et l'année actuelle).
          </div>
        </div>

        <!-- Kilométrage -->
        <div class="form-group">
          <label for="mileage" class="block mb-1">Kilométrage *</label>
          <input
            type="number"
            id="mileage"
            v-model="vehiculeModel.mileage"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': formBuilder?.errorMileage }"
            placeholder="Ex: 50000"
          />
          <div v-if="formBuilder?.errorMileage" class="text-red-500 text-sm mt-1">
            Veuillez entrer un kilométrage valide.
          </div>
        </div>
      </div>

      <!-- Caractéristiques du véhicule -->
      <div class="section-title font-bold text-lg mb-2 mt-6">Caractéristiques</div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Type -->
        <div class="form-group">
          <label for="type" class="block mb-1">Type de véhicule</label>
          <select id="type" v-model="vehiculeModel.type" class="w-full px-3 py-2 border rounded">
            <option value="">Sélectionner un type</option>
            <option value="sedan">Berline</option>
            <option value="suv">SUV</option>
            <option value="minibus">Minibus</option>
            <option value="bus">Bus</option>
            <option value="camion">Camion</option>
          </select>
        </div>

        <!-- Couleur -->
        <div class="form-group">
          <label for="color" class="block mb-1">Couleur</label>
          <input
            type="text"
            id="color"
            v-model="vehiculeModel.color"
            class="w-full px-3 py-2 border rounded"
            placeholder="Ex: Blanc"
          />
        </div>

        <!-- Type de carburant -->
        <div class="form-group">
          <label for="fuel_type" class="block mb-1">Type de carburant</label>
          <select
            id="fuel_type"
            v-model="vehiculeModel.fuel_type"
            class="w-full px-3 py-2 border rounded"
          >
            <option value="">Sélectionner un type</option>
            <option v-for="fuel in fuelTypes" :key="fuel.value" :value="fuel.value">
              {{ fuel.label }}
            </option>
          </select>
        </div>

        <!-- VIN -->
        <div class="form-group">
          <label for="vin" class="block mb-1">Numéro VIN</label>
          <input
            type="text"
            id="vin"
            v-model="vehiculeModel.vin"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': formBuilder?.errorVin }"
            placeholder="Ex: 1HGCM82633A123456"
          />
          <div v-if="formBuilder?.errorVin" class="text-red-500 text-sm mt-1">
            Veuillez entrer un numéro VIN valide (17 caractères).
          </div>
        </div>

        <!-- Capacité passagers -->
        <div class="form-group">
          <label for="passenger_capacity" class="block mb-1">Capacité passagers</label>
          <input
            type="number"
            id="passenger_capacity"
            v-model="vehiculeModel.passenger_capacity"
            class="w-full px-3 py-2 border rounded"
            placeholder="Ex: 5"
          />
        </div>

        <!-- Capacité de charge -->
        <div class="form-group">
          <label for="load_capacity" class="block mb-1">Capacité de charge (kg)</label>
          <input
            type="number"
            id="load_capacity"
            v-model="vehiculeModel.load_capacity"
            class="w-full px-3 py-2 border rounded"
            placeholder="Ex: 500"
          />
        </div>
      </div>

      <!-- Informations d'assurance -->
      <div class="section-title font-bold text-lg mb-2 mt-6">Informations d'assurance</div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Compagnie d'assurance -->
        <div class="form-group">
          <label for="insurance_company" class="block mb-1">Compagnie d'assurance</label>
          <input
            type="text"
            id="insurance_company"
            v-model="vehiculeModel.insurance_company"
            class="w-full px-3 py-2 border rounded"
            placeholder="Ex: AXA Assurances"
          />
        </div>

        <!-- Numéro de police -->
        <div class="form-group">
          <label for="insurance_policy_number" class="block mb-1">Numéro de police</label>
          <input
            type="text"
            id="insurance_policy_number"
            v-model="vehiculeModel.insurance_policy_number"
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': formBuilder?.errorInsurancePolicyNumber }"
            placeholder="Ex: POL-12345-AX"
          />
          <div v-if="formBuilder?.errorInsurancePolicyNumber" class="text-red-500 text-sm mt-1">
            Veuillez entrer un numéro de police valide.
          </div>
        </div>

        <!-- Date d'expiration -->
        <div class="form-group">
          <label for="insurance_expiry" class="block mb-1">Date d'expiration</label>
          <input
            type="date"
            id="insurance_expiry"
            v-model="vehiculeModel.insurance_expiry"
            class="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>

      <!-- Informations d'exploitation -->
      <div class="section-title font-bold text-lg mb-2 mt-6">Informations d'exploitation</div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Statut -->
        <div class="form-group">
          <label for="status" class="block mb-1">Statut</label>
          <select
            id="status"
            v-model="vehiculeModel.status"
            class="w-full px-3 py-2 border rounded"
          >
            <option value="">Sélectionner un statut</option>
            <option v-for="status in vehicleStatuses" :key="status.value" :value="status.value">
              {{ status.label }}
            </option>
          </select>
        </div>

        <!-- Date de début de service -->
        <div class="form-group">
          <label for="service_start_date" class="block mb-1">Date de mise en service</label>
          <input
            type="date"
            id="service_start_date"
            v-model="vehiculeModel.service_start_date"
            class="w-full px-3 py-2 border rounded"
          />
        </div>

        <!-- Conducteur -->
        <div class="form-group">
          <label for="driver_id" class="block mb-1">Conducteur assigné</label>
          <select
            id="driver_id"
            v-model="vehiculeModel.driver_id"
            class="w-full px-3 py-2 border rounded"
          >
            <option value="">Sélectionner un conducteur</option>
            <option v-for="driver in drivers" :key="driver.id" :value="driver.id">
              {{ driver.nom }}
            </option>
          </select>
        </div>
      </div>

      <!-- Informations de maintenance -->
      <div class="section-title font-bold text-lg mb-2 mt-6">Maintenance</div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Prochain contrôle technique -->
        <div class="form-group">
          <label for="next_technical_control" class="block mb-1">Prochain contrôle technique</label>
          <input
            type="date"
            id="next_technical_control"
            v-model="vehiculeModel.next_technical_control"
            class="w-full px-3 py-2 border rounded"
          />
        </div>

        <!-- Prochaine maintenance -->
        <div class="form-group">
          <label for="next_maintenance" class="block mb-1">Prochaine maintenance</label>
          <input
            type="date"
            id="next_maintenance"
            v-model="vehiculeModel.next_maintenance"
            class="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>

      <!-- Description -->
      <div class="form-group mt-4">
        <label for="description" class="block mb-1">Description / Notes</label>
        <textarea
          id="description"
          v-model="vehiculeModel.description"
          class="w-full px-3 py-2 border rounded"
          rows="4"
          placeholder="Informations complémentaires sur ce véhicule..."
        ></textarea>
      </div>

      <!-- Boutons de soumission -->
      <div class="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          class="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
          @click="resetForm"
        >
          Annuler
        </button>
        <button
          type="submit"
          class="px-4 py-2 border rounded bg-blue-500 text-white hover:bg-blue-600"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Enregistrement...</span>
          <span v-else>Enregistrer le véhicule</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { VehiculeForm } from '../../formBuilder/vehicules/vehiculesForm'
import Vehicle from '../../services/vehicules/Vehicle'
import { VEHICLE_STATUSES, FUEL_TYPES } from '../../config/vehiculeConfig'
import type { IVehicleModel } from '../../interfaces/vehiculesInterface'

interface IAgency {
  id: string
  name: string
}

interface IDriver {
  id: string
  nom: string
}

interface IFormState {
  successMessage: boolean
  errorMessage: boolean
}

export default defineComponent({
  name: 'RegisterVehiculeComponent',

  setup() {
    // État du formulaire
    const formBuilder = ref<any>(null)
    const isLoading = ref(false)

    // État des messages
    const formState = reactive<IFormState>({
      successMessage: false,
      errorMessage: false,
    })

    // Modèle de données du véhicule
    const vehiculeModel = reactive<Partial<IVehicleModel>>({
      agency_id: '',
      plate_number: '',
      brand: '',
      model: '',
      mileage: 0,
      year: null,
      type: null,
      status: 'disponible', // Valeur par défaut
      color: null,
      vin: null,
      service_assignment: null,
      driver_id: null,
      fuel_type: null,
      service_start_date: null,
      passenger_capacity: null,
      load_capacity: null,
      condition: null,
      description: null,
      next_technical_control: null,
      next_maintenance: null,
      insurance_company: null,
      insurance_policy_number: null,
      insurance_expiry: null,
      current_location: null,
      usage_area: null,
      daily_rate: null,
      operating_days: null,
      departure_time: null,
      max_return_time: null,
    })

    // Données de référence
    const agencies = ref<IAgency[]>([])
    const drivers = ref<IDriver[]>([])
    const vehicleStatuses = ref(VEHICLE_STATUSES)
    const fuelTypes = ref(FUEL_TYPES)

    // Chargement des données de référence
    onMounted(async () => {
      // Ici, chargement des agences et conducteurs depuis votre API
      // Exemple simple pour la démo:
      agencies.value = [
        { id: '1', name: 'Agence Centrale' },
        { id: '2', name: 'Agence Nord' },
        { id: '3', name: 'Agence Sud' },
      ]

      drivers.value = [
        { id: '1', nom: 'Jean Dupont' },
        { id: '2', nom: 'Marie Martin' },
        { id: '3', nom: 'Pierre Durand' },
      ]
    })

    // Validation et enregistrement du véhicule
    const registerVehicule = async () => {
      // Réinitialisation des messages
      formState.successMessage = false
      formState.errorMessage = false

      // Création et validation du formulaire avec le FormBuilder
      const vehiculeForm = new VehiculeForm()
        .setAgencyId(vehiculeModel.agency_id as string)
        .setPlateNumber(vehiculeModel.plate_number as string)
        .setBrand(vehiculeModel.brand as string)
        .setModel(vehiculeModel.model as string)
        .setMileage(vehiculeModel.mileage as number)

      // Validations optionnelles si des valeurs sont fournies
      if (vehiculeModel.year !== null) {
        vehiculeForm.setYear(vehiculeModel.year)
      }

      if (vehiculeModel.vin) {
        vehiculeForm.setVin(vehiculeModel.vin)
      }

      if (vehiculeModel.type) {
        vehiculeForm.setType(vehiculeModel.type)
      }

      if (vehiculeModel.status) {
        vehiculeForm.setStatus(vehiculeModel.status)
      }

      if (vehiculeModel.color) {
        vehiculeForm.setColor(vehiculeModel.color)
      }

      if (vehiculeModel.service_assignment) {
        vehiculeForm.setServiceAssignment(vehiculeModel.service_assignment)
      }

      if (vehiculeModel.driver_id) {
        vehiculeForm.setDriverId(vehiculeModel.driver_id)
      }

      if (vehiculeModel.fuel_type) {
        vehiculeForm.setFuelType(vehiculeModel.fuel_type)
      }

      if (vehiculeModel.service_start_date) {
        vehiculeForm.setServiceStartDate(vehiculeModel.service_start_date)
      }

      if (vehiculeModel.passenger_capacity !== null) {
        vehiculeForm.setPassengerCapacity(vehiculeModel.passenger_capacity)
      }

      if (vehiculeModel.load_capacity !== null) {
        vehiculeForm.setLoadCapacity(vehiculeModel.load_capacity)
      }

      if (vehiculeModel.condition) {
        vehiculeForm.setCondition(vehiculeModel.condition)
      }

      if (vehiculeModel.description) {
        vehiculeForm.setDescription(vehiculeModel.description)
      }

      if (vehiculeModel.next_technical_control) {
        vehiculeForm.setNextTechnicalControl(vehiculeModel.next_technical_control)
      }

      if (vehiculeModel.next_maintenance) {
        vehiculeForm.setNextMaintenance(vehiculeModel.next_maintenance)
      }

      if (vehiculeModel.insurance_company) {
        vehiculeForm.setInsuranceCompany(vehiculeModel.insurance_company)
      }

      if (vehiculeModel.insurance_policy_number) {
        vehiculeForm.setInsurancePolicyNumber(vehiculeModel.insurance_policy_number)
      }

      if (vehiculeModel.insurance_expiry) {
        vehiculeForm.setInsuranceExpiry(vehiculeModel.insurance_expiry)
      }

      if (vehiculeModel.current_location) {
        vehiculeForm.setCurrentLocation(vehiculeModel.current_location)
      }

      if (vehiculeModel.usage_area) {
        vehiculeForm.setUsageArea(vehiculeModel.usage_area)
      }

      if (vehiculeModel.daily_rate !== null) {
        vehiculeForm.setDailyRate(vehiculeModel.daily_rate)
      }

      if (vehiculeModel.operating_days) {
        vehiculeForm.setOperatingDays(vehiculeModel.operating_days)
      }

      if (vehiculeModel.departure_time) {
        vehiculeForm.setDepartureTime(vehiculeModel.departure_time)
      }

      if (vehiculeModel.max_return_time) {
        vehiculeForm.setMaxReturnTime(vehiculeModel.max_return_time)
      }

      // Récupération des erreurs
      formBuilder.value = vehiculeForm.builderVehiculeForm()

      // Vérification des erreurs critiques
      if (
        !formBuilder.value.errorAgencyId &&
        !formBuilder.value.errorPlateNumber &&
        !formBuilder.value.errorBrand &&
        !formBuilder.value.errorModel &&
        !formBuilder.value.errorMileage &&
        !formBuilder.value.errorYear &&
        !formBuilder.value.errorVin &&
        !formBuilder.value.errorInsurancePolicyNumber
      ) {
        try {
          isLoading.value = true

          // Création d'une instance de Vehicle avec toutes les propriétés
          const vehicleInstance = new Vehicle(
            vehiculeModel.agency_id as string,
            vehiculeModel.plate_number as string,
            vehiculeModel.brand as string,
            vehiculeModel.model as string,
            vehiculeModel.mileage as number,
            vehiculeModel.year,
            vehiculeModel.type,
            vehiculeModel.status,
            vehiculeModel.color,
            vehiculeModel.vin,
            vehiculeModel.service_assignment,
            vehiculeModel.driver_id,
            vehiculeModel.fuel_type,
            vehiculeModel.service_start_date,
            vehiculeModel.passenger_capacity,
            vehiculeModel.load_capacity,
            vehiculeModel.condition,
            vehiculeModel.description,
            vehiculeModel.next_technical_control,
            vehiculeModel.next_maintenance,
            vehiculeModel.insurance_company,
            vehiculeModel.insurance_policy_number,
            vehiculeModel.insurance_expiry,
            vehiculeModel.current_location,
            vehiculeModel.usage_area,
            vehiculeModel.daily_rate,
            vehiculeModel.operating_days,
            vehiculeModel.departure_time,
            vehiculeModel.max_return_time,
          )

          // Appel au service pour créer le véhicule
          const response = await vehicleInstance.createVehicle()

          if (response) {
            // Succès : afficher le message et réinitialiser le formulaire
            formState.successMessage = true
            resetForm()

            // Masquer le message de succès après 3 secondes
            setTimeout(() => {
              formState.successMessage = false
            }, 3000)
          } else {
            // Erreur : afficher le message d'erreur
            formState.errorMessage = true
            setTimeout(() => {
              formState.errorMessage = false
            }, 3000)
          }
        } catch (error) {
          console.error("Erreur lors de l'enregistrement du véhicule:", error)
          formState.errorMessage = true
          setTimeout(() => {
            formState.errorMessage = false
          }, 3000)
        } finally {
          isLoading.value = false
        }
      } else {
        // Formulaire invalide : afficher le message d'erreur
        formState.errorMessage = true
        setTimeout(() => {
          formState.errorMessage = false
        }, 3000)
      }
    }

    // Réinitialisation du formulaire
    const resetForm = () => {
      // Réinitialisation des valeurs du modèle
      Object.keys(vehiculeModel).forEach((key) => {
        const typedKey = key as keyof typeof vehiculeModel
        if (typedKey === 'mileage') {
          vehiculeModel[typedKey] = 0
        } else if (typedKey === 'status') {
          vehiculeModel[typedKey] = 'disponible'
        } else {
          vehiculeModel[typedKey] =
            typedKey === 'agency_id' ||
            typedKey === 'plate_number' ||
            typedKey === 'brand' ||
            typedKey === 'model'
              ? ''
              : null
        }
      })

      // Réinitialisation des erreurs
      formBuilder.value = null
    }

    return {
      vehiculeModel,
      formBuilder,
      isLoading,
      formState,
      agencies,
      drivers,
      vehicleStatuses,
      fuelTypes,
      registerVehicule,
      resetForm,
    }
  },
})
</script>

<style scoped>
.register-vehicule-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

.section-title {
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

/* Adaptation pour écrans plus petits */
@media (max-width: 768px) {
  .register-vehicule-container {
    padding: 1rem;
  }
}
</style>
