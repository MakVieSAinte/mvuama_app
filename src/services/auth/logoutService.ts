import { AuthService } from './auth'

export class LogoutService {
  /**
   * Déconnecte l'utilisateur et nettoie le stockage local
   * @returns {Promise<boolean>} - true si la déconnexion est réussie
   */
  static async logout(): Promise<boolean> {
    try {
      // Utiliser la méthode de déconnexion de AuthService
      const success = await AuthService.signOut()

      if (success) {
        // Nettoyer les données stockées localement
        localStorage.removeItem('remember_email')

        // Autres nettoyages si nécessaire
        // localStorage.removeItem('userPrefs')
      }

      return success
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      return false
    }
  }
}
