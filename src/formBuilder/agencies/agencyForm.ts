import { Validator } from '../../services/libs/validator'
import type { IAgencyModel, IAgencyBuilder } from '../../interfaces/agencyInterface'
import parsePhoneNumberFromString from 'libphonenumber-js'

export class AgencyForm {
  // Propriétés obligatoires et erreurs associées
  name: string
  errorName: boolean
  errorNameMessage: string
  country: string
  errorCountry: boolean
  errorCountryMessage: string
  created_by: string

  // Propriétés optionnelles
  code?: string
  errorCode: boolean
  errorCodeMessage: string
  type?: string
  errorType: boolean
  errorTypeMessage: string
  status?: 'active' | 'inactive'
  errorStatus: boolean
  errorStatusMessage: string
  city?: string
  errorCity: boolean
  errorCityMessage: string
  address?: string
  errorAddress: boolean
  errorAddressMessage: string
  postal_code?: string
  errorPostalCode: boolean
  errorPostalCodeMessage: string
  latitude?: number | null
  errorLatitude: boolean
  errorLatitudeMessage: string
  longitude?: number | null
  errorLongitude: boolean
  errorLongitudeMessage: string
  phone?: string | null
  errorPhone: boolean
  errorPhoneMessage: string
  mobile_phone?: string | null
  errorMobilePhone: boolean
  errorMobilePhoneMessage: string
  email?: string
  errorEmail: boolean
  errorEmailMessage: string
  website?: string | null
  errorWebsite: boolean
  errorWebsiteMessage: string
  logo_url?: string | null
  errorLogo: boolean
  errorLogoMessage: string
  description?: string
  errorDescription: boolean
  errorDescriptionMessage: string

  constructor(userId: string) {
    // Initialisation des propriétés obligatoires
    this.name = ''
    this.errorName = false
    this.errorNameMessage = "Veuillez saisir un nom d'agence valide"
    this.country = ''
    this.errorCountry = false
    this.errorCountryMessage = 'Veuillez sélectionner un pays'
    this.created_by = userId

    // Initialisation des propriétés optionnelles
    this.code = ''
    this.errorCode = false
    this.errorCodeMessage = 'Veuillez saisir un code valide (3-10 caractères alphanumériques)'
    this.type = ''
    this.errorType = false
    this.errorTypeMessage = "Veuillez sélectionner un type d'agence"
    this.status = 'active'
    this.errorStatus = false
    this.errorStatusMessage = 'Veuillez sélectionner un statut'
    this.city = ''
    this.errorCity = false
    this.errorCityMessage = 'Veuillez saisir une ville valide'
    this.address = ''
    this.errorAddress = false
    this.errorAddressMessage = 'Veuillez saisir une adresse valide'
    this.postal_code = ''
    this.errorPostalCode = false
    this.errorPostalCodeMessage = 'Veuillez saisir un code postal valide'
    this.latitude = null
    this.errorLatitude = false
    this.errorLatitudeMessage = 'La latitude doit être entre -90 et 90'
    this.longitude = null
    this.errorLongitude = false
    this.errorLongitudeMessage = 'La longitude doit être entre -180 et 180'
    this.phone = null
    this.errorPhone = false
    this.errorPhoneMessage = 'Numéro de téléphone fixe invalide'
    this.mobile_phone = null
    this.errorMobilePhone = false
    this.errorMobilePhoneMessage = 'Numéro de téléphone mobile invalide'
    this.email = ''
    this.errorEmail = false
    this.errorEmailMessage = 'Veuillez saisir une adresse email valide'
    this.website = null
    this.errorWebsite = false
    this.errorWebsiteMessage = 'Veuillez saisir une URL de site web valide'
    this.logo_url = null
    this.errorLogo = false
    this.errorLogoMessage = "Le format de l'image n'est pas valide"
    this.description = ''
    this.errorDescription = false
    this.errorDescriptionMessage = 'La description ne doit pas dépasser 500 caractères'
  }

