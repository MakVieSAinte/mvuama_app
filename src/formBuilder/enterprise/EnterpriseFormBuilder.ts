import type { IEnterpriseModel } from '@/interfaces/enterpriseInterface'
import { Validator } from '@/services/libs/validator'

export class EnterpriseFormBuilder {
  private name: string = ''
  private legalStatus?: string
  private activityType?: string
  private niuNumber?: string
  private rccmNumber?: string
  private country: string = ''
  private city?: string
  private address?: string
  private email: string = ''
  private phone?: string
  private website?: string
  private legalManagerName?: string
  private legalManagerPhone?: string
  private legalManagerEmail?: string
  private logoUrl?: string
  private description?: string
  private createdBy: string = ''

  // Flags d'erreurs
  public errorName: boolean = false
  public errorNameMessage: string = ''
  public errorLegalStatus: boolean = false
  public errorLegalStatusMessage: string = ''
  public errorActivityType: boolean = false
  public errorActivityTypeMessage: string = ''
  public errorNiuNumber: boolean = false
  public errorNiuNumberMessage: string = ''
  public errorRccmNumber: boolean = false
  public errorRccmNumberMessage: string = ''
  public errorCountry: boolean = false
  public errorCountryMessage: string = ''
  public errorCity: boolean = false
  public errorCityMessage: string = ''
  public errorAddress: boolean = false
  public errorAddressMessage: string = ''
  public errorPhone: boolean = false
  public errorPhoneMessage: string = ''
  public errorEmail: boolean = false
  public errorEmailMessage: string = ''
  public errorWebsite: boolean = false
  public errorWebsiteMessage: string = ''
  public errorLegalManagerName: boolean = false
  public errorLegalManagerNameMessage: string = ''
  public errorLegalManagerPhone: boolean = false
  public errorLegalManagerPhoneMessage: string = ''
  public errorLegalManagerEmail: boolean = false
  public errorLegalManagerEmailMessage: string = ''
  public errorLogoUrl: boolean = false
  public errorLogoUrlMessage: string = ''
  public errorDescription: boolean = false
  public errorDescriptionMessage: string = ''

  constructor() {}

  setName(name: string): EnterpriseFormBuilder {
    this.name = name
    return this
  }

  setLegalStatus(legalStatus?: string): EnterpriseFormBuilder {
    this.legalStatus = legalStatus
    return this
  }

  setActivityType(activityType?: string): EnterpriseFormBuilder {
    this.activityType = activityType
    return this
  }

  setNiuNumber(niuNumber?: string): EnterpriseFormBuilder {
    this.niuNumber = niuNumber
    return this
  }

  setRccmNumber(rccmNumber?: string): EnterpriseFormBuilder {
    this.rccmNumber = rccmNumber
    return this
  }

  setCountry(country: string): EnterpriseFormBuilder {
    this.country = country
    return this
  }

  setCity(city?: string): EnterpriseFormBuilder {
    this.city = city
    return this
  }

  setAddress(address?: string): EnterpriseFormBuilder {
    this.address = address
    return this
  }

  setPhone(phone?: string): EnterpriseFormBuilder {
    this.phone = phone
    return this
  }

  setEmail(email: string): EnterpriseFormBuilder {
    this.email = email
    return this
  }

  setWebsite(website?: string): EnterpriseFormBuilder {
    this.website = website
    return this
  }

  setLegalManagerName(legalManagerName?: string): EnterpriseFormBuilder {
    this.legalManagerName = legalManagerName
    return this
  }

  setLegalManagerPhone(legalManagerPhone?: string): EnterpriseFormBuilder {
    this.legalManagerPhone = legalManagerPhone
    return this
  }

  setLegalManagerEmail(legalManagerEmail?: string): EnterpriseFormBuilder {
    this.legalManagerEmail = legalManagerEmail
    return this
  }

  setLogoUrl(logoUrl?: string): EnterpriseFormBuilder {
    this.logoUrl = logoUrl
    return this
  }

  setDescription(description?: string): EnterpriseFormBuilder {
    this.description = description
    return this
  }

  setCreatedBy(createdBy: string): EnterpriseFormBuilder {
    this.createdBy = createdBy
    return this
  }

