<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-md p-6 bg-card rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-4 text-center">Traitement en cours</h2>
      <AuthHandler />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AuthHandler from '@/components/auth/AuthHandler.vue'

export default defineComponent({
  name: 'AuthHandlerView',
  components: {
    AuthHandler,
  },
})
</script>
