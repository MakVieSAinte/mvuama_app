<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { supabase } from '@/services/config/supabaseClient'
import { useRouter } from 'vue-router'
import { useSonner } from '@/plugins/sonner'

export default defineComponent({
  name: 'AuthCallbackComponent',
  setup() {
    const router = useRouter()
    const { toastSuccess, toastError } = useSonner()
    const isLoading = ref(true)

    onMounted(async () => {
      // Début du temps de chargement
      const startTime = Date.now()

      // Vérification de la session
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        // Calculer le temps écoulé
        const elapsedTime = Date.now() - startTime
        const remainingTime = Math.max(0, 3000 - elapsedTime)

        // Attendre le temps restant pour atteindre 3 secondes minimum
        if (remainingTime > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingTime))
        }

        toastError('Session invalide. Veuillez vous reconnecter.')
        isLoading.value = false
        return router.replace({ name: 'login' })
      }

      // Calculer le temps écoulé depuis le début
      const elapsedTime = Date.now() - startTime
      const remainingTime = Math.max(0, 3000 - elapsedTime)

      // Attendre le temps restant pour atteindre 3 secondes minimum
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime))
      }

      toastSuccess('Email vérifié. Connecté.')
      isLoading.value = false

      // Rediriger vers la page d'accueil ou le tableau de bord
      router.replace({ name: 'dashboard' })
    })

    return {
      isLoading,
    }
  },
})
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-6 text-center">
    <div v-if="isLoading" class="flex flex-col items-center gap-4">
      <div
        class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="text-lg font-medium">Connexion en cours...</p>
      <p class="text-sm text-muted-foreground">Veuillez patienter quelques secondes</p>
    </div>
    <div v-else class="flex flex-col items-center gap-4">
      <p class="text-lg font-medium">Redirection en cours...</p>
    </div>
  </div>
</template>

<style scoped></style>
