<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <Button variant="outline" @click="$emit('cancel')">
        <ChevronLeft class="mr-2 h-4 w-4" />
        Retour
      </Button>
      <h2 class="text-2xl font-semibold">Nouvelle sortie de véhicule</h2>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Enregistrer une sortie</CardTitle>
        <CardDescription>
          Complétez les informations nécessaires pour enregistrer la sortie d'un véhicule du parc
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="info" class="mb-6">
          <InfoIcon class="h-4 w-4" />
          <AlertTitle>Information importante</AlertTitle>
          <AlertDescription>
            L'échéance de parking sera automatiquement fixée à 3 mois après la sortie. Une alerte
            sera déclenchée 10 jours avant l'échéance.
          </AlertDescription>
        </Alert>

        <form @submit.prevent="submitForm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Sélection du véhicule -->
            <div class="space-y-2">
              <Label for="vehicule">Véhicule *</Label>
              <Select v-model="form.vehiculeId">
                <SelectTrigger id="vehicule" :class="{ 'border-destructive': errors.vehiculeId }">
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select-vehicle" disabled>Sélectionner un véhicule</SelectItem>
                  <SelectItem v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
                    {{ vehicle.immatriculation }} - {{ vehicle.marque }} {{ vehicle.modele }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p v-if="errors.vehiculeId" class="text-destructive text-sm">
                Veuillez sélectionner un véhicule
              </p>
            </div>

            <!-- Place de parking -->
            <div class="space-y-2">
              <Label for="place">Place de parking *</Label>
              <Input
                id="place"
                v-model="form.place"
                placeholder="A-15, B-08, etc."
                :class="{ 'border-destructive': errors.place }"
              />
              <p v-if="errors.place" class="text-destructive text-sm">
                La place de parking est requise
              </p>
            </div>

            <!-- Conducteur -->
            <div class="space-y-2">
              <Label for="conducteur">Conducteur *</Label>
              <Input
                id="conducteur"
                v-model="form.conducteur"
                placeholder="Nom du conducteur"
                :class="{ 'border-destructive': errors.conducteur }"
              />
              <p v-if="errors.conducteur" class="text-destructive text-sm">
                Le nom du conducteur est requis
              </p>
            </div>

            <!-- Destination -->
            <div class="space-y-2">
              <Label for="destination">Destination</Label>
              <Input
                id="destination"
                v-model="form.destination"
                placeholder="Lieu de destination (optionnel)"
              />
            </div>

            <!-- Kilométrage de sortie -->
            <div class="space-y-2">
              <Label for="kilometrage">Kilométrage actuel *</Label>
              <div class="flex items-center">
                <Input
                  id="kilometrage"
                  v-model="form.kilometrageSortie"
                  type="number"
                  placeholder="Kilométrage au compteur"
                  min="0"
                  :class="{
                    'border-destructive': errors.kilometrageSortie,
                    'rounded-r-none': true,
                  }"
                />
                <span
                  class="bg-muted text-muted-foreground px-3 py-2 border border-l-0 rounded-r-md"
                  >km</span
                >
              </div>
              <p v-if="errors.kilometrageSortie" class="text-destructive text-sm">
                Le kilométrage est requis et doit être un nombre positif
              </p>
            </div>

            <!-- Date de retour prévue -->
            <div class="space-y-2">
              <Label for="return-date">Date de retour prévue</Label>
              <Popover>
                <PopoverTrigger as-child>
                  <Button
                    id="return-date"
                    variant="outline"
                    :class="[
                      'w-full justify-start text-left font-normal',
                      !form.returnDate && 'text-muted-foreground',
                    ]"
                  >
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {{
                      form.returnDate
                        ? format(form.returnDate, 'PPP', { locale: fr })
                        : 'Sélectionner une date'
                    }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar
                    mode="single"
                    v-model="form.returnDate"
                    :disabled-date="(date) => date < new Date()"
                  />
                </PopoverContent>
              </Popover>
              <p class="text-xs text-muted-foreground">
                Optionnel. Aide à planifier le retour du véhicule.
              </p>
            </div>

            <!-- Notes -->
            <div class="col-span-1 md:col-span-2 space-y-2">
              <Label for="notes">Notes</Label>
              <Textarea
                id="notes"
                v-model="form.notes"
                placeholder="Informations supplémentaires concernant cette sortie"
                rows="3"
              />
            </div>
          </div>

          <!-- Boutons -->
          <div class="flex gap-4 mt-6">
            <Button
              type="submit"
              :disabled="!isFormValid"
              :class="{
                'opacity-50 cursor-not-allowed': !isFormValid,
              }"
            >
              <CheckIcon class="mr-2 h-4 w-4" />
              Enregistrer la sortie
            </Button>
            <Button variant="outline" type="button" @click="$emit('cancel')"> Annuler </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Vehicle } from '../../types/fleet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, CheckIcon, ChevronLeft, InfoIcon } from 'lucide-vue-next'

// Props and Emits
defineProps<{
  vehicles: Vehicle[]
}>()

defineEmits<{
  (e: 'submit', formData: any): void
  (e: 'cancel'): void
}>()

// Form state
const form = ref({
  vehiculeId: 'select-vehicle',
  place: '',
  conducteur: '',
  destination: '',
  kilometrageSortie: 0 as number | null,
  returnDate: null as Date | null,
  notes: '',
})

// Form validation
const errors = ref({
  vehiculeId: false,
  place: false,
  conducteur: false,
  kilometrageSortie: false,
})

const validateForm = () => {
  errors.value.vehiculeId = form.value.vehiculeId === 'select-vehicle'
  errors.value.place = !form.value.place.trim()
  errors.value.conducteur = !form.value.conducteur.trim()
  errors.value.kilometrageSortie =
    !form.value.kilometrageSortie || form.value.kilometrageSortie <= 0

  return (
    !errors.value.vehiculeId &&
    !errors.value.place &&
    !errors.value.conducteur &&
    !errors.value.kilometrageSortie
  )
}

const isFormValid = computed(() => {
  return (
    form.value.vehiculeId !== 'select-vehicle' &&
    form.value.place.trim() !== '' &&
    form.value.conducteur.trim() !== '' &&
    form.value.kilometrageSortie !== null &&
    form.value.kilometrageSortie > 0
  )
})

// Form submission
const submitForm = () => {
  if (validateForm()) {
    const formData = {
      vehiculeId: form.value.vehiculeId,
      place: form.value.place,
      conducteur: form.value.conducteur,
      destination: form.value.destination || undefined,
      kilometrageSortie: form.value.kilometrageSortie,
      returnDate: form.value.returnDate,
      notes: form.value.notes || undefined,
    }

    // Emit to parent component
    emit('submit', formData)
  }
}
</script>
