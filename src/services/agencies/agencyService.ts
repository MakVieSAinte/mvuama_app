import { supabase } from '../config/supabaseClient'
import type { IAgencyModel } from '../../interfaces/agencyInterface'

export class AgencyService {
  /**
   * Crée une nouvelle agence dans Supabase
   * @param {Omit<IAgencyModel, "id" | "created_at" | "updated_at" | "deleted_at">} agencyData - Les données de l'agence à créer
   * @returns {Promise<{data: any, error: any}>} - Les données créées ou une erreur
   */
  static async createAgency(
    agencyData: Omit<IAgencyModel, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>,
  ) {
    try {
      // Adaptation du format des données pour correspondre à la structure de la table
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

      // Si l'insertion réussit, ajouter automatiquement le créateur comme membre administrateur
      if (data) {
        await this.addAgencyMembership(data.id, agencyData.created_by, 'admin')
      }

      return { data, error: null, success: true }
    } catch (error: any) {
      console.error("Erreur lors de la création de l'agence:", error)
      return { data: null, error, success: false }
    }
  }

  /**
   * Ajoute une relation de membre entre un utilisateur et une agence
   * @param {string} agencyId - L'ID de l'agence
   * @param {string} userId - L'ID de l'utilisateur
   * @param {string} role - Le rôle de l'utilisateur (admin, chauffeur, controleur, gestionnaire)
   * @returns {Promise<{data: any, error: any}>} - Les données créées ou une erreur
   */
  static async addAgencyMembership(agencyId: string, userId: string, role: string = 'admin') {
    try {
      // Vérifier si l'utilisateur existe déjà dans la table users
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single()

      // Si l'utilisateur n'existe pas encore dans la table users, récupérer ses infos et l'ajouter
      if (userError || !existingUser) {
        const { data: authUser } = await supabase.auth.getUser(userId)

        if (authUser && authUser.user) {
          // Créer l'entrée utilisateur
          await supabase.from('users').insert([
            {
              id: userId,
              first_name: authUser.user.user_metadata?.first_name || '',
              last_name: authUser.user.user_metadata?.last_name || '',
              display_name:
                `${authUser.user.user_metadata?.first_name || ''} ${authUser.user.user_metadata?.last_name || ''}`.trim() ||
                authUser.user.email,
              avatar_url: authUser.user.user_metadata?.avatar_url || null,
            },
          ])
        }
      }

      // Ajouter l'adhésion
      const { data, error } = await supabase
        .from('memberships')
        .insert([
          {
            agency_id: agencyId,
            user_id: userId,
            role: role,
            created_by: userId,
          },
        ])
        .select()

      return { data, error: null }
    } catch (error: any) {
      console.error("Erreur lors de l'ajout du membre à l'agence:", error)
      return { data: null, error }
    }
  }

  /**
   * Récupère une agence par son ID
   * @param {string} agencyId - L'ID de l'agence
   * @returns {Promise<{data: IAgencyModel | null, error: any}>} - Les données de l'agence ou une erreur
   */
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

  /**
   * Récupère toutes les agences associées à un utilisateur
   * @param {string} [userId] - L'ID de l'utilisateur (optionnel, utilise l'utilisateur courant si non fourni)
   * @returns {Promise<{data: IAgencyModel[] | null, error: any, success: boolean}>} - Les agences de l'utilisateur ou une erreur
   */
  static async getUserAgencies(userId?: string) {
    try {
      // Si aucun userId n'est fourni, utiliser l'utilisateur actuellement connecté
      if (!userId) {
        const { data: authData } = await supabase.auth.getUser()
        if (!authData || !authData.user) {
          return { data: null, error: new Error('Utilisateur non authentifié'), success: false }
        }
        userId = authData.user.id
      }

      console.log('Recherche des agences pour userId:', userId)

      // Vérifier d'abord si l'utilisateur existe dans la table users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)

      console.log("Vérification de l'utilisateur dans la table users:", { userData, userError })

      // Si l'utilisateur n'existe pas, tenter de l'ajouter
      if (userError || !userData || userData.length === 0) {
        console.log("Utilisateur non trouvé dans la table users, tentative d'ajout")
        const { data: authUser } = await supabase.auth.getUser(userId)

        if (authUser && authUser.user) {
          // Créer l'entrée utilisateur
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([
              {
                id: userId,
                first_name: authUser.user.user_metadata?.first_name || '',
                last_name: authUser.user.user_metadata?.last_name || '',
                display_name:
                  `${authUser.user.user_metadata?.first_name || ''} ${authUser.user.user_metadata?.last_name || ''}`.trim() ||
                  authUser.user.email,
                avatar_url: authUser.user.user_metadata?.avatar_url || null,
              },
            ])
            .select()

          console.log("Résultat de l'ajout de l'utilisateur:", { newUser, insertError })
        }
      }

      // Essayer avec une requête plus simple d'abord
      console.log('Tentative de récupération des agences avec requête simple')
      const { data, error } = await supabase
        .from('memberships')
        .select(
          `
          agency:agency_id (
            id,
            name,
            code,
            type,
            description,
            logo_url
          )
        `,
        )
        .eq('user_id', userId)
        .is('deleted_at', null)

      console.log('Résultat de la requête simple:', { data, error })

      if (error) {
        console.error('Erreur lors de la récupération des agences:', error)
        return { data: null, error, success: false }
      }

      // Transformer les données pour correspondre au format attendu
      const formattedData = data ? data.map((item) => item.agency) : []
      console.log('Données formatées:', formattedData)

      return { data: formattedData, error: null, success: true }
    } catch (error) {
      console.error('Exception lors de la récupération des agences:', error)
      return { data: null, error, success: false }
    }
  }

