import { Validator } from '../../services/libs/validator'
import type { IRegisterModel, IRegisterBuilder } from '../../interfaces/registerInterface'

export class RegisterForm {
  // Propri�t�s obligatoires et erreurs associ�es
  first_name: string
  errorFirstName: boolean
  errorFirstNameMessage: string
  last_name: string
  errorLastName: boolean
  errorLastNameMessage: string
  email: string
  errorEmail: boolean
  errorEmailMessage: string
  country: string
  errorCountry: boolean
  errorCountryMessage: string
  currency: string
  errorCurrency: boolean
  errorCurrencyMessage: string
  password: string
  errorPassword: boolean
  errorPasswordMessage: string
  confirm_password: string
  errorConfirmPassword: boolean
  errorConfirmPasswordMessage: string

  // Propri�t�s optionnelles
  phone_number?: string | null
  errorPhoneNumber: boolean
  errorPhoneNumberMessage: string

  constructor() {
    // Initialisation des propri�t�s obligatoires
    this.first_name = ''
    this.errorFirstName = false
    this.errorFirstNameMessage = 'Veuillez saisir un pr�nom valide'
    this.last_name = ''
    this.errorLastName = false
    this.errorLastNameMessage = 'Veuillez saisir un nom valide'
    this.email = ''
    this.errorEmail = false
    this.errorEmailMessage = 'Veuillez saisir une adresse email valide'
    this.country = ''
    this.errorCountry = false
    this.errorCountryMessage = 'Veuillez saisir un pays'
    this.currency = ''
    this.errorCurrency = false
    this.errorCurrencyMessage = 'Veuillez saisir une devise'
    this.password = ''
    this.errorPassword = false
    this.errorPasswordMessage =
      'Le mot de passe doit contenir au moins 8 caract�res, une majuscule, une minuscule et un chiffre'
    this.confirm_password = ''
    this.errorConfirmPassword = false
    this.errorConfirmPasswordMessage = 'Les mots de passe ne correspondent pas'

    // Initialisation des propri�t�s optionnelles
    this.phone_number = null
    this.errorPhoneNumber = false
    this.errorPhoneNumberMessage = 'Num�ro de t�l�phone invalide'
  }

  /**
   * D�finit et valide le pr�nom
   * @param {string} first_name - Le pr�nom de l'utilisateur
   * @returns {RegisterForm} - L'instance courante pour le cha�nage
   */
  setFirstName(first_name: string) {
    this.first_name = first_name
    const isValid = Validator.validName(this.first_name)
    this.errorFirstName = this.first_name.trim() === '' || !isValid

    if (this.first_name.trim() === '') {
      this.errorFirstNameMessage = 'Le pr�nom est requis'
    } else if (!isValid) {
      this.errorFirstNameMessage = 'Veuillez saisir un pr�nom valide'
    }

    return this
  }

  /**
   * D�finit et valide le nom de famille
   * @param {string} last_name - Le nom de famille de l'utilisateur
   * @returns {RegisterForm} - L'instance courante pour le cha�nage
   */
  setLastName(last_name: string) {
    this.last_name = last_name
    const isValid = Validator.validName(this.last_name)
    this.errorLastName = this.last_name.trim() === '' || !isValid

    if (this.last_name.trim() === '') {
      this.errorLastNameMessage = 'Le nom est requis'
    } else if (!isValid) {
      this.errorLastNameMessage = 'Veuillez saisir un nom valide'
    }

    return this
  }

  /**
   * D�finit et valide l'email
   * @param {string} email - L'adresse email
   * @returns {RegisterForm} - L'instance courante pour le cha�nage
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
   * D�finit et valide le num�ro de t�l�phone
   * @param {string | null} phone_number - Le num�ro de t�l�phone
   * @returns {RegisterForm} - L'instance courante pour le cha�nage
   */
  setPhoneNumber(phone_number: string | null) {
    this.phone_number = phone_number

    if (phone_number !== null && phone_number.trim() !== '') {
      // Validation basique: au moins 8 chiffres, peut contenir +, -, espaces
      const isValid = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,12}$/im.test(phone_number.trim())
      this.errorPhoneNumber = !isValid

      if (!isValid) {
        this.errorPhoneNumberMessage = 'Veuillez saisir un num�ro de t�l�phone valide'
      }
    } else {
      this.errorPhoneNumber = false
    }

