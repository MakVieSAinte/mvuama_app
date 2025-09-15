import { supabase } from '../config/supabaseClient'
import type { IAgencyModel } from '@/interfaces/agencyInterface'

export class AgencyService {
  static async createAgency(
    agencyData: Omit<IAgencyModel, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>,
  ) {
    try {
      const formattedData = {
        name: agencyData.name,
        code: agencyData.code,
        enterprise_id: agencyData.enterprise_id,
        status: agencyData.status,
        country: agencyData.country,
        city: agencyData.city,
        address: agencyData.address,
        email: agencyData.email,
        phone: agencyData.phone,
        description: agencyData.description,
        manager_name: agencyData.manager_name,
        manager_position: agencyData.manager_position,
        manager_phone: agencyData.manager_phone,
        manager_email: agencyData.manager_email,
        created_by: agencyData.created_by,
      }

      // Insérer l'agence dans la table 'agencies'
      const { data, error } = await supabase
        .from('agencies')
        .insert([formattedData])
        .select()
        .single()

      if (error) {
        console.error("Erreur lors de la création de l'agence:", error)
        return { data: null, error, success: false }
      }

      return { data, error: null, success: true }
    } catch (error) {
      console.error("Erreur lors de la création de l'agence:", error)
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Erreur inconnue'),
        success: false,
      }
    }
  }

  static async getAgencyById(agencyId: string) {
    try {
      const { data, error } = await supabase
        .from('agencies')
        .select('*')
        .eq('id', agencyId)
        .single()

      if (error) {
        return { data: null, error, success: false }
      }

      return { data, error: null, success: true }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'agence:", error)
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Erreur inconnue'),
        success: false,
      }
    }
  }

  static async getAgenciesByEnterpriseId(enterpriseId: string): Promise<{
    data: IAgencyModel[] | null
    error: Error | null
    success: boolean
  }> {
    try {
      const { data, error } = await supabase
        .from('agencies')
        .select('*')
        .eq('enterprise_id', enterpriseId)
        .is('deleted_at', null)

      if (error) {
        console.error('Erreur lors de la récupération des agences:', error)
        return { data: null, error: new Error(error.message), success: false }
      }

      return { data, error: null, success: true }
    } catch (error) {
      console.error('Exception lors de la récupération des agences:', error)
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Erreur inconnue'),
        success: false,
      }
    }
  }

  static async getUserAgencies(userId?: string): Promise<{
    data: IAgencyModel[] | null
    error: Error | null
    success: boolean
  }> {
    try {
      const { data, error } = await supabase
        .from('agencies')
        .select('*')
        .eq('created_by', userId)
        .is('deleted_at', null)

      if (error) {
        console.error('Erreur lors de la récupération des agences:', error)
        return { data: null, error, success: false }
      }

      return { data, error: null, success: true }
    } catch (error) {
      console.error('Exception lors de la récupération des agences:', error)
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Erreur inconnue'),
        success: false,
      }
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

      if (error) {
        console.error("Erreur lors de la mise à jour de l'agence:", error)
        return { data: null, error, success: false }
      }

      return { data, error: null, success: true }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'agence:", error)
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Erreur inconnue'),
        success: false,
      }
    }
  }

  static async deleteAgency(agencyId: string) {
    try {
      // Soft delete en mettant à jour le champ deleted_at
      const { data, error } = await supabase
        .from('agencies')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', agencyId)
        .select()
        .single()

      if (error) {
        console.error("Erreur lors de la suppression de l'agence:", error)
        return { success: false, error }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'agence:", error)
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Erreur inconnue'),
      }
    }
  }
}
