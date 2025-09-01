<template>
  <div class="flex border-b border-gray-200 mb-6">
    <router-link
      to="/profile"
      class="px-4 py-2 border-b-2 font-medium text-sm"
      :class="{
        'border-primary text-primary': currentPath === '/profile',
        'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300':
          currentPath !== '/profile',
      }"
    >
      Profil
    </router-link>
    <router-link
      to="/subscription"
      class="px-4 py-2 border-b-2 font-medium text-sm"
      :class="{
        'border-primary text-primary': currentPath === '/subscription',
        'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300':
          currentPath !== '/subscription',
      }"
    >
      Abonnement
    </router-link>
    <router-link
      to="/notifications"
      class="px-4 py-2 border-b-2 font-medium text-sm"
      :class="{
        'border-primary text-primary': currentPath === '/notifications',
        'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300':
          currentPath !== '/notifications',
      }"
    >
      Notifications
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'UserNavTabs',
  setup() {
    const route = useRoute()
    const currentPath = computed(() => route.path)

    return {
      currentPath,
    }
  },
})
</script>
