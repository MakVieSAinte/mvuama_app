<template>
  <div class="h-full">
    <MainNav />
    <div class="container mx-auto py-10 h-full">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MainNav from '@/components/ui/navigation/MainNav.vue'

export default defineComponent({
  name: 'UserLayout',
  components: { MainNav },
})
</script>
