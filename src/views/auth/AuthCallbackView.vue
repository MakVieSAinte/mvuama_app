<script setup lang="ts">
import { onMounted } from 'vue'
import { supabase } from '@/services/config/supabaseClient'
import { useRouter } from 'vue-router'
import { useSonner } from '@/plugins/sonner'

const router = useRouter()
const { toastSuccess, toastError } = useSonner()

onMounted(async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error || !data.session) {
    toastError('Session invalide. Veuillez vous reconnecter.')
    return router.replace({ name: 'login' })
  }
  toastSuccess('Email vérifié. Connecté.')
})
</script>

<template>
  <div class="p-6 text-center">Connexion en cours...</div>
</template>

<style scoped></style>
