<template>
  <div>
    <div class="grid gap-4 w-full">
      <div class="mb-6 w-full">
        <form @submit.prevent="handleSubmit" class="w-full max-w-full">
          <div class="grid gap-3">
            <div class="flex flex-wrap items-center justify-between mb-3 gap-2">
              <h2 class="text-lg sm:text-xl font-semibold mb-1">Créer une nouvelle agence</h2>
            </div>

            <!-- Nom de l'agence -->
            <div class="grid gap-1">
              <UiLabel for="name" class="mb-1 block">Nom de l'agence *</UiLabel>
              <UiInput
                id="name"
                placeholder="Nom de votre agence"
                type="text"
                v-model="agencyData.name"
                :class="{ 'border-red-500': formErrors.errorName }"
              >
              </UiInput>
              <span v-if="formErrors.errorName" class="text-xs text-red-500">
                {{ formErrors.errorNameMessage }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Code de l'agence -->
              <div class="grid gap-1">
                <UiLabel for="code" class="mb-1 block">Code de l'agence</UiLabel>
                <UiInput
                  id="code"
                  placeholder="CODE123"
                  type="text"
                  v-model="agencyData.code"
                  :class="{ 'border-red-500': formErrors.errorCode }"
                />
                <span v-if="formErrors.errorCode" class="text-xs text-red-500">
                  {{ formErrors.errorCodeMessage }}
                </span>
              </div>

              <!-- Type d'agence -->
              <div class="grid gap-1">
                <UiLabel for="type" class="mb-1 block">Type d'agence</UiLabel>
                <Select v-model="agencyData.type">
                  <SelectTrigger
                    id="type"
                    class="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:border-primary transition-colors duration-150"
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
                </Select>
                <span v-if="formErrors.errorType" class="text-xs text-red-500">
                  {{ formErrors.errorTypeMessage }}
                </span>
              </div>
            </div>

            <!-- Pays -->
            <div class="grid gap-1 mt-2 w-full">
              <UiLabel for="country" class="mb-1 block">Pays *</UiLabel>
              <Select v-model="agencyData.country">
                <SelectTrigger
                  id="country"
                  class="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:border-primary transition-colors duration-150"
                  :class="{ 'border-red-500': formErrors.errorCountry }"
                >
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
              <span v-if="formErrors.errorCountry" class="text-xs text-red-500">
                {{ formErrors.errorCountryMessage }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Ville -->
              <div class="grid gap-1">
                <UiLabel for="city" class="mb-1 block">Ville</UiLabel>
                <UiInput
                  id="city"
                  placeholder="Ville de l'agence"
                  type="text"
                  v-model="agencyData.city"
                  :class="{ 'border-red-500': formErrors.errorCity }"
                />
                <span v-if="formErrors.errorCity" class="text-xs text-red-500">
                  {{ formErrors.errorCityMessage }}
                </span>
              </div>

              <!-- Code postal -->
              <div class="grid gap-1">
                <UiLabel for="postal_code" class="mb-1 block">Code postal</UiLabel>
                <UiInput
                  id="postal_code"
                  placeholder="Code postal"
                  type="text"
                  v-model="agencyData.postal_code"
                  :class="{ 'border-red-500': formErrors.errorPostalCode }"
                />
                <span v-if="formErrors.errorPostalCode" class="text-xs text-red-500">
                  {{ formErrors.errorPostalCodeMessage }}
                </span>
              </div>
            </div>

            <!-- Adresse -->
            <div class="grid gap-1 mt-2 w-full">
              <UiLabel for="address" class="mb-1 block">Adresse</UiLabel>
              <UiInput
                id="address"
                placeholder="Adresse complète"
                type="text"
                v-model="agencyData.address"
                :class="{ 'border-red-500': formErrors.errorAddress }"
                class="w-full"
              />
              <span v-if="formErrors.errorAddress" class="text-xs text-red-500">
                {{ formErrors.errorAddressMessage }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Numéro de téléphone -->
              <div class="grid gap-1">
                <UiLabel for="phone" class="mb-1 block">Téléphone fixe</UiLabel>
                <UiInput
                  id="phone"
                  placeholder="Ex: (+242 06 123 45 67)"
                  type="tel"
                  v-model="agencyData.phone"
                  @input="updatePhone('fixed')"
                  :class="{ 'border-red-500': formErrors.errorPhone }"
                />
                <span v-if="formErrors.errorPhone" class="text-xs text-red-500">
                  {{ formErrors.errorPhoneMessage }}
                </span>
              </div>

              <!-- Numéro de téléphone mobile -->
              <div class="grid gap-1">
                <UiLabel for="mobile_phone" class="mb-1 block">Téléphone mobile</UiLabel>
                <UiInput
                  id="mobile_phone"
                  placeholder="Ex: (+242 06 123 45 67)"
                  type="tel"
                  v-model="agencyData.mobile_phone"
                  @input="updatePhone('mobile')"
                  :class="{ 'border-red-500': formErrors.errorMobilePhone }"
                />
                <span v-if="formErrors.errorMobilePhone" class="text-xs text-red-500">
                  {{ formErrors.errorMobilePhoneMessage }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Email -->
              <div class="grid gap-1">
                <UiLabel for="email" class="mb-1 block">Email</UiLabel>
                <UiInput
                  id="email"
                  placeholder="agence@example.com"
                  type="email"
                  v-model="agencyData.email"
                  :class="{ 'border-red-500': formErrors.errorEmail }"
                />
                <span v-if="formErrors.errorEmail" class="text-xs text-red-500">
                  {{ formErrors.errorEmailMessage }}
                </span>
              </div>

              <!-- Site web -->
              <div class="grid gap-1">
                <UiLabel for="website" class="mb-1 block">Site web</UiLabel>
                <UiInput
                  id="website"
                  placeholder="https://www.example.com"
                  type="url"
                  v-model="agencyData.website"
                  :class="{ 'border-red-500': formErrors.errorWebsite }"
                />
                <span v-if="formErrors.errorWebsite" class="text-xs text-red-500">
                  {{ formErrors.errorWebsiteMessage }}
                </span>
              </div>
            </div>

            <!-- Description -->
            <div class="grid gap-1 mt-2 w-full">
              <UiLabel for="description" class="mb-1 block">Description</UiLabel>
              <UiTextarea
                id="description"
                placeholder="Décrivez votre agence en quelques mots..."
                v-model="agencyData.description"
                :class="{ 'border-red-500': formErrors.errorDescription }"
                class="w-full min-h-[100px]"
              />
              <span v-if="formErrors.errorDescription" class="text-xs text-red-500">
                {{ formErrors.errorDescriptionMessage }}
              </span>
            </div>

            <!-- Boutons d'action -->
            <div class="flex justify-between mt-6">
              <UiButton type="button" variant="outline" @click="$emit('cancel')">
                Annuler
              </UiButton>
              <UiButton type="submit" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="mr-2">
                  <UiSpinner class="h-4 w-4" />
                </span>
                Créer l'agence
              </UiButton>
            </div>
          </div>
        </form>
      </div>
    </div>
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
  },
  emits: ['created', 'cancel'],
  setup(props, { emit }) {
    const router = useRouter()
    const { toast } = useSonner()

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
      handleSubmit,
      updatePhone,
    }
  },
}
</script>
