<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useSonner } from '@/plugins/sonner'
import { useUserPrefs } from '@/composables/useUserPrefs'

// Composant de gestion des préférences utilisateur
const { toastSuccess, toastError } = useSonner()
const { theme, toggleTheme, savePrefsToDatabase } = useUserPrefs('user_prefs_mvuama')

// État des préférences
const preferences = ref({
  darkMode: computed({
    get: () => theme.value === 'dark',
    set: (value) => {
      if (value !== (theme.value === 'dark')) {
        toggleTheme()
      }
    },
  }),
  emailNotifications: true,
  smsNotifications: false,
  language: 'fr',
  timezone: 'Africa/Kinshasa',
})

const isSaving = ref(false)

// Sauvegarde des préférences
const savePreferences = async () => {
  isSaving.value = true

  try {
    // Sauvegarde dans Supabase
    const success = await savePrefsToDatabase()

    if (success) {
      toastSuccess('Préférences mises à jour avec succès')
    } else {
      toastError('Impossible de mettre à jour les préférences')
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des préférences:', error)
    toastError('Impossible de mettre à jour les préférences')
  } finally {
    isSaving.value = false
  }
}

// Réinitialisation des préférences
const resetPreferences = () => {
  // Réinitialisation du thème à "light" si actuellement en mode sombre
  if (theme.value === 'dark') {
    toggleTheme()
  }

  // Réinitialisation des autres préférences
  preferences.value.emailNotifications = true
  preferences.value.smsNotifications = false
  preferences.value.language = 'fr'
  preferences.value.timezone = 'Africa/Kinshasa'

  toastSuccess('Préférences réinitialisées')
}

// Liste des langues disponibles
const languages = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'ln', label: 'Lingala' },
  { value: 'sw', label: 'Swahili' },
]

// Liste des fuseaux horaires disponibles
const timezones = [
  { value: 'Africa/Kinshasa', label: 'Kinshasa (GMT+1)' },
  { value: 'Africa/Lubumbashi', label: 'Lubumbashi (GMT+2)' },
  { value: 'Africa/Lagos', label: 'Lagos (GMT+1)' },
  { value: 'Africa/Nairobi', label: 'Nairobi (GMT+3)' },
  { value: 'Europe/Paris', label: 'Paris (GMT+1/GMT+2)' },
  { value: 'Europe/London', label: 'Londres (GMT/GMT+1)' },
  { value: 'America/New_York', label: 'New York (GMT-5/GMT-4)' },
]
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Préférences Utilisateur</CardTitle>
      <CardDescription>Personnalisez votre expérience sur la plateforme</CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="savePreferences" class="space-y-6">
        <!-- Section des préférences générales -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Préférences générales</h3>
          <!-- Espace réservé pour les futures préférences générales -->
        </div>

        <!-- Section des préférences d'interface -->
        <div class="space-y-4 mt-6">
          <h3 class="text-lg font-medium">Préférences d'interface</h3>

          <!-- Préférence de thème -->
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Mode sombre</Label>
              <p class="text-sm text-muted-foreground">Activer le mode sombre pour l'interface</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-muted-foreground">{{
                theme === 'dark' ? 'Activé' : 'Désactivé'
              }}</span>
              <Switch v-model="preferences.darkMode" />
            </div>
          </div>
        </div>

        <!-- Section des préférences de notifications -->
        <div class="space-y-4 mt-6">
          <h3 class="text-lg font-medium">Préférences de notifications</h3>

          <!-- Notifications par email -->
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Notifications par email</Label>
              <p class="text-sm text-muted-foreground">Recevoir des notifications par email</p>
            </div>
            <Switch v-model="preferences.emailNotifications" />
          </div>

          <!-- Notifications par SMS -->
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Notifications par SMS</Label>
              <p class="text-sm text-muted-foreground">Recevoir des notifications par SMS</p>
            </div>
            <Switch v-model="preferences.smsNotifications" />
          </div>
        </div>

        <!-- Section des préférences régionales -->
        <div class="space-y-4 mt-6">
          <h3 class="text-lg font-medium">Préférences régionales</h3>

          <!-- Sélection de la langue -->
          <div class="space-y-2">
            <Label for="language">Langue</Label>
            <select
              id="language"
              v-model="preferences.language"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option v-for="lang in languages" :key="lang.value" :value="lang.value">
                {{ lang.label }}
              </option>
            </select>
          </div>

          <!-- Sélection du fuseau horaire -->
          <div class="space-y-2">
            <Label for="timezone">Fuseau horaire</Label>
            <select
              id="timezone"
              v-model="preferences.timezone"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option v-for="tz in timezones" :key="tz.value" :value="tz.value">
                {{ tz.label }}
              </option>
            </select>
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-end space-x-2">
      <Button variant="outline" @click="resetPreferences" :disabled="isSaving"
        >Réinitialiser</Button
      >
      <Button type="submit" :disabled="isSaving" @click="savePreferences">
        {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
      </Button>
    </CardFooter>
  </Card>
</template>
