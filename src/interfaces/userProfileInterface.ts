/**
 * Interface pour les données du profil utilisateur
 */
export interface IUserProfileModel {
  id: string
  first_name: string
  last_name: string
  full_name: string // Conservé pour compatibilité
  email: string
  phone?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  country?: string | null
  currency?: string | null
  bio?: string | null
  avatar_url?: string | null
  created_at: string
  updated_at?: string | null
}

/**
 * Interface pour les données de validation du formulaire de profil
 */
export interface IUserProfileBuilder {
  first_name: string
  last_name: string
  email: string
  phone?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  country?: string | null
  currency?: string | null
  bio?: string | null
}

/**
 * Interface pour la mise à jour du profil utilisateur
 */
export interface IUserProfileUpdateData {
  first_name?: string
  last_name?: string
  phone?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  country?: string | null
  currency?: string | null
  bio?: string | null
  avatar_url?: string | null
}
