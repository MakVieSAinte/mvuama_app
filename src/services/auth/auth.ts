import { supabase } from '../config/supabaseClient'

export class AuthService {
  static async signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { data, error }
    } catch (error: unknown) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Une erreur est survenue'),
      }
    }
  }

  static async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { data, error }
    } catch (error: unknown) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Une erreur est survenue'),
      }
    }
  }

  static async signInWithFacebook() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { data, error }
    } catch (error: unknown) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Une erreur est survenue'),
      }
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        console.error("Erreur d'authentification Supabase:", error)
        throw new Error(error.message || 'Erreur lors de la connexion')
      }

      return data
    } catch (error) {
      console.error('Exception dans signIn:', error)
      throw error
    }
  }

  static isAuthenticated(): boolean {
    // Vérifier dans le localStorage pour la session Supabase
    const session =
      localStorage.getItem('sb-access-token') ||
      localStorage.getItem('supabase.auth.token') ||
      localStorage.getItem('sb:session')

    // Vérifier aussi si on a un utilisateur dans localStorage
    const user = localStorage.getItem('sb-user')

    // Si on a une session ou un utilisateur, on considère qu'on est authentifié
    return !!(session || user)
  }

  static isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('sb-user') || 'null')
    return user && user.role === 'admin'
  }

  /**
   * Déconnecte l'utilisateur actuel
   * @returns {Promise<boolean>} - true si la déconnexion est réussie
   */
  static async signOut(): Promise<boolean> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return true
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      return false
    }
  }

  /**
   * Récupère la session courante
   * @returns {Promise<Session|null>} - La session ou null
   */
  static async getCurrentSession() {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return data.session
    } catch (error) {
      console.error('Erreur lors de la récupération de la session:', error)
      return null
    }
  }
}
