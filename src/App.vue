<template>
  <div>
    <router-view />
    <component :is="Toaster" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useSonner } from '@/plugins/sonner'

export default defineComponent({
  name: 'App',
  setup() {
    const { Toaster } = useSonner()
    return { Toaster }
  },
})
</script>

<style scoped></style>
