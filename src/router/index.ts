import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { authMiddleware } from '../middleware/auth'
import { AuthService } from '../services/auth/auth'

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
          path: 'login',
          name: 'login',
          component: () => import('../views/auth/LoginView.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('../views/auth/RegisterView.vue'),
        },
        {
          path: 'callback',
          name: 'auth-callback',
          component: () => import('../views/auth/AuthCallbackView.vue'),
        },
        {
          path: 'onboarding/agency',
          name: 'onboarding-agency',
          component: () => import('../views/auth/OnboardingAgencyView.vue'),
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: '/agency/:slug',
      name: 'agency-home',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: false },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
        },
        {
          path: 'vehicles',
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
          path: '/configuration',
          name: 'configuration',
          component: () => import('../views/ConfigurationView.vue'),
        },
        {
          path: '/documents',
          name: 'documents',
          component: () => import('../views/DocumentsView.vue'),
        },
        {
          path: '/gps',
          name: 'gps',
          component: () => import('../views/GpsView.vue'),
        },
        {
          path: '/alertes',
          name: 'alertes',
          component: () => import('../views/AlertesView.vue'),
        },
        {
          path: '/historique',
          name: 'historique',
          component: () => import('../views/HistoriqueView.vue'),
        },
        {
          path: '/conducteurs',
          name: 'conducteurs',
          component: () => import('../views/ConducteursView.vue'),
        },
        {
          path: '/chauffeurs',
          redirect: '/conducteurs',
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

// Navigation guard global : vérifie l'authentification sur toutes les routes
router.beforeEach(async (to, from, next) => {
  // Autoriser l'accès aux routes d'authentification sans être connecté
  if (
    to.path.startsWith('/auth/login') ||
    to.path.startsWith('/auth/register') ||
    to.path.startsWith('/auth/callback')
  ) {
    return next()
  }

  // Vérifier la session via l'API Supabase si on vient juste de se connecter
  if (from.path === '/auth/login') {
    try {
      const session = await AuthService.getCurrentSession()
      if (session) {
        console.log("Session active détectée, autorisation d'accès")
        return next()
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de la session:', error)
    }
  }

  // Pour toutes les autres routes, vérifier si l'utilisateur est connecté
  if (!AuthService.isAuthenticated()) {
    console.log('Utilisateur non connecté, redirection vers la page de connexion')
    return next('/auth/login')
  }

  // Si l'utilisateur est connecté, permettre l'accès à la route demandée
  return next()
})

export default router
