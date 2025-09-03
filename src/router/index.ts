import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { authMiddleware } from '../middleware/auth'
import { AuthService } from '../services/auth/auth'
import { supabase } from '../services/config/supabaseClient'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/create-agency',
      name: 'create-agency',
      component: () => import('../views/CreateAgencyView.vue'),
      meta: { requiresAuth: true },
    },
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
          path: '/conducteurs',
          name: 'conducteurs',
          component: () => import('../views/DriversView.vue'),
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
          path: '/corbeille',
          name: 'corbeille',
          component: () => import('../views/TrashView.vue'),
          meta: {
            requiresAuth: true,
            title: 'Éléments supprimés',
          },
        },
        {
          path: '/aide',
          name: 'aide',
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

// // Navigation guard global : vérifie l'authentification sur toutes les routes
// router.beforeEach(async (to, from, next) => {
//   console.log(`Navigation de ${from.path} vers ${to.path}`)

//   // Autoriser l'accès aux routes d'authentification sans être connecté
//   if (
//     to.path.startsWith('/auth/login') ||
//     to.path.startsWith('/auth/register') ||
//     to.path.startsWith('/auth/callback') ||
//     to.path.startsWith('/auth/forgot-password') ||
//     to.path.startsWith('/auth/forgot-password-confirmation') ||
//     to.path.startsWith('/auth/reset-password') ||
//     to.path.startsWith('/auth/handler')
//   ) {
//     console.log("Accès à une route d'authentification autorisé")
//     return next()
//   }

//   // Vérifier si l'utilisateur est authentifié via Supabase
//   try {
//     const { data } = await supabase.auth.getSession()
//     console.log('Session Supabase vérifiée:', data?.session ? 'Active' : 'Inactive')

//     // Si l'utilisateur n'est pas authentifié, rediriger vers login
//     if (!data.session) {
//       console.log('Aucune session active, redirection vers login')
//       return next('/auth/login')
//     }

//     // Si l'utilisateur vient de se connecter, vérifier s'il a une agence
//     if (from.path === '/auth/login' || to.path === '/create-agency') {
//       console.log("Vérification des agences de l'utilisateur après connexion")

//       try {
//         const { AgencyService } = await import('../services/agencies/agencyService')
//         const { data: agencies } = await AgencyService.getUserAgencies(data.session.user.id)
//         console.log('Agences trouvées:', agencies)

//         // Si l'utilisateur n'a pas d'agence, le rediriger vers create-agency
//         if (!agencies || agencies.length === 0) {
//           if (to.path !== '/create-agency') {
//             console.log("Aucune agence trouvée, redirection vers création d'agence")
//             return next('/create-agency')
//           }
//         }
//       } catch (agencyError) {
//         console.error('Erreur lors de la vérification des agences:', agencyError)
//       }
//     }

//     // Si l'utilisateur est connecté, permettre l'accès à la route demandée
//     console.log('Navigation autorisée')
//     return next()
//   } catch (error) {
//     console.error("Erreur lors de la vérification de l'authentification:", error)
//     return next('/auth/login')
//   }
// })

export default router
