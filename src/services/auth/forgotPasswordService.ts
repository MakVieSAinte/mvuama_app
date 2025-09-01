import { supabase } from '../config/supabaseClient'
import type {
  IForgotPasswordModel,
  IResetPasswordModel,
} from '@/interfaces/forgotPasswordInterface'
import { AuthNotificationService } from './authNotificationService'

/**
 * Service de gestion de la réinitialisation de mot de passe
 */
export class ForgotPasswordService {
  /**
   * Envoie un email de réinitialisation de mot de passe
   * @param data - Données du formulaire de demande de réinitialisation
   * @returns Promise<boolean> - true si l'email a été envoyé avec succès
   */
  static async sendResetPasswordEmail(data: IForgotPasswordModel): Promise<boolean> {
    try {
      // Utiliser notre page de traitement d'authentification spécifique
      const redirectUrl = `${window.location.origin}/auth/handler`

      console.log('URL de redirection configurée:', redirectUrl)

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: redirectUrl,
      })

      if (error) {
        console.error('Erreur lors de la demande de réinitialisation:', error)
        throw new Error(error.message)
      }

      return true
    } catch (error) {
      console.error('Exception dans sendResetPasswordEmail:', error)
      throw error
    }
  }

  /**
   * Réinitialise le mot de passe avec le token reçu par email
   * @param data - Données du formulaire de réinitialisation
   * @returns Promise<boolean> - true si le mot de passe a été réinitialisé avec succès
   */
  static async resetPassword(data: IResetPasswordModel): Promise<boolean> {
    try {
      // Vérifier d'abord que nous avons une session valide
      const sessionCheck = await supabase.auth.getSession()

      if (!sessionCheck.data.session) {
        console.error('Pas de session valide pour réinitialiser le mot de passe')
        throw new Error("Votre lien de réinitialisation a expiré ou n'est plus valide")
      }

      // Le token est géré par Supabase en interne à partir de l'URL
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error)

        // Messages d'erreur plus explicites
        if (error.message.includes('expired')) {
          throw new Error(
            'Le lien de réinitialisation a expiré. Veuillez demander un nouveau lien.',
          )
        } else if (error.message.includes('invalid')) {
          throw new Error(
            'Le lien de réinitialisation est invalide. Veuillez demander un nouveau lien.',
          )
        } else {
          throw new Error(error.message)
        }
      }

      return true
    } catch (error) {
      console.error('Exception dans resetPassword:', error)
      throw error
    }
  }

  /**
   * Vérifie si un token de réinitialisation est valide
   * Utilisé pour rediriger l'utilisateur vers la page appropriée
   * @returns Promise<boolean> - true si le token est valide
   */
  static async isValidResetToken(): Promise<boolean> {
    try {
      // Vérifier si nous avons une session valide
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Erreur lors de la vérification du token:', error)
        return false
      }

      // Vérifier si nous avons récupéré une session
      if (!data.session) {
        console.log('Pas de session trouvée')
        return false
      }

      // Vérifier si nous avons un type de session approprié pour la réinitialisation de mot de passe
      // Pour les tokens de réinitialisation, Supabase utilise généralement un type spécifique
      console.log('Type de session:', data.session.access_token)

      // La présence d'une session avec un access_token est suffisante pour considérer le token comme valide
      return !!data.session.access_token
    } catch (error) {
      console.error('Exception dans isValidResetToken:', error)
      return false
    }
  }
}
