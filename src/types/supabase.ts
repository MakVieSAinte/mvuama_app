/**
 * Ce fichier définit les types TypeScript pour la base de données Supabase
 * Vous pouvez le générer automatiquement via la commande:
 * npx supabase gen types typescript --project-id votre-id-projet > src/types/supabase.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      agencies: {
        Row: {
          id: string
          name: string
          description: string | null
          address: string | null
          logo_url: string | null
          contact_email: string | null
          contact_phone: string | null
          website: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          deleted_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          address?: string | null
          logo_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          deleted_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          address?: string | null
          logo_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          deleted_at?: string | null
        }
      }
      vehicles: {
        Row: {
          id: string
          agency_id: string
          plate_number: string
          brand: string
          model: string
          year: number | null
          type: string | null
          status: string | null
          color: string | null
          vin: string | null
          service_assignment: string | null
          driver_id: string | null
          fuel_type: string | null
          mileage: number
          service_start_date: string | null
          passenger_capacity: number | null
          load_capacity: number | null
          condition: string | null
          description: string | null
          next_technical_control: string | null
          next_maintenance: string | null
          insurance_company: string | null
          insurance_policy_number: string | null
          insurance_expiry: string | null
          current_location: string | null
          usage_area: string | null
          daily_rate: number | null
          operating_days: string | null
          departure_time: string | null
          max_return_time: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          deleted_at: string | null
        }
        Insert: {
          id?: string
          agency_id: string
          plate_number: string
          brand: string
          model: string
          year?: number | null
          type?: string | null
          status?: string | null
          color?: string | null
          vin?: string | null
          service_assignment?: string | null
          driver_id?: string | null
          fuel_type?: string | null
          mileage?: number
          service_start_date?: string | null
          passenger_capacity?: number | null
          load_capacity?: number | null
          condition?: string | null
          description?: string | null
          next_technical_control?: string | null
          next_maintenance?: string | null
          insurance_company?: string | null
          insurance_policy_number?: string | null
          insurance_expiry?: string | null
          current_location?: string | null
          usage_area?: string | null
          daily_rate?: number | null
          operating_days?: string | null
          departure_time?: string | null
          max_return_time?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          deleted_at?: string | null
        }
        Update: {
          id?: string
          agency_id?: string
          plate_number?: string
          brand?: string
          model?: string
          year?: number | null
          type?: string | null
          status?: string | null
          color?: string | null
          vin?: string | null
          service_assignment?: string | null
          driver_id?: string | null
          fuel_type?: string | null
          mileage?: number
          service_start_date?: string | null
          passenger_capacity?: number | null
          load_capacity?: number | null
          condition?: string | null
          description?: string | null
          next_technical_control?: string | null
          next_maintenance?: string | null
          insurance_company?: string | null
          insurance_policy_number?: string | null
          insurance_expiry?: string | null
          current_location?: string | null
          usage_area?: string | null
          daily_rate?: number | null
          operating_days?: string | null
          departure_time?: string | null
          max_return_time?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          deleted_at?: string | null
        }
      }
    }
    Views: {
      active_vehicles: {
        Row: {
          id: string
          agency_id: string
          plate_number: string
          brand: string
          model: string
          year: number | null
          type: string | null
          status: string | null
          color: string | null
          vin: string | null
          service_assignment: string | null
          driver_id: string | null
          fuel_type: string | null
          mileage: number
          service_start_date: string | null
          passenger_capacity: number | null
          load_capacity: number | null
          condition: string | null
          description: string | null
          next_technical_control: string | null
          next_maintenance: string | null
          insurance_company: string | null
          insurance_policy_number: string | null
          insurance_expiry: string | null
          current_location: string | null
          usage_area: string | null
          daily_rate: number | null
          operating_days: string | null
          departure_time: string | null
          max_return_time: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          deleted_at: null // Toujours null pour les véhicules actifs
        }
      }
    }
    Functions: {
      is_member_of_agency: {
        Args: {
          agency_id: string
        }
        Returns: boolean
      }
      user_has_role: {
        Args: {
          role: string
          agency_id: string
        }
        Returns: boolean
      }
      has_management_role: {
        Args: {
          agency_id: string
        }
        Returns: boolean
      }
      is_member_role: {
        Args: {
          agency_id: string
        }
        Returns: boolean
      }
    }
  }
}
