import { Validator } from './../../services/libs/validator'
import type { IVehicleModel, IVehicleBuilder } from '../../interfaces/vehiculesInterface'

export class VehiculeForm {
  // Propriétés obligatoires et erreurs associées
  agency_id: string
  errorAgencyId: boolean
  plate_number: string
  errorPlateNumber: boolean
  brand: string
  errorBrand: boolean
  model: string
  errorModel: boolean
  year?: number | null
  errorYear: boolean
  type?: string | null
  errorType: boolean
  color?: string | null
  errorColor: boolean
  fuel_type?: string | null
  errorFuelType: boolean
  mileage: number
  errorMileage: boolean

  // Propriétés optionnelles
  status?: string | null
  vin?: string | null
  errorVin: boolean
  service_assignment?: string | null
  driver_id?: string | null
  service_start_date?: string | null
  passenger_capacity?: number | null
  load_capacity?: number | null
  condition?: string | null
  description?: string | null
  next_technical_control?: string | null
  next_maintenance?: string | null
  insurance_company?: string | null
  insurance_policy_number?: string | null
  errorInsurancePolicyNumber: boolean
  insurance_expiry?: string | null
  current_location?: string | null
  usage_area?: string | null
  daily_rate?: number | null
  operating_days?: string | null
  departure_time?: string | null
  max_return_time?: string | null

  constructor() {
    // Initialisation des propriétés obligatoires
    this.agency_id = ''
    this.errorAgencyId = false
    this.plate_number = ''
    this.errorPlateNumber = false
    this.brand = ''
    this.errorBrand = false
    this.model = ''
    this.errorModel = false
    this.year = null
    this.errorYear = false
    this.type = null
    this.errorType = false
    this.color = null
    this.errorColor = false
    this.fuel_type = null
    this.errorFuelType = false
    this.mileage = 0
    this.errorMileage = false

    // Initialisation des propriétés optionnelles
    this.vin = null
    this.errorVin = false
    this.service_assignment = null
    this.service_assignment = null
    this.driver_id = null
    this.service_start_date = null
    this.passenger_capacity = null
    this.load_capacity = null
    this.condition = null
    this.description = null
    this.next_technical_control = null
    this.next_maintenance = null
    this.insurance_company = null
    this.insurance_policy_number = null
    this.errorInsurancePolicyNumber = false
    this.insurance_expiry = null
    this.current_location = null
    this.usage_area = null
    this.daily_rate = null
    this.operating_days = null
    this.departure_time = null
    this.max_return_time = null
  }

