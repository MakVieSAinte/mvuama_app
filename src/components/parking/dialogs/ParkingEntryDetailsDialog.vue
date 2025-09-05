<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[650px]">
      <DialogHeader>
        <DialogTitle>Détails de sortie du véhicule</DialogTitle>
        <DialogDescription>
          Informations complètes sur la sortie et le retour du véhicule
        </DialogDescription>
      </DialogHeader>

      <div v-if="entry && vehicle" class="space-y-6">
        <!-- En-tête avec info véhicule -->
        <div class="flex items-center gap-4">
          <Avatar class="h-14 w-14 border border-border">
            <Car class="h-8 w-8" />
            <AvatarFallback>{{ vehicle.marque?.substring(0, 2).toUpperCase() }}</AvatarFallback>
          </Avatar>
          <div>
            <h3 class="text-lg font-semibold mb-0.5">{{ vehicle.immatriculation }}</h3>
            <p class="text-muted-foreground">
              {{ vehicle.marque }} {{ vehicle.modele }} ({{ vehicle.annee }})
            </p>
          </div>
        </div>

        <Separator />

        <!-- Informations principales -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">Statut</p>
            <Badge :variant="entry.dateSortie ? 'success' : 'warning'" class="mt-1">
              {{ entry.dateSortie ? 'Terminé' : 'En cours' }}
            </Badge>
          </div>

          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">Place de parking</p>
            <p class="font-medium">{{ entry.place }}</p>
          </div>

          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">Conducteur</p>
            <p class="font-medium">{{ entry.conducteur }}</p>
          </div>

          <div class="space-y-1" v-if="entry.destination">
            <p class="text-sm text-muted-foreground">Destination</p>
            <p class="font-medium">{{ entry.destination }}</p>
          </div>
        </div>

        <Separator />

        <!-- Dates et durée -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">Date de sortie</p>
            <div class="font-medium">
              <p>{{ formatDateTime(entry.dateEntree).date }}</p>
              <p class="text-sm text-muted-foreground">
                {{ formatDateTime(entry.dateEntree).time }}
              </p>
            </div>
          </div>

          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">Date de retour</p>
            <div v-if="entry.dateSortie">
              <p class="font-medium">{{ formatDateTime(entry.dateSortie).date }}</p>
              <p class="text-sm text-muted-foreground">
                {{ formatDateTime(entry.dateSortie).time }}
              </p>
            </div>
            <p v-else class="italic text-muted-foreground">Non retourné</p>
          </div>

          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">Durée d'utilisation</p>
            <p class="font-medium">
              {{ calculateUsageDuration(entry.dateEntree, entry.dateSortie) }}
            </p>
          </div>

          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">Date d'échéance</p>
            <div class="font-medium" :class="getExpiryStatusClass(entry.dateEcheance)">
              <p>{{ formatDateTime(entry.dateEcheance).date }}</p>
              <p class="text-sm">{{ getExpiryStatus(entry.dateEcheance) }}</p>
            </div>
          </div>
        </div>

        <Separator />

        <!-- Kilométrage et distance -->
        <div class="grid grid-cols-3 gap-4">
          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">Kilométrage de sortie</p>
            <p class="font-medium">{{ formatNumber(entry.kilometrageSortie) }} km</p>
          </div>

          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">Kilométrage de retour</p>
            <p class="font-medium" v-if="entry.kilometrageRetour">
              {{ formatNumber(entry.kilometrageRetour) }} km
            </p>
            <p v-else class="italic text-muted-foreground">Non enregistré</p>
          </div>

          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">Distance parcourue</p>
            <p class="font-medium" v-if="entry.kilometrageRetour && entry.kilometrageSortie">
              {{ formatNumber(entry.kilometrageRetour - entry.kilometrageSortie) }} km
            </p>
            <p v-else class="italic text-muted-foreground">Non disponible</p>
          </div>
        </div>

        <!-- Notes (si présentes dans le futur) -->
        <div v-if="entry.notes" class="space-y-1">
          <p class="text-sm text-muted-foreground">Notes</p>
          <div class="bg-muted p-3 rounded-md">
            <p>{{ entry.notes }}</p>
          </div>
        </div>
      </div>

      <!-- Erreur ou cas où entry/vehicle est null -->
      <div v-else class="text-center py-6">
        <XCircle class="h-10 w-10 text-muted-foreground mx-auto mb-2" />
        <p>Impossible de charger les détails de cette entrée</p>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="$emit('update:open', false)"> Fermer </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { format, parseISO, differenceInDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { ParkingEntry, Vehicle } from '../../../types/fleet'
import { Car, XCircle } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// Props
defineProps<{
  open: boolean
  entry: ParkingEntry | null
  vehicle: Vehicle | null
}>()

// Emits
defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

// Methods
const formatDateTime = (dateString?: string) => {
  if (!dateString) return { date: '-', time: '-' }

  const date = parseISO(dateString)
  return {
    date: format(date, 'PPP', { locale: fr }),
    time: format(date, 'HH:mm', { locale: fr }),
  }
}

const calculateUsageDuration = (dateEntree: string, dateSortie?: string): string => {
  const start = parseISO(dateEntree)
  const end = dateSortie ? parseISO(dateSortie) : new Date()

  const diffMs = end.getTime() - start.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (diffDays > 0) {
    return `${diffDays}j ${diffHours}h ${diffMinutes}min`
  } else if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}min`
  } else {
    return `${diffMinutes}min`
  }
}

const formatNumber = (num?: number): string => {
  if (num === undefined || num === null) return '-'
  return num.toLocaleString('fr-FR')
}

const getExpiryStatus = (dateEcheance: string): string => {
  const today = new Date()
  const expiryDate = parseISO(dateEcheance)
  const days = differenceInDays(expiryDate, today)

  if (days < 0) {
    return `Dépassée de ${Math.abs(days)} jour(s)`
  } else if (days <= 10) {
    return `Urgent - dans ${days} jour(s)`
  } else if (days <= 30) {
    return `Dans ${days} jours`
  } else {
    return `Dans ${Math.floor(days / 30)} mois et ${days % 30} jour(s)`
  }
}

const getExpiryStatusClass = (dateEcheance: string): string => {
  const today = new Date()
  const expiryDate = parseISO(dateEcheance)
  const days = differenceInDays(expiryDate, today)

  if (days < 0) {
    return 'text-destructive'
  } else if (days <= 10) {
    return 'text-orange-500'
  } else if (days <= 30) {
    return 'text-amber-500'
  } else {
    return ''
  }
}
</script>
