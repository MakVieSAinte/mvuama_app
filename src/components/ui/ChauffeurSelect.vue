<template>
  <Select :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <SelectTrigger :class="triggerClass">
      <SelectValue :placeholder="placeholder">
        <div v-if="selectedChauffeur" class="flex items-center gap-3">
          <div class="relative">
            <img
              v-if="selectedChauffeur.photo"
              :src="selectedChauffeur.photo"
              :alt="selectedChauffeur.nom"
              class="w-8 h-8 rounded-full object-cover border"
            />
            <div
              v-else
              class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium border"
              :style="{ backgroundColor: selectedChauffeur.couleurInitiales }"
            >
              {{ selectedChauffeur.initiales }}
            </div>
          </div>
          <span class="font-medium">{{ selectedChauffeur.nom }}</span>
        </div>
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      <SelectItem
        v-for="chauffeur in chauffeurs"
        :key="chauffeur.id"
        :value="chauffeur.id.toString()"
        class="py-3"
      >
        <div class="flex items-center gap-3">
          <div class="relative">
            <img
              v-if="chauffeur.photo"
              :src="chauffeur.photo"
              :alt="chauffeur.nom"
              class="w-8 h-8 rounded-full object-cover border"
            />
            <div
              v-else
              class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium border"
              :style="{ backgroundColor: chauffeur.couleurInitiales }"
            >
              {{ chauffeur.initiales }}
            </div>
          </div>
          <span class="font-medium">{{ chauffeur.nom }}</span>
        </div>
      </SelectItem>
      <SelectItem value="aucun" class="py-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <span class="text-xs text-muted-foreground">-</span>
          </div>
          <span class="font-medium text-muted-foreground">Aucun conducteur attitré</span>
        </div>
      </SelectItem>
    </SelectContent>
  </Select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ChauffeurConfig } from '@/config/vehiculeConfig'

interface Props {
  modelValue?: string
  chauffeurs: ChauffeurConfig[]
  placeholder?: string
  triggerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Sélectionner un conducteur',
  triggerClass: 'w-full focus:border-primary focus:ring-primary',
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectedChauffeur = computed(() => {
  if (props.modelValue === 'aucun') return null
  return props.chauffeurs.find((chauffeur) => chauffeur.id.toString() === props.modelValue)
})
</script>
