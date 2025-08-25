<template>
  <Select :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <SelectTrigger :class="triggerClass">
      <SelectValue :placeholder="placeholder">
        <div v-if="selectedItem" class="flex items-center gap-2">
          <div
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: selectedItem.color }"
          ></div>
          <span>{{ selectedItem.label }}</span>
        </div>
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      <SelectItem
        v-for="item in items"
        :key="item.value"
        :value="item.value"
        class="flex items-center gap-2"
      >
        <div class="flex items-center gap-2">
          <div
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: item.color }"
          ></div>
          <span>{{ item.label }}</span>
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

interface SelectItem {
  value: string
  label: string
  color: string
}

interface Props {
  modelValue?: string
  items: SelectItem[]
  placeholder?: string
  triggerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Sélectionner une option',
  triggerClass: 'w-full focus:border-primary focus:ring-primary'
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectedItem = computed(() => {
  return props.items.find(item => item.value === props.modelValue)
})
</script>
