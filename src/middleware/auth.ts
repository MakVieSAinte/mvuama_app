// middleware/auth.ts
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { AuthService } from '../services/auth/auth'
import { supabase } from '../services/config/supabaseClient'

export async function authMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  console.log(`Navigation de ${from.path} vers ${to.path}`)

  // Autoriser l'accès aux routes d'authentification pour tous les utilisateurs
  if (
    to.path.startsWith('/auth/login') ||
    to.path.startsWith('/auth/register') ||
    to.path.startsWith('/auth/callback') ||
    to.path.startsWith('/auth/forgot-password') ||
    to.path.startsWith('/auth/reset-password') ||
    to.path.startsWith('/auth/handler')
  ) {
    console.log("Route d'authentification, accès autorisé")
    return next()
  }

  // Vérification asynchrone de l'authentification
  try {
    const isAuth = await AuthService.checkAuth()
    console.log("Statut d'authentification:", isAuth)

    // Si l'utilisateur n'est pas authentifié, rediriger vers login
    if (!isAuth) {
      console.log('Utilisateur non authentifié, redirection vers login')
      return next('/auth/login')
    }

    // Si l'utilisateur est authentifié et qu'il essaie d'accéder à /create-agency, vérifier s'il a déjà une agence
    if (to.path === '/create-agency') {
      console.log('Accès à /create-agency, vérification des agences existantes')
      const { data: user } = await supabase.auth.getUser()

      if (user && user.user) {
        const { AgencyService } = await import('../services/agencies/agencyService')
        const { data: agencies } = await AgencyService.getUserAgencies(user.user.id)

        // Si l'utilisateur a déjà des agences, le rediriger vers le dashboard
        if (agencies && agencies.length > 0) {
          console.log("L'utilisateur a déjà des agences, redirection vers le dashboard")
          return next('/')
        }
      }
    }

    // Protection admin : doit être authentifié ET admin
    if (to.path.startsWith('/admin')) {
      if (!AuthService.isAdmin()) {
        console.log("Accès admin refusé, redirection vers l'accueil")
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
