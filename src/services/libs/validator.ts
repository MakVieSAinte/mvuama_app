export class Validator {
  /**
   * Validate Firstname
   * @param {string} name - Le nom à valider
   * @returns {boolean} - true si le nom est valide
   */
  static validName(name: string) {
    const regex = /^[A-zÀ-ú\s]+-*[A-zÀ-ú\s ]?[0-9]*$/
    return regex.test(name)
  }

  /**
   * Validate Email
   * @param {string} email - L'email à valider
   * @returns {boolean} - true si l'email est valide
   */
  static email(email: string) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return regex.test(email)
  }

  /**
   * Valide un numéro de plaque d'immatriculation
   * @param {string} plateNumber - Le numéro de plaque à valider
   * @returns {boolean} - true si le numéro de plaque est valide
   */
  static plateNumber(plateNumber: string) {
    // Format général pour les plaques d'immatriculation (adapté aux formats courants)
    // Cette regex peut être adaptée selon les formats spécifiques de votre région
    const regex = /^[A-Z0-9]{2,10}([-\s]?[A-Z0-9]{1,5}){0,3}$/i
    return regex.test(plateNumber)
  }

  /**
   * Valide le nom d'une marque de véhicule
   * @param {string} brand - La marque à valider
   * @returns {boolean} - true si la marque est valide
   */
  static brand(brand: string) {
    const regex = /^[A-zÀ-ú\s\-&\.]{2,50}$/
    return regex.test(brand)
  }

  /**
   * Valide le modèle d'un véhicule
   * @param {string} model - Le modèle à valider
   * @returns {boolean} - true si le modèle est valide
   */
  static vehicleModel(model: string) {
    const regex = /^[A-zÀ-ú0-9\s\-\.]{2,50}$/
    return regex.test(model)
  }

  /**
   * Valide un numéro VIN (Vehicle Identification Number)
   * @param {string} vin - Le VIN à valider
   * @returns {boolean} - true si le VIN est valide
   */
  static vin(vin: string) {
    // Format standard VIN: 17 caractères alphanumériques (sauf I, O, Q)
    const regex = /^[A-HJ-NPR-Z0-9]{17}$/i
    return regex.test(vin)
  }

  /**
   * Valide un kilométrage
   * @param {number} mileage - Le kilométrage à valider
   * @returns {boolean} - true si le kilométrage est valide
   */
  static mileage(mileage: number) {
    return Number.isFinite(mileage) && mileage >= 0 && mileage <= 2000000
  }

  /**
   * Valide une année de fabrication
   * @param {number} year - L'année à valider
   * @returns {boolean} - true si l'année est valide
   */
  static year(year: number) {
    const currentYear = new Date().getFullYear()
    return Number.isInteger(year) && year >= 1900 && year <= currentYear + 1
  }

  /**
   * Valide un numéro de police d'assurance
   * @param {string} policyNumber - Le numéro de police à valider
   * @returns {boolean} - true si le numéro de police est valide
   */
  static insurancePolicyNumber(policyNumber: string) {
    // Généralement alphanumérique de longueur variable
    const regex = /^[A-Z0-9\-\/]{5,30}$/i
    return regex.test(policyNumber)
  }
}
