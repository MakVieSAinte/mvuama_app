<template>
  <form @submit.prevent="handleSubmit" class="w-full max-w-full">
    <!-- Stepper inspiré de RegisterComponent -->
    <div class="mb-8">
      <nav aria-label="Progress">
        <ol role="list" class="space-y-4 md:flex md:space-x-8 md:space-y-0 w-full">
          <li class="md:flex-1" v-for="(step, index) in steps" :key="index">
            <div
              :class="[
                currentStep >= index ? 'border-primary' : 'border-input',
                'group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4',
              ]"
            >
              <span
                :class="[
                  currentStep >= index ? 'text-primary' : 'text-muted-foreground',
                  'text-sm font-medium',
                ]"
              >
                Étape {{ index + 1 }}
              </span>
              <span class="text-sm font-medium">{{ step.name }}</span>
            </div>
          </li>
        </ol>
      </nav>
    </div>

    <!-- Transition entre les étapes -->
    <div class="space-y-8 w-full">
      <!-- Étape 1: Informations de base -->
      <div v-show="currentStep === 0" class="space-y-4 w-full">
        <div class="space-y-1.5">
          <h3 class="text-lg font-semibold">Informations générales</h3>
          <p class="text-sm text-muted-foreground">
            Commençons par les informations essentielles de votre entreprise
          </p>
        </div>

        <!-- Nom de l'agence -->
        <div class="grid gap-1.5">
          <UiLabel for="name" required>Nom de l'entreprise</UiLabel>
          <UiInput
            id="name"
            placeholder="Ex: Transport Express Brazzaville SARL"
            type="text"
            v-model="enterpriseData.name"
            :class="{ 'border-red-500 ring-red-500': formErrors.errorName }"
            autofocus
          />
          <p v-if="formErrors.errorName" class="text-xs text-red-500">
            {{ formErrors.errorNameMessage }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Code de l'agence (généré automatiquement) -->
          <div class="grid gap-1.5">
            <UiLabel for="code">Code de l'entreprise</UiLabel>
            <UiInput
              id="code"
              placeholder="Généré automatiquement"
              type="text"
              v-model="enterpriseData.code"
              :class="{ 'border-red-500': formErrors.errorCode }"
              disabled
            />
            <p v-if="!formErrors.errorCode" class="text-xs text-muted-foreground">
              Le code est généré automatiquement à partir du nom de l'entreprise
            </p>
            <p v-else class="text-xs text-red-500">
              {{ formErrors.errorCodeMessage }}
            </p>
          </div>

          <!-- Type d'agence -->
          <div class="grid gap-1.5">
            <UiLabel for="type">Type d'entreprise</UiLabel>
            <UiSelect v-model="enterpriseData.type" class="w-full">
              <SelectTrigger
                id="type"
                class="w-full"
                :class="{ 'border-red-500': formErrors.errorType }"
              >
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="type in agencyTypes" :key="type.value" :value="type.value">
                    {{ type.label }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </UiSelect>
            <p v-if="formErrors.errorType" class="text-xs text-red-500">
              {{ formErrors.errorTypeMessage }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- NUI (Numéro Unique d'Identification) -->
          <div class="grid gap-1.5">
            <UiLabel for="nui">NUI</UiLabel>
            <UiInput
              id="nui"
              placeholder="Numéro Unique d'Identification"
              type="text"
              v-model="enterpriseData.nui"
              :class="{ 'border-red-500': formErrors.errorNui }"
            />
            <p v-if="formErrors.errorNui" class="text-xs text-red-500">
              {{ formErrors.errorNuiMessage }}
            </p>
          </div>

          <!-- Type d'activité -->
          <div class="grid gap-1.5">
            <UiLabel for="activityType">Type d'activité</UiLabel>
            <UiSelect v-model="enterpriseData.activityType" class="w-full">
              <SelectTrigger
                id="activityType"
                class="w-full"
                :class="{ 'border-red-500': formErrors.errorActivityType }"
              >
                <SelectValue placeholder="Sélectionnez un type d'activité" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="type in activityTypes" :key="type.value" :value="type.value">
                    {{ type.label }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </UiSelect>
            <p v-if="formErrors.errorActivityType" class="text-xs text-red-500">
              {{ formErrors.errorActivityTypeMessage }}
            </p>
          </div>
        </div>

        <!-- Description -->
        <div class="grid gap-1.5">
          <UiLabel for="description">Description</UiLabel>
          <UiTextarea
            id="description"
            placeholder="Décrivez votre agence en quelques mots..."
            v-model="enterpriseData.description"
            :class="{ 'border-red-500': formErrors.errorDescription }"
            class="min-h-[100px]"
          />
          <p v-if="formErrors.errorDescription" class="text-xs text-red-500">
            {{ formErrors.errorDescriptionMessage }}
          </p>
        </div>
      </div>

      <!-- Étape 2: Localisation -->
      <div v-show="currentStep === 1" class="space-y-4 w-full">
        <div class="space-y-1.5">
          <h3 class="text-lg font-semibold">Localisation</h3>
          <p class="text-sm text-muted-foreground">
            Où se situe votre agence? Ces informations apparaîtront sur vos documents
          </p>
        </div>

        <!-- Pays -->
        <div class="grid gap-1.5">
          <UiLabel for="country" required>Pays</UiLabel>
          <UiSelect
            v-model="enterpriseData.country"
            class="w-full"
            @update:modelValue="onCountryChange"
          >
            <SelectTrigger
              id="country"
              class="w-full"
              :class="{ 'border-red-500': formErrors.errorCountry }"
            >
              <SelectValue placeholder="Sélectionnez un pays" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="country in countries" :key="country.code" :value="country.code">
                  <img
                    :src="`https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`"
                    width="15"
                    height="9"
                  />
                  <span>{{ countryCodeToFlag(country.code) }}</span>
                  {{ country.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </UiSelect>
          <p v-if="formErrors.errorCountry" class="text-xs text-red-500">
            {{ formErrors.errorCountryMessage }}
          </p>
        </div>

        <!-- Devise -->
        <div class="grid gap-1.5">
          <UiLabel for="currency">Devise</UiLabel>
          <UiSelect v-model="enterpriseData.currency" class="w-full">
            <SelectTrigger
              id="currency"
              class="w-full"
              :class="{ 'border-red-500': formErrors.errorCurrency }"
            >
              <SelectValue placeholder="Sélectionnez une devise" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="currency in currencies"
                  :key="currency.code"
                  :value="currency.code"
                >
                  <span class="text-bold">{{ currency.symbol }}</span> {{ currency.name }} ({{
                    currency.code
                  }})
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </UiSelect>
          <p v-if="formErrors.errorCurrency" class="text-xs text-red-500">
            {{ formErrors.errorCurrencyMessage }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Ville -->
          <div class="grid gap-1.5">
            <UiLabel for="city">Ville</UiLabel>
            <Select v-model="enterpriseData.city" class="w-full" v-if="citiesByCountry.length > 0">
              <SelectTrigger
                id="city"
                class="w-full"
                :class="{ 'border-red-500': formErrors.errorCity }"
              >
                <SelectValue placeholder="Sélectionnez une ville" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="city in citiesByCountry" :key="city" :value="city">
                    {{ city }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <UiInput
              v-else
              id="city"
              placeholder="Ville de l'agence"
              type="text"
              v-model="enterpriseData.city"
              :class="{ 'border-red-500': formErrors.errorCity }"
            />
            <p v-if="formErrors.errorCity" class="text-xs text-red-500">
              {{ formErrors.errorCityMessage }}
            </p>
          </div>

          <!-- Code postal -->
          <div class="grid gap-1.5">
            <UiLabel for="postal_code">Code postal</UiLabel>
            <UiInput
              id="postal_code"
              placeholder="Code postal"
              type="text"
              v-model="enterpriseData.postal_code"
              :class="{ 'border-red-500': formErrors.errorPostalCode }"
            />
            <p v-if="formErrors.errorPostalCode" class="text-xs text-red-500">
              {{ formErrors.errorPostalCodeMessage }}
            </p>
          </div>
        </div>

        <!-- Adresse -->
        <div class="grid gap-1.5">
          <UiLabel for="address">Adresse complète</UiLabel>
          <UiInput
            id="address"
            placeholder="Numéro, rue, avenue, quartier..."
            type="text"
            v-model="enterpriseData.address"
            :class="{ 'border-red-500': formErrors.errorAddress }"
          />
          <p v-if="formErrors.errorAddress" class="text-xs text-red-500">
            {{ formErrors.errorAddressMessage }}
          </p>
        </div>
      </div>

      <!-- Étape 3: Contact -->
      <div v-show="currentStep === 2" class="space-y-4 w-full">
        <div class="space-y-1.5">
          <h3 class="text-lg font-semibold">Informations de contact</h3>
          <p class="text-sm text-muted-foreground">
            Comment vos clients peuvent-ils vous contacter?
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Numéro de téléphone fixe -->
          <div class="grid gap-1.5">
            <UiLabel for="phone">Téléphone fixe</UiLabel>
            <UiInput
              id="phone"
              placeholder="Ex: (+242 06 123 45 67)"
              type="tel"
              v-model="enterpriseData.phone"
              @input="updatePhone('fixed')"
              :class="{ 'border-red-500': formErrors.errorPhone }"
            />
            <p v-if="formErrors.errorPhone" class="text-xs text-red-500">
              {{ formErrors.errorPhoneMessage }}
            </p>
          </div>

          <!-- Numéro de téléphone mobile -->
          <div class="grid gap-1.5">
            <UiLabel for="mobile_phone">Téléphone mobile</UiLabel>
            <UiInput
              id="mobile_phone"
              placeholder="Ex: (+242 06 123 45 67)"
              type="tel"
              v-model="enterpriseData.mobile_phone"
              @input="updatePhone('mobile')"
              :class="{ 'border-red-500': formErrors.errorMobilePhone }"
            />
            <p v-if="formErrors.errorMobilePhone" class="text-xs text-red-500">
              {{ formErrors.errorMobilePhoneMessage }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Email -->
          <div class="grid gap-1.5">
            <UiLabel for="email">Email</UiLabel>
            <UiInput
              id="email"
              placeholder="agence@example.com"
              type="email"
              v-model="enterpriseData.email"
              :class="{ 'border-red-500': formErrors.errorEmail }"
            />
            <p v-if="formErrors.errorEmail" class="text-xs text-red-500">
              {{ formErrors.errorEmailMessage }}
            </p>
          </div>

          <!-- Site web -->
          <div class="grid gap-1.5">
            <UiLabel for="website">Site web</UiLabel>
            <UiInput
              id="website"
              placeholder="https://www.example.com"
              type="url"
              v-model="enterpriseData.website"
              :class="{ 'border-red-500': formErrors.errorWebsite }"
            />
            <p v-if="formErrors.errorWebsite" class="text-xs text-red-500">
              {{ formErrors.errorWebsiteMessage }}
            </p>
          </div>
        </div>
      </div>

      <!-- Étape 4: Résumé final -->
      <div v-show="currentStep === 3" class="space-y-4 w-full">
        <div class="space-y-1.5 mb-4">
          <h3 class="text-lg font-semibold">Vérifiez et confirmez</h3>
          <p class="text-sm text-muted-foreground">
            Voici un résumé des informations de votre agence. Vous pourrez les modifier
            ultérieurement
          </p>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <!-- Colonne 1 -->
          <div class="space-y-4">
            <div class="space-y-1 border-b pb-2">
              <h4 class="text-sm font-medium text-muted-foreground">Informations générales</h4>
              <dl class="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                <dt class="text-sm font-medium">Nom</dt>
                <dd class="text-sm">{{ enterpriseData.name || 'Non spécifié' }}</dd>

                <dt class="text-sm font-medium">Code</dt>
                <dd class="text-sm">{{ enterpriseData.code || 'Non spécifié' }}</dd>

                <dt class="text-sm font-medium">Type</dt>
                <dd class="text-sm">{{ getTypeLabel(enterpriseData.type) || 'Non spécifié' }}</dd>

                <dt class="text-sm font-medium">NUI</dt>
                <dd class="text-sm">{{ enterpriseData.nui || 'Non spécifié' }}</dd>

                <dt class="text-sm font-medium">Type d'activité</dt>
                <dd class="text-sm">
                  {{ getActivityTypeLabel(enterpriseData.activityType) || 'Non spécifié' }}
                </dd>
              </dl>
            </div>

            <div class="space-y-1 border-b pb-2">
              <h4 class="text-sm font-medium text-muted-foreground">Adresse</h4>
              <dl class="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                <dt class="text-sm font-medium">Pays</dt>
                <dd class="text-sm">
                  {{ getCountryName(enterpriseData.country) || 'Non spécifié' }}
                </dd>

                <dt class="text-sm font-medium">Ville</dt>
                <dd class="text-sm">{{ enterpriseData.city || 'Non spécifié' }}</dd>

                <dt class="text-sm font-medium">Code postal</dt>
                <dd class="text-sm">{{ enterpriseData.postal_code || 'Non spécifié' }}</dd>

                <dt class="text-sm font-medium">Adresse</dt>
                <dd class="text-sm">{{ enterpriseData.address || 'Non spécifié' }}</dd>

                <dt class="text-sm font-medium">Devise</dt>
                <dd class="text-sm">
                  {{ getCurrencyName(enterpriseData.currency) || 'Non spécifié' }}
                </dd>
              </dl>
            </div>
          </div>

          <!-- Colonne 2 -->
          <div class="space-y-4">
            <div class="space-y-1 border-b pb-2">
              <h4 class="text-sm font-medium text-muted-foreground">Contact</h4>
              <dl class="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                <dt class="text-sm font-medium">Téléphone fixe</dt>
                <dd class="text-sm">{{ enterpriseData.phone || 'Non spécifié' }}</dd>

                <dt class="text-sm font-medium">Mobile</dt>
                <dd class="text-sm">{{ enterpriseData.mobile_phone || 'Non spécifié' }}</dd>

                <dt class="text-sm font-medium">Email</dt>
                <dd class="text-sm">{{ enterpriseData.email || 'Non spécifié' }}</dd>

                <dt class="text-sm font-medium">Site web</dt>
                <dd class="text-sm">{{ enterpriseData.website || 'Non spécifié' }}</dd>
              </dl>
            </div>

            <div v-if="enterpriseData.description" class="space-y-1">
              <h4 class="text-sm font-medium text-muted-foreground">Description</h4>
              <p class="text-sm">{{ enterpriseData.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation entre les étapes -->
      <div class="flex justify-between w-full mt-8">
        <UiButton type="button" @click="$emit('cancel')" variant="outline" size="lg">
          Annuler
        </UiButton>

        <div class="flex space-x-2">
          <UiButton
            type="button"
            @click="prevStep"
            variant="outline"
            size="lg"
            v-if="currentStep > 0"
          >
            <ChevronLeftIcon class="h-4 w-4 mr-2" />
            Précédent
          </UiButton>

          <UiButton
            type="button"
            @click="validateStep"
            :disabled="isSubmitting"
            variant="default"
            size="lg"
            v-if="currentStep < steps.length - 1"
          >
            Suivant
            <ChevronRightIcon class="h-4 w-4 ml-2" />
          </UiButton>

          <UiButton
            type="button"
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="bg-green-600 hover:bg-green-700 text-white"
            size="lg"
            v-else
          >
            <span v-if="isSubmitting" class="mr-2">
              <UiSpinner class="h-4 w-4" />
            </span>
            <CheckIcon class="h-4 w-4 mr-2" v-else />
            Créer l'entreprise
          </UiButton>
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
// import { useRouter } from 'vue-router'
import { useSonner } from '@/plugins/sonner'

// UI Components
import { Button as UiButton } from '@/components/ui/button'
import { Input as UiInput } from '@/components/ui/input'
import { Label as UiLabel } from '@/components/ui/label'
import { Textarea as UiTextarea } from '@/components/ui/textarea'
import {
  Select as UiSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { default as UiSpinner } from '@/components/utils/Spinner.vue'

// Icons
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Check as CheckIcon,
} from 'lucide-vue-next'

// Data and form validation
import { EnterpriseFormBuilder } from '@/formBuilder/enterprise/EnterpriseFormBuilder'
import { EnterpriseService } from '@/services/enterprise/enterpriseService'
import { AGENCY_TYPES } from '@/interfaces/agencyTypes'
import { formatAsYouType } from '@/lib/phone'
import { countries } from '@/lib/countries'
import { supabase } from '@/services/config/supabaseClient'
import { countryCodeToFlag } from '@/lib/codeToFlags'
import { currencies as currencyList } from '@/lib/currency'

export default {
  name: 'EnterpriseForm',
  components: {
    UiButton,
    UiInput,
    UiLabel,
    UiTextarea,
    UiSpinner,
    UiSelect,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    ChevronLeftIcon,
    ChevronRightIcon,
    CheckIcon,
  },
  data() {
    return {
      countryCodeToFlag: countryCodeToFlag,
      currencies: currencyList,
    }
  },
  emits: ['created', 'cancel'],
  setup(props, { emit }) {
    // const router = useRouter()
    const { toastSuccess, toastError } = useSonner()
    const toast = {
      success: toastSuccess,
      error: toastError,
    }

    // État du stepper
    const currentStep = ref(0)
    const steps = [
      { name: 'Informations générales', fields: ['name', 'code', 'type', 'description'] },
      { name: 'Localisation', fields: ['country', 'city', 'address', 'postal_code'] },
      { name: 'Contact', fields: ['phone', 'mobile_phone', 'email', 'website'] },
      { name: 'Vérification', fields: [] },
    ]

    // État du formulaire
    const isSubmitting = ref(false)
    const agencyTypes = ref(AGENCY_TYPES)

    // Liste des types d'activité
    const activityTypes = ref([
      { value: 'transport_personnes', label: 'Transport de personnes' },
      { value: 'transport_marchandises', label: 'Transport de marchandises' },
      { value: 'location_vehicules', label: 'Location de véhicules' },
      { value: 'logistique', label: 'Logistique' },
      { value: 'autre', label: 'Autre' },
    ])

    // Villes par pays
    const citiesByCountry = ref([])

    // Données du formulaire
    const enterpriseData = reactive({
      name: '',
      code: '',
      type: '',
      nui: '',
      activityType: '',
      country: '',
      city: '',
      address: '',
      postal_code: '',
      currency: '',
      phone: null,
      mobile_phone: null,
      email: '',
      website: null,
      description: '',
    })

    // État de la validation
    const formErrors = reactive({
      errorName: false,
      errorNameMessage: '',
      errorCode: false,
      errorCodeMessage: '',
      errorType: false,
      errorTypeMessage: '',
      errorNui: false,
      errorNuiMessage: '',
      errorActivityType: false,
      errorActivityTypeMessage: '',
      errorCountry: false,
      errorCountryMessage: '',
      errorCity: false,
      errorCityMessage: '',
      errorAddress: false,
      errorAddressMessage: '',
      errorPostalCode: false,
      errorPostalCodeMessage: '',
      errorCurrency: false,
      errorCurrencyMessage: '',
      errorPhone: false,
      errorPhoneMessage: '',
      errorMobilePhone: false,
      errorMobilePhoneMessage: '',
      errorEmail: false,
      errorEmailMessage: '',
      errorWebsite: false,
      errorWebsiteMessage: '',
      errorDescription: false,
      errorDescriptionMessage: '',
    })

    const user = ref(null)

    onMounted(async () => {
      // Récupérer l'utilisateur courant
      const { data } = await supabase.auth.getUser()
      user.value = data.user
    })

    // Navigation entre les étapes
    const nextStep = () => {
      if (currentStep.value < steps.length - 1) {
        currentStep.value++
      }
    }

    const prevStep = () => {
      if (currentStep.value > 0) {
        currentStep.value--
      }
    }

    const goToStep = (step) => {
      currentStep.value = step
    }

    // Génération automatique du code de l'entreprise
    const generateEnterpriseCode = (name) => {
      if (!name) return ''
      // Extrait les 3 premières lettres du nom de l'entreprise (ou moins si le nom est plus court)
      const prefix = name
        .replace(/[^a-zA-Z]/g, '')
        .substring(0, 3)
        .toUpperCase()
      // Génère un nombre aléatoire à 4 chiffres
      const suffix = Math.floor(1000 + Math.random() * 9000)
      return `${prefix}${suffix}`
    }

    // Surveille les changements du nom de l'entreprise pour générer le code
    watch(
      () => enterpriseData.name,
      (newName) => {
        if (newName) {
          enterpriseData.code = generateEnterpriseCode(newName)
        }
      },
    )

    // Charge les villes en fonction du pays sélectionné
    const onCountryChange = async (countryCode) => {
      if (!countryCode) return

      // Réinitialiser la ville
      enterpriseData.city = ''

      // Simuler l'appel à une API de villes (à remplacer par un vrai service)
      // Pour l'exemple, on utilise des villes prédéfinies
      const citiesData = {
        CG: ['Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Ouesso'],
        CD: ['Kinshasa', 'Lubumbashi', 'Goma', 'Bukavu', 'Kisangani'],
        AO: ['Luanda', 'Huambo', 'Lobito', 'Benguela', 'Namibe'],
        FR: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
        US: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
      }

      // Sélectionner la devise par défaut pour le pays
      const currencyMapping = {
        CG: 'XAF',
        CD: 'CDF',
        AO: 'AOA',
        FR: 'EUR',
        US: 'USD',
      }

      if (currencyMapping[countryCode]) {
        enterpriseData.currency = currencyMapping[countryCode]
      }

      citiesByCountry.value = citiesData[countryCode] || []
    }

    // Validation de l'étape actuelle
    const validateStep = () => {
      // Créer une instance du formulaire pour la validation
      const enterpriseForm = new EnterpriseFormBuilder()
        .setName(enterpriseData.name)
        .setLegalStatus(enterpriseData.type)
        .setActivityType(enterpriseData.activityType)
        .setNiuNumber(enterpriseData.nui)
        .setCountry(enterpriseData.country)
        .setCity(enterpriseData.city)
        .setAddress(enterpriseData.address)
        .setPhone(enterpriseData.phone)
        .setEmail(enterpriseData.email)
        .setWebsite(enterpriseData.website)
        .setDescription(enterpriseData.description)
        .setCreatedBy(user.value?.id || '')

      // Valider et récupérer toutes les erreurs
      enterpriseForm.validate() // D'abord valider
      const validationErrors = enterpriseForm.buildEnterpriseForm() // Puis récupérer les erreurs
      Object.assign(formErrors, validationErrors)

      // Vérifier les champs de l'étape actuelle
      const currentFields = steps[currentStep.value].fields
      const hasErrors = currentFields.some((field) => {
        const errorKey = 'error' + field.charAt(0).toUpperCase() + field.slice(1)
        return formErrors[errorKey] === true
      })

      // Vérifier les champs obligatoires de l'étape
      if (currentStep.value === 0 && !enterpriseData.name) {
        formErrors.errorName = true
        formErrors.errorNameMessage = "Le nom de l'entreprise est obligatoire"
        toast.error('Veuillez compléter les champs obligatoires')
        return
      }

      if (currentStep.value === 1 && !enterpriseData.country) {
        formErrors.errorCountry = true
        formErrors.errorCountryMessage = 'Le pays est obligatoire'
        toast.error('Veuillez compléter les champs obligatoires')
        return
      }

      if (hasErrors) {
        toast.error('Veuillez corriger les erreurs avant de continuer')
        return
      }

      // Si tout est valide, passer à l'étape suivante
      nextStep()
    }

    // Récupérer le nom du pays à partir du code
    const getCountryName = (code) => {
      if (!code) return null
      const country = countries.find((c) => c.code === code)
      return country ? country.name : null
    }

    // Récupérer le libellé du type d'agence
    const getTypeLabel = (typeValue) => {
      if (!typeValue) return null
      const type = AGENCY_TYPES.find((t) => t.value === typeValue)
      return type ? type.label : null
    }

    // Récupérer le libellé du type d'activité
    const getActivityTypeLabel = (typeValue) => {
      if (!typeValue) return null
      const type = activityTypes.value.find((t) => t.value === typeValue)
      return type ? type.label : null
    }

    // Récupérer le nom de la devise à partir du code
    const getCurrencyName = (code) => {
      if (!code) return null
      const currency = currencyList.find((c) => c.code === code)
      return currency ? `${currency.name} (${currency.symbol})` : null
    }

    // Formater les numéros de téléphone pendant la saisie
    const updatePhone = (type) => {
      if (type === 'fixed' && enterpriseData.phone) {
        enterpriseData.phone = formatAsYouType(enterpriseData.phone)
      } else if (type === 'mobile' && enterpriseData.mobile_phone) {
        enterpriseData.mobile_phone = formatAsYouType(enterpriseData.mobile_phone)
      }
    }

    // Gérer la soumission du formulaire
    const handleSubmit = async () => {
      if (!user.value) {
        toast.error('Vous devez être connecté pour créer une entreprise')
        return
      }

      isSubmitting.value = true

      try {
        // Utiliser le formBuilder pour valider les données
        const enterpriseForm = new EnterpriseFormBuilder()
          .setName(enterpriseData.name)
          .setLegalStatus(enterpriseData.type)
          .setActivityType(enterpriseData.activityType)
          .setNiuNumber(enterpriseData.nui)
          .setCountry(enterpriseData.country)
          .setCity(enterpriseData.city)
          .setAddress(enterpriseData.address)
          .setPhone(enterpriseData.phone)
          .setEmail(enterpriseData.email)
          .setWebsite(enterpriseData.website)
          .setDescription(enterpriseData.description)
          .setCreatedBy(user.value?.id || '')

        // Valider et récupérer les erreurs
        enterpriseForm.validate() // D'abord valider
        const validationErrors = enterpriseForm.buildEnterpriseForm() // Puis récupérer les erreurs
        Object.assign(formErrors, validationErrors)

        // Vérifier si le formulaire est valide
        if (!enterpriseForm.validate()) {
          toast.error('Veuillez corriger les erreurs dans le formulaire')
          isSubmitting.value = false
          return
        }

        // Créer l'entreprise via le service
        const validatedEnterpriseData = enterpriseForm.getEnterpriseData()
        const response = await EnterpriseService.createEnterprise(validatedEnterpriseData)

        if (!response) {
          throw new Error('Aucune réponse reçue du serveur')
        }

        if (response.error) {
          throw new Error(
            response.error.message ||
              "Une erreur s'est produite lors de la création de l'entreprise",
          )
        }

        if (response.success && response.data) {
          toast.success('Entreprise créée avec succès!')

          // Émission de l'événement avec les données de l'agence
          emit('created', response.data)
        } else {
          throw new Error("Échec de la création de l'entreprise")
        }
      } catch (error) {
        console.error("Erreur lors de la création de l'entreprise:", error)
        toast.error(
          error.message || "Une erreur s'est produite lors de la création de l'entreprise",
        )
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      enterpriseData,
      formErrors,
      isSubmitting,
      agencyTypes,
      activityTypes,
      countries,
      citiesByCountry,
      currentStep,
      steps,
      handleSubmit,
      updatePhone,
      nextStep,
      prevStep,
      goToStep,
      validateStep,
      onCountryChange,
      getCountryName,
      getTypeLabel,
      getActivityTypeLabel,
      getCurrencyName,
      generateEnterpriseCode,
    }
  },
}
</script>
