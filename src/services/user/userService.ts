import supabase from '../config/supabaseClient'

export class UserService {
  /**
   * Récupère les informations de l'utilisateur actuellement connecté
   * @returns Les informations de l'utilisateur ou null si non connecté
   */
  static async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error
      return data.user
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error)
      return null
    }
  }

  /**
   * Récupère les informations formatées de l'utilisateur pour l'affichage
   * @returns Un objet contenant le nom complet, l'email et l'avatar de l'utilisateur
   */
  static async getUserDisplayInfo() {
    try {
      const user = await this.getCurrentUser()

      if (!user) return null

      const firstName = user.user_metadata?.first_name || ''
      const lastName = user.user_metadata?.last_name || ''
      const fullName = `${firstName} ${lastName}`.trim()

      // Si le nom complet pas disponible, utiliser l'email ou un nom par défaut
      const displayName =
        fullName || user.user_metadata?.name || user.email?.split('@')[0] || 'Utilisateur'

      return {
        name: displayName,
        firstName: firstName || '',
        lastName: lastName || '',
        email: user.email || '',
        avatar: user.user_metadata?.avatar_url || null,
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error)
      return null
    }
  }
}
