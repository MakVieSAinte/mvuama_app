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
import { Badge } from '@/components/ui/badge'
import { useSonner } from '@/plugins/sonner'
import { CheckCircle2, ChevronRight } from 'lucide-vue-next'

const { toastSuccess, toastError } = useSonner()

// Types pour les plans
interface Plan {
  id: string
  name: string
  description: string
  price: number
  billingCycle: 'monthly' | 'yearly'
  maxVehicles: number | 'unlimited'
  features: string[]
  popular: boolean
  isCurrentPlan?: boolean
}

// Plans disponibles
const plans = ref<Plan[]>([
  {
    id: 'basic',
    name: 'Basique',
    description: 'Idéal pour les petites flottes',
    price: 24.99,
    billingCycle: 'monthly',
    maxVehicles: 10,
    features: [
      'Suivi GPS basique',
      'Rapports mensuels',
      'Support par email',
      'Contrôle d\'accès',
      'Application mobile',
    ],
    popular: false,
    isCurrentPlan: false
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Pour les flottes de taille moyenne',
    price: 49.99,
    billingCycle: 'monthly',
    maxVehicles: 30,
    features: [
      'Suivi GPS en temps réel',
      'Rapports hebdomadaires',
      'Support prioritaire',
      'API d\'intégration',
      'Alertes personnalisées',
      'Contrôle d\'accès avancé',
      'Application mobile premium'
    ],
    popular: true,
    isCurrentPlan: true
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Solution complète pour grandes flottes',
    price: 99.99,
    billingCycle: 'monthly',
    maxVehicles: 'unlimited',
    features: [
      'Suivi avancé en temps réel',
      'Analyses prédictives',
      'Support 24/7',
      'API complète',
      'Formation utilisateurs',
      'Intégration complète',
      'Sauvegarde des données',
      'Tableau de bord personnalisable',
      'Accès multi-équipes'
    ],
    popular: false,
    isCurrentPlan: false
  }
])

// Cycle de facturation
const billingCycle = ref<'monthly' | 'yearly'>('monthly')

// Dialog de confirmation
const showConfirmDialog = ref(false)
const selectedPlan = ref<Plan | null>(null)
const isChangingPlan = ref(false)

// Afficher les prix annualisés
const getAdjustedPrice = (plan: Plan) => {
  if (billingCycle.value === 'yearly') {
    return (plan.price * 10).toFixed(2) // 2 mois gratuits
  }
  return plan.price.toFixed(2)
}

// Ouvrir le dialogue de confirmation
const confirmPlanChange = (plan: Plan) => {
  if (plan.isCurrentPlan) return
  
  selectedPlan.value = plan
  showConfirmDialog.value = true
}

// Changer de plan
const changePlan = async () => {
  if (!selectedPlan.value) return
  
  isChangingPlan.value = true
  
  try {
    // Simulation d'une requête API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mise à jour des plans
    plans.value.forEach(plan => {
      plan.isCurrentPlan = plan.id === selectedPlan.value?.id
    })
    
    showConfirmDialog.value = false
    selectedPlan.value = null
    
    toastSuccess('Votre plan d\'abonnement a été mis à jour')
  } catch (error) {
    console.error('Erreur lors du changement de plan:', error)
    toastError('Impossible de changer de plan')
  } finally {
    isChangingPlan.value = false
  }
}

// Modifier le cycle de facturation
const toggleBillingCycle = () => {
  billingCycle.value = billingCycle.value === 'monthly' ? 'yearly' : 'monthly'
}

// Obtenir le texte pour le nombre de véhicules
const getVehiclesText = (maxVehicles: number | 'unlimited') => {
  if (maxVehicles === 'unlimited') return 'Véhicules illimités'
  return `Jusqu'à ${maxVehicles} véhicule${maxVehicles > 1 ? 's' : ''}`
}

