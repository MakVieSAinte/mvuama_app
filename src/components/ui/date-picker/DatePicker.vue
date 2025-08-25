<script setup lang="ts">
import { computed, ref } from 'vue'
import { CalendarIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
  class?: string
  disabled?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isOpen = ref(false)

const selectedDate = computed({
  get: () => {
    if (!props.modelValue) return undefined
    return new Date(props.modelValue)
  },
  set: (date: Date | undefined) => {
    if (date) {
      emits('update:modelValue', date.toISOString().split('T')[0])
    } else {
      emits('update:modelValue', '')
    }
    isOpen.value = false
  },
})

const formattedDate = computed(() => {
  if (!selectedDate.value) return ''
  return selectedDate.value.toLocaleDateString('fr-FR')
})
</script>

<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="
          cn(
            'w-full justify-start text-left font-normal focus:border-primary focus:ring-primary border-2',
            !selectedDate && 'text-muted-foreground',
            props.class,
          )
        "
        :disabled="disabled"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        <span v-if="selectedDate">{{ formattedDate }}</span>
        <span v-else>{{ placeholder || 'Sélectionner une date' }}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <Calendar v-model="selectedDate" initial-focus />
    </PopoverContent>
  </Popover>
</template>
