<template>
  <div class="grid gap-6">
    <div class="mb-8">
      <form @submit.prevent="handleStepAction">
        <!-- Étape 1: Informations personnelles -->
        <div v-if="currentStep === 0" class="grid gap-2">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold mr-3 mb-2 w-max">Informations personnelles</h2>
            <UiSteps :current-step="currentStep" :steps="steps" />
          </div>

          <!-- Prénom et Nom sur la même ligne -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Prénom -->
            <div class="grid gap-1">
              <UiLabel for="first_name">Prénom</UiLabel>
              <UiInput
                id="first_name"
                placeholder="Prénom"
                type="text"
                v-model="formData.first_name"
                :class="{ 'border-red-500': formErrors.errorFirstName }"
              />
              <span v-if="formErrors.errorFirstName" class="text-xs text-red-500">
                {{ formErrors.errorFirstNameMessage }}
              </span>
            </div>

            <!-- Nom -->
            <div class="grid gap-1">
              <UiLabel for="last_name">Nom</UiLabel>
              <UiInput
                id="last_name"
                placeholder="Nom"
                type="text"
                v-model="formData.last_name"
                :class="{ 'border-red-500': formErrors.errorLastName }"
              />
              <span v-if="formErrors.errorLastName" class="text-xs text-red-500">
                {{ formErrors.errorLastNameMessage }}
              </span>
            </div>
          </div>

          <!-- Email -->
          <div class="grid gap-1 mt-2">
            <UiLabel for="email">Email</UiLabel>
            <UiInput
              id="email"
              placeholder="votre@email.com"
              type="email"
              auto-capitalize="none"
              auto-complete="email"
              auto-correct="off"
              v-model="formData.email"
              :class="{ 'border-red-500': formErrors.errorEmail }"
            />
            <span v-if="formErrors.errorEmail" class="text-xs text-red-500">
              {{ formErrors.errorEmailMessage }}
            </span>
          </div>

          <!-- Numéro de téléphone -->
          <div class="grid gap-1 mt-2">
            <UiLabel for="phone_number">Numéro de téléphone (optionnel)</UiLabel>
            <UiInput
              id="phone_number"
              placeholder="+33 6 12 34 56 78"
              type="tel"
              v-model="formData.phone_number"
              :class="{ 'border-red-500': formErrors.errorPhoneNumber }"
            />
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
            <UiLabel for="country">Pays</UiLabel>
            <UiInput
              id="country"
              placeholder="France"
              type="text"
              v-model="formData.country"
              :class="{ 'border-red-500': formErrors.errorCountry }"
            />
            <span v-if="formErrors.errorCountry" class="text-xs text-red-500">
              {{ formErrors.errorCountryMessage }}
            </span>
          </div>

          <!-- Devise -->
          <div class="grid gap-1 mt-2">
            <UiLabel for="currency">Devise</UiLabel>
            <UiInput
              id="currency"
              placeholder="EUR"
              type="text"
              v-model="formData.currency"
              :class="{ 'border-red-500': formErrors.errorCurrency }"
            />
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
            <UiLabel for="password">Mot de passe</UiLabel>
            <UiInput
              id="password"
              placeholder="Mot de passe"
              :type="showPassword ? 'text' : 'password'"
              auto-complete="new-password"
              class="pr-10"
              v-model="formData.password"
              :class="{ 'border-red-500': formErrors.errorPassword }"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              tabindex="-1"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground focus:outline-none"
            >
              <Eye v-if="!showPassword" class="w-[17px]" />
              <EyeOff v-else class="w-[17px]" />
            </button>
            <span v-if="formErrors.errorPassword" class="text-xs text-red-500">
              {{ formErrors.errorPasswordMessage }}
            </span>
          </div>

          <!-- Confirmer mot de passe -->
          <div class="grid gap-1 mt-2 relative">
            <UiLabel for="confirm_password">Confirmer le mot de passe</UiLabel>
            <UiInput
              id="confirm_password"
              placeholder="Confirmer le mot de passe"
              :type="showConfirmPassword ? 'text' : 'password'"
              auto-complete="new-password"
              class="pr-10"
              v-model="formData.confirm_password"
              :class="{ 'border-red-500': formErrors.errorConfirmPassword }"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              tabindex="-1"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground focus:outline-none"
            >
              <Eye v-if="!showConfirmPassword" class="w-[17px]" />
              <EyeOff v-else class="w-[17px]" />
            </button>
            <span v-if="formErrors.errorConfirmPassword" class="text-xs text-red-500">
              {{ formErrors.errorConfirmPasswordMessage }}
            </span>
          </div>

          <!-- Message d'erreur général -->
          <div
            v-if="errorMessage"
            class="p-3 rounded bg-red-100 border border-red-300 text-red-800 mt-4"
          >
            {{ errorMessage }}
          </div>
        </div>

        <!-- Navigation des étapes -->
        <div class="flex justify-between mt-8">
          <UiButton
            type="button"
            variant="outline"
            @click="prevStep"
            :disabled="currentStep === 0 || isLoading"
          >
            Précédent
          </UiButton>

          <UiButton type="submit" :disabled="isLoading">
            <span v-if="isLoading" class="animate-spin mr-2">⏳</span>
            {{ isLastStep ? "S'inscrire" : 'Suivant' }}
          </UiButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { Button as UiButton } from '@/components/ui/button'
