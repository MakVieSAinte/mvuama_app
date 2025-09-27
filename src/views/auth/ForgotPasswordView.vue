<script setup lang="ts">
import ForgotPasswordComponent from '@/components/auth/ForgotPasswordComponent.vue'
</script>

<template>
  <main>
    <ForgotPasswordComponent />
  </main>
</template>

<style scoped>
@media screen and (max-width: 640px) {
  :deep(form) {
    width: 100%;
  }
}

@media screen and (max-width: 400px) {
  :deep(form) {
    width: 100%;
  }
}
</style>
