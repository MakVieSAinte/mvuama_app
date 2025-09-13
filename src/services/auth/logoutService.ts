import { AuthService } from './auth'
// import { config } from '../config/config'

export class LogoutService {
  static async logout(): Promise<boolean> {
    try {
      const success = await AuthService.signOut()

      if (success) {
        localStorage.removeItem('remember_email')
        // localStorage.removeItem(config.user_prefs)
      }

      return success
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      return false
    }
  }
}
