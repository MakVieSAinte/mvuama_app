import { Validator } from '../../services/libs/validator'
import type { ILoginModel, ILoginBuilder } from '../../interfaces/loginInterface'

export class LoginForm {
  // Propriétés obligatoires et erreurs associées
  email: string
  errorEmail: boolean
  errorEmailMessage: string

  password: string
  errorPassword: boolean
  errorPasswordMessage: string

  // Propriétés optionnelles
  remember: boolean

  constructor() {
    // Initialisation des propriétés
    this.email = ''
    this.errorEmail = false
    this.errorEmailMessage = 'Veuillez saisir une adresse email valide'

    this.password = ''
    this.errorPassword = false
    this.errorPasswordMessage = 'Veuillez saisir votre mot de passe'

    this.remember = false
  }

  /**
   * Définit et valide l'email
   * @param {string} email - L'adresse email
   * @returns {LoginForm} - L'instance courante pour le chaînage
   */
  setEmail(email: string) {
    this.email = email
    const isValid = Validator.email(this.email)
    this.errorEmail = this.email.trim() === '' || !isValid

    if (this.email.trim() === '') {
      this.errorEmailMessage = "L'email est requis"
    } else if (!isValid) {
      this.errorEmailMessage = 'Veuillez saisir une adresse email valide'
    }

    return this
  }

  /**
   * Définit et valide le mot de passe
   * @param {string} password - Le mot de passe
   * @returns {LoginForm} - L'instance courante pour le chaînage
   */
  setPassword(password: string) {
    this.password = password
    this.errorPassword = this.password.trim() === ''

    if (this.password.trim() === '') {
      this.errorPasswordMessage = 'Le mot de passe est requis'
    } else if (password !== password.trim()) {
      // Vérification des espaces inutiles au début ou à la fin du mot de passe
      this.errorPassword = true
      this.errorPasswordMessage =
        "Le mot de passe ne doit pas contenir d'espaces au début ou à la fin"
    }

    return this
  }

  /**
   * Définit la préférence de mémorisation
   * @param {boolean} remember - Si l'utilisateur veut être mémorisé
   * @returns {LoginForm} - L'instance courante pour le chaînage
   */
  setRemember(remember: boolean) {
    this.remember = remember
    return this
  }

  /**
   * Construit l'objet de validation du formulaire
   * @returns {ILoginBuilder} - L'objet contenant les états d'erreur
   */
  builderLoginForm(): ILoginBuilder {
    return {
      errorEmail: this.errorEmail,
      errorEmailMessage: this.errorEmailMessage,
      errorPassword: this.errorPassword,
      errorPasswordMessage: this.errorPasswordMessage,
    }
  }

  /**
   * Retourne un objet prêt pour la connexion d'un utilisateur
   * @returns {ILoginModel} - Les données de connexion
   */
  getLoginData(): ILoginModel {
    return {
      email: this.email,
      password: this.password,
      remember: this.remember,
    }
  }
}
