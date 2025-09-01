<template>
  <div class="grid gap-4 w-full">
    <form @submit.prevent="handleResetPassword" class="w-full">
      <div class="grid gap-3 w-full">
        <!-- Mot de passe -->
        <div class="grid gap-1 mt-2 relative">
          <UiLabel class="mb-1 block" for="password">Nouveau mot de passe</UiLabel>
          <UiInput
            id="password"
            placeholder="Nouveau mot de passe"
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
            class="absolute right-2 -bottom-2 -translate-y-1/2 text-muted-foreground focus:outline-none"
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
          <UiLabel class="mb-1 block" for="confirmPassword">Confirmer le mot de passe</UiLabel>
          <UiInput
            id="confirmPassword"
            placeholder="Confirmer le mot de passe"
            :type="showConfirmPassword ? 'text' : 'password'"
            auto-complete="new-password"
            class="pr-10"
            v-model="formData.confirmPassword"
            :class="{ 'border-red-500': formErrors.errorConfirmPassword }"
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            tabindex="-1"
            class="absolute right-2 -bottom-2 -translate-y-1/2 text-muted-foreground focus:outline-none"
          >
            <Eye v-if="!showConfirmPassword" class="w-[17px]" />
            <EyeOff v-else class="w-[17px]" />
          </button>
          <span v-if="formErrors.errorConfirmPassword" class="text-xs text-red-500">
            {{ formErrors.errorConfirmPasswordMessage }}
          </span>
        </div>

        <!-- Exigences de mot de passe -->
        <div class="bg-muted/50 p-3 rounded mt-2 text-xs text-muted-foreground">
          <p class="font-semibold mb-1">Le mot de passe doit contenir :</p>
          <ul class="list-disc list-inside space-y-1">
            <li>Au moins 6 caractères</li>
            <li>Au moins une lettre majuscule</li>
            <li>Au moins une lettre minuscule</li>
            <li>Au moins un chiffre</li>
          </ul>
        </div>

        <UiButton
          type="submit"
          class="mt-4 flex items-center justify-center gap-4 py-3 w-full"
          :disabled="isLoading"
        >
          <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          Réinitialiser le mot de passe
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
import { ResetPasswordForm } from '@/formBuilder/auth/forgotPasswordForm'
import { ForgotPasswordService } from '@/services/auth/forgotPasswordService'
import { AuthNotificationService } from '@/services/auth/authNotificationService'
import type { IResetPasswordBuilder } from '@/interfaces/forgotPasswordInterface'

export default defineComponent({
  name: 'ResetPasswordForm',
  components: { Eye, EyeOff, UiButton, UiInput, UiLabel, Loader2 },
  data() {
    return {
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false,
      token: '',
      formData: {
        password: '',
        confirmPassword: '',
      },
      formErrors: {
        errorPassword: false,
        errorPasswordMessage: '',
        errorConfirmPassword: false,
        errorConfirmPasswordMessage: '',
      } as IResetPasswordBuilder,
    }
  },

  async created() {
    // Attendre un court instant pour que Supabase traite les tokens de l'URL
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Vérifier si le token est valide
    await this.checkTokenValidity()
  },

  methods: {
    /**
     * Vérifie la validité du token
     */
    async checkTokenValidity() {
      try {
        // Attendre un peu pour s'assurer que Supabase a eu le temps de traiter le token
        await new Promise((resolve) => setTimeout(resolve, 500))

        const isValid = await ForgotPasswordService.isValidResetToken()

        if (!isValid) {
          // Rediriger vers la page de demande de réinitialisation si le token est invalide
          AuthNotificationService.notifyPasswordResetError(
            'Le lien de réinitialisation est invalide ou a expiré',
          )
          this.$router.push({ name: 'forgot-password' })
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du token:', error)
        AuthNotificationService.notifyPasswordResetError(
          'Une erreur est survenue lors de la validation de votre lien',
        )
        this.$router.push({ name: 'forgot-password' })
      }
    },

    /**
     * Valide le formulaire de réinitialisation
     * @returns {boolean} - true si le formulaire est valide
     */
    validateForm(): boolean {
      const resetPasswordForm = new ResetPasswordForm()
      resetPasswordForm
        .setPassword(this.formData.password)
        .setConfirmPassword(this.formData.confirmPassword)
        .setToken(this.token)

      this.formErrors = resetPasswordForm.builderResetPasswordForm()

      return !(this.formErrors.errorPassword || this.formErrors.errorConfirmPassword)
    },

    /**
     * Gère la soumission du formulaire de réinitialisation
     */
    async handleResetPassword() {
      try {
        // Validation du formulaire
        if (!this.validateForm()) {
          return
        }

        this.isLoading = true

        // Vérification préalable de la validité du token
        const isValid = await ForgotPasswordService.isValidResetToken()
        if (!isValid) {
          AuthNotificationService.notifyPasswordResetError(
            "Le lien de réinitialisation a expiré ou n'est plus valide. Veuillez demander un nouveau lien.",
          )
          this.$router.push({ name: 'forgot-password' })
          return
        }

        // Création d'une instance du formulaire
        const resetPasswordForm = new ResetPasswordForm()
        resetPasswordForm
          .setPassword(this.formData.password)
          .setConfirmPassword(this.formData.confirmPassword)

        // Réinitialisation du mot de passe
        const result = await ForgotPasswordService.resetPassword(
          resetPasswordForm.getResetPasswordData(),
        )

        if (result) {
          // Notification de succès
          AuthNotificationService.notifyPasswordResetSuccess()

          // Redirection vers la page de connexion
          setTimeout(() => {
            this.$router.push({ name: 'login' })
          }, 1000) // Légère pause pour permettre à l'utilisateur de voir la notification
        }
      } catch (error: unknown) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error)

        // Notification d'erreur
        const errorMessage =
          error instanceof Error ? error.message : "Une erreur inattendue s'est produite"

        AuthNotificationService.notifyPasswordResetError(errorMessage)

        // Si l'erreur concerne un lien expiré, rediriger vers la page de demande de réinitialisation
        if (
          errorMessage.toLowerCase().includes('expir') ||
          errorMessage.toLowerCase().includes('invalid')
        ) {
          setTimeout(() => {
            this.$router.push({ name: 'forgot-password' })
          }, 1500)
        }
      } finally {
        this.isLoading = false
      }
    },
  },
})
</script>
