<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import ResetPasswordForm from './authForm/ResetPasswordForm.vue'
import { supabase } from '@/services/config/supabaseClient'
import { useRouter } from 'vue-router'
import { AuthNotificationService } from '@/services/auth/authNotificationService'

export default defineComponent({
  name: 'ResetPasswordComponent',
  components: {
    ResetPasswordForm,
  },
  setup() {
    const router = useRouter()

    onMounted(async () => {
      // Vérifier si nous avons des paramètres d'authentification dans l'URL
      const hashParams = window.location.hash

      if (
        hashParams &&
        (hashParams.includes('type=recovery') || hashParams.includes('access_token'))
      ) {
        console.log("Paramètres d'authentification détectés dans l'URL")

        try {
          // Permettre à Supabase de traiter les paramètres d'URL
          await supabase.auth.getSession()
        } catch (error) {
          console.error('Erreur lors de la récupération de la session:', error)
          AuthNotificationService.notifyPasswordResetError(
            'Erreur lors de la validation du lien de réinitialisation',
          )
          router.push({ name: 'forgot-password' })
        }
      }
    })

    return {
      buttonVariants,
      cn,
    }
  },
})
</script>

<template>
  <div
    class="container relative min-h-screen flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
  >
    <!-- Lien de connexion toujours visible -->
    <router-link
      :to="{ name: 'login' }"
      :class="
        cn(buttonVariants({ variant: 'ghost' }), 'absolute right-4 top-4 md:right-8 md:top-8')
      "
    >
      Connexion
    </router-link>

    <!-- Partie gauche: cachée sur mobile, visible sur desktop -->
    <div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
      <div class="absolute inset-0 bg-zinc-900" />
      <div class="relative z-20 flex items-center text-lg font-medium">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          class="mr-2 h-6 w-6"
        >
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
        mvuama app
      </div>
      <div class="relative z-20 mt-auto">
        <blockquote class="space-y-2">
          <p class="text-lg">
            &ldquo;Définissez un nouveau mot de passe sécurisé pour protéger votre compte et vos
            données.&rdquo;
          </p>
          <footer class="text-sm">Équipe Support Mvuama</footer>
        </blockquote>
      </div>
    </div>

    <!-- Partie droite: formulaire de réinitialisation (visible sur tous les écrans) -->
    <div class="flex h-full w-full items-center justify-center p-4 sm:p-6 lg:p-8">
      <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] max-w-[90vw]">
        <div class="flex flex-col space-y-2 text-left">
          <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight">
            Réinitialiser le mot de passe
          </h1>
          <p class="text-sm sm:text-md text-muted-foreground">
            Créez un nouveau mot de passe sécurisé pour votre compte
          </p>
        </div>

        <!-- Logo sur mobile uniquement -->
        <div class="flex items-center justify-center sm:hidden mb-4">
          <div class="flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              class="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            mvuama app
          </div>
        </div>

        <ResetPasswordForm />
      </div>
    </div>
  </div>
</template>

<style scoped>
@media screen and (max-width: 640px) {
  /* Pour les petits écrans */
  :deep(form) {
    width: 100%;
  }
}

@media screen and (max-width: 400px) {
  /* Pour très petits écrans */
  :deep(form) {
    width: 100%;
  }
}
</style>
