<template>
  <div class="grid gap-4 w-full">
    <form @submit.prevent="handleLogin" class="w-full">
      <div class="grid gap-3 w-full">
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
            class="absolute right-2 -bottom-2 -translate-y-1/2 text-muted-foreground focus:outline-none"
          >
            <Eye v-if="!showPassword" class="w-[17px]" />
            <EyeOff v-else class="w-[17px]" />
          </button>
        </div>
        <span v-if="formErrors.errorPassword" class="text-xs text-red-500">
          {{ formErrors.errorPasswordMessage }}
        </span>

        <div class="flex items-center justify-between flex-wrap mt-2">
          <div class="flex items-center space-x-2">
            <Checkbox id="remember" v-model="formData.remember" />
            <label
              for="remember"
              class="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Se souvenir de moi
            </label>
          </div>
          <router-link
            to="/auth/forgot-password"
            class="text-xs sm:text-sm text-muted-foreground underline-offset-4 hover:underline mt-1 sm:mt-0"
            >Mot de passe oublié?</router-link
          >
        </div>

        <UiButton
          type="submit"
          class="mt-4 flex items-center justify-center gap-4 py-3 w-full"
          :disabled="isLoading"
        >
          <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          Se connecter
        </UiButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Eye, EyeOff, Loader2 } from 'lucide-vue-next'
import { Button as UiButton } from '@/components/ui/button'
import { Input as UiInput } from '@/components/ui/input'
import { Label as UiLabel } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { LoginForm } from '@/formBuilder/auth/loginForm'
import { LoginService } from '@/services/auth/loginService'
import { AuthNotificationService } from '@/services/auth/authNotificationService'
import { supabase } from '@/services/config/supabaseClient'
import { AgencyService } from '@/services/agencies/agencyService'
import type { ILoginBuilder } from '@/interfaces/loginInterface'

export default defineComponent({
  name: 'LoginForm',
  components: { Eye, EyeOff, UiButton, UiInput, UiLabel, Checkbox, Loader2 },
  data() {
    return {
      showPassword: false,
      isLoading: false,
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
          AuthNotificationService.notifyLoginError('Email ou mot de passe incorrect')
          return
        }

        // Petite pause pour laisser le temps aux tokens d'être correctement enregistrés
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Notification de connexion réussie
        const username = this.formData.email.split('@')[0] || 'Utilisateur'
        AuthNotificationService.notifyLoginSuccess(username)

        // Vérifier si l'utilisateur a des agences
        try {
          console.log('Tentative de redirection après connexion...')
          const { data: user } = await supabase.auth.getUser()
          console.log('Utilisateur récupéré:', user)

          if (user && user.user) {
            console.log('Recherche des agences pour userId:', user.user.id)
            const { data: agencies, error } = await AgencyService.getUserAgencies(user.user.id)
            console.log("Résultat de la recherche d'agences:", { agencies, error })

            // Forcer la navigation vers la page appropriée
            if (!agencies || agencies.length === 0) {
              console.log('Aucune agence trouvée, redirection vers create-agency')
              // Utiliser la navigation programmatique via l'objet router
              window.location.href = '/create-agency'
            } else {
              console.log('Agences trouvées, redirection vers dashboard')
              window.location.href = '/'
            }
          } else {
            console.log('Utilisateur non disponible, redirection vers create-agency')
            window.location.href = '/create-agency'
          }
        } catch (error) {
          console.error('Erreur lors de la redirection après connexion:', error)
          // En cas d'erreur, rediriger vers la création d'agence
          window.location.href = '/create-agency'
        }
      } catch (error: unknown) {
        console.error('Erreur de login dans le composant:', error)
        // Notification d'erreur
        const errorMessage =
          error instanceof Error ? error.message : "Une erreur inattendue s'est produite"
        AuthNotificationService.notifyLoginError(errorMessage)
      } finally {
        this.isLoading = false
      }
    },

    // La méthode goToForgotPassword n'est plus nécessaire, nous utilisons router-link directement
  },
})
</script>

<style scoped></style>
