<script lang="ts">
import { defineComponent, ref } from 'vue'
import Home from '@/components/home/Home.vue'
import TestVehicleForm from '@/components/test/TestVehicleForm.vue'
import TestSetupWorkflow from '@/components/test/TestSetupWorkflow.vue'
import VehicleDisplay from '@/components/test/VehicleDisplay.vue'

// Interface pour les onglets (à utiliser plus tard)
// interface Tab {
//   id: string
//   label: string
//   shortLabel: string
//   icon: string
// }

export default defineComponent({
  name: 'App',
  components: {
    Home,
    TestVehicleForm,
    TestSetupWorkflow,
    VehicleDisplay,
  },
  setup() {
    const showTest = ref(false) // Mettre à true pour afficher le composant de test
    const activeView = ref('vehicleDisplay') // Nouvelle variable pour gérer les vues

    return {
      showTest,
      activeView,
    }
  },
})
</script>

<template>
  <div>
 

    <div v-if="showTest">
      <div v-if="activeView === 'workflow'">
        <TestSetupWorkflow />
      </div>
      <div v-else-if="activeView === 'vehicleForm'">
        <TestVehicleForm />
      </div>
      <div v-else-if="activeView === 'vehicleDisplay'">
        <VehicleDisplay />
      </div>
    </div>
    <div v-else>
      <Home />
    </div>
  </div>
</template>

<style scoped>
.navigation {
  display: flex;
  gap: 10px;
  margin: 20px 0;
  justify-content: center;
}

.navigation button {
  padding: 8px 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s ease;
}

.navigation button.active {
  background-color: #4caf50;
  color: white;
  border-color: #4caf50;
}

.navigation button:hover:not(.active) {
  background-color: #e0e0e0;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
