<template>
  <div class="max-w-5xl mx-auto">
    <!-- En-tête -->
    <div class="flex flex-col items-center text-center mb-10 max-w-lg mx-auto">
      <div class="w-12 h-12 mb-4 flex items-center justify-center rounded-lg bg-primary/10">
        <BuildingIcon class="h-6 w-6 text-primary" />
      </div>
      <h1 class="text-3xl font-bold tracking-tight">Créer une nouvelle agence</h1>
      <p class="text-muted-foreground mt-2">
        Créez votre agence en quelques étapes simples pour commencer à gérer votre flotte.
      </p>
    </div>

    <!-- Stepper principal -->
    <div class="mb-10">
      <nav aria-label="Progress" class="flex justify-between">
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

    <form @submit.prevent="validateCurrentStep" class="mx-auto">
      <!-- Transition entre les étapes -->
      <div class="relative">
        <!-- Étape 1: Informations de base -->
        <div v-show="currentStep === 0" class="space-y-6 rounded-lg p-6 bg-card border shadow-sm">
          <div class="space-y-1.5 mb-4">
            <h3 class="text-xl font-semibold tracking-tight">Informations générales</h3>
            <p class="text-sm text-muted-foreground">
              Commençons par les informations essentielles de votre agence.
            </p>
          </div>

          <!-- Nom de l'agence -->
          <div class="grid gap-1.5">
            <UiLabel for="name" required>Nom de l'agence</UiLabel>
            <UiInput
              id="name"
              placeholder="Ex: Taxi Express Brazzaville"
              type="text"
              v-model="agencyData.name"
              :class="{ 'border-red-500 ring-red-500': formErrors.errorName }"
              autofocus
            />
            <p v-if="formErrors.errorName" class="text-xs text-red-500">
              {{ formErrors.errorNameMessage }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Code de l'agence -->
            <div class="grid gap-1.5">
              <UiLabel for="code">Code de l'agence</UiLabel>
              <UiInput
                id="code"
                placeholder="Ex: TXEXPRESS"
                type="text"
                v-model="agencyData.code"
                :class="{ 'border-red-500': formErrors.errorCode }"
              />
              <p v-if="formErrors.errorCode" class="text-xs text-red-500">
                {{ formErrors.errorCodeMessage }}
              </p>
            </div>

            <!-- Type d'agence -->
            <div class="grid gap-1.5">
              <UiLabel for="type">Type d'agence</UiLabel>
              <Select v-model="agencyData.type">
                <SelectTrigger id="type" :class="{ 'border-red-500': formErrors.errorType }">
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="type in agencyTypes" :key="type.value" :value="type.value">
                      {{ type.label }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p v-if="formErrors.errorType" class="text-xs text-red-500">
                {{ formErrors.errorTypeMessage }}
              </p>
            </div>
          </div>

          <!-- Description -->
          <div class="grid gap-1.5">
            <UiLabel for="description">Description</UiLabel>
            <UiTextarea
              id="description"
              placeholder="Décrivez votre agence en quelques mots..."
              v-model="agencyData.description"
              :class="{ 'border-red-500': formErrors.errorDescription }"
              class="min-h-[100px]"
            />
            <p v-if="formErrors.errorDescription" class="text-xs text-red-500">
              {{ formErrors.errorDescriptionMessage }}
            </p>
          </div>
        </div>

        <!-- Étape 2: Localisation -->
        <div v-show="currentStep === 1" class="space-y-6 rounded-lg p-6 bg-card border shadow-sm">
          <div class="space-y-1.5 mb-4">
            <h3 class="text-xl font-semibold tracking-tight">Localisation</h3>
            <p class="text-sm text-muted-foreground">
              Où se situe votre agence? Ces informations apparaîtront sur vos documents.
            </p>
          </div>

          <!-- Pays -->
          <div class="grid gap-1.5">
            <UiLabel for="country" required>Pays</UiLabel>
            <Select v-model="agencyData.country">
              <SelectTrigger id="country" :class="{ 'border-red-500': formErrors.errorCountry }">
                <SelectValue placeholder="Sélectionnez un pays" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="country in countries"
                    :key="country.code"
                    :value="country.code"
                  >
                    {{ country.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p v-if="formErrors.errorCountry" class="text-xs text-red-500">
              {{ formErrors.errorCountryMessage }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Ville -->
            <div class="grid gap-1.5">
              <UiLabel for="city">Ville</UiLabel>
              <UiInput
                id="city"
                placeholder="Ville de l'agence"
                type="text"
                v-model="agencyData.city"
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
                v-model="agencyData.postal_code"
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
              v-model="agencyData.address"
              :class="{ 'border-red-500': formErrors.errorAddress }"
            />
            <p v-if="formErrors.errorAddress" class="text-xs text-red-500">
              {{ formErrors.errorAddressMessage }}
            </p>
          </div>
        </div>

        <!-- Étape 3: Contact -->
        <div v-show="currentStep === 2" class="space-y-6 rounded-lg p-6 bg-card border shadow-sm">
          <div class="space-y-1.5 mb-4">
            <h3 class="text-xl font-semibold tracking-tight">Informations de contact</h3>
            <p class="text-sm text-muted-foreground">
              Comment vos clients peuvent-ils vous contacter?
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Numéro de téléphone fixe -->
            <div class="grid gap-1.5">
              <UiLabel for="phone">Téléphone fixe</UiLabel>
              <UiInput
                id="phone"
                placeholder="Ex: (+242 06 123 45 67)"
                type="tel"
                v-model="agencyData.phone"
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
                v-model="agencyData.mobile_phone"
                @input="updatePhone('mobile')"
                :class="{ 'border-red-500': formErrors.errorMobilePhone }"
              />
              <p v-if="formErrors.errorMobilePhone" class="text-xs text-red-500">
                {{ formErrors.errorMobilePhoneMessage }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Email -->
            <div class="grid gap-1.5">
              <UiLabel for="email">Email</UiLabel>
              <UiInput
                id="email"
                placeholder="agence@example.com"
                type="email"
                v-model="agencyData.email"
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
                v-model="agencyData.website"
                :class="{ 'border-red-500': formErrors.errorWebsite }"
              />
              <p v-if="formErrors.errorWebsite" class="text-xs text-red-500">
                {{ formErrors.errorWebsiteMessage }}
              </p>
            </div>
          </div>
        </div>

        <!-- Résumé final -->
        <div v-show="currentStep === 3" class="space-y-6 rounded-lg p-6 bg-card border shadow-sm">
          <div class="space-y-1.5 mb-6">
            <h3 class="text-xl font-semibold tracking-tight">Vérifiez et confirmez</h3>
            <p class="text-sm text-muted-foreground">
              Voici un résumé des informations de votre agence. Vous pourrez les modifier
              ultérieurement.
            </p>
          </div>

          <div class="grid gap-6 md:grid-cols-2">
            <!-- Colonne 1 -->
            <div class="space-y-4">
              <div class="space-y-1">
                <h4 class="text-sm font-medium text-muted-foreground">Informations générales</h4>
                <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                  <p class="text-sm font-medium">Nom de l'agence</p>
                  <p class="text-sm">{{ agencyData.name || 'Non spécifié' }}</p>

                  <p class="text-sm font-medium">Code</p>
                  <p class="text-sm">{{ agencyData.code || 'Non spécifié' }}</p>

                  <p class="text-sm font-medium">Type</p>
                  <p class="text-sm">{{ getTypeLabel(agencyData.type) || 'Non spécifié' }}</p>
                </div>
              </div>

              <div class="space-y-1">
                <h4 class="text-sm font-medium text-muted-foreground">Adresse</h4>
                <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                  <p class="text-sm font-medium">Pays</p>
                  <p class="text-sm">{{ getCountryName(agencyData.country) || 'Non spécifié' }}</p>

                  <p class="text-sm font-medium">Ville</p>
                  <p class="text-sm">{{ agencyData.city || 'Non spécifié' }}</p>

                  <p class="text-sm font-medium">Code postal</p>
                  <p class="text-sm">{{ agencyData.postal_code || 'Non spécifié' }}</p>

                  <p class="text-sm font-medium">Adresse</p>
                  <p class="text-sm">{{ agencyData.address || 'Non spécifié' }}</p>
                </div>
              </div>
            </div>

            <!-- Colonne 2 -->
            <div class="space-y-4">
              <div class="space-y-1">
                <h4 class="text-sm font-medium text-muted-foreground">Contact</h4>
                <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                  <p class="text-sm font-medium">Téléphone fixe</p>
                  <p class="text-sm">{{ agencyData.phone || 'Non spécifié' }}</p>

                  <p class="text-sm font-medium">Mobile</p>
                  <p class="text-sm">{{ agencyData.mobile_phone || 'Non spécifié' }}</p>

                  <p class="text-sm font-medium">Email</p>
                  <p class="text-sm">{{ agencyData.email || 'Non spécifié' }}</p>

                  <p class="text-sm font-medium">Site web</p>
                  <p class="text-sm">{{ agencyData.website || 'Non spécifié' }}</p>
                </div>
              </div>

              <div class="space-y-1" v-if="agencyData.description">
                <h4 class="text-sm font-medium text-muted-foreground">Description</h4>
                <p class="text-sm">{{ agencyData.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation entre les étapes -->
      <div class="flex justify-between mt-8">
        <UiButton type="button" variant="outline" @click="prevStep" v-if="currentStep > 0">
          <ChevronLeftIcon class="h-4 w-4 mr-2" />
          Précédent
        </UiButton>
        <div v-else></div>

        <div>
          <UiButton type="button" @click="$emit('cancel')" variant="ghost" class="mr-2">
            Annuler
          </UiButton>

          <UiButton type="submit" :disabled="isSubmitting" v-if="currentStep < steps.length - 1">
            Suivant
            <ChevronRightIcon class="h-4 w-4 ml-2" />
          </UiButton>

          <UiButton
            type="button"
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="bg-green-600 hover:bg-green-700 text-white"
            v-else
          >
            <span v-if="isSubmitting" class="mr-2">
              <UiSpinner class="h-4 w-4" />
            </span>
            <CheckIcon class="h-4 w-4 mr-2" v-else />
            Créer l'agence
          </UiButton>
        </div>
      </div>

      <!-- Indicateur de progression -->
      <div class="mt-6 flex justify-center">
        <div class="flex gap-2">
          <button
            v-for="(step, index) in steps"
            :key="index"
            type="button"
            @click="goToStep(index)"
            class="h-2 rounded-full transition-all duration-300 focus:outline-none"
            :class="[index === currentStep ? 'w-8 bg-primary' : 'w-2 bg-primary/30']"
            :aria-current="index === currentStep ? 'step' : undefined"
          >
            <span class="sr-only">Étape {{ index + 1 }}</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSonner } from '@/plugins/sonner'

// UI Components
import { Button as UiButton } from '@/components/ui/button'
import { Input as UiInput } from '@/components/ui/input'
import { Label as UiLabel } from '@/components/ui/label'
import { Textarea as UiTextarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { default as UiSpinner } from '@/components/utils/Spinner.vue'

// Icons
import {
  Building as BuildingIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Check as CheckIcon,
} from 'lucide-vue-next'

// Data and form validation
import { AgencyForm } from '@/formBuilder/agencies/agencyForm'
import { AgencyService } from '@/services/agencies/agencyService'
import { AGENCY_TYPES } from '@/interfaces/agencyInterface'
import { formatPhoneNumber, formatAsYouType } from '@/lib/phone'
import { countries } from '@/lib/countries'
import { supabase } from '@/services/config/supabaseClient'

export default {
  name: 'CreateAgencyForm',
  components: {
    UiButton,
    UiInput,
    UiLabel,
    UiTextarea,
    UiSpinner,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    BuildingIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CheckIcon,
  },
  emits: ['created', 'cancel'],
  setup(props, { emit }) {
    const router = useRouter()
    const { toast } = useSonner()

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

    // Données du formulaire
    const agencyData = reactive({
      name: '',
      code: '',
      type: '',
      country: '',
      city: '',
      address: '',
      postal_code: '',
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
      errorCountry: false,
      errorCountryMessage: '',
      errorCity: false,
      errorCityMessage: '',
      errorAddress: false,
      errorAddressMessage: '',
      errorPostalCode: false,
      errorPostalCodeMessage: '',
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

    // Validation de l'étape actuelle
    const validateCurrentStep = () => {
      // Créer une instance du formulaire pour la validation
      const agencyForm = new AgencyForm(user.value?.id || '')
        .setName(agencyData.name)
        .setCode(agencyData.code)
        .setType(agencyData.type)
        .setCountry(agencyData.country)
        .setCity(agencyData.city)
        .setAddress(agencyData.address)
        .setPostalCode(agencyData.postal_code)
        .setPhone(agencyData.phone)
        .setMobilePhone(agencyData.mobile_phone)
        .setEmail(agencyData.email)
        .setWebsite(agencyData.website)
        .setDescription(agencyData.description)

      // Récupérer toutes les erreurs
      const validationErrors = agencyForm.builderAgencyForm()
      Object.assign(formErrors, validationErrors)

      // Vérifier les champs de l'étape actuelle
      const currentFields = steps[currentStep.value].fields
      const hasErrors = currentFields.some((field) => {
        const errorKey = 'error' + field.charAt(0).toUpperCase() + field.slice(1)
        return formErrors[errorKey] === true
      })

      // Vérifier les champs obligatoires de l'étape
      if (currentStep.value === 0 && !agencyData.name) {
        formErrors.errorName = true
        formErrors.errorNameMessage = "Le nom de l'agence est obligatoire"
        toast.error('Veuillez compléter les champs obligatoires')
        return
      }

      if (currentStep.value === 1 && !agencyData.country) {
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
      if (currentStep.value < steps.length - 1) {
        nextStep()
      }
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

    // Formater les numéros de téléphone pendant la saisie
    const updatePhone = (type) => {
      if (type === 'fixed' && agencyData.phone) {
        agencyData.phone = formatAsYouType(agencyData.phone)
      } else if (type === 'mobile' && agencyData.mobile_phone) {
        agencyData.mobile_phone = formatAsYouType(agencyData.mobile_phone)
      }
    }

    // Gérer la soumission du formulaire
    const handleSubmit = async () => {
      if (!user.value) {
        toast.error('Vous devez être connecté pour créer une agence')
        return
      }

      isSubmitting.value = true

      try {
        // Utiliser le formBuilder pour valider les données
        const agencyForm = new AgencyForm(user.value.id)
          .setName(agencyData.name)
          .setCode(agencyData.code)
          .setType(agencyData.type)
          .setCountry(agencyData.country)
          .setCity(agencyData.city)
          .setAddress(agencyData.address)
          .setPostalCode(agencyData.postal_code)
          .setPhone(agencyData.phone)
          .setMobilePhone(agencyData.mobile_phone)
          .setEmail(agencyData.email)
          .setWebsite(agencyData.website)
          .setDescription(agencyData.description)

        // Récupérer les erreurs
        const validationErrors = agencyForm.builderAgencyForm()
        Object.assign(formErrors, validationErrors)

        // Vérifier si le formulaire est valide
        if (!agencyForm.isValid()) {
          toast.error('Veuillez corriger les erreurs dans le formulaire')
          isSubmitting.value = false
          return
        }

        // Créer l'agence via le service
        const validatedAgencyData = agencyForm.getAgencyData()
        const response = await AgencyService.createAgency(validatedAgencyData)

        if (response.error) {
          throw new Error(
            response.error.message || "Une erreur s'est produite lors de la création de l'agence",
          )
        }

        if (response.success && response.data) {
          toast.success('Agence créée avec succès!')

          // Stockage de l'ID de l'agence dans le localStorage
          localStorage.setItem('current_agency_id', response.data.id)
          localStorage.setItem('current_agency_name', response.data.name)

          emit('created', response.data)

          // Rediriger vers le dashboard avec l'ID de l'agence
          router.push(`/agency/${response.data.id}`)
        } else {
          throw new Error("Échec de la création de l'agence")
        }
      } catch (error) {
        console.error("Erreur lors de la création de l'agence:", error)
        toast.error(error.message || "Une erreur s'est produite lors de la création de l'agence")
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      agencyData,
      formErrors,
      isSubmitting,
      agencyTypes,
      countries,
      currentStep,
      steps,
      handleSubmit,
      updatePhone,
      nextStep,
      prevStep,
      goToStep,
      validateCurrentStep,
      getCountryName,
      getTypeLabel,
    }
  },
}
</script>
