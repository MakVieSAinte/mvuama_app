<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 border rounded-lg bg-card">
    <component
      :is="icon"
      :class="[
        'h-12 w-12 mb-4',
        variant === 'default'
          ? 'text-muted-foreground'
          : variant === 'success'
            ? 'text-green-500'
            : variant === 'warning'
              ? 'text-orange-500'
              : variant === 'error'
                ? 'text-destructive'
                : 'text-primary',
      ]"
    />
    <h3 class="text-lg font-medium mb-2">{{ title }}</h3>
    <p class="text-muted-foreground text-center max-w-md mb-6">{{ description }}</p>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { type Component } from 'vue'

// Props with defaults
withDefaults(
  defineProps<{
    title: string
    description: string
    icon: Component
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  }>(),
  {
    variant: 'default',
  },
)
</script>