// Calculer les économies en pourcentage
const getSavingsPercentage = () => {
  return 16.67 // 2 mois sur 12 = ~16.67%
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Plans disponibles</CardTitle>
      <CardDescription>
        Choisissez le plan qui correspond le mieux à vos besoins
      </CardDescription>
    </CardHeader>
    
    <CardContent>
      <!-- Switch de cycle de facturation -->
      <div class="flex items-center justify-end mb-8">
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium" :class="{ 'text-primary': billingCycle === 'monthly' }">Mensuel</span>
          
          <Button 
            variant="outline" 
            size="sm" 
            class="relative px-6 h-8"
            @click="toggleBillingCycle"
          >
            <span 
              class="absolute inset-0 h-full w-1/2 bg-primary rounded-sm transition-all duration-200 transform"
              :class="billingCycle === 'yearly' ? 'translate-x-full' : ''"
            />
            <span class="sr-only">Toggle billing cycle</span>
          </Button>
          
          <span class="text-sm font-medium" :class="{ 'text-primary': billingCycle === 'yearly' }">
            Annuel
            <Badge v-if="billingCycle === 'yearly'" variant="secondary" class="ml-1">
              -{{ getSavingsPercentage() }}%
            </Badge>
          </span>
        </div>
      </div>
      
      <!-- Grille de plans -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="plan in plans"
          :key="plan.id"
          class="border transition-all duration-200"
          :class="{
            'border-primary shadow-sm': plan.popular,
            'ring-2 ring-primary': plan.isCurrentPlan
          }"
        >
          <CardHeader>
            <div class="flex justify-between items-start">
              <div>
                <CardTitle>{{ plan.name }}</CardTitle>
                <CardDescription>{{ plan.description }}</CardDescription>
              </div>
              
              <Badge v-if="plan.popular" variant="secondary">Populaire</Badge>
            </div>
          </CardHeader>
          
          <CardContent class="space-y-4">
            <!-- Prix -->
            <div>
              <div class="flex items-baseline">
                <span class="text-3xl font-bold">{{ getAdjustedPrice(plan) }} €</span>
                <span class="text-muted-foreground ml-1">
                  /{{ billingCycle === 'monthly' ? 'mois' : 'an' }}
                </span>
              </div>
              
              <p v-if="billingCycle === 'yearly'" class="text-xs text-muted-foreground mt-1">
                Soit {{ plan.price.toFixed(2) }} € par mois (2 mois offerts)
              </p>
            </div>
            
            <!-- Nombre de véhicules -->
            <p class="font-medium">{{ getVehiclesText(plan.maxVehicles) }}</p>
            
            <!-- Liste des fonctionnalités -->
            <ul class="space-y-2 mt-4">
              <li
                v-for="(feature, index) in plan.features"
                :key="index"
                class="flex items-center gap-2"
              >
                <CheckCircle2 class="h-4 w-4 text-green-600 dark:text-green-400" />
                <span class="text-sm">{{ feature }}</span>
              </li>
            </ul>
          </CardContent>
          
          <CardFooter>
            <Button
              class="w-full"
              :variant="plan.isCurrentPlan ? 'secondary' : 'default'"
              :disabled="plan.isCurrentPlan"
              @click="confirmPlanChange(plan)"
            >
              <span v-if="plan.isCurrentPlan">Plan actuel</span>
              <span v-else>Sélectionner ce plan</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <!-- Note sur les fonctionnalités communes -->
      <p class="text-sm text-muted-foreground mt-8">
        * Tous les plans incluent l'accès de base au tableau de bord, le stockage des données pendant 3 mois et l'assistance technique par email.
      </p>
    </CardContent>
  </Card>
  
  <!-- Dialog de confirmation de changement de plan -->
  <Dialog v-model:open="showConfirmDialog">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Changer de plan</DialogTitle>
        <DialogDescription>
          Vous êtes sur le point de passer au plan {{ selectedPlan?.name }}. Les modifications seront effectives immédiatement.
        </DialogDescription>
      </DialogHeader>
      
      <div class="space-y-4 py-2">
        <div class="flex items-center justify-between">
          <span class="font-medium">Nouveau plan</span>
          <span>{{ selectedPlan?.name }}</span>
        </div>
        
        <div class="flex items-center justify-between">
          <span class="font-medium">Prix</span>
          <span>
            {{ selectedPlan ? getAdjustedPrice(selectedPlan) : '0.00' }} €
            /{{ billingCycle === 'monthly' ? 'mois' : 'an' }}
          </span>
        </div>
        
        <div class="flex items-center justify-between">
          <span class="font-medium">Facturation</span>
          <span>{{ billingCycle === 'monthly' ? 'Mensuelle' : 'Annuelle' }}</span>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" @click="showConfirmDialog = false">
          Annuler
        </Button>
        <Button 
          @click="changePlan"
          :disabled="isChangingPlan"
        >
          {{ isChangingPlan ? 'Changement en cours...' : 'Confirmer le changement' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
