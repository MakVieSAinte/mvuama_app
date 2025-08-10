import { supabase } from '../config/supabaseClient'

/**
 * Service de gestion des appartenances (memberships) aux agences
 */
export class MembershipService {
  /**
   * Vérifie si l'utilisateur a un rôle spécifique dans une agence
   * @param agencyId ID de l'agence
   * @param role Rôle à vérifier (ou tableau de rôles)
   * @returns true si l'utilisateur a le rôle, false sinon
   */
  static async hasRole(agencyId: string, role: string | string[]): Promise<boolean> {
    try {
      // Récupérer la session courante
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) return false

      const userId = sessionData.session.user.id

      // Construire la requête
      let query = supabase
        .from('memberships')
        .select('*')
        .eq('agency_id', agencyId)
        .eq('user_id', userId)
        .is('deleted_at', null)

      // Si on cherche plusieurs rôles
      if (Array.isArray(role)) {
        query = query.in('role', role)
      } else {
        query = query.eq('role', role)
      }

      // Exécuter la requête
      const { data, error } = await query

      if (error) {
        console.error('Erreur lors de la vérification du rôle:', error.message)
        return false
      }

      // Si on a un résultat, l'utilisateur a le rôle
      return data && data.length > 0
    } catch (error) {
      console.error('Exception lors de la vérification du rôle:', error)
      return false
    }
  }

  /**
   * Vérifie si l'utilisateur a un rôle de gestion (admin ou gestionnaire) dans une agence
   * @param agencyId ID de l'agence
   * @returns true si l'utilisateur est admin ou gestionnaire, false sinon
   */
  static async hasManagementRole(agencyId: string): Promise<boolean> {
    return this.hasRole(agencyId, ['admin', 'gestionnaire'])
  }

  /**
   * Récupère tous les rôles de l'utilisateur dans une agence
   * @param agencyId ID de l'agence
   * @returns Le membership complet ou null
   */
  static async getUserMembership(agencyId: string) {
    try {
      // Récupérer la session courante
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) return null

      const userId = sessionData.session.user.id

      // Récupérer le membership
      const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .eq('agency_id', agencyId)
        .eq('user_id', userId)
        .is('deleted_at', null)
        .single()

      if (error) {
        console.error('Erreur lors de la récupération du membership:', error.message)
        return null
      }

      return data
    } catch (error) {
      console.error('Exception lors de la récupération du membership:', error)
      return null
    }
  }
}
