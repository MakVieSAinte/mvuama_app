<template>
  <div class="lds-ring-wrapper">
    <div class="lds-ring" :style="{ width: size, height: size, '--spinner-color': colorComputed }">
      <div
        v-for="n in 4"
        :key="n"
        :style="{ borderColor: `var(--spinner-color) transparent transparent transparent` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: '15px',
  },
  color: {
    type: String,
    default: '#fff', // blanc par défaut
  },
})

// Couleur dynamique : si non précisé, hérite du texte parent (currentColor)
const colorComputed = computed(() => {
  if (props.color) return props.color
  // Utilise la couleur du texte parent, qui s'adapte au thème
  return 'currentColor'
})
</script>

<style scoped>
.lds-ring-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: max-content;
  height: max-content;
}
.lds-ring {
  display: inline-block;
  position: relative;
  vertical-align: middle;
  width: var(--spinner-size, 15px);
  height: var(--spinner-size, 15px);
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  border: 2px solid;
  border-color: var(--spinner-color, currentColor) transparent transparent transparent;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
