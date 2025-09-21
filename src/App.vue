<template>
  <div>
    <router-view />
    <component :is="Toaster" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useSonner } from '@/plugins/sonner'
import { useUserStore } from '@/stores/userStore'
import { AuthService } from '@/services/auth/auth'

export default defineComponent({
  name: 'App',
  setup() {
    const { Toaster } = useSonner()
    const userStore = useUserStore()

    // Charger les données utilisateur au démarrage de l'application si l'utilisateur est connecté
    onMounted(async () => {
      try {
        const isLoggedIn = await AuthService.checkAuth()
        if (isLoggedIn && !userStore.currentUser) {
          console.log("Chargement du profil utilisateur au démarrage de l'application")
          await userStore.fetchUserProfile()
        }
      } catch (error) {
        console.error('Erreur lors du chargement initial du profil:', error)
      }
    })

    return { Toaster }
  },
})
</script>

<style scoped></style>
