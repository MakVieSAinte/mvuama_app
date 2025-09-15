import { supabase } from '../config/supabaseClient'
import type { IEnterpriseModel } from '../../interfaces/enterpriseInterface'

export class EnterpriseService {
  static async createEnterprise(
    enterpriseData: Omit<IEnterpriseModel, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>,
  ) {
    try {
      const formattedData = {
        name: enterpriseData.name,
        legal_status: enterpriseData.legal_status,
        activity_type: enterpriseData.activity_type,
        niu_number: enterpriseData.niu_number,
        rccm_number: enterpriseData.rccm_number,
        country: enterpriseData.country,
        city: enterpriseData.city,
        address: enterpriseData.address,
        email: enterpriseData.email,
        phone: enterpriseData.phone,
        website: enterpriseData.website,
        legal_manager_name: enterpriseData.legal_manager_name,
        legal_manager_phone: enterpriseData.legal_manager_phone,
        legal_manager_email: enterpriseData.legal_manager_email,
        description: enterpriseData.description,
        logo_url: enterpriseData.logo_url,
        created_by: enterpriseData.created_by,
      }

      // Insérer l'entreprise dans la table 'enterprises'
      const { data, error } = await supabase
        .from('enterprises')
        .insert([formattedData])
        .select()
        .single()

      if (error) {
        console.error("Erreur lors de la création de l'entreprise:", error)
        return { data: null, error, success: false }
      }

      return { data, error: null, success: true }
    } catch (error: any) {
      console.error("Erreur lors de la création de l'entreprise:", error)
      return { data: null, error, success: false }
    }
  }

  static async getEnterpriseById(enterpriseId: string) {
    try {
      const { data, error } = await supabase
        .from('enterprises')
        .select('*')
        .eq('id', enterpriseId)
        .single()

      return { data, error: null }
    } catch (error: any) {
      console.error("Erreur lors de la récupération de l'entreprise:", error)
      return { data: null, error }
    }
  }

  static async getUserEnterprises(userId?: string): Promise<{
    data: IEnterpriseModel[] | null
    error: Error | null
    success: boolean
  }> {
    try {
      // Vérifier d'abord si l'utilisateur existe dans la table users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)

      const { data: enterprises, error } = await supabase
        .from('enterprises')
        .select('*')
        .eq('created_by', userId)
        .is('deleted_at', null)

      if (error) {
        console.error('Erreur lors de la récupération des entreprises:', error)
        return { data: null, error: new Error(error.message), success: false }
      }

      return { data: enterprises, error: null, success: true }
    } catch (err) {
      console.error('Exception lors de la récupération des entreprises:', err)
      const error = err instanceof Error ? err : new Error(String(err))
      return { data: null, error, success: false }
    }
  }

  static async updateEnterprise(enterpriseId: string, enterpriseData: Partial<IEnterpriseModel>) {
    try {
      const { data, error } = await supabase
        .from('enterprises')
        .update(enterpriseData)
        .eq('id', enterpriseId)
        .select()
        .single()

      if (error) {
        return { data: null, error: new Error(error.message), success: false }
      }

      return { data, error: null, success: true }
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'entreprise:", err)
      const error = err instanceof Error ? err : new Error(String(err))
      return { data: null, error, success: false }
    }
  }

  static async deleteEnterprise(enterpriseId: string, userId: string) {
    try {
      // Effectuer une suppression en définissant deleted_at
      const { error } = await supabase
        .from('enterprises')
        .update({
          deleted_at: new Date().toISOString(),
        })
        .eq('id', enterpriseId)

      if (error) throw new Error(error.message)

      return { success: true, error: null }
    } catch (err) {
      console.error("Erreur lors de la suppression de l'entreprise:", err)
      const error = err instanceof Error ? err : new Error(String(err))
      return { success: false, error }
    }
  }

  // Cette méthode a été déplacée dans agencyService.ts
  /* static async updateAgency(agencyId: string, agencyData: Partial<any>) {
    try {
      const { data, error } = await supabase
        .from('public.agencies')
        .update(agencyData)
        .eq('id', agencyId)
        .select()
        .single()

      return { data, error: null }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'agence:", error)
      return { data: null, error: error instanceof Error ? error : new Error('Erreur inconnue') }
    }
  } */

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
