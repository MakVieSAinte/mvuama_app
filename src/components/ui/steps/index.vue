<template>
  <div class="flex w-max justify-end gap-1">
    <template v-for="(step, index) in steps" :key="index">
      <div class="flex flex-col items-center">
        <!-- Numéro de l'étape avec son statut -->
        <div
          class="flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium border"
          :class="getStepNumberClass(index)"
        >
          <component
            :is="getStepIcon(index)"
            v-if="index < currentStep && getStepIcon(index)"
            class="w-4 h-4"
          />
          <span v-else>{{ index + 1 }}</span>
        </div>

        <!-- Titre de l'étape -->
        <div class="mt-2 text-center">
          <div class="text-sm font-medium" :class="getStepTextClass(index)">
            {{ step.title }}
          </div>
          <div
            v-if="step.description"
            class="text-xs mt-1"
            :class="index <= currentStep ? 'text-muted-foreground' : 'text-muted-foreground/50'"
          >
            {{ step.description }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { Check } from 'lucide-vue-next'

export interface Step {
  title: string
  description?: string
  icon?: typeof Check
}

export default defineComponent({
  name: 'UiSteps',
  components: {
    Check,
  },
  props: {
    currentStep: {
      type: Number,
      required: true,
    },
    steps: {
      type: Array as PropType<Step[]>,
      required: true,
    },
  },
  methods: {
    getStepNumberClass(index: number): string {
      if (index < this.currentStep) {
        return 'border-primary bg-primary text-primary-foreground'
      }

      if (index === this.currentStep) {
        return 'border-primary text-primary'
      }

      return 'border-border text-muted-foreground'
    },

    getStepTextClass(index: number): string {
      if (index <= this.currentStep) {
        return 'text-foreground'
      }

      return 'text-muted-foreground/50'
    },

    getStepIcon(index: number) {
      // Vous pouvez ajouter une logique pour retourner des icônes personnalisées
      // basées sur les propriétés de chaque étape
      if (index < this.currentStep) {
        return Check
      }

      const step = this.steps[index]
      return step?.icon || null
    },
  },
})
</script>
