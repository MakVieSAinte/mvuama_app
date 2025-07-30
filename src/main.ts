import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import { setupShadcnVue } from "shadcn-vue";

import App from './App.vue'
import router from './router'

const app = createApp(App)

// setupShadcnVue();

app.use(createPinia())
app.use(router)

app.mount('#app')
