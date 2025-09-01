import type {
  IForgotPasswordModel,
  IForgotPasswordBuilder,
  IResetPasswordModel,
  IResetPasswordBuilder,
} from '@/interfaces/forgotPasswordInterface'
import { Validator } from '@/services/libs/validator'

/**
 * Classe pour gérer et valider le formulaire de demande de réinitialisation de mot de passe
 */
export class ForgotPasswordForm {
  private email: string = ''
  private errors: IForgotPasswordBuilder = {
    errorEmail: false,
    errorEmailMessage: '',
  }

  /**
   * Définit l'adresse email pour la demande de réinitialisation
   * @param email - Adresse email de l'utilisateur
   */
  setEmail(email: string): ForgotPasswordForm {
    this.email = email
    return this
  }

  /**
   * Valide le formulaire et retourne les erreurs éventuelles
   * @returns IForgotPasswordBuilder - Objet contenant les flags d'erreurs
   */
  builderForgotPasswordForm(): IForgotPasswordBuilder {
    // Réinitialiser les erreurs
    this.errors = {
      errorEmail: false,
      errorEmailMessage: '',
    }

    // Validation de l'email
    if (!this.email || this.email.trim() === '') {
      this.errors.errorEmail = true
      this.errors.errorEmailMessage = "L'adresse email est requise"
    } else if (!Validator.email(this.email)) {
      this.errors.errorEmail = true
      this.errors.errorEmailMessage = 'Veuillez entrer une adresse email valide'
    }

    return this.errors
  }

  /**
   * Retourne les données du formulaire prêtes à être envoyées à l'API
   * @returns IForgotPasswordModel - Données de demande de réinitialisation
   */
  getForgotPasswordData(): IForgotPasswordModel {
    return {
      email: this.email.trim().toLowerCase(),
    }
  }
}

/**
 * Classe pour gérer et valider le formulaire de réinitialisation de mot de passe
 */
export class ResetPasswordForm {
  private password: string = ''
  private confirmPassword: string = ''
  private token: string = ''
  private errors: IResetPasswordBuilder = {
    errorPassword: false,
    errorPasswordMessage: '',
    errorConfirmPassword: false,
    errorConfirmPasswordMessage: '',
  }

  /**
   * Définit le nouveau mot de passe
   * @param password - Nouveau mot de passe
   */
  setPassword(password: string): ResetPasswordForm {
    this.password = password
    return this
  }

  /**
   * Définit la confirmation du mot de passe
   * @param confirmPassword - Confirmation du mot de passe
   */
  setConfirmPassword(confirmPassword: string): ResetPasswordForm {
    this.confirmPassword = confirmPassword
    return this
  }

  /**
   * Définit le token de réinitialisation
   * @param token - Token de réinitialisation
   */
  setToken(token: string): ResetPasswordForm {
    this.token = token
    return this
  }

  /**
   * Valide le formulaire et retourne les erreurs éventuelles
   * @returns IResetPasswordBuilder - Objet contenant les flags d'erreurs
   */
  builderResetPasswordForm(): IResetPasswordBuilder {
    // Réinitialiser les erreurs
    this.errors = {
      errorPassword: false,
      errorPasswordMessage: '',
      errorConfirmPassword: false,
      errorConfirmPasswordMessage: '',
    }

    // Validation du mot de passe
    if (!this.password) {
      this.errors.errorPassword = true
      this.errors.errorPasswordMessage = 'Le mot de passe est requis'
    } else if (this.password.length < 6) {
      this.errors.errorPassword = true
      this.errors.errorPasswordMessage = 'Le mot de passe doit contenir au moins 6 caractères'
    } else if (!Validator.password(this.password)) {
      this.errors.errorPassword = true
      this.errors.errorPasswordMessage =
        'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre'
    }

    // Validation de la confirmation du mot de passe
    if (!this.confirmPassword) {
      this.errors.errorConfirmPassword = true
      this.errors.errorConfirmPasswordMessage = 'La confirmation du mot de passe est requise'
    } else if (this.password !== this.confirmPassword) {
      this.errors.errorConfirmPassword = true
      this.errors.errorConfirmPasswordMessage = 'Les mots de passe ne correspondent pas'
    }

    return this.errors
  }

  /**
   * Retourne les données du formulaire prêtes à être envoyées à l'API
   * @returns IResetPasswordModel - Données de réinitialisation
   */
  getResetPasswordData(): IResetPasswordModel {
    return {
      password: this.password,
      confirmPassword: this.confirmPassword,
      token: this.token,
    }
  }
}
