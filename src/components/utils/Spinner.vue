<template>
  <div class="lds-ring-wrapper">
    <div class="lds-ring" :style="{ width: size, height: size }">
      <div
        v-for="n in 4"
        :key="n"
        :style="{ borderColor: `${color} transparent transparent transparent` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
  size: {
    type: String,
    default: '15px', // taille par défaut
  },
  color: {
    type: String,
    default: 'currentColor',
  },
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
  vertical-align: middle; /* Aligner avec le texte */
  width: var(--spinner-size, 18px);
  height: var(--spinner-size, 18px);
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: calc(var(--spinner-size, 18px) * 0.8);
  height: calc(var(--spinner-size, 18px) * 0.8);
  margin: calc(var(--spinner-size, 18px) * 0.1);
  border: calc(var(--spinner-size, 18px) * 0.1) solid;
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

