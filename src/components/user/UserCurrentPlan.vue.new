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
import { CheckCircle2, AlertTriangle, CreditCard } from 'lucide-vue-next'

const { toastSuccess, toastError } = useSonner()

// Type pour le plan
interface SubscriptionPlan {
  id: string
  name: string
  price: number
  billingCycle: 'monthly' | 'yearly'
  status: 'active' | 'pending' | 'cancelled' | 'expired'
  features: string[]
  startDate: Date
  renewalDate: Date
  paymentMethod: {
    type: 'card' | 'bank' | 'paypal'
    lastFour?: string
    expiry?: string
    name?: string
  }
}

// Plan d'abonnement actuel
const currentPlan = ref<SubscriptionPlan>({
  id: 'standard',
  name: 'Standard',
  price: 49.99,
  billingCycle: 'monthly',
  status: 'active',
  features: [
    'Jusqu\'à 30 véhicules',
    'Suivi GPS en temps réel',
    'Rapports hebdomadaires',
    'Support prioritaire',
    'API d\'intégration'
  ],
  startDate: new Date('2024-01-15'),
  renewalDate: new Date('2024-10-15'),
  paymentMethod: {
    type: 'card',
    lastFour: '4242',
    expiry: '06/2025',
    name: 'Visa'
  }
})

// Dialog de confirmation pour annulation
const showCancelDialog = ref(false)
const isCancelling = ref(false)

// Format de date
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Annuler l'abonnement
const cancelSubscription = async () => {
  isCancelling.value = true
  
  try {
    // Simulation d'une requête API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    currentPlan.value.status = 'cancelled'
    showCancelDialog.value = false
    
    toastSuccess('Votre abonnement sera annulé à la fin de la période en cours')
  } catch (error) {
    console.error('Erreur lors de l\'annulation de l\'abonnement:', error)
    toastError('Impossible d\'annuler l\'abonnement')
  } finally {
    isCancelling.value = false
  }
}

// Obtenir la couleur du badge de statut
const getStatusBadgeClass = () => {
  switch (currentPlan.value.status) {
    case 'active': 
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
    case 'pending': 
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
    case 'cancelled': 
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
    case 'expired': 
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
    default: 
      return ''
  }
}

// Traduire le statut
const getStatusLabel = () => {
  switch (currentPlan.value.status) {
    case 'active': return 'Actif'
    case 'pending': return 'En attente'
    case 'cancelled': return 'Annulé'
    case 'expired': return 'Expiré'
    default: return ''
  }
}

// Obtenir l'icône du moyen de paiement
const getPaymentIcon = () => {
  switch (currentPlan.value.paymentMethod.type) {
    case 'card': return CreditCard
    case 'paypal': return CreditCard // Remplacer par l'icône PayPal si disponible
    case 'bank': return CreditCard // Remplacer par l'icône Bank si disponible
    default: return CreditCard
  }
}

// Obtenir le label du moyen de paiement
const getPaymentMethodLabel = () => {
  const method = currentPlan.value.paymentMethod
  
  switch (method.type) {
    case 'card': 
      return `${method.name} se terminant par ${method.lastFour}`
    case 'paypal': 
      return 'Compte PayPal'
    case 'bank': 
      return 'Prélèvement bancaire'
    default: 
      return 'Moyen de paiement inconnu'
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Votre abonnement actuel</CardTitle>
      <CardDescription>
        Détails et gestion de votre abonnement en cours
      </CardDescription>
    </CardHeader>
    
    <CardContent>
      <div class="space-y-6">
        <!-- En-tête avec nom du plan et badge de statut -->
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-2xl font-bold">{{ currentPlan.name }}</h3>
            <p class="text-muted-foreground">
              {{ currentPlan.price }} € / {{ currentPlan.billingCycle === 'monthly' ? 'mois' : 'an' }}
            </p>
          </div>
          
          <Badge :class="getStatusBadgeClass()">
            <component 
              :is="currentPlan.status === 'active' ? CheckCircle2 : AlertTriangle"
              class="mr-1 h-3 w-3"
            />
            {{ getStatusLabel() }}
          </Badge>
        </div>
        
        <!-- Dates importantes -->
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">Date d'activation</p>
            <p class="font-medium">{{ formatDate(currentPlan.startDate) }}</p>
          </div>
          
          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">Prochaine facturation</p>
            <p class="font-medium">{{ formatDate(currentPlan.renewalDate) }}</p>
          </div>
        </div>
        
        <!-- Méthode de paiement -->
        <div class="pt-4 border-t">
          <h4 class="text-sm font-medium mb-2">Moyen de paiement</h4>
          <div class="flex items-center gap-2">
            <component :is="getPaymentIcon()" class="h-4 w-4 text-muted-foreground" />
            <span>{{ getPaymentMethodLabel() }}</span>
          </div>
        </div>
        
        <!-- Fonctionnalités incluses -->
        <div class="pt-4 border-t">
          <h4 class="text-sm font-medium mb-2">Fonctionnalités incluses</h4>
          <ul class="space-y-2">
            <li 
              v-for="(feature, index) in currentPlan.features" 
              :key="index"
              class="flex items-center gap-2"
            >
              <CheckCircle2 class="h-4 w-4 text-green-600 dark:text-green-400" />
              <span>{{ feature }}</span>
            </li>
          </ul>
        </div>
      </div>
    </CardContent>
    
    <CardFooter class="flex flex-wrap gap-2">
      <Button variant="outline" as="a" href="/subscription/payment-methods">
        Gérer le paiement
      </Button>
      <Button 
        variant="outline" 
        as="a" 
        href="/subscription/available-plans"
      >
        Changer de plan
      </Button>
      <Button 
        variant="destructive" 
        @click="showCancelDialog = true"
        :disabled="currentPlan.status !== 'active'"
      >
        Annuler l'abonnement
      </Button>
    </CardFooter>
  </Card>
  
  <!-- Dialog de confirmation d'annulation -->
  <Dialog v-model:open="showCancelDialog">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Annuler votre abonnement ?</DialogTitle>
        <DialogDescription>
          Vous conserverez l'accès à tous les services jusqu'à la fin de votre période de facturation actuelle, le {{ formatDate(currentPlan.renewalDate) }}.
        </DialogDescription>
      </DialogHeader>
      
      <div class="bg-muted/50 p-4 rounded-lg mt-2">
        <p class="text-sm">
          <AlertTriangle class="inline-block h-4 w-4 mr-1 text-amber-500" />
          L'annulation entraînera la perte d'accès aux fonctionnalités premium.
        </p>
      </div>
      
      <DialogFooter class="mt-4">
        <Button variant="outline" @click="showCancelDialog = false">
          Retour
        </Button>
        <Button 
          variant="destructive" 
          @click="cancelSubscription"
          :disabled="isCancelling"
        >
          {{ isCancelling ? 'Annulation en cours...' : 'Confirmer l\'annulation' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
