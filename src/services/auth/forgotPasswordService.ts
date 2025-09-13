import { supabase } from '../config/supabaseClient'
import type {
  IForgotPasswordModel,
  IResetPasswordModel,
} from '@/interfaces/forgotPasswordInterface'

export class ForgotPasswordService {
  static async sendResetPasswordEmail(data: IForgotPasswordModel): Promise<boolean> {
    try {
      const redirectUrl = `${window.location.origin}/auth/handler`

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

  // Réinitialise le mot de passe avec le token reçu par email

  static async resetPassword(data: IResetPasswordModel): Promise<boolean> {
    try {
      // Vérifier d'abord que nous avons une session valide
      const sessionCheck = await supabase.auth.getSession()

      if (!sessionCheck.data.session) {
        console.error('Pas de session valide pour réinitialiser le mot de passe')
        throw new Error("Votre lien de réinitialisation a expiré ou n'est plus valide")
      }

      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error)

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
