<template>
  <Dialog
    :open="open"
    @update:open="
      (val) => {
        if (!val) emit('close')
      }
    "
  >
    <DialogContent class="z-[9999] p-0 bg-transparent" style="pointer-events: all">
      <div
        class="max-w-5xl w-full max-h-[90vh] flex flex-col bg-background rounded-3xl shadow-2xl overflow-hidden"
      >
        <DialogHeader class="p-6 pb-0">
          <DialogTitle>Ajouter un véhicule à la flotte</DialogTitle>
        </DialogHeader>

        <div class="space-y-8 w-full h-full overflow-y-auto py-4 px-8">
          <!-- 1️⃣ Informations générales -->
          <div>
            <h3 class="text-xl font-bold mb-4">1️⃣ Informations générales</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium mb-2">Marque du véhicule</label>
                <UiInput placeholder="Ex : Toyota" v-model="form.marque" />
                <p class="text-xs text-muted-foreground mt-1">
                  Indiquez la marque constructeur (ex : Toyota, Renault...)
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Modèle</label>
                <UiInput placeholder="Ex : Corolla" v-model="form.modele" />
                <p class="text-xs text-muted-foreground mt-1">
                  Modèle précis du véhicule (ex : Clio, 208...)
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Année de fabrication</label>
                <UiInput placeholder="Ex : 2022" type="number" v-model="form.annee" />
                <p class="text-xs text-muted-foreground mt-1">
                  Année du modèle ou de première mise en circulation
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Numéro d'immatriculation</label>
                <UiInput placeholder="Ex : AB-123-CD" v-model="form.immatriculation" />

                <p class="text-xs text-muted-foregr ound mt-1">
                  Plaque d'immatriculation officielle
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Type de véhicule</label>
                <UiSelect v-model="form.type">
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Voiture">Voiture</SelectItem>
                    <SelectItem value="Camion">Camion</SelectItem>
                    <SelectItem value="Utilitaire">Utilitaire</SelectItem>
                    <SelectItem value="Moto">Moto</SelectItem>
                  </SelectContent>
                </UiSelect>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Statut</label>
                <UiSelect v-model="form.statut">
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Disponible">Disponible</SelectItem>
                    <SelectItem value="En service">En service</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Hors service">Hors service</SelectItem>
                    <SelectItem value="En reserve">En réserve</SelectItem>
                  </SelectContent>
                </UiSelect>
              </div>
            </div>
          </div>

          <!-- 2️⃣ Caractéristiques techniques -->
          <div>
            <h3 class="text-xl font-bold mb-4">2️⃣ Caractéristiques techniques</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium mb-2">Carburant</label>
                <UiSelect v-model="form.carburant">
                  <SelectTrigger>
                    <SelectValue placeholder="Type de carburant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Essence">Essence</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Électrique">Électrique</SelectItem>
                    <SelectItem value="Hybride">Hybride</SelectItem>
                  </SelectContent>
                </UiSelect>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Kilométrage</label>
                <UiInput placeholder="Ex : 50000" type="number" v-model="form.kilometrage" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Date de mise en service</label>
                <UiInput type="date" v-model="form.dateMiseEnService" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Libellé/Description</label>
                <UiInput placeholder="Description courte du véhicule" v-model="form.libelle" />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-4 pt-4 border-t">
            <UiButton variant="outline" @click="emit('close')"> Annuler </UiButton>
            <UiButton @click="handleSubmit" :disabled="!isFormValid">
              <Plus class="h-4 w-4 mr-2" />
              Ajouter le véhicule
            </UiButton>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-vue-next'

interface Props {
  open: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

// Formulaire d'ajout de véhicule
const form = ref({
  marque: '',
  modele: '',
  annee: '',
  immatriculation: '',
  type: '',
  statut: '',
  dateMiseEnService: '',
  carburant: '',
  kilometrage: '',
  libelle: '',
})

// Validation du formulaire
const isFormValid = computed(() => {
  return (
    form.value.marque &&
    form.value.modele &&
    form.value.annee &&
    form.value.immatriculation &&
    form.value.type &&
    form.value.statut &&
    form.value.carburant
  )
})

// Soumission du formulaire
function handleSubmit() {
  if (!isFormValid.value) return

  // Ici vous pouvez ajouter la logique pour sauvegarder le véhicule
  console.log('Nouveau véhicule:', form.value)

  // Réinitialiser le formulaire
  form.value = {
    marque: '',
    modele: '',
    annee: '',
    immatriculation: '',
    type: '',
    statut: '',
    dateMiseEnService: '',
    carburant: '',
    kilometrage: '',
    libelle: '',
  }

  // Fermer le modal
  emit('close')
}
</script>
