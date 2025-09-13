import { supabase } from '../config/supabaseClient'
import type { IAgencyModel } from '../../interfaces/agencyInterface'

export class AgencyService {
  static async createAgency(
    agencyData: Omit<IAgencyModel, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>,
  ) {
    try {
      const formattedData = {
        name: agencyData.name,
        code: agencyData.code,
        type: agencyData.type,
        country: agencyData.country,
        city: agencyData.city,
        address: agencyData.address,
        postal_code: agencyData.postal_code,
        phone: agencyData.phone,
        mobile_phone: agencyData.mobile_phone,
        contact_email: agencyData.email,
        website: agencyData.website,
        description: agencyData.description,
        logo_url: agencyData.logo_url,
        created_by: agencyData.created_by,
      }

      // Insérer l'agence dans la table 'agencies'
      const { data, error } = await supabase
        .from('agencies')
        .insert([formattedData])
        .select()
        .single()

      if (error) {
        return { data: null, error, success: false }
      }

      return { data, error: null, success: true }
    } catch (error: any) {
      console.error("Erreur lors de la création de l'agence:", error)
      return { data: null, error, success: false }
    }
  }

  static async getAgencyById(agencyId: string) {
    try {
      const { data, error } = await supabase
        .from('agencies')
        .select('*')
        .eq('id', agencyId)
        .single()

      return { data, error: null }
    } catch (error: any) {
      console.error("Erreur lors de la récupération de l'agence:", error)
      return { data: null, error }
    }
  }

  static async getUserAgencies(userId?: string): any {
    try {
      // Vérifier d'abord si l'utilisateur existe dans la table users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)

      console.log("Vérification de l'utilisateur dans la table users:", { userData, userError })

      const getAgencies = await AgencyService.getUserAgencies(userId)

      return getAgencies
    } catch (error) {
      console.error('Exception lors de la récupération des agences:', error)
      return { data: null, error, success: false }
    }
  }

  static async updateAgency(agencyId: string, agencyData: Partial<IAgencyModel>) {
    try {
      const { data, error } = await supabase
        .from('agencies')
        .update(agencyData)
        .eq('id', agencyId)
        .select()
        .single()

      return { data, error: null }
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de l'agence:", error)
      return { data: null, error }
    }
  }

  static async deleteAgency(agencyId: string, userId: string) {
    try {
      // Effectuer une suppression en définissant deleted_at
      const { error } = await supabase
        .from('agencies')
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: userId,
        })
        .eq('id', agencyId)

      if (error) throw error

      return { success: true, error: null }
    } catch (error: any) {
      console.error("Erreur lors de la suppression de l'agence:", error)
      return { success: false, error }
    }
  }
}