  /**
   * Définit et valide le nom de l'agence
   * @param {string} name - Le nom de l'agence
   * @returns {AgencyForm} - L'instance courante pour le chaînage
   */
  setName(name: string) {
    this.name = name
    const isValid = Validator.validName(this.name)
    this.errorName = this.name.trim() === '' || !isValid

    if (this.name.trim() === '') {
      this.errorNameMessage = "Le nom de l'agence est requis"
    } else if (!isValid) {
      this.errorNameMessage = "Veuillez saisir un nom d'agence valide"
    }

    return this
  }

  /**
   * Définit et valide le code de l'agence
   * @param {string} code - Le code de l'agence
   * @returns {AgencyForm} - L'instance courante pour le chaînage
   */
  setCode(code: string) {
    this.code = code

    if (code && code.trim() !== '') {
      // Idéalement, nous utiliserions Validator.agencyCode(this.code), mais ajoutons la validation ici
      const isValid = /^[A-Z0-9\-]{3,10}$/i.test(this.code)
      this.errorCode = !isValid

      if (!isValid) {
        this.errorCodeMessage = 'Veuillez saisir un code valide (3-10 caractères alphanumériques)'
      }
    } else {
      this.errorCode = false
      this.code = undefined
    }

    return this
  }

  /**
   * Définit et valide le type d'agence
   * @param {string} type - Le type d'agence
   * @returns {AgencyForm} - L'instance courante pour le chaînage
   */
  setType(type: string) {
    this.type = type

    if (!type || type.trim() === '') {
      this.errorType = false
      this.type = undefined
    }

    return this
  }

  /**
   * Définit et valide le statut de l'agence
   * @param {string} status - Le statut de l'agence
   * @returns {AgencyForm} - L'instance courante pour le chaînage
   */
  setStatus(status: 'active' | 'inactive') {
    this.status = status
    this.errorStatus = false
    return this
  }

  /**
   * Définit et valide le pays de l'agence
   * @param {string} country - Le pays de l'agence
   * @returns {AgencyForm} - L'instance courante pour le chaînage
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
   * Définit et valide la ville de l'agence
   * @param {string} city - La ville de l'agence
   * @returns {AgencyForm} - L'instance courante pour le chaînage
   */
  setCity(city: string) {
    this.city = city

    if (!city || city.trim() === '') {
      this.errorCity = false
      this.city = undefined
    }

    return this
  }

  /**
   * Définit et valide l'adresse de l'agence
   * @param {string} address - L'adresse de l'agence
   * @returns {AgencyForm} - L'instance courante pour le chaînage
   */
  setAddress(address: string) {
    this.address = address

    if (!address || address.trim() === '') {
      this.errorAddress = false
      this.address = undefined
    }

    return this
  }

  /**
   * Définit et valide le code postal de l'agence
   * @param {string} postal_code - Le code postal de l'agence
   * @returns {AgencyForm} - L'instance courante pour le chaînage
   */
  setPostalCode(postal_code: string) {
    this.postal_code = postal_code

    if (postal_code && postal_code.trim() !== '') {
      // Idéalement, nous utiliserions Validator.postalCode(this.postal_code), mais ajoutons la validation ici
      const isValid = /^[A-Z0-9\-\s]{3,10}$/i.test(this.postal_code)
      this.errorPostalCode = !isValid

      if (!isValid) {
        this.errorPostalCodeMessage = 'Veuillez saisir un code postal valide'
      }
    } else {
      this.errorPostalCode = false
      this.postal_code = undefined
    }

    return this
  }

  /**
   * Définit et valide la latitude de l'agence
   * @param {number | null} latitude - La latitude de l'agence
   * @returns {AgencyForm} - L'instance courante pour le chaînage
   */
  setLatitude(latitude: number | null) {
    this.latitude = latitude

    if (latitude !== null) {
      // Validation de la latitude
      const isValid = Number.isFinite(latitude) && latitude >= -90 && latitude <= 90
      this.errorLatitude = !isValid

      if (!isValid) {
        this.errorLatitudeMessage = 'La latitude doit être entre -90 et 90'
      }
    } else {
      this.errorLatitude = false
    }

    return this
  }

  /**
   * Définit et valide la longitude de l'agence
   * @param {number | null} longitude - La longitude de l'agence
   * @returns {AgencyForm} - L'instance courante pour le chaînage
   */
  setLongitude(longitude: number | null) {
    this.longitude = longitude

    if (longitude !== null) {
      // Validation de la longitude
      const isValid = Number.isFinite(longitude) && longitude >= -180 && longitude <= 180
      this.errorLongitude = !isValid

      if (!isValid) {
        this.errorLongitudeMessage = 'La longitude doit être entre -180 et 180'
      }
    } else {
      this.errorLongitude = false
    }

    return this
  }

