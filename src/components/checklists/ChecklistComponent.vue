<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2>Checklists des Véhicules</h2>
      <button
        @click="showAddForm = true"
        class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        <Plus class="h-4 w-4" />
        Nouvelle checklist
      </button>
    </div>

    <!-- Formulaire d'ajout -->
    <div v-if="showAddForm" class="bg-card border border-border rounded-lg p-6">
      <h3 class="mb-4">Créer une nouvelle checklist</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium mb-2">Véhicule *</label>
          <select
            v-model="newChecklist.vehiculeId"
            class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Sélectionner un véhicule</option>
            <option v-for="vehicle in mockVehicles" :key="vehicle.id" :value="vehicle.id">
              {{ vehicle.immatriculation }} - {{ vehicle.marque }} {{ vehicle.modele }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Vérificateur *</label>
          <input
            v-model="newChecklist.verificateur"
            type="text"
            placeholder="Nom du vérificateur"
            class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div class="mb-6">
        <h4 class="mb-3">Points de contrôle</h4>
        <div class="space-y-3">
          <div
            v-for="(item, index) in newChecklist.items"
            :key="index"
            class="flex items-center gap-3 p-3 border border-border rounded-lg"
          >
            <input type="checkbox" v-model="item.verifie" class="w-4 h-4 rounded border-border" />
            <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                v-model="item.nom"
                type="text"
                placeholder="Point de contrôle"
                class="px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                v-model="item.commentaire"
                type="text"
                placeholder="Commentaire (optionnel)"
                class="px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              @click="removeChecklistItem(index)"
              class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X class="h-4 w-4" />
            </button>
          </div>
        </div>

        <button
          @click="addChecklistItem"
          class="mt-3 px-3 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm"
        >
          + Ajouter un point de contrôle
        </button>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium mb-2">Commentaires généraux</label>
        <textarea
          v-model="newChecklist.commentaires"
          placeholder="Commentaires sur l'état général du véhicule"
          rows="3"
          class="w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
        ></textarea>
      </div>

      <div class="flex gap-4">
        <button
          @click="handleChecklistSubmit"
          :disabled="!isChecklistFormValid"
          :class="[
            'px-4 py-2 rounded-lg transition-colors',
            isChecklistFormValid
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-muted text-muted-foreground cursor-not-allowed',
          ]"
        >
          Enregistrer la checklist
        </button>
        <button
          @click="cancelForm"
          class="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
        >
          Annuler
        </button>
      </div>
    </div>

    <!-- Liste des checklists -->
    <div class="grid gap-4">
      <div
        v-for="checklist in checklists"
        :key="checklist.id"
        class="bg-card border border-border rounded-lg p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <CheckSquare class="h-6 w-6" />
            <div>
              <h3 class="font-medium">
                {{ getVehicleInfo(checklist.vehiculeId)?.immatriculation }} - Checklist du
                {{ formatDate(checklist.date) }}
              </h3>
              <p class="text-sm text-muted-foreground">Vérifiée par {{ checklist.verificateur }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span :class="['px-2 py-1 rounded text-sm', getChecklistStatus(checklist)]">
              {{ getChecklistStatusText(checklist) }}
            </span>
            <span class="text-sm text-muted-foreground">
              {{ getCompletionRate(checklist) }}% complété
            </span>
          </div>
        </div>

        <div class="space-y-2 mb-4">
          <div
            v-for="item in checklist.items"
            :key="item.id"
            class="flex items-center gap-3 p-2 border border-border rounded"
          >
            <div class="flex items-center gap-2">
              <CheckCircle v-if="item.verifie" class="h-4 w-4 text-green-600" />
              <XCircle v-else class="h-4 w-4 text-red-600" />
              <span :class="[item.verifie ? 'text-foreground' : 'text-red-600']">
                {{ item.nom }}
              </span>
            </div>
            <span v-if="item.commentaire" class="text-sm text-muted-foreground">
              - {{ item.commentaire }}
            </span>
          </div>
        </div>

        <div v-if="checklist.commentaires" class="text-sm text-muted-foreground">
          <strong>Commentaires :</strong> {{ checklist.commentaires }}
        </div>
      </div>
    </div>

    <!-- Message si aucune checklist -->
    <div
      v-if="checklists.length === 0"
      class="bg-card border border-border rounded-lg p-8 text-center"
    >
      <CheckSquare class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <p class="text-muted-foreground mb-4">Aucune checklist enregistrée</p>
      <button
        @click="showAddForm = true"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        Créer la première checklist
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { Plus, CheckSquare, CheckCircle, XCircle, X } from 'lucide-vue-next'
import { mockChecklists, mockVehicles } from '../../data/mockData'
import type { Checklist, ChecklistItem, Vehicle } from '../../types/fleet'

interface NewChecklistForm {
  vehiculeId: string
  verificateur: string
  items: ChecklistItem[]
  commentaires: string
}

export default defineComponent({
  name: 'VehicleChecklist',
  setup() {
    const showAddForm = ref<boolean>(false)
    const checklists = ref<Checklist[]>([...mockChecklists])

    const newChecklist = ref<NewChecklistForm>({
      vehiculeId: '',
      verificateur: '',
      items: [
        { id: '1', nom: "Niveau d'huile", verifie: false, commentaire: '' },
        { id: '2', nom: 'Pression des pneus', verifie: false, commentaire: '' },
        { id: '3', nom: 'Éclairage', verifie: false, commentaire: '' },
        { id: '4', nom: 'Freins', verifie: false, commentaire: '' },
        { id: '5', nom: 'Batterie', verifie: false, commentaire: '' },
      ],
      commentaires: '',
    })

    const isChecklistFormValid = computed(
      (): boolean =>
        newChecklist.value.vehiculeId.trim() !== '' &&
        newChecklist.value.verificateur.trim() !== '' &&
        newChecklist.value.items.some((item) => item.nom.trim() !== ''),
    )

    const getVehicleInfo = (vehiculeId: string): Vehicle | undefined => {
      return mockVehicles.find((v) => v.id === vehiculeId)
    }

    const formatDate = (dateString: string): string => {
      return new Date(dateString).toLocaleDateString('fr-FR')
    }

    const getCompletionRate = (checklist: Checklist): number => {
      const total = checklist.items.length
      const completed = checklist.items.filter((item) => item.verifie).length
      return total > 0 ? Math.round((completed / total) * 100) : 0
    }

    const getChecklistStatus = (checklist: Checklist): string => {
      const rate = getCompletionRate(checklist)
      if (rate === 100) return 'bg-green-100 text-green-800'
      if (rate >= 80) return 'bg-yellow-100 text-yellow-800'
      return 'bg-red-100 text-red-800'
    }

    const getChecklistStatusText = (checklist: Checklist): string => {
      const rate = getCompletionRate(checklist)
      if (rate === 100) return 'Conforme'
      if (rate >= 80) return 'Attention'
      return 'Non conforme'
    }

    const addChecklistItem = (): void => {
      newChecklist.value.items.push({
        id: Date.now().toString(),
        nom: '',
        verifie: false,
        commentaire: '',
      })
    }

    const removeChecklistItem = (index: number): void => {
      newChecklist.value.items.splice(index, 1)
    }

    const handleChecklistSubmit = (): void => {
      if (!isChecklistFormValid.value) return

      const checklist: Checklist = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        ...newChecklist.value,
        items: newChecklist.value.items.filter((item) => item.nom.trim() !== ''),
      }

      checklists.value.unshift(checklist)
      cancelForm()
    }

    const cancelForm = (): void => {
      showAddForm.value = false
      newChecklist.value = {
        vehiculeId: '',
        verificateur: '',
        items: [
          { id: '1', nom: "Niveau d'huile", verifie: false, commentaire: '' },
          { id: '2', nom: 'Pression des pneus', verifie: false, commentaire: '' },
          { id: '3', nom: 'Éclairage', verifie: false, commentaire: '' },
          { id: '4', nom: 'Freins', verifie: false, commentaire: '' },
          { id: '5', nom: 'Batterie', verifie: false, commentaire: '' },
        ],
        commentaires: '',
      }
    }

    return {
      showAddForm,
      checklists,
      newChecklist,
      mockVehicles,
      isChecklistFormValid,
      getVehicleInfo,
      formatDate,
      getCompletionRate,
      getChecklistStatus,
      getChecklistStatusText,
      addChecklistItem,
      removeChecklistItem,
      handleChecklistSubmit,
      cancelForm,
      Plus,
      CheckSquare,
      CheckCircle,
      XCircle,
      X,
    }
  },
})
</script>
