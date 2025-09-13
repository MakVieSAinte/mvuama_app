import { supabase } from '../config/supabaseClient'

export default class RegisterService {
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string | null
  country?: string
  currency?: string
  password?: string
  confirm_password?: string
  role?: string

  constructor(
    first_name: string,
    last_name: string,
    email: string,
    country: string,
    currency: string,
    phone_number?: string | null,
    password?: string,
    confirm_password?: string,
  ) {
    this.first_name = first_name
    this.last_name = last_name
    this.email = email
    this.country = country
    this.currency = currency
    this.phone_number = phone_number
    this.password = password || ''
    this.confirm_password = confirm_password || ''
  }

  async save() {
    try {
      if (!this.email || !this.password) {
        throw new Error('Email et mot de passe sont requis')
      }

      if (this.password !== this.confirm_password) {
        throw new Error('Les mots de passe ne correspondent pas')
      }

      // Étape 1 : Créer l'utilisateur dans auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: this.email,
        password: this.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            phone_number: this.phone_number,
            full_name: `${this.first_name} ${this.last_name}`,
          },
        },
      })

      if (authError) throw authError

      // Étape 2 : Ajouter les informations dans la table users
      if (authData && authData.user) {
        const { data, error } = await supabase.from('users').insert([
          {
            id: authData.user.id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            phone_number: this.phone_number,
            country: this.country,
            currency: this.currency,
            role: this.role,
          },
        ])

        if (error) throw error
        return data
      }

      return authData
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error)
      return 'Erreur'
    }
  }
}
