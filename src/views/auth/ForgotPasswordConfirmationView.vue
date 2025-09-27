<script setup lang="ts">
import ForgotPasswordConfirmation from '@/components/auth/ForgotPasswordConfirmation.vue'
</script>

<template>
  <main>
    <ForgotPasswordConfirmation />
  </main>
</template>

<style scoped>
@media screen and (max-width: 640px) {
  /* Pour les petits écrans */
  :deep(form) {
    width: 100%;
  }
}

@media screen and (max-width: 400px) {
  /* Pour très petits écrans */
  :deep(form) {
    width: 100%;
  }
}
</style>
