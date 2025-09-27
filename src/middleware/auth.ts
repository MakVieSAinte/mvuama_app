import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { supabase } from '../services/config/supabaseClient'
import { AuthService } from '../services/auth/auth'

// Liste centrale des routes publiques (plus facile à maintenir)
const PUBLIC_PREFIXES = [
  '/auth/login',
  '/auth/register',
  '/auth/callback',
  '/auth/forgot-password',
  '/auth/forgot-password-confirmation',
  '/auth/reset-password',
  '/auth/handler',
]

function isPublicRoute(path: string) {
  return PUBLIC_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix + '/'))
}

/**
 * authMiddleware : garde de navigation compatible avec le pattern `beforeEach` utilisant `next`.
 * - garde la logique séquentielle claire
 * - erreurs journalisées et comportements de repli définis
 */
export async function authMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  // 1) Routes publiques : accès immédiat
  if (isPublicRoute(to.path)) return next()

  try {
    // 2) Récupérer la session
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error('[authMiddleware] supabase.getSession error', error)
      return next('/auth/login')
    }
    const session = data?.session
    if (!session) {
      console.debug('[authMiddleware] pas de session -> login')
      return next('/auth/login')
    }

    const userId = session.user?.id
    if (!userId) {
      return next('/auth/login')
    }

    // 3) Protection admin (déléguée à AuthService si existant)
    if (to.path.startsWith('/admin')) {
      // AuthService.isAdmin peut être sync ou async ; on essaye les deux
      const isAdmin =
        typeof AuthService.isAdmin === 'function'
          ? await (AuthService.isAdmin as any)(session).catch(() => false)
          : false

      if (!isAdmin) {
        return next('/')
      }
    }

    // 4) Vérification entreprise/agences — exécuter seulement si nécessaire
    //    (on peut contrôler via to.meta.skipEnterpriseCheck pour éviter la vérif)
    if (!to.meta?.skipEnterpriseCheck) {
      try {
        const { EnterpriseService } = await import('../services/enterprise/enterpriseService')
        const { data: enterprises } = await EnterpriseService.getUserEnterprises(userId)
        const hasEnterprises = Array.isArray(enterprises) && enterprises.length > 0

        if (!hasEnterprises) {
          // Si pas d'entreprise -> forcer création
          if (to.path !== '/create-enterprise') {
            console.debug('[authMiddleware] aucune entreprise -> redirect /create-enterprise')
            return next('/create-enterprise')
          }
          return next()
        }

        // Si l'utilisateur a déjà une entreprise mais visite /create-enterprise,
        // vérifier s'il y a des agences pour lui proposer le dashboard
        if (to.path === '/create-enterprise') {
          const { AgencyService } = await import('../services/agencies/agencyService')
          const { data: agencies } = await AgencyService.getAgenciesByEnterpriseId(
            enterprises[0].id,
          )
          if (!Array.isArray(agencies) || agencies.length === 0) {
            // a une entreprise mais pas d'agence -> dashboard (où UI montrera overlay)
            return next('/')
          } else {
            // entreprise + agences -> redirection dashboard
            return next('/')
          }
        }
      } catch (err) {
        // Décision explicite : en cas d'erreur côté entreprise/agences
        console.error('[authMiddleware] erreur vérification entreprise/agence', err)
        // Choix : rediriger vers dashboard (ou créer une page d'erreur dédiée)
        return next('/')
      }
    }

    // 5) Tout est OK
    return next()
  } catch (err) {
    console.error('[authMiddleware] erreur inattendue', err)
    return next('/auth/login')
  }
}
