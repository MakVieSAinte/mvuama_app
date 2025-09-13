import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { AuthService } from '../services/auth/auth'
import { supabase } from '../services/config/supabaseClient'

export async function authMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  if (
    to.path.startsWith('/auth/login') ||
    to.path.startsWith('/auth/register') ||
    to.path.startsWith('/auth/callback') ||
    to.path.startsWith('/auth/forgot-password') ||
    to.path.startsWith('/auth/forgot-password-confirmation') ||
    to.path.startsWith('/auth/reset-password') ||
    to.path.startsWith('/auth/handler')
  ) {
    return next()
  }

  try {
    const { data } = await supabase.auth.getSession()

    if (!data.session) {
      console.log('Aucune session active, redirection vers login')
      return next('/auth/login')
    }

    if (from.path === '/auth/login' || to.path === '/create-agency') {
      try {
        const { AgencyService } = await import('../services/agencies/agencyService')
        const { data: agencies } = await AgencyService.getUserAgencies(data.session.user.id)

        // Si l'utilisateur n'a pas d'agence, le rediriger vers create-agency
        if (!agencies || agencies.length === 0) {
          if (to.path !== '/create-agency') {
            return next('/create-agency')
          }
        } else if (to.path === '/create-agency') {
          return next('/')
        }
      } catch (agencyError) {
        console.error('Erreur lors de la vérification des agences:', agencyError)
      }
    }

    // Protection admin
    if (to.path.startsWith('/admin')) {
      if (!AuthService.isAdmin()) {
        return next('/')
      }
    }

    // Si l'utilisateur est connecté, permettre l'accès à la route demandée
    console.log('Navigation autorisée')
    return next()
  } catch (error) {
    console.error("Erreur dans le middleware d'authentification:", error)
    return next('/auth/login')
  }
}
