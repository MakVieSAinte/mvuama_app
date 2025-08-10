import { supabase } from '../config/supabaseClient'

/**
 * Service d'authentification pour Supabase
 */
export class AuthService {
  /**
   * Connecte un utilisateur avec email et mot de passe
   * @param email Email de l'utilisateur
   * @param password Mot de passe
   * @returns L'utilisateur connecté ou false en cas d'erreur
   */
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Erreur d'authentification:", error.message)
        return false
      }

      return data
    } catch (error) {
      console.error("Exception lors de l'authentification:", error)
      return false
    }
  }

  /**
   * Vérifie si un utilisateur est actuellement connecté
   * @returns Les données de la session ou null
   */
  static async getCurrentSession() {
    try {
      const { data } = await supabase.auth.getSession()
      return data.session
    } catch (error) {
      console.error('Erreur lors de la récupération de la session:', error)
      return null
    }
  }

  /**
   * Déconnecte l'utilisateur courant
   * @returns true si déconnecté avec succès, false sinon
   */
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Erreur lors de la déconnexion:', error.message)
        return false
      }

      return true
    } catch (error) {
      console.error('Exception lors de la déconnexion:', error)
      return false
    }
  }
}