  /**
   * Définit et valide le numéro de téléphone fixe de l'agence
   * @param {string | null} phone - Le numéro de téléphone fixe
   * @returns {AgencyForm} - L'instance courante pour le chaînage
   */
  setPhone(phone: string | null) {
    this.phone = phone

    if (phone !== null && phone.trim() !== '') {
      try {
        const parsed = parsePhoneNumberFromString(phone, 'CG')
        if (parsed && parsed.isValid()) {
          this.errorPhone = false
          this.errorPhoneMessage = ''
          this.phone = parsed.formatInternational()
        } else {
          this.errorPhone = true
          this.errorPhoneMessage = 'Veuillez saisir un numéro de téléphone valide'
        }
      } catch (e) {
        this.errorPhone = true
        this.errorPhoneMessage = 'Numéro de téléphone invalide'
      }
    } else {
      this.errorPhone = false
      this.errorPhoneMessage = ''
      this.phone = null
    }

    return this
  }

  /**
   * Définit et valide le numéro de téléphone mobile de l'agence
   * @param {string | null} mobile_phone - Le numéro de téléphone mobile
   * @returns {AgencyForm} - L'instance courante pour le chaînage
   */
  setMobilePhone(mobile_phone: string | null) {
    this.mobile_phone = mobile_phone

    if (mobile_phone !== null && mobile_phone.trim() !== '') {
      try {
        const parsed = parsePhoneNumberFromString(mobile_phone, 'CG')
        if (parsed && parsed.isValid()) {
          this.errorMobilePhone = false
          this.errorMobilePhoneMessage = ''
          this.mobile_phone = parsed.formatInternational()
        } else {
          this.errorMobilePhone = true
          this.errorMobilePhoneMessage = 'Veuillez saisir un numéro de téléphone mobile valide'
        }
      } catch (e) {
        this.errorMobilePhone = true
        this.errorMobilePhoneMessage = 'Numéro de téléphone mobile invalide'
      }
    } else {
      this.errorMobilePhone = false
      this.errorMobilePhoneMessage = ''
      this.mobile_phone = null
    }

    return this
  }

  /**
   * Définit et valide l'email de l'agence
   * @param {string} email - L'email de l'agence
   * @returns {AgencyForm} - L'instance courante pour le chaînage
   */
  setEmail(email: string) {
    this.email = email

    if (email && email.trim() !== '') {
      const isValid = Validator.email(this.email)
      this.errorEmail = !isValid

      if (!isValid) {
        this.errorEmailMessage = 'Veuillez saisir une adresse email valide'
      }
    } else {
      this.errorEmail = false
      this.email = undefined
    }

    return this
  }

  /**
   * Définit et valide l'URL du site web de l'agence
   * @param {string | null} website - L'URL du site web
   * @returns {AgencyForm} - L'instance courante pour le chaînage
   */
  setWebsite(website: string | null) {
    this.website = website

    if (website !== null && website.trim() !== '') {
      // Idéalement, nous utiliserions Validator.website(this.website), mais ajoutons la validation ici
      const isValid = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?].*)?$/.test(
        website,
      )
      this.errorWebsite = !isValid

