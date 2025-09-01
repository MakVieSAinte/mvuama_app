<template>
  <div class="grid gap-4 w-full text-center">
    <div class="mb-4">
      <div class="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
        <Mail class="h-8 w-8 text-primary" />
      </div>
    </div>

    <h2 class="text-2xl font-semibold tracking-tight">Vérifiez votre boîte de réception</h2>

    <p class="text-sm text-muted-foreground mt-1">
      Si un compte est associé à l'adresse <span class="font-medium">{{ email }}</span
      >, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
    </p>

    <div class="mt-4 space-y-2">
      <UiButton variant="outline" class="w-full" @click="resendEmail">
        <RefreshCw v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
        <RefreshCw v-else class="mr-2 h-4 w-4" />
        Je n'ai pas reçu l'email
      </UiButton>

      <router-link :to="{ name: 'login' }">
        <UiButton variant="ghost" class="w-full">
          <ArrowLeft class="mr-2 h-4 w-4" />
          Retour à la connexion
        </UiButton>
      </router-link>
    </div>

    <div class="bg-muted/50 p-4 rounded-md mt-6">
      <p class="text-xs text-muted-foreground">
        Si vous ne recevez pas d'email, vérifiez vos dossiers de spam/indésirables ou essayez avec
        une autre adresse email.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RefreshCw, Mail, ArrowLeft } from 'lucide-vue-next'
import { Button as UiButton } from '@/components/ui/button'
import { ForgotPasswordForm } from '@/formBuilder/auth/forgotPasswordForm'
import { ForgotPasswordService } from '@/services/auth/forgotPasswordService'
import { AuthNotificationService } from '@/services/auth/authNotificationService'

export default defineComponent({
  name: 'ForgotPasswordConfirmation',
  components: { UiButton, RefreshCw, Mail, ArrowLeft },

  data() {
    return {
      isLoading: false,
      email: '',
    }
  },

  created() {
    // Récupérer l'email depuis les paramètres de route ou le localStorage
    const routeEmail = this.$route.query.email as string
    this.email = routeEmail || localStorage.getItem('reset_password_email') || ''

    if (!this.email) {
      // Si aucun email n'est trouvé, rediriger vers la page de demande de réinitialisation
      this.$router.push({ name: 'forgot-password' })
    }
  },

  methods: {
    /**
     * Renvoie l'email de réinitialisation
     */
    async resendEmail() {
      if (!this.email) {
        AuthNotificationService.notifyResetEmailError('Adresse email manquante')
        return
      }

      try {
        this.isLoading = true

        const forgotPasswordForm = new ForgotPasswordForm()
        forgotPasswordForm.setEmail(this.email)

        // Renvoyer l'email
        await ForgotPasswordService.sendResetPasswordEmail(
          forgotPasswordForm.getForgotPasswordData(),
        )

        // Notification de succès
        AuthNotificationService.notifyResetEmailSent()
      } catch (error: unknown) {
        console.error("Erreur lors du renvoi de l'email:", error)

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
