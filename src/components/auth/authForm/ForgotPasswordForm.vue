<template>
  <div class="grid gap-4 w-full">
    <form @submit.prevent="handleForgotPassword" class="w-full">
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

        <div class="flex items-center justify-between flex-wrap mt-2">
          <router-link
            :to="{ name: 'login' }"
            class="text-xs sm:text-sm text-muted-foreground underline-offset-4 hover:underline mt-1 sm:mt-0"
          >
            Retour à la connexion
          </router-link>
        </div>

        <UiButton
          type="submit"
          class="mt-4 flex items-center justify-center gap-4 py-3 w-full"
          :disabled="isLoading"
        >
          <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          Envoyer les instructions
        </UiButton>

        <div class="text-center mt-4 text-sm text-muted-foreground">
          <p>
            Nous vous enverrons un email avec les instructions pour réinitialiser votre mot de
            passe.
          </p>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { Button as UiButton } from '@/components/ui/button'
import { Input as UiInput } from '@/components/ui/input'
import { Label as UiLabel } from '@/components/ui/label'
import { ForgotPasswordForm } from '@/formBuilder/auth/forgotPasswordForm'
import { ForgotPasswordService } from '@/services/auth/forgotPasswordService'
import { AuthNotificationService } from '@/services/auth/authNotificationService'
import type { IForgotPasswordBuilder } from '@/interfaces/forgotPasswordInterface'

export default defineComponent({
  name: 'ForgotPasswordForm',
  components: { UiButton, UiInput, UiLabel, Loader2 },
  data() {
    return {
      isLoading: false,
      formData: {
        email: '',
      },
      formErrors: {
        errorEmail: false,
        errorEmailMessage: '',
      } as IForgotPasswordBuilder,
    }
  },

  methods: {
    /**
     * Valide le formulaire de demande de réinitialisation
     * @returns {boolean} - true si le formulaire est valide
     */
    validateForm(): boolean {
      const forgotPasswordForm = new ForgotPasswordForm()
      forgotPasswordForm.setEmail(this.formData.email)
      this.formErrors = forgotPasswordForm.builderForgotPasswordForm()
      return !this.formErrors.errorEmail
    },

    /**
     * Gère la soumission du formulaire de demande de réinitialisation
     */
    async handleForgotPassword() {
      try {
        // Validation du formulaire
        if (!this.validateForm()) {
          return
        }

        this.isLoading = true

        // Création d'une instance du service de réinitialisation
        const forgotPasswordForm = new ForgotPasswordForm()
        forgotPasswordForm.setEmail(this.formData.email.trim())

        // Envoi de l'email de réinitialisation
        const result = await ForgotPasswordService.sendResetPasswordEmail(
          forgotPasswordForm.getForgotPasswordData(),
        )

        if (result) {
          // Notification de succès
          AuthNotificationService.notifyResetEmailSent()

          // Redirection vers la page de confirmation
          this.$router.push({ name: 'forgot-password-confirmation' })
        }
      } catch (error: unknown) {
        console.error('Erreur lors de la demande de réinitialisation:', error)

        // Notification d'erreur
        const errorMessage =
          error instanceof Error ? error.message : "Une erreur inattendue s'est produite"
        AuthNotificationService.notifyResetEmailError(errorMessage)
      } finally {
        this.isLoading = false
      }
    },
  },
})
</script>
