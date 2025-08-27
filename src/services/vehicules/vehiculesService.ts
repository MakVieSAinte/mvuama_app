import { supabase } from '../config/supabaseClient'

export default class VehicleService {
  agency_id?: string
  plate_number?: string
  brand?: string
  model?: string
  mileage?: number
  year?: number | null
  type?: string | null
  status?: string | null
  color?: string | null
  vin?: string | null
  service_assignment?: string | null
  driver_id?: string | null
  fuel_type?: string | null
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

  constructor(
    agency_id?: string,
    plate_number?: string,
    brand?: string,
    model?: string,
    mileage?: number,
    year?: number | null,
    type?: string | null,
    status?: string | null,
    color?: string | null,
    vin?: string | null,
    service_assignment?: string | null,
    driver_id?: string | null,
    fuel_type?: string | null,
    service_start_date?: string | null,
    passenger_capacity?: number | null,
    load_capacity?: number | null,
    condition?: string | null,
    description?: string | null,
    next_technical_control?: string | null,
    next_maintenance?: string | null,
    insurance_company?: string | null,
    insurance_policy_number?: string | null,
    insurance_expiry?: string | null,
    current_location?: string | null,
    usage_area?: string | null,
    daily_rate?: number | null,
    operating_days?: string | null,
    departure_time?: string | null,
    max_return_time?: string | null,
  ) {
    this.agency_id = agency_id
    this.plate_number = plate_number
    this.brand = brand
    this.model = model
    this.mileage = mileage
    this.year = year
    this.type = type
    this.status = status
    this.color = color
    this.vin = vin
    this.service_assignment = service_assignment
    this.driver_id = driver_id
    this.fuel_type = fuel_type
    this.service_start_date = service_start_date
    this.passenger_capacity = passenger_capacity
    this.load_capacity = load_capacity
    this.condition = condition
    this.description = description
    this.next_technical_control = next_technical_control
    this.next_maintenance = next_maintenance
    this.insurance_company = insurance_company
    this.insurance_policy_number = insurance_policy_number
    this.insurance_expiry = insurance_expiry
    this.current_location = current_location
    this.usage_area = usage_area
    this.daily_rate = daily_rate
    this.operating_days = operating_days
    this.departure_time = departure_time
    this.max_return_time = max_return_time
  }

  async save() {
    try {
      const { data, error } = await supabase.from('vehicles').insert([
        {
          agency_id: this.agency_id,
          plate_number: this.plate_number,
          brand: this.brand,
          model: this.model,
          mileage: this.mileage,
          year: this.year,
          type: this.type,
          status: this.status,
          color: this.color,
          vin: this.vin,
          service_assignment: this.service_assignment,
          driver_id: this.driver_id,
          fuel_type: this.fuel_type,
          service_start_date: this.service_start_date,
          passenger_capacity: this.passenger_capacity,
          load_capacity: this.load_capacity,
          condition: this.condition,
          description: this.description,
          next_technical_control: this.next_technical_control,
          next_maintenance: this.next_maintenance,
          insurance_company: this.insurance_company,
          insurance_policy_number: this.insurance_policy_number,
          insurance_expiry: this.insurance_expiry,
          current_location: this.current_location,
          usage_area: this.usage_area,
          daily_rate: this.daily_rate,
          operating_days: this.operating_days,
          departure_time: this.departure_time,
          max_return_time: this.max_return_time,
        },
      ])
      if (error) throw error
      return data
    } catch (error) {
      return 'Erreur'
    }
  }

  async getAll() {
    try {
      const { data, error } = await supabase.from('vehicles').select('*')
      if (error) throw error
      return data
    } catch (error) {
      return 'Erreur'
    }
  }
}
