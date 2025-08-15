// middleware/auth.ts
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { AuthService } from '../services/auth/auth'

export function authMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  // Si la route n'est pas /auth/login et que l'utilisateur n'est pas authentifié, on redirige vers login
  if (!to.path.startsWith('/auth/login') && !AuthService.isAuthenticated()) {
    return next('/auth/login')
  }

  if (!to.path.startsWith('/auth/register')) {
    return next('/auth/register')
  }

  // Protection admin (optionnel)
  if (to.path.startsWith('/admin')) {
    if (!AuthService.isAuthenticated()) {
      return next('/auth/login')
    } else if (!AuthService.isAdmin()) {
      return next('/')
    }
  }

  return next()
}
