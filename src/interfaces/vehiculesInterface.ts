// Model Interface Vehicle

export interface IVehicleModel {
  id: string
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
  mileage: number
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
  created_at: string
  updated_at: string
  created_by?: string | null
  deleted_at?: string | null
}

// Builder Interface Vehicle

export interface IVehicleBuilder {
  errorPlateNumber: boolean
  errorBrand: boolean
  errorModel: boolean
  errorMileage: boolean
}

// Student Model Interface (conservé pour compatibilité)

export interface IStudentModel {
  firstname: string
  email: string
}

// Builder Interface Student (conservé pour compatibilité)

export interface IStudentBuilder {
  errorFirstname: boolean
  errorEmail: boolean
}
