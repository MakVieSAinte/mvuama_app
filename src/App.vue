<template>
  <div>
    <router-view />
    <Toaster :theme="currentTheme" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { Toaster } from '@/plugins/sonner'

export default defineComponent({
  name: 'App',
  components: {
    Toaster,
  },
  setup() {
    const currentTheme = ref('light')
    const updateTheme = () => {
      currentTheme.value = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    }
    onMounted(() => {
      updateTheme()
      // Observe les changements de classe sur <html>
      const observer = new MutationObserver(updateTheme)
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    })
    return { currentTheme }
  },
})
</script>

<style scoped></style>