  /**
   * Définit et valide l'ID de l'agence
   * @param {string} agency_id - L'ID de l'agence
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setAgencyId(agency_id: string) {
    this.agency_id = agency_id
    this.errorAgencyId = this.agency_id.trim() === ''
    return this
  }

  /**
   * Définit et valide le numéro de plaque d'immatriculation
   * @param {string} plate_number - Le numéro de plaque d'immatriculation
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setPlateNumber(plate_number: string) {
    this.plate_number = plate_number
    const isValid = Validator.plateNumber(this.plate_number)
    this.errorPlateNumber = this.plate_number.trim() === '' || !isValid
    return this
  }

  /**
   * Définit et valide la marque du véhicule
   * @param {string} brand - La marque du véhicule
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setBrand(brand: string) {
    this.brand = brand
    const isValid = Validator.brand(this.brand)
    this.errorBrand = this.brand.trim() === '' || !isValid
    return this
  }

  /**
   * Définit et valide le modèle du véhicule
   * @param {string} model - Le modèle du véhicule
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setModel(model: string) {
    this.model = model
    const isValid = Validator.vehicleModel(this.model)
    this.errorModel = this.model.trim() === '' || !isValid
    return this
  }

  /**
   * Définit et valide le kilométrage du véhicule
   * @param {number} mileage - Le kilométrage du véhicule
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setMileage(mileage: number) {
    this.mileage = mileage
    const isValid = Validator.mileage(this.mileage)
    this.errorMileage = !isValid
    return this
  }

  /**
   * Définit et valide l'année du véhicule
   * @param {number | null} year - L'année du véhicule
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setYear(year: number | null) {
    this.year = year
    if (year !== null) {
      const isValid = Validator.year(year)
      this.errorYear = !isValid
    } else {
      this.errorYear = false
    }
    return this
  }

  /**
   * Définit le type de véhicule
   * @param {string | null} type - Le type de véhicule
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setType(type: string | null) {
    this.type = type
    this.errorType = !type || type.trim() === ''
    return this
  }

  /**
   * Définit le statut du véhicule
   * @param {string | null} status - Le statut du véhicule
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setStatus(status: string | null) {
    this.status = status
    return this
  }

  /**
   * Définit la couleur du véhicule
   * @param {string | null} color - La couleur du véhicule
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setColor(color: string | null) {
    this.color = color
    this.errorColor = !color || color.trim() === ''
    return this
  }

  /**
   * Définit et valide le numéro VIN du véhicule
   * @param {string | null} vin - Le numéro VIN du véhicule
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setVin(vin: string | null) {
    this.vin = vin
    if (vin !== null && vin.trim() !== '') {
      const isValid = Validator.vin(vin)
      this.errorVin = !isValid
    } else {
      this.errorVin = false
    }
    return this
  }

  /**
   * Définit l'affectation de service du véhicule
   * @param {string | null} service_assignment - L'affectation de service
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setServiceAssignment(service_assignment: string | null) {
    this.service_assignment = service_assignment
    return this
  }

  /**
   * Définit l'ID du conducteur du véhicule
   * @param {string | null} driver_id - L'ID du conducteur
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setDriverId(driver_id: string | null) {
    this.driver_id = driver_id
    return this
  }

  /**
   * Définit le type de carburant du véhicule
   * @param {string | null} fuel_type - Le type de carburant
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setFuelType(fuel_type: string | null) {
    this.fuel_type = fuel_type
    this.errorFuelType = !fuel_type || fuel_type.trim() === ''
    return this
  }

  /**
   * Définit la date de début de service du véhicule
   * @param {string | null} service_start_date - La date de début de service
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setServiceStartDate(service_start_date: string | null) {
    this.service_start_date = service_start_date
    return this
  }

  /**
   * Définit la capacité de passagers du véhicule
   * @param {number | null} passenger_capacity - La capacité de passagers
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setPassengerCapacity(passenger_capacity: number | null) {
    this.passenger_capacity = passenger_capacity
    return this
  }

  /**
   * Définit la capacité de charge du véhicule
   * @param {number | null} load_capacity - La capacité de charge
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setLoadCapacity(load_capacity: number | null) {
    this.load_capacity = load_capacity
    return this
  }

  /**
   * Définit l'état du véhicule
   * @param {string | null} condition - L'état du véhicule
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setCondition(condition: string | null) {
    this.condition = condition
    return this
  }

  /**
   * Définit la description du véhicule
   * @param {string | null} description - La description du véhicule
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setDescription(description: string | null) {
    this.description = description
    return this
  }

  /**
   * Définit la date du prochain contrôle technique
   * @param {string | null} next_technical_control - La date du prochain contrôle technique
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setNextTechnicalControl(next_technical_control: string | null) {
    this.next_technical_control = next_technical_control
    return this
  }

  /**
   * Définit la date de la prochaine maintenance
   * @param {string | null} next_maintenance - La date de la prochaine maintenance
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setNextMaintenance(next_maintenance: string | null) {
    this.next_maintenance = next_maintenance
    return this
  }

  /**
   * Définit la compagnie d'assurance du véhicule
   * @param {string | null} insurance_company - La compagnie d'assurance
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setInsuranceCompany(insurance_company: string | null) {
    this.insurance_company = insurance_company
    return this
  }

  /**
   * Définit et valide le numéro de police d'assurance
   * @param {string | null} insurance_policy_number - Le numéro de police d'assurance
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setInsurancePolicyNumber(insurance_policy_number: string | null) {
    this.insurance_policy_number = insurance_policy_number
    if (insurance_policy_number !== null && insurance_policy_number.trim() !== '') {
      const isValid = Validator.insurancePolicyNumber(insurance_policy_number)
      this.errorInsurancePolicyNumber = !isValid
    } else {
      this.errorInsurancePolicyNumber = false
    }
    return this
  }

  /**
   * Définit la date d'expiration de l'assurance
   * @param {string | null} insurance_expiry - La date d'expiration de l'assurance
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setInsuranceExpiry(insurance_expiry: string | null) {
    this.insurance_expiry = insurance_expiry
    return this
  }

  /**
   * Définit la localisation actuelle du véhicule
   * @param {string | null} current_location - La localisation actuelle
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setCurrentLocation(current_location: string | null) {
    this.current_location = current_location
    return this
  }

  /**
   * Définit la zone d'utilisation du véhicule
   * @param {string | null} usage_area - La zone d'utilisation
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setUsageArea(usage_area: string | null) {
    this.usage_area = usage_area
    return this
  }

  /**
   * Définit le tarif journalier du véhicule
   * @param {number | null} daily_rate - Le tarif journalier
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setDailyRate(daily_rate: number | null) {
    this.daily_rate = daily_rate
    return this
  }

  /**
   * Définit les jours d'exploitation du véhicule
   * @param {string | null} operating_days - Les jours d'exploitation
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setOperatingDays(operating_days: string | null) {
    this.operating_days = operating_days
    return this
  }

  /**
   * Définit l'heure de départ du véhicule
   * @param {string | null} departure_time - L'heure de départ
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setDepartureTime(departure_time: string | null) {
    this.departure_time = departure_time
    return this
  }

  /**
   * Définit l'heure maximale de retour du véhicule
   * @param {string | null} max_return_time - L'heure maximale de retour
   * @returns {VehiculeForm} - L'instance courante pour le chaînage
   */
  setMaxReturnTime(max_return_time: string | null) {
    this.max_return_time = max_return_time
    return this
  }

  /**
   * Construit l'objet de validation du formulaire
   * @returns {IVehicleBuilder} - L'objet contenant les états d'erreur
   */
  builderVehiculeForm(): IVehicleBuilder {
    return {
      errorAgencyId: this.errorAgencyId,
      errorPlateNumber: this.errorPlateNumber,
      errorBrand: this.errorBrand,
      errorModel: this.errorModel,
      errorYear: this.errorYear,
      errorType: this.errorType,
      errorColor: this.errorColor,
      errorFuelType: this.errorFuelType,
      errorMileage: this.errorMileage,
    }
  }

  /**
   * Retourne un objet prêt pour la création/mise à jour d'un véhicule
   * @returns {Omit<IVehicleModel, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'deleted_at'>}
   */
  getVehiculeData(): Omit<
    IVehicleModel,
    'id' | 'created_at' | 'updated_at' | 'created_by' | 'deleted_at'
  > {
    return {
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
    }
  }
}
