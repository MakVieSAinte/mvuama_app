<template>
  <div>
    <Home />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Home from '@/components/home/Home.vue'

export default defineComponent({
  name: 'App',
  components: {
    Home,
  },

  setup() {
    return {

    }
  },
})
</script>


<style scoped></style>
