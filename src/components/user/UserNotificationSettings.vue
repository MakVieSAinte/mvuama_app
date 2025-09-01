<script setup lang="ts">
import { ref } from 'vue'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useSonner } from '@/plugins/sonner'

const { toastSuccess, toastError } = useSonner()

// Types pour les préférences de notification
interface NotificationType {
  id: string
  title: string
  description: string
  enabled: boolean
  required: boolean
}

interface NotificationChannel {
  id: string
  title: string
  description: string
  enabled: boolean
  required: boolean
}

// Types de notifications disponibles
const notificationTypes = ref<NotificationType[]>([
  {
    id: 'system',
    title: 'Système',
    description: 'Informations importantes sur la plateforme et votre compte',
    enabled: true,
    required: true
  },
  {
    id: 'vehicles',
    title: 'Véhicules',
    description: 'Mises à jour concernant l\'état et l\'emplacement des véhicules',
    enabled: true,
    required: false
  },
  {
    id: 'drivers',
    title: 'Chauffeurs',
    description: 'Activités et statuts des chauffeurs',
    enabled: true,
    required: false
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    description: 'Rappels d\'entretien et réparations à programmer',
    enabled: true,
    required: false
  },
  {
    id: 'payments',
    title: 'Paiements',
    description: 'Factures et confirmation de paiements',
    enabled: true,
    required: false
  },
  {
    id: 'marketing',
    title: 'Marketing',
    description: 'Offres spéciales et nouvelles fonctionnalités',
    enabled: false,
    required: false
  }
])

// Canaux de notification
const notificationChannels = ref<NotificationChannel[]>([
  {
    id: 'app',
    title: 'Dans l\'application',
    description: 'Notifications directement dans l\'interface utilisateur',
    enabled: true,
    required: true
  },
  {
    id: 'email',
    title: 'Email',
    description: 'Notifications envoyées à votre adresse email',
    enabled: true,
    required: false
  },
  {
    id: 'sms',
    title: 'SMS',
    description: 'Alertes par SMS sur votre téléphone mobile',
    enabled: false,
    required: false
  },
  {
    id: 'push',
    title: 'Notifications push',
    description: 'Alertes sur votre navigateur même lorsque l\'application est fermée',
    enabled: true,
    required: false
  }
])

// État du formulaire
const isSaving = ref(false)

// Sauvegarder les préférences
const savePreferences = async () => {
  isSaving.value = true
  
  try {
    // Simulation d'une requête API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toastSuccess('Préférences de notification mises à jour')
  } catch (error) {
    console.error('Erreur lors de la mise à jour des préférences:', error)
    toastError('Impossible de mettre à jour les préférences')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Préférences de notifications</CardTitle>
      <CardDescription>
        Choisissez les notifications que vous souhaitez recevoir et comment
      </CardDescription>
    </CardHeader>
    
    <CardContent>
      <div class="space-y-6">
        <!-- Types de notifications -->
        <div>
          <h3 class="text-lg font-medium mb-4">Types de notifications</h3>
          
          <div class="space-y-4">
            <div 
              v-for="type in notificationTypes" 
              :key="type.id"
              class="flex items-center justify-between space-x-2"
            >
              <div class="space-y-0.5">
                <Label :for="`notification-type-${type.id}`">
                  {{ type.title }}
                  <span v-if="type.required" class="text-xs text-muted-foreground"> (Obligatoire)</span>
                </Label>
                <p class="text-sm text-muted-foreground">
                  {{ type.description }}
                </p>
              </div>
              
              <Switch
                :id="`notification-type-${type.id}`"
                v-model="type.enabled"
                :disabled="type.required"
              />
            </div>
          </div>
        </div>
        
        <!-- Canaux de notification -->
        <div class="pt-6 border-t">
          <h3 class="text-lg font-medium mb-4">Canaux de communication</h3>
          
          <div class="space-y-4">
            <div 
              v-for="channel in notificationChannels" 
              :key="channel.id"
              class="flex items-center justify-between space-x-2"
            >
              <div class="space-y-0.5">
                <Label :for="`notification-channel-${channel.id}`">
                  {{ channel.title }}
                  <span v-if="channel.required" class="text-xs text-muted-foreground"> (Obligatoire)</span>
                </Label>
                <p class="text-sm text-muted-foreground">
                  {{ channel.description }}
                </p>
              </div>
              
              <Switch
                :id="`notification-channel-${channel.id}`"
                v-model="channel.enabled"
                :disabled="channel.required"
              />
            </div>
          </div>
        </div>
        
        <!-- Fréquence des résumés -->
        <div class="pt-6 border-t">
          <h3 class="text-lg font-medium mb-4">Résumés de notifications</h3>
          
          <div class="space-y-2">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button variant="outline" class="justify-center">Jamais</Button>
              <Button variant="default" class="justify-center">Quotidien</Button>
              <Button variant="outline" class="justify-center">Hebdomadaire</Button>
              <Button variant="outline" class="justify-center">Mensuel</Button>
            </div>
            <p class="text-xs text-muted-foreground mt-2">
              Recevez un résumé de toutes vos notifications non lues selon la fréquence choisie.
            </p>
          </div>
        </div>
      </div>
    </CardContent>
    
    <CardFooter>
      <Button @click="savePreferences" :disabled="isSaving">
        {{ isSaving ? 'Enregistrement...' : 'Enregistrer les préférences' }}
      </Button>
    </CardFooter>
  </Card>
</template>