    return this
  }

  /**
   * D�finit et valide le pays
   * @param {string} country - Le pays de l'utilisateur
   * @returns {RegisterForm} - L'instance courante pour le cha�nage
   */
  setCountry(country: string) {
    this.country = country
    this.errorCountry = this.country.trim() === ''

    if (this.country.trim() === '') {
      this.errorCountryMessage = 'Le pays est requis'
    }

    return this
  }

  /**
   * D�finit et valide la devise
   * @param {string} currency - La devise de l'utilisateur
   * @returns {RegisterForm} - L'instance courante pour le cha�nage
   */
  setCurrency(currency: string) {
    this.currency = currency
    this.errorCurrency = this.currency.trim() === ''

    if (this.currency.trim() === '') {
      this.errorCurrencyMessage = 'La devise est requise'
    }

    return this
  }

  /**
   * D�finit et valide le mot de passe
   * @param {string} password - Le mot de passe
   * @returns {RegisterForm} - L'instance courante pour le cha�nage
   */
  setPassword(password: string) {
    this.password = password
    const isValid = Validator.password(this.password)
    this.errorPassword = this.password.trim() === '' || !isValid

    if (this.password.trim() === '') {
      this.errorPasswordMessage = 'Le mot de passe est requis'
    } else if (!isValid) {
      this.errorPasswordMessage =
        'Le mot de passe doit contenir au moins 8 caract�res, une majuscule, une minuscule et un chiffre'
    }

    return this
  }

  /**
   * D�finit et valide la confirmation du mot de passe
   * @param {string} confirm_password - La confirmation du mot de passe
   * @returns {RegisterForm} - L'instance courante pour le cha�nage
   */
  setConfirmPassword(confirm_password: string) {
    this.confirm_password = confirm_password
    this.errorConfirmPassword =
      this.confirm_password !== this.password || this.confirm_password.trim() === ''

    if (this.confirm_password.trim() === '') {
      this.errorConfirmPasswordMessage = 'La confirmation du mot de passe est requise'
    } else if (this.confirm_password !== this.password) {
      this.errorConfirmPasswordMessage = 'Les mots de passe ne correspondent pas'
    }

    return this
  }

  /**
   * Construit l'objet de validation du formulaire
   * @returns {IRegisterBuilder} - L'objet contenant les �tats d'erreur
   */
  builderRegisterForm(): IRegisterBuilder {
    return {
      errorFirstName: this.errorFirstName,
      errorFirstNameMessage: this.errorFirstNameMessage,
      errorLastName: this.errorLastName,
      errorLastNameMessage: this.errorLastNameMessage,
      errorEmail: this.errorEmail,
      errorEmailMessage: this.errorEmailMessage,
      errorPhoneNumber: this.errorPhoneNumber,
      errorPhoneNumberMessage: this.errorPhoneNumberMessage,
      errorCountry: this.errorCountry,
      errorCountryMessage: this.errorCountryMessage,
      errorCurrency: this.errorCurrency,
      errorCurrencyMessage: this.errorCurrencyMessage,
      errorPassword: this.errorPassword,
      errorPasswordMessage: this.errorPasswordMessage,
      errorConfirmPassword: this.errorConfirmPassword,
      errorConfirmPasswordMessage: this.errorConfirmPasswordMessage,
    }
  }

  /**
   * Retourne un objet pr�t pour l'enregistrement d'un utilisateur
   * @returns {Omit<IRegisterModel, "id" | "created_at" | "updated_at" | "deleted_at" | "deleted_by" | "role">}
   */
  getRegisterData(): Omit<
    IRegisterModel,
    'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'deleted_by' | 'role'
  > {
    return {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      phone_number: this.phone_number,
      country: this.country,
      currency: this.currency,
    }
  }
}
