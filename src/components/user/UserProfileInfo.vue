<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSonner } from '@/plugins/sonner'
import { Pencil } from 'lucide-vue-next'

// Composant de gestion du profil utilisateur
const { toastSuccess, toastError } = useSonner()

// Initialisation des données du profil
const profile = ref({
  full_name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  bio: '',
})

const avatarUrl = ref('')
const isSaving = ref(false)

// Récupération des données du profil
onMounted(async () => {
  try {
    // Simulation de chargement des données depuis une API
    // Dans un cas réel, appel à une API ou à Supabase
    await new Promise((resolve) => setTimeout(resolve, 500))

    profile.value = {
      full_name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+243 123456789',
      address: '123 Rue Principale',
      city: 'Kinshasa',
      state: '',
      zip: '12345',
      country: 'République Démocratique du Congo',
      bio: 'Professionnel passionné par la technologie et la gestion de flotte automobile.',
    }
  } catch (error) {
    console.error('Erreur lors du chargement du profil:', error)
    toastError('Impossible de charger les informations du profil')
  }
})

// Fonction pour obtenir les initiales pour l'avatar
const getAvatarInitials = () => {
  if (!profile.value.full_name) return 'U'

  const nameParts = profile.value.full_name.split(' ')
  if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase()

  return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase()
}

// Gestion du changement d'avatar
const handleAvatarChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  const file = input.files[0]

  // Validation du fichier
  if (!file.type.startsWith('image/')) {
    toastError('Veuillez sélectionner une image')
    return
  }

  try {
    // Simulation d'upload d'image
    // Dans un cas réel, upload vers Supabase Storage par exemple
    avatarUrl.value = URL.createObjectURL(file)
    toastSuccess('Avatar mis à jour avec succès')
  } catch (error) {
    console.error("Erreur lors du téléchargement de l'avatar:", error)
    toastError("Impossible de mettre à jour l'avatar")
  }
}

// Sauvegarde des modifications du profil
const saveProfile = async () => {
  isSaving.value = true

  try {
    // Simulation de sauvegarde des données
    // Dans un cas réel, envoi des données à une API ou à Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toastSuccess('Profil mis à jour avec succès')
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du profil:', error)
    toastError('Impossible de mettre à jour le profil')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Informations Personnelles</CardTitle>
      <CardDescription>Gérez vos informations personnelles et votre profil</CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="saveProfile" class="space-y-6">
        <div class="flex items-center space-x-4 mb-6">
          <div class="relative h-24 w-24">
            <Avatar class="h-24 w-24">
              <AvatarImage
                :src="avatarUrl || '/src/assets/images/default-avatar.png'"
                alt="Photo de profil"
              />
              <AvatarFallback>{{ getAvatarInitials() }}</AvatarFallback>
            </Avatar>
            <div class="absolute bottom-0 right-0">
              <label
                for="avatar-upload"
                class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-sm"
              >
                <span class="sr-only">Changer la photo</span>
                <Pencil class="h-4 w-4" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleAvatarChange"
              />
            </div>
          </div>
          <div>
            <h3 class="font-medium">{{ profile.full_name || 'Utilisateur' }}</h3>
            <p class="text-muted-foreground text-sm">{{ profile.email }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="full_name">Nom complet</Label>
            <Input id="full_name" v-model="profile.full_name" placeholder="Votre nom complet" />
          </div>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="profile.email"
              type="email"
              disabled
              placeholder="votre@email.com"
            />
          </div>

          <div class="space-y-2">
            <Label for="phone">Téléphone</Label>
            <Input id="phone" v-model="profile.phone" placeholder="+243 xxxxxxxx" />
          </div>

          <div class="space-y-2">
            <Label for="country">Pays</Label>
            <Input id="country" v-model="profile.country" placeholder="Votre pays" />
          </div>

          <div class="space-y-2 md:col-span-2">
            <Label for="address">Adresse</Label>
            <Input id="address" v-model="profile.address" placeholder="Votre adresse" />
          </div>

          <div class="space-y-2">
            <Label for="city">Ville</Label>
            <Input id="city" v-model="profile.city" placeholder="Votre ville" />
          </div>

          <div class="space-y-2">
            <Label for="zip">Code postal</Label>
            <Input id="zip" v-model="profile.zip" placeholder="Code postal" />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="bio">Biographie</Label>
          <textarea
            id="bio"
            v-model="profile.bio"
            rows="4"
            placeholder="Quelques mots sur vous..."
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          ></textarea>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-end space-x-2">
      <Button variant="outline">Annuler</Button>
      <Button type="submit" :disabled="isSaving" @click="saveProfile">
        {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
      </Button>
    </CardFooter>
  </Card>
</template>
