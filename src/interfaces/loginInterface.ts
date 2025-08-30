// Interface pour le modèle de connexion
export interface ILoginModel {
  email: string
  password: string
  remember?: boolean
}

// Interface pour la validation du formulaire de connexion
export interface ILoginBuilder {
  errorEmail: boolean
  errorEmailMessage: string
  errorPassword: boolean
  errorPasswordMessage: string
}
