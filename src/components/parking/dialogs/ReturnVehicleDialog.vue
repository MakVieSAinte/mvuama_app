<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Enregistrer le retour du véhicule</DialogTitle>
        <DialogDescription>
          Complétez les informations pour finaliser le retour du véhicule
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit">
        <div v-if="entry && vehicle" class="space-y-6 py-2">
          <!-- Informations du véhicule -->
          <div class="flex items-center space-x-4">
            <Badge variant="outline" class="text-base font-mono">
              {{ vehicle.immatriculation }}
            </Badge>
            <span>{{ vehicle.marque }} {{ vehicle.modele }}</span>
          </div>

          <Separator />

          <!-- Informations de la sortie -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <p class="text-sm text-muted-foreground">Conducteur</p>
              <p>{{ entry.conducteur }}</p>
            </div>

            <div class="space-y-1">
              <p class="text-sm text-muted-foreground">Place de parking</p>
              <p>{{ entry.place }}</p>
            </div>

            <div class="space-y-1">
              <p class="text-sm text-muted-foreground">Date de sortie</p>
              <p>{{ formatDateTime(entry.dateEntree).date }}</p>
            </div>

            <div class="space-y-1">
              <p class="text-sm text-muted-foreground">Durée d'utilisation</p>
              <p>{{ calculateUsageDuration(entry.dateEntree) }}</p>
            </div>
          </div>

          <Separator />

          <!-- Kilomètrage -->
          <div class="space-y-2">
            <Label for="kilometrage-sortie">Kilométrage de sortie</Label>
            <div class="flex items-center">
              <Input
                id="kilometrage-sortie"
                :value="formatNumber(entry.kilometrageSortie)"
                disabled
                class="rounded-r-none"
              />
              <span class="bg-muted text-muted-foreground px-3 py-2 border border-l-0 rounded-r-md"
                >km</span
              >
            </div>
          </div>

          <!-- Kilomètrage de retour -->
          <div class="space-y-2">
            <Label for="kilometrage-retour" class="required">Kilométrage au retour</Label>
            <div class="flex items-center">
              <Input
                id="kilometrage-retour"
                v-model="form.kilometrageRetour"
                type="number"
                :min="entry.kilometrageSortie || 0"
                required
                :class="{ 'border-destructive': errors.kilometrageRetour, 'rounded-r-none': true }"
              />
              <span class="bg-muted text-muted-foreground px-3 py-2 border border-l-0 rounded-r-md"
                >km</span
              >
            </div>
            <p v-if="errors.kilometrageRetour" class="text-sm text-destructive">
              {{ errors.kilometrageRetour }}
            </p>
          </div>

          <!-- Notes de retour -->
          <div class="space-y-2">
            <Label for="notes">Notes de retour</Label>
            <Textarea
              id="notes"
              v-model="form.notes"
              placeholder="Observations, incidents ou informations sur l'état du véhicule..."
              rows="3"
            />
          </div>
        </div>

        <div v-else class="text-center py-6">
          <AlertCircle class="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <p>Impossible de charger les détails du véhicule</p>
        </div>

        <DialogFooter class="mt-6">
          <Button type="button" variant="outline" @click="$emit('update:open', false)">
            Annuler
          </Button>
          <Button
            type="submit"
            :disabled="!isValid || isSubmitting"
            :class="{ 'opacity-50': !isValid || isSubmitting }"
          >
            <CheckIcon v-if="!isSubmitting" class="mr-2 h-4 w-4" />
            <Loader2 v-else class="mr-2 h-4 w-4 animate-spin" />
            Confirmer le retour
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { ParkingEntry, Vehicle } from '../../../types/fleet'
import { AlertCircle, CheckIcon, Loader2 } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

// Props
defineProps<{
  open: boolean
  entry: ParkingEntry | null
  vehicle: Vehicle | null
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'confirm', data: { entryId: string; kilometrageRetour: number; notes?: string }): void
}>()

// State
const form = ref({
  kilometrageRetour: 0,
  notes: '',
})

const errors = ref({
  kilometrageRetour: '',
})

const isSubmitting = ref(false)

// Computed
const isValid = computed(() => {
  const { entry } = props
  if (!entry) return false

  const minKm = entry.kilometrageSortie || 0
  return form.value.kilometrageRetour > minKm
})

// Watch for props changes to update form
watch(
  () => props.entry,
  (newEntry) => {
    if (newEntry) {
      // Préremplir avec une valeur par défaut (kilométrage de sortie + 1)
      form.value.kilometrageRetour = (newEntry.kilometrageSortie || 0) + 1
      form.value.notes = ''
      errors.value.kilometrageRetour = ''
    }
  },
  { immediate: true },
)

// Methods
const formatDateTime = (dateString?: string) => {
  if (!dateString) return { date: '-', time: '-' }

  const date = parseISO(dateString)
  return {
    date: format(date, 'PPP', { locale: fr }),
    time: format(date, 'HH:mm', { locale: fr }),
  }
}

const calculateUsageDuration = (dateEntree: string): string => {
  const start = parseISO(dateEntree)
  const end = new Date()

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

const handleSubmit = () => {
  if (!props.entry) return

  // Validation
  errors.value.kilometrageRetour = ''

  const minKm = props.entry.kilometrageSortie || 0
  if (!form.value.kilometrageRetour) {
    errors.value.kilometrageRetour = 'Le kilométrage de retour est requis'
    return
  }

  if (form.value.kilometrageRetour <= minKm) {
    errors.value.kilometrageRetour = `Le kilométrage doit être supérieur à ${minKm} km`
    return
  }

  // Submit form
  isSubmitting.value = true

  // Simulate API call with short timeout
  setTimeout(() => {
    emit('confirm', {
      entryId: props.entry!.id,
      kilometrageRetour: form.value.kilometrageRetour,
      notes: form.value.notes || undefined,
    })

    isSubmitting.value = false
  }, 500)
}
</script>

<style scoped>
.required::after {
  content: ' *';
  color: var(--destructive);
}
</style>
