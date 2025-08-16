<script setup lang="ts">
import { onMounted } from 'vue'
import { supabase } from '@/services/config/supabaseClient'
import { useRouter } from 'vue-router'
import { useSonner } from '@/plugins/sonner'
import { getFirstMembershipAgency, slugify } from '@/services/agencies/agency'

const router = useRouter()
const { toastSuccess, toastError } = useSonner()

onMounted(async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error || !data.session) {
    toastError('Session invalide. Veuillez vous reconnecter.')
    return router.replace({ name: 'login' })
  }
  toastSuccess('Email vérifié. Connecté.')
  const agency = await getFirstMembershipAgency()
  if (!agency) return router.replace({ name: 'onboarding-agency' })
  return router.replace({ name: 'agency-home', params: { slug: slugify(agency.name) } })
})
</script>

<template>
  <div class="p-6 text-center">Connexion en cours...</div>
</template>

<style scoped></style>
