import { useSonner } from '@/plugins/sonner'

export class AuthNotificationService {
  private static toast = useSonner()

  static notifyLoginSuccess(username: string = 'Utilisateur') {
    this.toast.toastSuccess(`Bienvenue ${username} ! Connexion réussie.`, {
      description: 'Vous êtes maintenant connecté à votre compte.',
      duration: 4100,
    })
  }

  static notifyLoginError(error: string = 'Échec de la connexion') {
    this.toast.toastError(error, {
      description: 'Veuillez vérifier vos identifiants et réessayer.',
      duration: 5000,
    })
  }

  static notifyRegistrationSuccess() {
    this.toast.toastSuccess('Inscription réussie !', {
      description:
        'Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.',
      duration: 8500,
    })
  }

  static notifyRegistrationError(error: string = "L'inscription a échoué") {
    this.toast.toastError(error, {
      description: 'Veuillez vérifier les informations saisies et réessayer.',
      duration: 5000,
    })
  }

  static notifyLogout() {
    this.toast.toastInfo('Vous avez été déconnecté', {
      description: 'À bientôt !',
      duration: 3000,
    })
  }

  static notifyDangerousAction(message: string, description?: string) {
    this.toast.toastWarning(message, {
      description,
      duration: 7000,
      important: true,
    })
  }

  static notifyUnauthorized() {
    this.toast.toastError('Accès non autorisé', {
      description: "Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.",
      duration: 5000,
    })
  }

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

  static notifyResetEmailSent() {
    this.toast.toastSuccess('Email de réinitialisation envoyé !', {
      description:
        'Un email contenant les instructions pour réinitialiser votre mot de passe a été envoyé à votre adresse.',
      duration: 8500,
    })
  }

  static notifyResetEmailError(error: string = "L'envoi de l'email a échoué") {
    this.toast.toastError(error, {
      description: 'Veuillez vérifier votre adresse email et réessayer.',
      duration: 8500,
    })
  }

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

  static notifyPasswordResetError(error: string = 'La réinitialisation du mot de passe a échoué') {
    this.toast.toastError(error, {
      description: 'Veuillez réessayer ou demander un nouveau lien de réinitialisation.',
      duration: 8000,
    })
  }
}
