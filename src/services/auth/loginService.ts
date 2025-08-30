import { supabase } from '../config/supabaseClient'
import type { ILoginModel } from '../../interfaces/loginInterface'
import { AuthService } from './auth'

export class LoginService {
  private loginData: ILoginModel

  /**
   * Constructeur du service de connexion
   * @param {ILoginModel} loginData - Les données de connexion de l'utilisateur
   */
  constructor(loginData: ILoginModel) {
    this.loginData = loginData
  }

  /**
   * Authentifie un utilisateur avec email et mot de passe
   * @returns {Promise<any>} - Les données de l'utilisateur ou une erreur
   */
  async login() {
    try {
      // Nettoyer l'email (supprimer les espaces inutiles)
      const cleanedEmail = this.loginData.email.trim().toLowerCase()

      console.log('Tentative de connexion avec:', {
        email: cleanedEmail,
        passwordLength: this.loginData.password.length,
      })

      // Utiliser la méthode signIn de AuthService avec email nettoyé
      const result = await AuthService.signIn(cleanedEmail, this.loginData.password)

      // Si l'option "se souvenir de moi" est activée, stocker les identifiants localement
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

      // Gérer l'erreur de manière plus détaillée
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
  } /**
   * Récupère l'email mémorisé s'il existe
   * @returns {string|null} - L'email mémorisé ou null
   */
  static getRememberedEmail(): string | null {
    return localStorage.getItem('remember_email')
  }

  /**
   * Vérifie si un utilisateur est actuellement connecté
   * @returns {Promise<boolean>} - true si l'utilisateur est connecté
   */
  static async isUserLoggedIn(): Promise<boolean> {
    try {
      const { data } = await supabase.auth.getSession()
      return !!data.session
    } catch (error) {
      console.error('Erreur lors de la vérification de la session:', error)
      return false
    }
  }

  /**
   * Récupère les informations de l'utilisateur connecté
   * @returns {Promise<any>} - Les données de l'utilisateur ou null
   */
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
