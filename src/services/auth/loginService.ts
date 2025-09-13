import { supabase } from '../config/supabaseClient'
import type { ILoginModel } from '../../interfaces/loginInterface'
import { AuthService } from './auth'

export class LoginService {
  private loginData: ILoginModel

  constructor(loginData: ILoginModel) {
    this.loginData = loginData
  }

  async login() {
    try {
      const cleanedEmail = this.loginData.email.trim().toLowerCase()

      console.log('Tentative de connexion avec:', {
        email: cleanedEmail,
        passwordLength: this.loginData.password.length,
      })

      const result = await AuthService.signIn(cleanedEmail, this.loginData.password)

      // "se souvenir de moi", stocker les identifiants localement
      if (this.loginData.remember) {
        localStorage.setItem('remember_email', cleanedEmail)
      } else {
        localStorage.removeItem('remember_email')
      }

      // Stocker manuellement le résultat de la connexion pour s'assurer que isAuthenticated() fonctionne
      if (result?.session) {
        if (!localStorage.getItem('sb-access-token')) {
          localStorage.setItem('sb-access-token', result.session.access_token)
        }
        if (result.user && !localStorage.getItem('sb-user')) {
          localStorage.setItem('sb-user', JSON.stringify(result.user))
        }
      }

      console.log('Connexion réussie')
      return result
    } catch (error) {
      console.error('Erreur de connexion:', error)

      if (error instanceof Error) {
        if (error.message.includes('Invalid login')) {
          throw new Error('Email ou mot de passe incorrect')
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Veuillez confirmer votre email avant de vous connecter')
        } else {
          throw error
        }
      }

      throw new Error('Erreur lors de la connexion')
    }
  }

  static getRememberedEmail(): string | null {
    return localStorage.getItem('remember_email')
  }

  static async isUserLoggedIn(): Promise<boolean> {
    try {
      const { data } = await supabase.auth.getSession()
      return !!data.session
    } catch (error) {
      console.error('Erreur lors de la vérification de la session:', error)
      return false
    }
  }

  static async getCurrentUser() {
    try {
      const { data } = await supabase.auth.getUser()
      return data.user
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error)
      return null
    }
  }
}
