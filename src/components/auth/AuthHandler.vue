<template>
  <div v-if="loading" class="flex items-center justify-center h-20">
    <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    <span class="ml-2">Traitement de l'authentification...</span>
  </div>
  <div v-else-if="error" class="text-red-500">
    {{ error }}
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/services/config/supabaseClient'
import { AuthNotificationService } from '@/services/auth/authNotificationService'

export default defineComponent({
  name: 'AuthHandler',
  setup() {
    const loading = ref(true)
    const error = ref('')
    const router = useRouter()
    const route = useRoute()

    onMounted(async () => {
      try {
        // Récupérer le hash de l'URL pour voir si on a un token
        const hashParams = window.location.hash
        console.log('Hash params:', hashParams)

        // Détection du type d'action à effectuer
        const isPasswordReset =
          hashParams.includes('type=recovery') ||
          route.query.type === 'recovery' ||
          route.path === '/auth/reset-password'

        // Si c'est une réinitialisation de mot de passe
        if (isPasswordReset) {
          // On attend que Supabase traite le hash
          const { data, error: sessionError } = await supabase.auth.getSession()

          if (sessionError) {
            console.error('Erreur lors de la récupération de la session:', sessionError)
            throw new Error(sessionError.message)
          }

          if (data?.session) {
            console.log('Session récupérée avec succès')
            // Rediriger vers la page de réinitialisation
            router.push({ name: 'reset-password' })
          } else {
            console.warn('Session non récupérée')
            AuthNotificationService.notifyPasswordResetError(
              'Le lien de réinitialisation est invalide ou a expiré',
            )
            router.push({ name: 'forgot-password' })
          }
        } else {
          // Pour d'autres types d'authentification
          router.push({ name: 'login' })
        }
      } catch (err: any) {
        console.error('Erreur dans AuthHandler:', err)
        error.value = 'Une erreur est survenue lors du traitement de votre authentification.'
        AuthNotificationService.notifyPasswordResetError(
          'Le lien de réinitialisation est invalide ou a expiré',
        )

        // Rediriger vers la page de demande de réinitialisation
        setTimeout(() => {
          router.push({ name: 'forgot-password' })
        }, 1500)
      } finally {
        loading.value = false
      }
    })

    return {
      loading,
      error,
    }
  },
})
</script>
