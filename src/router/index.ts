import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { authMiddleware } from '../middleware/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'auth',
      beforeEnter: authMiddleware,
      meta: { requiresAuth: false },
      children: [
        {
          path: '/login',
          name: 'login',
          component: () => import('../views/auth/LoginView.vue'),
        },
        {
          path: '/register',
          name: 'register',
          component: () => import('../views/auth/RegisterView.vue'),
        }
      ],
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      // meta: { requiresAuth: false },
      children: [
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
    },
  ],
})

// router.beforeEach(authMiddleware)

export default router
