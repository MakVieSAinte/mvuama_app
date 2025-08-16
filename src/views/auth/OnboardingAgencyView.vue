<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createAgency, addAdminMembership, slugify } from '@/services/agencies/agency'
import { useRouter } from 'vue-router'
import { useSonner } from '@/plugins/sonner'

const router = useRouter()
const { toastError, toastSuccess } = useSonner()

const name = ref('')
const description = ref('')
const address = ref('')
const contact_email = ref('')
const contact_phone = ref('')
const website = ref('')
const isLoading = ref(false)

async function submit() {
  try {
    isLoading.value = true
    const agency = await createAgency({
      name: name.value,
      description: description.value || undefined,
      address: address.value || undefined,
      contact_email: contact_email.value || undefined,
      contact_phone: contact_phone.value || undefined,
      website: website.value || undefined,
    })
    await addAdminMembership(agency.id)
    toastSuccess('Agence créée')
    const slug = slugify(agency.name)
    router.replace({ name: 'agency-home', params: { slug } })
  } catch (e: any) {
    toastError(e?.message || 'Impossible de créer votre agence')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container max-w-xl mx-auto py-10 space-y-6">
    <h1 class="text-2xl font-semibold">Créer votre agence</h1>
    <div class="grid gap-4">
      <div>
        <Label for="name">Nom de l'agence</Label>
        <Input id="name" v-model="name" placeholder="Ex: Mopayo Transport" />
      </div>
      <div>
        <Label for="description">Description</Label>
        <Input id="description" v-model="description" placeholder="Brève description" />
      </div>
      <div>
        <Label for="address">Adresse</Label>
        <Input id="address" v-model="address" placeholder="Adresse de l'agence" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <Label for="contact_email">Email de contact</Label>
          <Input
            id="contact_email"
            v-model="contact_email"
            type="email"
            placeholder="contact@..."
          />
        </div>
        <div>
          <Label for="contact_phone">Téléphone</Label>
          <Input id="contact_phone" v-model="contact_phone" placeholder="+221..." />
        </div>
      </div>
      <div>
        <Label for="website">Site web</Label>
        <Input id="website" v-model="website" placeholder="https://..." />
      </div>
      <Button :disabled="isLoading" @click="submit">Continuer</Button>
    </div>
  </div>
</template>

<style scoped></style>
