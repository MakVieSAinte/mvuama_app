import type { IAgencyModel } from '@/interfaces/agencyInterface'
import { Validator } from '@/services/libs/validator'

export class AgencyFormBuilder {
  private name: string = ''
  private code?: string
  private enterpriseId: string = ''
  private status?: string
  private country: string = ''
  private city?: string
  private address?: string
  private email?: string
  private phone?: string
  private description?: string
  private managerName?: string
  private managerPosition?: string
  private managerPhone?: string
  private managerEmail?: string
  private createdBy: string = ''

  // Flags d'erreurs
  public errorName: boolean = false
  public errorNameMessage: string = ''
  public errorCode: boolean = false
  public errorCodeMessage: string = ''
  public errorEnterpriseId: boolean = false
  public errorEnterpriseIdMessage: string = ''
  public errorStatus: boolean = false
  public errorStatusMessage: string = ''
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
  public errorDescription: boolean = false
  public errorDescriptionMessage: string = ''
  public errorManagerName: boolean = false
  public errorManagerNameMessage: string = ''
  public errorManagerPosition: boolean = false
  public errorManagerPositionMessage: string = ''
  public errorManagerPhone: boolean = false
  public errorManagerPhoneMessage: string = ''
  public errorManagerEmail: boolean = false
  public errorManagerEmailMessage: string = ''

  constructor() {}

  setName(name: string): AgencyFormBuilder {
    this.name = name
    return this
  }

  setCode(code?: string): AgencyFormBuilder {
    this.code = code
    return this
  }

  setEnterpriseId(enterpriseId: string): AgencyFormBuilder {
    this.enterpriseId = enterpriseId
    return this
  }

  setStatus(status?: string): AgencyFormBuilder {
    this.status = status
    return this
  }

  setCountry(country: string): AgencyFormBuilder {
    this.country = country
    return this
  }

  setCity(city?: string): AgencyFormBuilder {
    this.city = city
    return this
  }

  setAddress(address?: string): AgencyFormBuilder {
    this.address = address
    return this
  }

  setPhone(phone?: string): AgencyFormBuilder {
    this.phone = phone
    return this
  }

  setEmail(email?: string): AgencyFormBuilder {
    this.email = email
    return this
  }

  setDescription(description?: string): AgencyFormBuilder {
    this.description = description
    return this
  }

  setManagerName(managerName?: string): AgencyFormBuilder {
    this.managerName = managerName
    return this
  }

  setManagerPosition(managerPosition?: string): AgencyFormBuilder {
    this.managerPosition = managerPosition
    return this
  }

  setManagerPhone(managerPhone?: string): AgencyFormBuilder {
    this.managerPhone = managerPhone
    return this
  }

  setManagerEmail(managerEmail?: string): AgencyFormBuilder {
    this.managerEmail = managerEmail
    return this
  }

  setCreatedBy(createdBy: string): AgencyFormBuilder {
    this.createdBy = createdBy
    return this
  }

  validate(): boolean {
    let isValid = true

    // Validation du nom (obligatoire)
    if (!this.name || this.name.trim() === '') {
      this.errorName = true
      this.errorNameMessage = "Le nom de l'agence est obligatoire"
      isValid = false
    } else {
      this.errorName = false
      this.errorNameMessage = ''
    }

    // Validation de l'ID d'entreprise (obligatoire)
    if (!this.enterpriseId) {
      this.errorEnterpriseId = true
      this.errorEnterpriseIdMessage = "L'entreprise associée est obligatoire"
      isValid = false
    } else {
      this.errorEnterpriseId = false
      this.errorEnterpriseIdMessage = ''
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

    // Validation de l'email (format valide si fourni)
    if (this.email && !/\S+@\S+\.\S+/.test(this.email)) {
      this.errorEmail = true
      this.errorEmailMessage = "Format d'email invalide"
      isValid = false
    } else {
      this.errorEmail = false
      this.errorEmailMessage = ''
    }

    // Validation du téléphone (format valide si fourni)
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

    // Validation de l'email du responsable (format valide si fourni)
    if (this.managerEmail && !/\S+@\S+\.\S+/.test(this.managerEmail)) {
      this.errorManagerEmail = true
      this.errorManagerEmailMessage = "Format d'email du responsable invalide"
      isValid = false
    } else {
      this.errorManagerEmail = false
      this.errorManagerEmailMessage = ''
    }

    // Validation du téléphone du responsable (format valide si fourni)
    if (
      this.managerPhone &&
      !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/.test(
        this.managerPhone,
      )
    ) {
      this.errorManagerPhone = true
      this.errorManagerPhoneMessage = 'Format de numéro de téléphone du responsable invalide'
      isValid = false
    } else {
      this.errorManagerPhone = false
      this.errorManagerPhoneMessage = ''
    }

    // Validation de l'ID utilisateur (obligatoire)
    if (!this.createdBy) {
      isValid = false
    }

    return isValid
  }

  buildAgencyForm() {
    return {
      errorName: this.errorName,
      errorNameMessage: this.errorNameMessage,
      errorCode: this.errorCode,
      errorCodeMessage: this.errorCodeMessage,
      errorEnterpriseId: this.errorEnterpriseId,
      errorEnterpriseIdMessage: this.errorEnterpriseIdMessage,
      errorStatus: this.errorStatus,
      errorStatusMessage: this.errorStatusMessage,
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
      errorDescription: this.errorDescription,
      errorDescriptionMessage: this.errorDescriptionMessage,
      errorManagerName: this.errorManagerName,
      errorManagerNameMessage: this.errorManagerNameMessage,
      errorManagerPosition: this.errorManagerPosition,
      errorManagerPositionMessage: this.errorManagerPositionMessage,
      errorManagerPhone: this.errorManagerPhone,
      errorManagerPhoneMessage: this.errorManagerPhoneMessage,
      errorManagerEmail: this.errorManagerEmail,
      errorManagerEmailMessage: this.errorManagerEmailMessage,
    }
  }

  getAgencyData(): Omit<IAgencyModel, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> {
    return {
      name: this.name,
      code: this.code,
      enterprise_id: this.enterpriseId,
      status: this.status as 'active' | 'closed' | 'suspended' | undefined,
      country: this.country,
      city: this.city,
      address: this.address,
      phone: this.phone,
      email: this.email,
      description: this.description,
      manager_name: this.managerName,
      manager_position: this.managerPosition,
      manager_phone: this.managerPhone,
      manager_email: this.managerEmail,
      created_by: this.createdBy,
    }
  }
}
