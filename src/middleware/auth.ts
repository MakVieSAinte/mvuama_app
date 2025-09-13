// middleware/auth.ts
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { AuthService } from '../services/auth/auth'
import { supabase } from '../services/config/supabaseClient'

export async function authMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  // Autoriser l'accès aux routes d'authentification pour tous les utilisateurs
  if (
    to.path.startsWith('/auth/login') ||
    to.path.startsWith('/auth/register') ||
    to.path.startsWith('/auth/callback') ||
    to.path.startsWith('/auth/forgot-password') ||
    to.path.startsWith('/auth/reset-password') ||
    to.path.startsWith('/auth/handler')
  ) {
    return next()
  }

  // Vérification asynchrone de l'authentification
  try {
    const isAuth = await AuthService.checkAuth()

    if (!isAuth) {
      console.log('Utilisateur non authentifié, redirection vers login')
      return next('/auth/login')
    }

    // Si l'utilisateur est authentifié et qu'il essaie d'accéder à /create-agency, vérifier s'il a déjà une agence
    if (to.path === '/create-agency') {
      const { data: user } = await supabase.auth.getUser()

      if (user && user.user) {
        const { AgencyService } = await import('../services/agencies/agencyService')
        const { data: agencies } = await AgencyService.getUserAgencies(user.user.id)

        // Si l'utilisateur a déjà des agences, le rediriger vers le dashboard
        if (agencies && agencies.length > 0) {
          return next('/')
        }
      }
    }

    // Protection admin : doit être authentifié ET admin
    if (to.path.startsWith('/admin')) {
      if (!AuthService.isAdmin()) {
        return next('/')
      }
    }

    console.log('Navigation autorisée')
    return next()
  } catch (error) {
    console.error("Erreur dans le middleware d'authentification:", error)
    return next('/auth/login')
  }
}
