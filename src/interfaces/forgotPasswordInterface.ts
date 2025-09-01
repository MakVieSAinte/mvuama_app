/**
 * Interface pour le formulaire de demande de réinitialisation de mot de passe
 * Définit la structure des données nécessaires pour la demande
 */
export interface IForgotPasswordModel {
  email: string
}

/**
 * Interface pour les erreurs de validation du formulaire de réinitialisation de mot de passe
 * Contient les flags d'erreurs et messages associés
 */
export interface IForgotPasswordBuilder {
  // Flag d'erreur pour l'email
  errorEmail: boolean
  errorEmailMessage: string
}

/**
 * Interface pour le formulaire de réinitialisation de mot de passe (avec le token)
 * Définit la structure des données nécessaires pour la réinitialisation
 */
export interface IResetPasswordModel {
  password: string
  confirmPassword: string
  token: string
}

/**
 * Interface pour les erreurs de validation du formulaire de définition de nouveau mot de passe
 * Contient les flags d'erreurs et messages associés
 */
export interface IResetPasswordBuilder {
  // Flag d'erreur pour le mot de passe
  errorPassword: boolean
  errorPasswordMessage: string

  // Flag d'erreur pour la confirmation du mot de passe
  errorConfirmPassword: boolean
  errorConfirmPasswordMessage: string
}
