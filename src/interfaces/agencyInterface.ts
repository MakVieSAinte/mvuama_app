// Interface pour le modèle d'agence

export interface IAgencyModel {
  id?: string
  name: string
  code?: string
  type?: string
  status?: 'active' | 'inactive'
  country: string
  city?: string
  address?: string
  postal_code?: string
  latitude?: number | null
  longitude?: number | null
  phone?: string | null
  mobile_phone?: string | null
  email?: string
  website?: string | null
  logo_url?: string | null
  description?: string
  created_at?: string
  updated_at?: string
  created_by: string
  deleted_at?: string | null
}

// Interface pour la validation du formulaire d'agence

export interface IAgencyBuilder {
  errorName: boolean
  errorNameMessage: string
  errorCode: boolean
  errorCodeMessage: string
  errorType: boolean
  errorTypeMessage: string
  errorStatus: boolean
  errorStatusMessage: string
  errorCountry: boolean
  errorCountryMessage: string
  errorCity: boolean
  errorCityMessage: string
  errorAddress: boolean
  errorAddressMessage: string
  errorPostalCode: boolean
  errorPostalCodeMessage: string
  errorLatitude: boolean
  errorLatitudeMessage: string
  errorLongitude: boolean
  errorLongitudeMessage: string
  errorPhone: boolean
  errorPhoneMessage: string
  errorMobilePhone: boolean
  errorMobilePhoneMessage: string
  errorEmail: boolean
  errorEmailMessage: string
  errorWebsite: boolean
  errorWebsiteMessage: string
  errorLogo: boolean
  errorLogoMessage: string
  errorDescription: boolean
  errorDescriptionMessage: string
}

// Types d'agences disponibles
export const AGENCY_TYPES = [
  { value: 'headquarters', label: 'Siège social' },
  { value: 'branch', label: 'Succursale' },
  { value: 'franchise', label: 'Franchise' },
  { value: 'partner', label: 'Partenaire' },
  { value: 'dealer', label: 'Concessionnaire' },
  { value: 'other', label: 'Autre' },
]
