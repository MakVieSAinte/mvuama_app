// Interface pour le modèle d'agence

export interface IAgencyModel {
  id?: string
  enterprise_id: string // ID de l'entreprise parente
  name: string // Nom de l'agence
  code?: string // Code interne pour gestion dans l'app
  status?: 'active' | 'closed' | 'suspended' // Statut dans l'app (active, fermée, suspendue)
  description?: string // Description (ex: "Agence spécialisée dans le transport urbain")
  country: string // Pays
  city?: string // Ville
  address?: string // Adresse complète
  email?: string // Email de l'agence
  phone?: string | null // Téléphone de l'agence
  manager_name?: string // Responsable d'agence (nom)
  manager_position?: string // Fonction du responsable
  manager_phone?: string | null // Téléphone du responsable
  manager_email?: string | null // Email du responsable
  created_at?: string
  updated_at?: string
  created_by: string
  deleted_at?: string | null
}

// Interface pour la validation du formulaire d'agence

export interface IAgencyBuilder {
  errorEnterpriseId: boolean
  errorEnterpriseIdMessage: string
  errorName: boolean
  errorNameMessage: string
  errorCode: boolean
  errorCodeMessage: string
  errorStatus: boolean
  errorStatusMessage: string
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
  errorDescription: boolean
  errorDescriptionMessage: string
  errorManagerName: boolean
  errorManagerNameMessage: string
  errorManagerPosition: boolean
  errorManagerPositionMessage: string
  errorManagerPhone: boolean
  errorManagerPhoneMessage: string
  errorManagerEmail: boolean
  errorManagerEmailMessage: string
}

// Statuts possibles pour les agences
export const AGENCY_STATUS = [
  { value: 'active', label: 'Active' },
  { value: 'closed', label: 'Fermée' },
  { value: 'suspended', label: 'Suspendue' },
]
