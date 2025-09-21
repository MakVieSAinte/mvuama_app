<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSonner } from '@/plugins/sonner'
import { Pencil, Loader2 } from 'lucide-vue-next'
import { UserService } from '@/services/user/userService'
import { UserProfileForm } from '@/formBuilder/user/userProfileForm'
import { useUserStore } from '@/stores/userStore'
import { countries } from '@/lib/countries'
import { currencies } from '@/lib/currency'
import { countryCodeToFlag } from '@/lib/codeToFlags'
import type { IUserProfileModel } from '@/interfaces/userProfileInterface'

export default defineComponent({
  name: 'UserProfileInfo',
  components: {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Avatar,
    AvatarImage,
    AvatarFallback,
    Pencil,
    Loader2,
    UiButton: Button,
    UiInput: Input,
    UiLabel: Label,
    UiSelect: Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  },

  setup() {
    const { toast, toastSuccess, toastError } = useSonner()

    // Utilisation du store utilisateur
    const userStore = useUserStore()

    // États
    const profile = ref<IUserProfileModel | null>(null)
    const profileForm = ref(new UserProfileForm())
    const avatarUrl = ref('')
    const isSaving = ref(false)
    const isLoading = ref(true)

    // Données pour les sélecteurs de pays et devise
    const countryList = ref(countries)
    const currencyList = ref(currencies)

    // Fonction pour obtenir les initiales pour l'avatar
    const getAvatarInitials = () => {
      if (!profile.value?.full_name) return 'U'

      const nameParts = profile.value.full_name.split(' ')
      if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase()

      return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase()
    }

    // Récupération des données du profil
    const loadUserProfile = async () => {
      isLoading.value = true

      try {
        // Récupération du profil utilisateur via le store ou l'API
        if (userStore.currentUser) {
          // Utiliser les données du store si disponibles
          profile.value = userStore.currentUser
          avatarUrl.value = userStore.userAvatar || ''
        } else {
          // Sinon charger depuis l'API
          await userStore.fetchUserProfile()

          if (!userStore.currentUser) {
            // Fallback au service si le store n'a pas pu charger le profil
            const currentUser = await UserService.getCurrentUser()
            if (!currentUser) {
              toastError('Vous devez être connecté pour voir votre profil')
              isLoading.value = false
              return
            }

            const userData = await UserService.getUserProfile()
            if (userData) {
              profile.value = userData
              avatarUrl.value = userData.avatar_url || ''
            } else {
              // Configuration minimale si pas de profil trouvé
              const firstName =
                currentUser.user_metadata?.first_name || currentUser.email?.split('@')[0] || ''
              const lastName = currentUser.user_metadata?.last_name || ''

              profile.value = {
                id: currentUser.id,
                first_name: firstName,
                last_name: lastName,
                full_name: `${firstName} ${lastName}`.trim(),
                email: currentUser.email || '',
                created_at: currentUser.created_at,
                phone: null,
                address: null,
                city: null,
                state: null,
                zip: null,
                country: 'République Démocratique du Congo',
                bio: null,
                avatar_url: currentUser.user_metadata?.avatar_url || null,
              }
            }
          } else {
            // Si le store a bien chargé le profil
            profile.value = userStore.currentUser
            avatarUrl.value = userStore.userAvatar || ''
          }
        }

        // Initialisation du formulaire avec les données du profil
        if (profile.value) {
          profileForm.value
            .setFirstName(profile.value.first_name || '')
            .setLastName(profile.value.last_name || '')
            .setEmail(profile.value.email || '')
            .setPhone(profile.value.phone || null)
            .setAddress(profile.value.address || null)
            .setCity(profile.value.city || null)
            .setState(profile.value.state || null)
            .setZip(profile.value.zip || null)
            .setCountry(profile.value.country || 'CD')
            .setCurrency(profile.value.currency || 'CDF')
            .setBio(profile.value.bio || null)
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error)
        toastError('Impossible de charger les informations du profil')
      } finally {
        isLoading.value = false
      }
    }

    // Gestion du changement d'avatar
    const handleAvatarChange = async (event: Event) => {
      const input = event.target as HTMLInputElement
      if (!input.files || input.files.length === 0) return

      const file = input.files[0]

      // Validation du fichier
      if (!file.type.startsWith('image/')) {
        toastError('Veuillez sélectionner une image valide (jpg, png, etc.)')
        return
      }

      // Taille max 2Mo
      if (file.size > 2 * 1024 * 1024) {
        toastError("L'image est trop volumineuse. Taille maximale: 2 Mo")
        return
      }

      try {
        toast({
          title: 'Téléchargement en cours...',
          description: 'Veuillez patienter pendant le téléchargement de votre avatar',
        })

        // Upload vers Supabase Storage
        const newAvatarUrl = await UserService.updateAvatar(file)

        if (newAvatarUrl) {
          avatarUrl.value = newAvatarUrl
          toastSuccess('Avatar mis à jour avec succès')
        } else {
          toastError("Impossible de mettre à jour l'avatar")
        }
      } catch (error) {
        console.error("Erreur lors du téléchargement de l'avatar:", error)
        toastError("Impossible de mettre à jour l'avatar")
      }
    }

    // Sauvegarde des modifications du profil
    const saveProfile = async () => {
      // Validation du formulaire
      if (!profileForm.value.isValid()) {
        toastError('Veuillez corriger les erreurs dans le formulaire')
        return
      }

      isSaving.value = true

      try {
        // Récupération des données du formulaire
        const formData = profileForm.value.getUserProfileData()

        // Vérification si l'utilisateur existe dans la table users
        const currentUser = await UserService.getCurrentUser()
        if (!currentUser) {
          toastError("Vous n'êtes plus connecté. Veuillez vous reconnecter.")
          isSaving.value = false
          return
        }

        // Envoi à Supabase
        const updatedProfile = await UserService.updateUserProfile(formData)

        if (updatedProfile) {
          profile.value = updatedProfile

          // Mettre à jour le store (pour être sûr, même si déjà fait par le service)
          userStore.updateUserProfile(updatedProfile)

          toastSuccess('Profil mis à jour avec succès')
        } else {
          toastError('Impossible de mettre à jour le profil')
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du profil:', error)
        toastError('Impossible de mettre à jour le profil. Veuillez réessayer.')
      } finally {
        isSaving.value = false
      }
    }

    // Annulation des modifications
    const cancelChanges = () => {
      if (profile.value) {
        // Réinitialisation du formulaire avec les données actuelles
        profileForm.value
          .setFirstName(profile.value.first_name)
          .setLastName(profile.value.last_name)
          .setEmail(profile.value.email)
          .setPhone(profile.value.phone || null)
          .setAddress(profile.value.address || null)
          .setCity(profile.value.city || null)
          .setState(profile.value.state || null)
          .setZip(profile.value.zip || null)
          .setCountry(profile.value.country || null)
          .setCurrency(profile.value.currency || null)
          .setBio(profile.value.bio || null)
      }
    }

    // Chargement initial du profil
    onMounted(async () => {
      // Si le store a déjà les données, on les utilise
      if (userStore.currentUser) {
        console.log('Utilisation des données du store pour le profil')
        profile.value = userStore.currentUser
        avatarUrl.value = userStore.userAvatar || ''

        // Initialiser le formulaire
        profileForm.value
          .setFirstName(userStore.userFirstName)
          .setLastName(userStore.userLastName)
          .setEmail(userStore.userEmail)
          .setPhone(profile.value.phone || null)
          .setAddress(profile.value.address || null)
          .setCity(profile.value.city || null)
          .setState(profile.value.state || null)
          .setZip(profile.value.zip || null)
          .setCountry(profile.value.country || 'République Démocratique du Congo')
          .setBio(profile.value.bio || null)

        isLoading.value = false
      } else {
        // Sinon on charge depuis l'API
        await loadUserProfile()
      }
    })

    return {
      profile,
      profileForm,
      avatarUrl,
      isSaving,
      isLoading,
      getAvatarInitials,
      handleAvatarChange,
      saveProfile,
      cancelChanges,
      countries: countryList,
      currencies: currencyList,
      countryCodeToFlag,
    }
  },
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Informations Personnelles</CardTitle>
      <CardDescription>Gérez vos informations personnelles et votre profil</CardDescription>
    </CardHeader>
    <CardContent>
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
        <span class="ml-2">Chargement du profil...</span>
      </div>

      <form v-else @submit.prevent="saveProfile" class="space-y-6">
        <div class="flex items-center space-x-4 mb-6">
          <div class="relative h-24 w-24">
            <Avatar class="h-24 w-24">
              <AvatarImage v-if="avatarUrl" :src="avatarUrl" alt="Photo de profil" />
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
            <h3 class="font-medium">{{ profile?.full_name || 'Utilisateur' }}</h3>
            <p class="text-muted-foreground text-sm">{{ profile?.email }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <UiLabel for="first_name">Prénom</UiLabel>
            <UiInput
              id="first_name"
              v-model="profileForm.firstName"
              placeholder="Votre prénom"
              :class="{ 'border-red-500': profileForm.errorFirstName }"
            />
            <p v-if="profileForm.errorFirstName" class="text-red-500 text-xs mt-1">
              Veuillez saisir un prénom valide
            </p>
          </div>

          <div class="space-y-2">
            <UiLabel for="last_name">Nom</UiLabel>
            <UiInput
              id="last_name"
              v-model="profileForm.lastName"
              placeholder="Votre nom"
              :class="{ 'border-red-500': profileForm.errorLastName }"
            />
            <p v-if="profileForm.errorLastName" class="text-red-500 text-xs mt-1">
              Veuillez saisir un nom valide
            </p>
          </div>

          <div class="space-y-2">
            <UiLabel for="email">Email</UiLabel>
            <UiInput
              id="email"
              v-model="profileForm.email"
              type="email"
              disabled
              placeholder="votre@email.com"
            />
          </div>

          <div class="space-y-2">
            <UiLabel for="phone">Téléphone</UiLabel>
            <UiInput id="phone" v-model="profileForm.phone" placeholder="+243 xxxxxxxx" />
          </div>

          <div class="space-y-2">
            <UiLabel for="country">Pays</UiLabel>
            <UiSelect v-model="profileForm.country">
              <SelectTrigger
                id="country"
                class="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:border-primary transition-colors duration-150"
              >
                <SelectValue placeholder="Sélectionnez un pays" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Pays</SelectLabel>
                  <SelectItem v-for="c in countries" :key="c.code" :value="c.code">
                    <img
                      :src="`https://flagcdn.com/24x18/${c.code.toLowerCase()}.png`"
                      width="15"
                      height="9"
                    />
                    <span>{{ countryCodeToFlag(c.code) }}</span> {{ c.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </UiSelect>
          </div>

          <div class="space-y-2">
            <UiLabel for="currency">Devise</UiLabel>
            <UiSelect v-model="profileForm.currency">
              <SelectTrigger
                id="currency"
                class="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:border-primary transition-colors duration-150"
              >
                <SelectValue placeholder="Sélectionnez une devise" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Devise</SelectLabel>
                  <SelectItem v-for="c in currencies" :key="c.code" :value="c.code">
                    <span class="text-bold">{{ c.symbol }}</span> {{ c.name }} ({{ c.code }})
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </UiSelect>
          </div>

          <div class="space-y-2 md:col-span-2">
            <UiLabel for="address">Adresse</UiLabel>
            <UiInput id="address" v-model="profileForm.address" placeholder="Votre adresse" />
          </div>

          <div class="space-y-2">
            <UiLabel for="city">Ville</UiLabel>
            <UiInput id="city" v-model="profileForm.city" placeholder="Votre ville" />
          </div>

          <div class="space-y-2">
            <UiLabel for="zip">Code postal</UiLabel>
            <UiInput id="zip" v-model="profileForm.zip" placeholder="Code postal" />
          </div>
        </div>

        <div class="space-y-2">
          <UiLabel for="bio">Biographie</UiLabel>
          <textarea
            id="bio"
            v-model="profileForm.bio"
            rows="4"
            placeholder="Quelques mots sur vous..."
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          ></textarea>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-end space-x-2">
      <UiButton variant="outline" @click="cancelChanges" :disabled="isLoading || isSaving">
        Annuler
      </UiButton>
      <UiButton
        type="submit"
        :disabled="isLoading || isSaving"
        @click="saveProfile"
        class="inline-flex items-center"
      >
        <Loader2 v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
        {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
      </UiButton>
    </CardFooter>
  </Card>
</template>
