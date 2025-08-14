// middleware/auth.ts
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { AuthService } from '../services/auth/auth'


export function authMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {

  if (to.path.startsWith('/admin')) {
    if (!AuthService.isAuthenticated()) {
      return next('/')
    } else if (AuthService.isAdmin()) {
      return next('/admin')
    }
  }

  return next()
}