      if (!isValid) {
        this.errorWebsiteMessage = 'Veuillez saisir une URL de site web valide'
      }
    } else {
      this.errorWebsite = false
      this.website = null
    }

    return this
  }

  /**
   * Définit et valide l'URL du logo de l'agence
   * @param {string | null} logo_url - L'URL du logo
   * @returns {AgencyForm} - L'instance courante pour le chaînage
   */
  setLogoUrl(logo_url: string | null) {
    this.logo_url = logo_url
    this.errorLogo = false
    return this
  }

  /**
   * Définit et valide la description de l'agence
   * @param {string} description - La description de l'agence
   * @returns {AgencyForm} - L'instance courante pour le chaînage
   */
  setDescription(description: string) {
    this.description = description

    if (description && description.trim() !== '') {
      this.errorDescription = description.length > 500

      if (this.errorDescription) {
        this.errorDescriptionMessage = 'La description ne doit pas dépasser 500 caractères'
      }
    } else {
      this.errorDescription = false
      this.description = undefined
    }

    return this
  }

  /**
   * Construit l'objet de validation du formulaire
   * @returns {IAgencyBuilder} - L'objet contenant les états d'erreur
   */
  builderAgencyForm(): IAgencyBuilder {
    return {
      errorName: this.errorName,
      errorNameMessage: this.errorNameMessage,
      errorCode: this.errorCode,
      errorCodeMessage: this.errorCodeMessage,
      errorType: this.errorType,
      errorTypeMessage: this.errorTypeMessage,
      errorStatus: this.errorStatus,
      errorStatusMessage: this.errorStatusMessage,
      errorCountry: this.errorCountry,
      errorCountryMessage: this.errorCountryMessage,
      errorCity: this.errorCity,
      errorCityMessage: this.errorCityMessage,
      errorAddress: this.errorAddress,
      errorAddressMessage: this.errorAddressMessage,
      errorPostalCode: this.errorPostalCode,
      errorPostalCodeMessage: this.errorPostalCodeMessage,
      errorLatitude: this.errorLatitude,
      errorLatitudeMessage: this.errorLatitudeMessage,
      errorLongitude: this.errorLongitude,
      errorLongitudeMessage: this.errorLongitudeMessage,
      errorPhone: this.errorPhone,
      errorPhoneMessage: this.errorPhoneMessage,
      errorMobilePhone: this.errorMobilePhone,
      errorMobilePhoneMessage: this.errorMobilePhoneMessage,
      errorEmail: this.errorEmail,
      errorEmailMessage: this.errorEmailMessage,
      errorWebsite: this.errorWebsite,
      errorWebsiteMessage: this.errorWebsiteMessage,
      errorLogo: this.errorLogo,
      errorLogoMessage: this.errorLogoMessage,
      errorDescription: this.errorDescription,
      errorDescriptionMessage: this.errorDescriptionMessage,
    }
  }

  /**
   * Vérifie si le formulaire est valide
   * @returns {boolean} - true si le formulaire est valide
   */
  isValid(): boolean {
    // Vérifie que les champs obligatoires sont remplis et valides
    return (
      !this.errorName &&
      !this.errorCountry &&
      // Vérifie que les champs optionnels sont valides s'ils sont remplis
      !this.errorCode &&
      !this.errorType &&
      !this.errorStatus &&
      !this.errorCity &&
      !this.errorAddress &&
      !this.errorPostalCode &&
      !this.errorLatitude &&
      !this.errorLongitude &&
      !this.errorPhone &&
      !this.errorMobilePhone &&
      !this.errorEmail &&
      !this.errorWebsite &&
      !this.errorLogo &&
      !this.errorDescription
    )
  }

  /**
   * Retourne un objet prêt pour la création d'une agence
   * @returns {Omit<IAgencyModel, "id" | "created_at" | "updated_at" | "deleted_at">}
   */
  getAgencyData(): Omit<IAgencyModel, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> {
    // Construire l'objet de base avec les champs obligatoires
    const agencyData: Omit<IAgencyModel, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> = {
      name: this.name,
      country: this.country,
      created_by: this.created_by,
    }

    // Ajouter les champs optionnels seulement s'ils sont définis
    if (this.code) agencyData.code = this.code
    if (this.type) agencyData.type = this.type
    if (this.status) agencyData.status = this.status
    if (this.city) agencyData.city = this.city
    if (this.address) agencyData.address = this.address
    if (this.postal_code) agencyData.postal_code = this.postal_code
    if (this.latitude !== null) agencyData.latitude = this.latitude
    if (this.longitude !== null) agencyData.longitude = this.longitude
    if (this.phone !== null) agencyData.phone = this.phone
    if (this.mobile_phone !== null) agencyData.mobile_phone = this.mobile_phone
    if (this.email) agencyData.email = this.email
    if (this.website !== null) agencyData.website = this.website
    if (this.logo_url !== null) agencyData.logo_url = this.logo_url
    if (this.description) agencyData.description = this.description

    return agencyData
  }
}