import { Input as UiInput } from '@/components/ui/input'
import { Label as UiLabel } from '@/components/ui/label'
import UiSteps from '@/components/ui/steps/index.vue'
import { RegisterForm } from '@/formBuilder/auth/registerForm'
import RegisterService from '@/services/auth/registerService'
import type { IRegisterBuilder } from '@/interfaces/registerInterface'

export default defineComponent({
  name: 'RegisterForm',
  components: { Eye, EyeOff, UiButton, UiInput, UiLabel, UiSteps },
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
      formData: {
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
    }
  },
  computed: {
    isLastStep(): boolean {
      return this.currentStep === this.steps.length - 1
    },
  },
  methods: {
    validateCurrentStep(): boolean {
      const registerForm = new RegisterForm()

      // Valide uniquement les champs de l'étape actuelle
      if (this.currentStep === 0) {
        registerForm
          .setFirstName(this.formData.first_name)
          .setLastName(this.formData.last_name)
          .setEmail(this.formData.email)
          .setPhoneNumber(this.formData.phone_number || null)

        this.formErrors = registerForm.builderRegisterForm()

        return !(
          this.formErrors.errorFirstName ||
          this.formErrors.errorLastName ||
          this.formErrors.errorEmail ||
          this.formErrors.errorPhoneNumber
        )
      } else if (this.currentStep === 1) {
        registerForm.setCountry(this.formData.country).setCurrency(this.formData.currency)

        this.formErrors = registerForm.builderRegisterForm()

        return !(this.formErrors.errorCountry || this.formErrors.errorCurrency)
      } else if (this.currentStep === 2) {
        registerForm
          .setPassword(this.formData.password)
          .setConfirmPassword(this.formData.confirm_password)

        this.formErrors = registerForm.builderRegisterForm()

        return !(this.formErrors.errorPassword || this.formErrors.errorConfirmPassword)
      }

      return true
    },

    validateForm(): boolean {
      // Validation complète du formulaire
      const registerForm = new RegisterForm()

      registerForm
        .setFirstName(this.formData.first_name)
        .setLastName(this.formData.last_name)
        .setEmail(this.formData.email)
        .setPhoneNumber(this.formData.phone_number || null)
        .setCountry(this.formData.country)
        .setCurrency(this.formData.currency)
        .setPassword(this.formData.password)
        .setConfirmPassword(this.formData.confirm_password)

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
          this.formData.first_name,
          this.formData.last_name,
          this.formData.email,
          this.formData.country,
          this.formData.currency,
          this.formData.phone_number || null,
          this.formData.password,
          this.formData.confirm_password,
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
