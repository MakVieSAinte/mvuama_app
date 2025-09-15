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

    // Vérifier si l'utilisateur a déjà une entreprise
    try {
      const { EnterpriseService } = await import('../services/enterprise/enterpriseService')
      const { data: enterprises } = await EnterpriseService.getUserEnterprises(data.session.user.id)

      // Si l'utilisateur n'a pas d'entreprise, le rediriger vers create-enterprise
      if (!enterprises || enterprises.length === 0) {
        if (to.path !== '/create-enterprise') {
          console.log("Aucune entreprise trouvée, redirection vers création d'entreprise")
          return next('/create-enterprise')
        }
      } else if (to.path === '/create-enterprise') {
        // Si l'utilisateur a déjà une entreprise et essaie d'accéder à create-enterprise,
        // vérifier s'il a une agence
        const { AgencyService } = await import('../services/agencies/agencyService')
        const { data: agencies } = await AgencyService.getAgenciesByEnterpriseId(enterprises[0].id)

        if (!agencies || agencies.length === 0) {
          // L'utilisateur a une entreprise mais pas d'agence, on l'envoie au dashboard
          // où il verra l'overlay pour créer une agence
          return next('/')
        } else {
          // L'utilisateur a déjà une entreprise et au moins une agence
          return next('/')
        }
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'entreprise:", error)
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
