import { supabase } from '../config/supabaseClient'
import { useSonner } from '@/plugins/sonner'

/**
 * Service pour gérer les notifications d'authentification
 */
export class AuthNotificationService {
  private static toast = useSonner()

  /**
   * Affiche une notification après une connexion réussie
   * @param username Nom d'utilisateur
   */
  static notifyLoginSuccess(username: string = 'Utilisateur') {
    this.toast.toastSuccess(`Bienvenue ${username} ! Connexion réussie.`, {
      description: 'Vous êtes maintenant connecté à votre compte.',
      duration: 4000,
    })
  }

  /**
   * Affiche une notification après une erreur de connexion
   * @param error Message d'erreur
   */
  static notifyLoginError(error: string = 'Échec de la connexion') {
    this.toast.toastError(error, {
      description: 'Veuillez vérifier vos identifiants et réessayer.',
      duration: 5000,
    })
  }

  /**
   * Affiche une notification après une inscription réussie
   */
  static notifyRegistrationSuccess() {
    this.toast.toastSuccess('Inscription réussie !', {
      description:
        'Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.',
      duration: 6000,
    })
  }

  /**
   * Affiche une notification après une erreur d'inscription
   * @param error Message d'erreur
   */
  static notifyRegistrationError(error: string = "L'inscription a échoué") {
    this.toast.toastError(error, {
      description: 'Veuillez vérifier les informations saisies et réessayer.',
      duration: 5000,
    })
  }

  /**
   * Affiche une notification après une déconnexion réussie
   */
  static notifyLogout() {
    this.toast.toastInfo('Vous avez été déconnecté', {
      description: 'À bientôt !',
      duration: 3000,
    })
  }

  /**
   * Affiche une notification pour les actions dangereuses (suppression de compte, etc.)
   * @param message Message principal
   * @param description Description supplémentaire
   */
  static notifyDangerousAction(message: string, description?: string) {
    this.toast.toastWarning(message, {
      description,
      duration: 7000,
      important: true, // Ne peut pas être rejeté facilement
    })
  }

  /**
   * Affiche une notification pour les erreurs d'autorisation
   */
  static notifyUnauthorized() {
    this.toast.toastError('Accès non autorisé', {
      description: "Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.",
      duration: 5000,
    })
  }

  /**
   * Affiche une notification pour la session expirée
   */
  static notifySessionExpired() {
    this.toast.toastWarning('Votre session a expiré', {
      description: 'Veuillez vous reconnecter pour continuer.',
      duration: 5000,
      action: {
        label: 'Se connecter',
        onClick: () => (window.location.href = '/auth/login'),
      },
    })
  }

  /**
   * Affiche une notification après l'envoi d'un email de réinitialisation de mot de passe
   */
  static notifyResetEmailSent() {
    this.toast.toastSuccess('Email de réinitialisation envoyé !', {
      description:
        'Un email contenant les instructions pour réinitialiser votre mot de passe a été envoyé à votre adresse.',
      duration: 6000,
    })
  }

  /**
   * Affiche une notification après une erreur d'envoi d'email de réinitialisation
   * @param error Message d'erreur
   */
  static notifyResetEmailError(error: string = "L'envoi de l'email a échoué") {
    this.toast.toastError(error, {
      description: 'Veuillez vérifier votre adresse email et réessayer.',
      duration: 5000,
    })
  }

  /**
   * Affiche une notification après une réinitialisation de mot de passe réussie
   */
  static notifyPasswordResetSuccess() {
    this.toast.toastSuccess('Mot de passe réinitialisé avec succès !', {
      description: 'Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.',
      duration: 5000,
      action: {
        label: 'Se connecter',
        onClick: () => (window.location.href = '/auth/login'),
      },
    })
  }

  /**
   * Affiche une notification après une erreur de réinitialisation de mot de passe
   * @param error Message d'erreur
   */
  static notifyPasswordResetError(error: string = 'La réinitialisation du mot de passe a échoué') {
    this.toast.toastError(error, {
      description: 'Veuillez réessayer ou demander un nouveau lien de réinitialisation.',
      duration: 5000,
    })
  }
}
