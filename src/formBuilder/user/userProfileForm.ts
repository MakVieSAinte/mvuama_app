import type { IUserProfileBuilder } from '@/interfaces/userProfileInterface'
import { Validator } from '@/services/libs/validator'

/**
 * Classe de gestion du formulaire de profil utilisateur
 */
export class UserProfileForm {
  // Champs obligatoires
  public firstName: string = ''
  public lastName: string = ''
  public email: string = ''

  // Flags d'erreur pour champs obligatoires
  public errorFirstName: boolean = false
  public errorLastName: boolean = false
  public errorEmail: boolean = false

  // Champ virtuel pour compatibilité
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim()
  }

  // Champs optionnels
  public phone: string | null = null
  public address: string | null = null
  public city: string | null = null
  public state: string | null = null
  public zip: string | null = null
  public country: string | null = null
  public currency: string | null = null
  public bio: string | null = null

  /**
   * Définit le prénom
   * @param firstName Prénom de l'utilisateur
   * @returns this pour chaînage
   */
  setFirstName(firstName: string) {
    this.firstName = firstName
    this.errorFirstName = !this.firstName || !Validator.validName(this.firstName)
    return this
  }

  /**
   * Définit le nom
   * @param lastName Nom de l'utilisateur
   * @returns this pour chaînage
   */
  setLastName(lastName: string) {
    this.lastName = lastName
    this.errorLastName = !this.lastName || !Validator.validName(this.lastName)
    return this
  }

  /**
   * Définit l'email
   * @param email Email de l'utilisateur
   * @returns this pour chaînage
   */
  setEmail(email: string) {
    this.email = email
    this.errorEmail = !this.email || !Validator.email(this.email)
    return this
  }

  /**
   * Définit le numéro de téléphone
   * @param phone Numéro de téléphone
   * @returns this pour chaînage
   */
  setPhone(phone: string | null) {
    this.phone = phone
    return this
  }

  /**
   * Définit l'adresse
   * @param address Adresse
   * @returns this pour chaînage
   */
  setAddress(address: string | null) {
    this.address = address
    return this
  }

  /**
   * Définit la ville
   * @param city Ville
   * @returns this pour chaînage
   */
  setCity(city: string | null) {
    this.city = city
    return this
  }

  /**
   * Définit l'état/province
   * @param state État/Province
   * @returns this pour chaînage
   */
  setState(state: string | null) {
    this.state = state
    return this
  }

  /**
   * Définit le code postal
   * @param zip Code postal
   * @returns this pour chaînage
   */
  setZip(zip: string | null) {
    this.zip = zip
    return this
  }

  /**
   * Définit le pays
   * @param country Pays
   * @returns this pour chaînage
   */
  setCountry(country: string | null) {
    this.country = country
    return this
  }

  /**
   * Définit la devise
   * @param currency Devise
   * @returns this pour chaînage
   */
  setCurrency(currency: string | null) {
    this.currency = currency
    return this
  }

  /**
   * Définit la biographie
   * @param bio Biographie
   * @returns this pour chaînage
   */
  setBio(bio: string | null) {
    this.bio = bio
    return this
  }

  /**
   * Vérifie si le formulaire est valide
   * @returns true si le formulaire est valide, false sinon
   */
  isValid(): boolean {
    this.errorFirstName = !this.firstName || !Validator.validName(this.firstName)
    this.errorLastName = !this.lastName || !Validator.validName(this.lastName)
    this.errorEmail = !this.email || !Validator.email(this.email)

    return !this.errorFirstName && !this.errorLastName && !this.errorEmail
  }

  /**
   * Construit l'objet de validation
   * @returns Objet de validation pour le profil
   */
  buildUserProfileForm(): IUserProfileBuilder {
    return {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      phone: this.phone,
      address: this.address,
      city: this.city,
      state: this.state,
      zip: this.zip,
      country: this.country,
      currency: this.currency,
      bio: this.bio,
    }
  }

  /**
   * Obtient les données pour mise à jour du profil
   * @returns Données pour mise à jour API/BDD
   */
  getUserProfileData() {
    return {
      first_name: this.firstName,
      last_name: this.lastName,
      phone: this.phone,
      address: this.address,
      city: this.city,
      state: this.state,
      zip: this.zip,
      country: this.country,
      currency: this.currency,
      bio: this.bio,
    }
  }
}