  validate(): boolean {
    let isValid = true

    // Validation du nom (obligatoire)
    if (!this.name || this.name.trim() === '') {
      this.errorName = true
      this.errorNameMessage = "Le nom de l'entreprise est obligatoire"
      isValid = false
    } else {
      this.errorName = false
      this.errorNameMessage = ''
    }

    // Validation du pays (obligatoire)
    if (!this.country || this.country.trim() === '') {
      this.errorCountry = true
      this.errorCountryMessage = 'Le pays est obligatoire'
      isValid = false
    } else {
      this.errorCountry = false
      this.errorCountryMessage = ''
    }

    // Validation de l'email (obligatoire et format valide)
    if (!this.email || this.email.trim() === '') {
      this.errorEmail = true
      this.errorEmailMessage = "L'email est obligatoire"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(this.email)) {
      this.errorEmail = true
      this.errorEmailMessage = "Format d'email invalide"
      isValid = false
    } else {
      this.errorEmail = false
      this.errorEmailMessage = ''
    }

    // Validation du téléphone (optionnel mais format valide si fourni)
    if (
      this.phone &&
      !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/.test(
        this.phone,
      )
    ) {
      this.errorPhone = true
      this.errorPhoneMessage = 'Format de numéro de téléphone invalide'
      isValid = false
    } else {
      this.errorPhone = false
      this.errorPhoneMessage = ''
    }

    // Validation de l'email du responsable (optionnel mais format valide si fourni)
    if (this.legalManagerEmail && !/\S+@\S+\.\S+/.test(this.legalManagerEmail)) {
      this.errorLegalManagerEmail = true
      this.errorLegalManagerEmailMessage = "Format d'email du responsable invalide"
      isValid = false
    } else {
      this.errorLegalManagerEmail = false
      this.errorLegalManagerEmailMessage = ''
    }

    // Validation du téléphone du responsable (optionnel mais format valide si fourni)
    if (
      this.legalManagerPhone &&
      !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/.test(
        this.legalManagerPhone,
      )
    ) {
      this.errorLegalManagerPhone = true
      this.errorLegalManagerPhoneMessage = 'Format de numéro de téléphone du responsable invalide'
      isValid = false
    } else {
      this.errorLegalManagerPhone = false
      this.errorLegalManagerPhoneMessage = ''
    }

    // Validation de l'ID utilisateur (obligatoire)
    if (!this.createdBy) {
      isValid = false
    }

    return isValid
  }

  buildEnterpriseForm() {
    return {
      errorName: this.errorName,
      errorNameMessage: this.errorNameMessage,
      errorLegalStatus: this.errorLegalStatus,
      errorLegalStatusMessage: this.errorLegalStatusMessage,
      errorActivityType: this.errorActivityType,
      errorActivityTypeMessage: this.errorActivityTypeMessage,
      errorNiuNumber: this.errorNiuNumber,
      errorNiuNumberMessage: this.errorNiuNumberMessage,
      errorRccmNumber: this.errorRccmNumber,
      errorRccmNumberMessage: this.errorRccmNumberMessage,
      errorCountry: this.errorCountry,
      errorCountryMessage: this.errorCountryMessage,
      errorCity: this.errorCity,
      errorCityMessage: this.errorCityMessage,
      errorAddress: this.errorAddress,
      errorAddressMessage: this.errorAddressMessage,
      errorPhone: this.errorPhone,
      errorPhoneMessage: this.errorPhoneMessage,
      errorEmail: this.errorEmail,
      errorEmailMessage: this.errorEmailMessage,
      errorWebsite: this.errorWebsite,
      errorWebsiteMessage: this.errorWebsiteMessage,
      errorLegalManagerName: this.errorLegalManagerName,
      errorLegalManagerNameMessage: this.errorLegalManagerNameMessage,
      errorLegalManagerPhone: this.errorLegalManagerPhone,
      errorLegalManagerPhoneMessage: this.errorLegalManagerPhoneMessage,
      errorLegalManagerEmail: this.errorLegalManagerEmail,
      errorLegalManagerEmailMessage: this.errorLegalManagerEmailMessage,
      errorLogoUrl: this.errorLogoUrl,
      errorLogoUrlMessage: this.errorLogoUrlMessage,
      errorDescription: this.errorDescription,
      errorDescriptionMessage: this.errorDescriptionMessage,
    }
  }

  getEnterpriseData(): Omit<IEnterpriseModel, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> {
    return {
      name: this.name,
      legal_status: this.legalStatus,
      activity_type: this.activityType,
      niu_number: this.niuNumber,
      rccm_number: this.rccmNumber,
      country: this.country,
      city: this.city,
      address: this.address,
      phone: this.phone,
      email: this.email,
      website: this.website,
      legal_manager_name: this.legalManagerName,
      legal_manager_phone: this.legalManagerPhone,
      legal_manager_email: this.legalManagerEmail,
      logo_url: this.logoUrl,
      description: this.description,
      created_by: this.createdBy,
    }
  }
}
