import { createRouter, createWebHistory } from 'vue-router'
import { authMiddleware } from '../middleware/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/create-enterprise',
      name: 'create-enterprise',
      component: () => import('../views/CreateEnterpriseView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/auth',
      name: 'auth',
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
          path: 'forgot-password',
          name: 'forgot-password',
          component: () => import('../views/auth/ForgotPasswordView.vue'),
        },
        {
          path: 'forgot-password-confirmation',
          name: 'forgot-password-confirmation',
          component: () => import('../views/auth/ForgotPasswordConfirmationView.vue'),
        },
        {
          path: 'reset-password',
          name: 'reset-password',
          component: () => import('../views/auth/ResetPasswordView.vue'),
        },
        {
          path: 'handler',
          name: 'auth-handler',
          component: () => import('../views/auth/AuthHandlerView.vue'),
        },
        {
          path: 'callback',
          name: 'auth-callback',
          component: () => import('../views/auth/AuthCallbackView.vue'),
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
          component: () => import('../views/VehiclesView.vue'),
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
          path: '/drivers',
          name: 'drivers',
          component: () => import('../views/DriversView.vue'),
        },
        {
          path: '/recettes',
          name: 'recettes',
          component: () => import('../views/RecettesView.vue'),
        },
        {
          path: '/payment',
          name: 'payment',
          component: () => import('../views/PaymentView.vue'),
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import('../views/user/ProfilView.vue'),
          meta: {
            requiresAuth: true,
            title: 'Profil Utilisateur',
          },
        },
        {
          path: '/subscription',
          name: 'subscription',
          component: () => import('../views/user/SubscriptionView.vue'),
          meta: {
            requiresAuth: true,
            title: 'Abonnement',
          },
        },
        {
          path: '/notifications',
          name: 'notifications',
          component: () => import('../views/user/NotificationView.vue'),
          meta: {
            requiresAuth: true,
            title: 'Notifications',
          },
        },
        {
          path: '/trash',
          name: 'trash',
          component: () => import('../views/TrashView.vue'),
          meta: {
            requiresAuth: true,
            title: 'Éléments supprimés',
          },
        },
        {
          path: '/help',
          name: 'help',
          component: () => import('../views/HelpView.vue'),
          meta: {
            requiresAuth: true,
            title: "Centre d'aide",
          },
        },
      ],
    },
  ],
})

router.beforeEach(authMiddleware)

export default router
