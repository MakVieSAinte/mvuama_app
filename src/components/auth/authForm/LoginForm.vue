<template>
  <div class="grid gap-6">
    <form @submit.prevent="handleLogin">
      <div class="grid gap-2">
        <div class="grid gap-1">
          <UiLabel class="mb-1 block" for="email">Email</UiLabel>
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
        <div class="grid gap-1 mt-2 relative">
          <UiLabel class="mb-1 block" for="password">Mot de passe</UiLabel>
          <UiInput
            id="password"
            placeholder="Mot de passe"
            :type="showPassword ? 'text' : 'password'"
            auto-complete="current-password"
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

        <div class="flex items-center space-x-2 mt-2">
          <Checkbox id="remember" v-model="formData.remember" />
          <label
            for="remember"
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Se souvenir de moi
          </label>
        </div>

        <!-- Message d'erreur général -->
        <div
          v-if="errorMessage"
          class="p-3 rounded bg-red-100 border border-red-300 text-red-800 mt-4"
        >
          {{ errorMessage }}
        </div>

        <UiButton
          type="submit"
          class="mt-4 flex items-center justify-center gap-4 py-3"
          :disabled="isLoading"
        >
          <Spinner v-if="isLoading" class="mr-2" size="18px" color="#fff" />
          Se connecter
        </UiButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { Button as UiButton } from '@/components/ui/button'
import { Input as UiInput } from '@/components/ui/input'
import { Label as UiLabel } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import Spinner from '@/components/utils/Spinner.vue'
import { LoginForm } from '@/formBuilder/auth/loginForm'
import { LoginService } from '@/services/auth/loginService'
import type { ILoginBuilder } from '@/interfaces/loginInterface'

export default defineComponent({
  name: 'LoginForm',
  components: { Eye, EyeOff, UiButton, UiInput, UiLabel, Checkbox, Spinner },
  data() {
    return {
      showPassword: false,
      isLoading: false,
      errorMessage: '',
      formData: {
        email: '',
        password: '',
        remember: false,
      },
      formErrors: {
        errorEmail: false,
        errorEmailMessage: '',
        errorPassword: false,
        errorPasswordMessage: '',
      } as ILoginBuilder,
    }
  },

  created() {
    // Récupérer l'email mémorisé si disponible
    const rememberedEmail = LoginService.getRememberedEmail()
    if (rememberedEmail) {
      this.formData.email = rememberedEmail
      this.formData.remember = true
    }
  },

  methods: {
    /**
     * Valide le formulaire de connexion
     * @returns {boolean} - true si le formulaire est valide
     */
    validateForm(): boolean {
      const loginForm = new LoginForm()

      loginForm
        .setEmail(this.formData.email)
        .setPassword(this.formData.password)
        .setRemember(this.formData.remember)

      this.formErrors = loginForm.builderLoginForm()

      return !(this.formErrors.errorEmail || this.formErrors.errorPassword)
    },

    /**
     * Gère la soumission du formulaire de connexion
     */
    async handleLogin() {
      try {
        this.errorMessage = ''

        // Validation du formulaire
        if (!this.validateForm()) {
          return
        }

        this.isLoading = true

        // Créer une instance du service de connexion
        const loginForm = new LoginForm()
          .setEmail(this.formData.email.trim()) // Trim l'email dès la saisie
          .setPassword(this.formData.password)
          .setRemember(this.formData.remember)

        const loginService = new LoginService(loginForm.getLoginData())

        // Tentative de connexion avec gestion d'erreur améliorée
        const result = await loginService.login()

        if (!result) {
          this.errorMessage = 'Email ou mot de passe incorrect'
          return
        }

        // Petite pause pour laisser le temps aux tokens d'être correctement enregistrés
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Redirection vers le dashboard
        this.$router.push('/')
      } catch (error: unknown) {
        console.error('Erreur de login dans le composant:', error)
        // Affichage de l'erreur spécifique provenant du service
        this.errorMessage =
          error instanceof Error ? error.message : "Une erreur inattendue s'est produite"
      } finally {
        this.isLoading = false
      }
    },
  },
})
</script>

<style scoped></style>
