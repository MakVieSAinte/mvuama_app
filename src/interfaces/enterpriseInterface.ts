// Interface pour le modèle d'entreprise

export interface IEnterpriseModel {
  id?: string
  name: string // Nom de l'entreprise
  legal_status?: string // Statut juridique (SARL, SA, Entreprise individuelle...)
  activity_type?: string // Type d'activité
  niu_number?: string // Numéro NIU
  rccm_number?: string // Numéro RCCM
  description?: string // Brève présentation de l'entreprise
  country: string // Pays du siège
  city?: string // Ville du siège
  address?: string // Adresse complète
  email: string // Email principal
  phone?: string | null // Téléphone principal
  website?: string | null // Site web (optionnel)
  legal_manager_name?: string // Nom du responsable légal
  legal_manager_phone?: string | null // Téléphone du responsable
  legal_manager_email?: string | null // Email du responsable
  logo_url?: string | null // Logo (optionnel)
  created_at?: string
  updated_at?: string
  created_by: string
  deleted_at?: string | null
}

// Interface pour la validation du formulaire d'entreprise

export interface IEnterpriseBuilder {
  errorName: boolean
  errorNameMessage: string
  errorLegalStatus: boolean
  errorLegalStatusMessage: string
  errorActivityType: boolean
  errorActivityTypeMessage: string
  errorNiuNumber: boolean
  errorNiuNumberMessage: string
  errorRccmNumber: boolean
  errorRccmNumberMessage: string
  errorCountry: boolean
  errorCountryMessage: string
  errorCity: boolean
  errorCityMessage: string
  errorAddress: boolean
  errorAddressMessage: string
  errorPhone: boolean
  errorPhoneMessage: string
  errorEmail: boolean
  errorEmailMessage: string
  errorWebsite: boolean
  errorWebsiteMessage: string
  errorLegalManagerName: boolean
  errorLegalManagerNameMessage: string
  errorLegalManagerPhone: boolean
  errorLegalManagerPhoneMessage: string
  errorLegalManagerEmail: boolean
  errorLegalManagerEmailMessage: string
  errorLogoUrl: boolean
  errorLogoUrlMessage: string
  errorDescription: boolean
  errorDescriptionMessage: string
}
