<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSonner } from '@/plugins/sonner'

const { toastSuccess, toastError } = useSonner()

// État du formulaire de changement de mot de passe
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isSaving = ref(false)
const changePassword = async () => {
  // Validation de base
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
    toastError('Tous les champs sont obligatoires')
    return
  }
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toastError('Les nouveaux mots de passe ne correspondent pas')
    return
  }

  isSaving.value = true
  try {
    // Simulation de sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Réinitialiser les champs
    passwordForm.value.currentPassword = ''
    passwordForm.value.newPassword = ''
    passwordForm.value.confirmPassword = ''
    
    toastSuccess('Mot de passe modifié avec succès')
  } catch (error) {
    console.error('Erreur lors de la modification du mot de passe:', error)
    toastError('Impossible de modifier le mot de passe')
  } finally {
    isSaving.value = false
  }
}

// Authentification à deux facteurs
const twoFAEnabled = ref(false)
const isEnabling2FA = ref(false)

const toggleTwoFA = async () => {
  isEnabling2FA.value = true
  try {
    // Simulation d'activation/désactivation de la 2FA
    await new Promise(resolve => setTimeout(resolve, 1000))
    twoFAEnabled.value = !twoFAEnabled.value
    toastSuccess(twoFAEnabled.value 
      ? 'Authentification à deux facteurs activée'
      : 'Authentification à deux facteurs désactivée'
    )
  } catch (error) {
    console.error('Erreur lors de la configuration de la 2FA:', error)
    toastError('Impossible de modifier les paramètres d\'authentification')
  } finally {
    isEnabling2FA.value = false
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Sécurité du Compte</CardTitle>
      <CardDescription>Gérez les paramètres de sécurité de votre compte</CardDescription>
    </CardHeader>
    <CardContent class="space-y-6">
      <form @submit.prevent="changePassword" class="space-y-4">
        <h3 class="text-lg font-semibold">Changer le mot de passe</h3>
        
        <div class="space-y-2">
          <Label for="current-password">Mot de passe actuel</Label>
          <Input
            id="current-password"
            v-model="passwordForm.currentPassword"
            type="password"
            placeholder="Entrez votre mot de passe actuel"
            autocomplete="current-password"
          />
        </div>

        <div class="space-y-2">
          <Label for="new-password">Nouveau mot de passe</Label>
          <Input
            id="new-password"
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="Entrez votre nouveau mot de passe"
            autocomplete="new-password"
          />
        </div>

        <div class="space-y-2">
          <Label for="confirm-password">Confirmer le mot de passe</Label>
          <Input
            id="confirm-password"
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="Confirmez votre nouveau mot de passe"
            autocomplete="new-password"
          />
        </div>
        
        <Button type="submit" :disabled="isSaving" class="w-full">
          {{ isSaving ? 'Modification en cours...' : 'Modifier le mot de passe' }}
        </Button>
      </form>

      <div class="space-y-4 pt-6">
        <h3 class="text-lg font-semibold">Authentification à deux facteurs</h3>
        <p class="text-sm text-muted-foreground">
          L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire à votre compte.
        </p>

        <Button 
          variant="outline" 
          :disabled="isEnabling2FA"
          @click="toggleTwoFA"
          class="w-full"
        >
          <span v-if="isEnabling2FA">Configuration en cours...</span>
          <span v-else>{{ twoFAEnabled ? 'Désactiver' : 'Activer' }} l'authentification à deux facteurs</span>
        </Button>
      </div>
      
      <div class="pt-6 border-t">
        <h3 class="text-lg font-semibold text-destructive mb-2">Zone de danger</h3>
        <p class="text-sm text-muted-foreground mb-4">
          Une fois que vous supprimez votre compte, toutes vos données seront définitivement perdues.
        </p>
        <Button variant="destructive">
          Supprimer mon compte
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
