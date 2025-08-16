// middleware/auth.ts
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { AuthService } from '../services/auth/auth'

export function authMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  // Autoriser l'accès à /auth/login et /auth/register si non connecté
  if (to.path.startsWith('/auth/login') || to.path.startsWith('/auth/register')) {
    return next()
  }

  // Si l'utilisateur n'est pas authentifié, rediriger vers login
  if (!AuthService.isAuthenticated()) {
    return next('/auth/login')
  }

  // Protection admin : doit être authentifié ET admin
  if (to.path.startsWith('/admin')) {
    if (!AuthService.isAdmin()) {
      return next('/')
    }
  }

  return next()
}