  /**
   * Met à jour une agence existante
   * @param {string} agencyId - L'ID de l'agence à mettre à jour
   * @param {Partial<IAgencyModel>} agencyData - Les données à mettre à jour
   * @returns {Promise<{data: any, error: any}>} - Les données mises à jour ou une erreur
   */
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

  /**
   * Supprime une agence (soft delete)
   * @param {string} agencyId - L'ID de l'agence à supprimer
   * @param {string} userId - L'ID de l'utilisateur qui effectue la suppression
   * @returns {Promise<{success: boolean, error: any}>} - Succès ou erreur
   */
  static async deleteAgency(agencyId: string, userId: string) {
    try {
      // Effectuer une suppression logique en définissant deleted_at
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

  /**
   * Vérifie si un utilisateur est membre d'une agence avec un rôle spécifique
   * @param {string} agencyId - L'ID de l'agence
   * @param {string} userId - L'ID de l'utilisateur
   * @param {string[]} roles - Les rôles à vérifier
   * @returns {Promise<{hasRole: boolean, error: any}>} - True si l'utilisateur a l'un des rôles, sinon False
   */
  static async checkUserAgencyRole(agencyId: string, userId: string, roles: string[] = ['admin']) {
    try {
      const { data, error } = await supabase
        .from('agency_memberships')
        .select('role')
        .eq('agency_id', agencyId)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()

      if (error) throw error

      const hasRole = data && roles.includes(data.role)
      return { hasRole, error: null }
    } catch (error: any) {
      console.error("Erreur lors de la vérification du rôle de l'utilisateur:", error)
      return { hasRole: false, error }
    }
  }

  /**
   * Ajoute un membre à une agence ou met à jour son rôle
   * @param {string} agencyId - L'ID de l'agence
   * @param {string} userEmail - L'email de l'utilisateur à inviter
   * @param {string} role - Le rôle à attribuer
   * @param {string} invitedBy - L'ID de l'utilisateur qui fait l'invitation
   * @returns {Promise<{data: any, error: any}>} - Résultat de l'opération
   */
  static async inviteAgencyMember(
    agencyId: string,
    userEmail: string,
    role: string,
    invitedBy: string,
  ) {
    try {
      // 1. Chercher l'utilisateur par email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', userEmail)
        .single()

      if (userError) {
        return { data: null, error: { message: 'Utilisateur non trouvé' } }
      }

      // 2. Vérifier si l'utilisateur est déjà membre de l'agence
      const { data: existingMember } = await supabase
        .from('agency_memberships')
        .select('*')
        .eq('agency_id', agencyId)
        .eq('user_id', userData.id)
        .single()

      // 3. Ajouter ou mettre à jour le membre
      if (existingMember) {
        // Mettre à jour le rôle et le statut si nécessaire
        const { data, error } = await supabase
          .from('agency_memberships')
          .update({
            role: role,
            status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('agency_id', agencyId)
          .eq('user_id', userData.id)
          .select()

        return { data, error }
      } else {
        // Créer une nouvelle entrée dans agency_memberships
        const { data, error } = await supabase
          .from('agency_memberships')
          .insert([
            {
              agency_id: agencyId,
              user_id: userData.id,
              role: role,
              status: 'invited',
              invited_by: invitedBy,
            },
          ])
          .select()

        return { data, error }
      }
    } catch (error: any) {
      console.error("Erreur lors de l'invitation du membre:", error)
      return { data: null, error }
    }
  }
}
