import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/vehicles',
      name: 'vehicles',
      component: () => import('../views/VehiculesView.vue'),
    },
    {
      path: '/maintenance',
      name: 'maintenance',
      component: () => import('../views/MaintenanceView.vue'),
    },
    {
      path: '/checklist',
      name: 'checklist',
      component: () => import('../views/ChecklistView.vue'),
    },
    {
      path: '/parking',
      name: 'parking',
      component: () => import('../views/ParkingView.vue'),
    },
    {
      path: '/chauffeurs',
      name: 'chauffeurs',
      component: () => import('../views/ChauffeursView.vue'),
    },
    {
      path: '/recettes',
      name: 'recettes',
      component: () => import('../views/RecettesView.vue'),
    },
    {
      path: '/paiements',
      name: 'paiements',
      component: () => import('../views/PaiementsView.vue'),
    },
  ],
})

export default router
