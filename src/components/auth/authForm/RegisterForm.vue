<template>
  <div>
    <div class="grid gap-6">
      <div class="mb-8">
        <form @submit.prevent="handleStepAction">
          <!-- Étape 1: Informations personnelles -->
          <div v-if="currentStep === 0" class="grid gap-2">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold mr-3 mb-2 w-max">Informations personnelles</h2>
              <UiSteps :current-step="currentStep" :steps="steps" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Nom -->
              <div class="grid gap-1">
                <UiLabel for="last_name" class="mb-1 block">Nom</UiLabel>
                <UiInput id="last_name" placeholder="Nom" type="text" v-model="formModel.last_name"
                  :class="{ 'border-red-500': formErrors.errorLastName }">
                </UiInput>
                <span v-if="formErrors.errorLastName" class="text-xs text-red-500">
                  {{ formErrors.errorLastNameMessage }}
                </span>
              </div>

              <!-- Prénom -->
              <div class="grid gap-1">
                <UiLabel for="first_name" class="mb-1 block">Prénom</UiLabel>
                <UiInput id="first_name" placeholder="Prénom" type="text" v-model="formModel.first_name"
                  :class="{ 'border-red-500': formErrors.errorFirstName }" />
                <span v-if="formErrors.errorFirstName" class="text-xs text-red-500">
                  {{ formErrors.errorFirstNameMessage }}
                </span>
              </div>
            </div>

            <!-- Email -->
            <div class="grid gap-1 mt-2">
              <UiLabel for="email" class="mb-1 block">Email</UiLabel>
              <UiInput id="email" placeholder="votre@email.com" type="email" auto-capitalize="none"
                auto-complete="email" auto-correct="on" v-model="formModel.email"
                :class="{ 'border-red-500': formErrors.errorEmail }" />
              <span v-if="formErrors.errorEmail" class="text-xs text-red-500">
                {{ formErrors.errorEmailMessage }}
              </span>
            </div>

            <!-- Numéro de téléphone -->
            <div class="grid gap-1 mt-2">
              <UiLabel for="phone_number" class="mb-1 block">Numéro de téléphone (optionnel)</UiLabel>
              <UiInput id="phone_number" placeholder="Entrez votre numéro (+242 06 613 93 33)" type="tel"
                v-model="formModel.phone_number" @input="updatePhone"
                :class="{ 'border-red-500': formErrors.errorPhoneNumber }" />
              <span v-if="formErrors.errorPhoneNumber" class="text-xs text-red-500">
                {{ formErrors.errorPhoneNumberMessage }}
              </span>
            </div>
          </div>

          <!-- Étape 2: Informations régionales -->
          <div v-if="currentStep === 1" class="grid gap-2">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold mr-6">Informations régionales</h2>
              <UiSteps :current-step="currentStep" :steps="steps" />
            </div>

            <!-- Pays -->
            <div class="grid gap-1 mt-2">
              <UiLabel for="country" class="mb-1 block">Pays</UiLabel>
              <Select v-model="formModel.country" :disabled="isPhoneValid">
                <SelectTrigger id="country"
                  class="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:border-primary transition-colors duration-150"
                  :class="{ 'border-red-500': formErrors.errorCountry }">
                  <SelectValue placeholder="Sélectionnez un pays" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Pays</SelectLabel>
                    <SelectItem v-for="c in countries" :key="c.code" :value="c.code">
                      <img :src="`https://flagcdn.com/24x18/${c.code.toLowerCase()}.png`" width="15" height="9" />
                      <span>{{ countryCodeToFlag(c.code) }}</span> {{ c.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <span v-if="formErrors.errorCountry" class="text-xs text-red-500">
                {{ formErrors.errorCountryMessage }}
              </span>
            </div>

            <!-- Devise -->
            <div class="grid gap-1 mt-2">
              <UiLabel for="currency" class="mb-1 block">Devise</UiLabel>
              <Select v-model="formModel.currency">
                <SelectTrigger id="currency"
                  class="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:border-primary transition-colors duration-150"
                  :class="{ 'border-red-500': formErrors.errorCurrency }">
                  <SelectValue placeholder="Sélectionnez une devise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Devise</SelectLabel>
                    <SelectItem v-for="c in currencies" :key="c.code" :value="c.code">
                      <span class="text-bold">{{ c.symbol }}</span> {{ c.name }} ({{ c.code }})
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <span v-if="formErrors.errorCurrency" class="text-xs text-red-500">
                {{ formErrors.errorCurrencyMessage }}
              </span>
            </div>
          </div>

          <!-- Étape 3: Sécurité du compte -->
          <div v-if="currentStep === 2" class="grid gap-2">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold mr-6">Sécurité du compte</h2>
              <UiSteps :current-step="currentStep" :steps="steps" />
            </div>

            <!-- Mot de passe -->
            <div class="grid gap-1 mt-2 relative">
              <UiLabel for="password" class="mb-1 block">Mot de passe</UiLabel>
              <UiInput id="password" placeholder="Mot de passe" :type="showPassword ? 'text' : 'password'"
                auto-complete="new-password" class="pr-10" v-model="formModel.password"
                :class="{ 'border-red-500': formErrors.errorPassword }" />
              <button type="button" @click="showPassword = !showPassword" tabindex="-1"
                class="absolute right-2 -bottom-2 -translate-y-1/2 text-muted-foreground focus:outline-none">
                <Eye v-if="!showPassword" class="w-[17px]" />
                <EyeOff v-else class="w-[17px]" />
              </button>
            </div>
            <span v-if="formErrors.errorPassword" class="text-xs text-red-500">
              {{ formErrors.errorPasswordMessage }}
            </span>

            <!-- Confirmer mot de passe -->
            <div class="grid gap-1 mt-2 relative">
              <UiLabel for="confirm_password" class="mb-1 block">Confirmer le mot de passe</UiLabel>
              <UiInput id="confirm_password" placeholder="Confirmer le mot de passe"
                :type="showConfirmPassword ? 'text' : 'password'" auto-complete="new-password" class="pr-10"
                v-model="formModel.confirm_password" :class="{ 'border-red-500': formErrors.errorConfirmPassword }" />
              <button type="button" @click="showConfirmPassword = !showConfirmPassword" tabindex="-1"
                class="absolute right-2 -bottom-2 -translate-y-1/2 text-muted-foreground focus:outline-none">
                <Eye v-if="!showConfirmPassword" class="w-[17px]" />
                <EyeOff v-else class="w-[17px]" />
              </button>
            </div>
            <span v-if="formErrors.errorConfirmPassword" class="text-xs text-red-500">
              {{ formErrors.errorConfirmPasswordMessage }}
            </span>

            <!-- Message d'erreur général -->
            <div v-if="errorMessage" class="p-3 rounded bg-red-100 border border-red-300 text-red-800 mt-4">
              {{ errorMessage }}
            </div>
          </div>

          <!-- Navigation des étapes -->
          <div class="flex justify-between mt-8">
            <UiButton type="button" variant="outline" @click="prevStep" :disabled="currentStep === 0 || isLoading">
              Précédent
            </UiButton>

            <UiButton type="submit" :disabled="isLoading" class="text-white">
              <Spinner v-if="isLoading" class="mr-1" size="15px" color="#fff" />
              {{ isLastStep ? "S'inscrire" : 'Suivant' }}
            </UiButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { Button as UiButton } from '@/components/ui/button'
import { Input as UiInput } from '@/components/ui/input'
import { Label as UiLabel } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import UiSteps from '@/components/ui/steps/index.vue'
import Spinner from '@/components/utils/Spinner.vue'
import { RegisterForm } from '@/formBuilder/auth/registerForm'
import RegisterService from '@/services/auth/registerService'
import type { IRegisterBuilder } from '@/interfaces/registerInterface'
import { formatPhoneNumber, formatAsYouType } from '@/lib/phone'
import { countries } from '@/lib/countries'
import { currencies } from '@/lib/currency'
import { countryCodeToFlag } from '@/lib/codeToFlags'
import parsePhoneNumberFromString from 'libphonenumber-js'


export default defineComponent({
  name: 'RegisterForm',
  components: {
    Eye,
    EyeOff,
    UiButton,
    UiInput,
    UiLabel,
    UiSteps,
    Spinner,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  },

  created() { },

  data() {
    return {
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false,
      errorMessage: '',
      currentStep: 0,
      steps: [
        { title: '', description: '' },
        { title: '', description: '' },
        { title: '', description: '' },
      ],
      formModel: {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        country: '',
        currency: '',
        password: '',
        confirm_password: '',
      },
      formErrors: {
        errorFirstName: false,
        errorLastName: false,
        errorEmail: false,
        errorPhoneNumber: false,
        errorCountry: false,
        errorCurrency: false,
        errorPassword: false,
        errorConfirmPassword: false,
      } as IRegisterBuilder,
      formatted: {
        international: '',
        national: '',
        valid: false,
      },
      countryCodeToFlag: countryCodeToFlag,
      currencies: currencies,
    }
  },

  computed: {
    isLastStep(): boolean {
      return this.currentStep === this.steps.length - 1
    },
    countries() {
      return countries
    },
    isPhoneValid() {
      return this.formatted && this.formatted.valid && !!this.formModel.phone_number
    },
  },

  watch: {},

  methods: {

    updatePhone() {
      const raw = this.formModel.phone_number

      // Détecte le pays si le numéro contient l'indicatif
      const parsed = parsePhoneNumberFromString(raw)
      if (parsed && parsed.country) {
        this.formModel.country = parsed.country
      }

      // Formate au fil de la frappe
      this.formModel.phone_number = formatAsYouType(raw, this.formModel.country)
      this.formatted = formatPhoneNumber(this.formModel.phone_number, this.formModel.country)
    },


    validateCurrentStep(): boolean {
      const registerForm = new RegisterForm()

      // Valide uniquement les champs de l'étape actuelle
      if (this.currentStep === 0) {
        registerForm
          .setFirstName(this.formModel.first_name)
          .setLastName(this.formModel.last_name)
          .setEmail(this.formModel.email)
          .setPhoneNumber(this.formModel.phone_number || null)

        this.formErrors = registerForm.builderRegisterForm()

        return !(
          this.formErrors.errorFirstName ||
          this.formErrors.errorLastName ||
          this.formErrors.errorEmail ||
          this.formErrors.errorPhoneNumber
        )
      } else if (this.currentStep === 1) {
        registerForm.setCountry(this.formModel.country).setCurrency(this.formModel.currency)

        this.formErrors = registerForm.builderRegisterForm()

        return !(this.formErrors.errorCountry || this.formErrors.errorCurrency)
      } else if (this.currentStep === 2) {
        registerForm
          .setPassword(this.formModel.password)
          .setConfirmPassword(this.formModel.confirm_password)

        this.formErrors = registerForm.builderRegisterForm()

        return !(this.formErrors.errorPassword || this.formErrors.errorConfirmPassword)
      }

      return true
    },

    validateForm(): boolean {
      // Validation complète du formulaire
      const registerForm = new RegisterForm()

      registerForm
        .setFirstName(this.formModel.first_name)
        .setLastName(this.formModel.last_name)
        .setEmail(this.formModel.email)
        .setPhoneNumber(this.formModel.phone_number || null)
        .setCountry(this.formModel.country)
        .setCurrency(this.formModel.currency)
        .setPassword(this.formModel.password)
        .setConfirmPassword(this.formModel.confirm_password)

      this.formErrors = registerForm.builderRegisterForm()

      return !(
        this.formErrors.errorFirstName ||
        this.formErrors.errorLastName ||
        this.formErrors.errorEmail ||
        this.formErrors.errorPhoneNumber ||
        this.formErrors.errorCountry ||
        this.formErrors.errorCurrency ||
        this.formErrors.errorPassword ||
        this.formErrors.errorConfirmPassword
      )
    },

    nextStep() {
      if (this.validateCurrentStep() && this.currentStep < this.steps.length - 1) {
        this.currentStep++
      }
    },

    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--
      }
    },

    handleStepAction() {
      if (this.isLastStep) {
        this.register()
      } else {
        this.nextStep()
      }
    },

    async register() {
      try {
        this.errorMessage = ''

        // Validation complète du formulaire
        if (!this.validateForm()) {
          return
        }

        this.isLoading = true

        // Création d'une instance du service d'inscription
        const registerService = new RegisterService(
          this.formModel.first_name,
          this.formModel.last_name,
          this.formModel.email,
          this.formModel.country,
          this.formModel.currency,
          this.formModel.phone_number || null,
          this.formModel.password,
          this.formModel.confirm_password,
        )

        // Soumission de l'inscription
        const result = await registerService.save()

        if (result === 'Erreur') {
          this.errorMessage = "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
          return
        }

        // Redirection vers la page de connexion ou dashboard
        this.$router.push('/auth/login')
      } catch (error: unknown) {
        this.errorMessage =
          error instanceof Error ? error.message : "Une erreur inattendue s'est produite"
      } finally {
        this.isLoading = false
      }
    },
  },
})
</script>

<style scoped>
.icon-svg {
  width: 16px !important;
}
</style>
