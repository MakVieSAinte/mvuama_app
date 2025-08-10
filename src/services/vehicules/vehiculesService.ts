import { supabase } from '../config/supabaseClient'
import type { IVehicleModel } from '../../interfaces/vehiculesInterface'

/**
 * Service pour la gestion des véhicules via Supabase
 */
export class VehicleService {
  /**
   * Récupère tous les véhicules actifs (non supprimés) depuis la vue active_vehicles
   * @returns Un tableau de véhicules actifs ou false en cas d'erreur
   */
  static async getActiveVehicles(): Promise<IVehicleModel[] | false> {
    try {
      // Requête vers la vue active_vehicles de Supabase
      const { data, error } = await supabase.from('active_vehicles').select('*')

      // Gestion des erreurs
      if (error) {
        console.error('Erreur lors de la récupération des véhicules:', error.message)
        return false
      }

      // Vérification que des données ont été trouvées
      if (data && data.length > 0) {
        return data as IVehicleModel[]
      } else {
        // Aucun véhicule trouvé, mais pas d'erreur
        return []
      }
    } catch (error) {
      console.error('Exception lors de la récupération des véhicules:', error)
      return false
    }
  }

  /**
   * Récupère un véhicule actif par son ID
   * @param id L'identifiant UUID du véhicule
   * @returns L'objet véhicule ou false en cas d'erreur ou non trouvé
   */
  static async getVehicleById(id: string): Promise<IVehicleModel | false> {
    try {
      const { data, error } = await supabase
        .from('active_vehicles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Erreur lors de la récupération du véhicule:', error.message)
        return false
      }

      if (data) {
        return data as IVehicleModel
      } else {
        return false
      }
    } catch (error) {
      console.error('Exception lors de la récupération du véhicule:', error)
      return false
    }
  }

  /**
   * Récupère les véhicules par agence
   * @param agencyId L'identifiant UUID de l'agence
   * @returns Un tableau de véhicules ou false en cas d'erreur
   */
  static async getVehiclesByAgency(agencyId: string): Promise<IVehicleModel[] | false> {
    try {
      const { data, error } = await supabase
        .from('active_vehicles')
        .select('*')
        .eq('agency_id', agencyId)

      if (error) {
        console.error('Erreur lors de la récupération des véhicules par agence:', error.message)
        return false
      }

      if (data) {
        return data as IVehicleModel[]
      } else {
        return []
      }
    } catch (error) {
      console.error('Exception lors de la récupération des véhicules par agence:', error)
      return false
    }
  }

  /**
   * Crée un nouveau véhicule
   * @param vehicle Les données du véhicule à créer
   * @returns Le véhicule créé ou false en cas d'erreur
   */
  static async createVehicle(
    vehicle: Omit<IVehicleModel, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<IVehicleModel | false> {
    try {
      const { data, error } = await supabase.from('vehicles').insert([vehicle]).select().single()

      if (error) {
        console.error('Erreur lors de la création du véhicule:', error.message)
        return false
      }

      if (data) {
        return data as IVehicleModel
      } else {
        return false
      }
    } catch (error) {
      console.error('Exception lors de la création du véhicule:', error)
      return false
    }
  }

  /**
   * Met à jour un véhicule existant
   * @param id L'identifiant UUID du véhicule à mettre à jour
   * @param vehicleData Les données à mettre à jour
   * @returns Le véhicule mis à jour ou false en cas d'erreur
   */
  static async updateVehicle(
    id: string,
    vehicleData: Partial<IVehicleModel>,
  ): Promise<IVehicleModel | false> {
    try {
      // Ajout de la date de mise à jour
      const updateData = {
        ...vehicleData,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('vehicles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erreur lors de la mise à jour du véhicule:', error.message)
        return false
      }

      if (data) {
        return data as IVehicleModel
      } else {
        return false
      }
    } catch (error) {
      console.error('Exception lors de la mise à jour du véhicule:', error)
      return false
    }
  }

  /**
   * Suppression logique d'un véhicule (soft delete)
   * @param id L'identifiant UUID du véhicule à supprimer
   * @returns true si la suppression a réussi, false sinon
   */
  static async deleteVehicle(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) {
        console.error('Erreur lors de la suppression du véhicule:', error.message)
        return false
      }

      return true
    } catch (error) {
      console.error('Exception lors de la suppression du véhicule:', error)
      return false
    }
  }
}
