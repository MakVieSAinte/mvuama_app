export class Validator {
  /**
   * Validate Name
   * @param {string} name
   * @returns {boolean}
   */
  static validName(name: string) {
    const regex = /^[A-zÀ-ú\s]+-*[A-zÀ-ú\s ]?[0-9]*$/
    return regex.test(name)
  }

  /**
   * Validate Email
   * @param {string} email
   * @returns {boolean}
   */
  static email(email: string) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return regex.test(email)
  }

  /**
   * Valide la complexité d'un mot de passe
   * @param {string} password
   * @returns {boolean}
   */
  static password(password: string): boolean {
    // Au moins 8 caractères, une majuscule, une minuscule, un chiffre
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
  }

  /**
   * Valide un numéro de plaque d'immatriculation
   * @param {string} plateNumber
   * @returns {boolean}
   */
  static plateNumber(plateNumber: string) {
    const regex = /^[A-Z0-9]{2,10}([-\s]?[A-Z0-9]{1,5}){0,3}$/i
    return regex.test(plateNumber)
  }

  /**
   * Valide le nom d'une marque de véhicule
   * @param {string} brand
   * @returns {boolean}
   */
  static brand(brand: string) {
    const regex = /^[A-zÀ-ú\s\-&\.]{2,50}$/
    return regex.test(brand)
  }

  /**
   * Valide le modèle d'un véhicule
   * @param {string} model
   * @returns {boolean}
   */
  static vehicleModel(model: string) {
    const regex = /^[A-zÀ-ú0-9\s\-\.]{2,50}$/
    return regex.test(model)
  }

  /**
   * Valide un numéro VIN (Vehicle Identification Number)
   * @param {string} vin
   * @returns {boolean}
   */
  static vin(vin: string) {
    // Format standard VIN: 17 caractères alphanumériques (sauf I, O, Q)
    const regex = /^[A-HJ-NPR-Z0-9]{17}$/i
    return regex.test(vin)
  }

  /**
   * Valide un kilométrage
   * @param {number} mileage
   * @returns {boolean}
   */
  static mileage(mileage: number) {
    return Number.isFinite(mileage) && mileage >= 0 && mileage <= 2000000
  }

  /**
   * Valide une année de fabrication
   * @param {number} year
   * @returns {boolean}
   */
  static year(year: number) {
    const currentYear = new Date().getFullYear()
    return Number.isInteger(year) && year >= 1900 && year <= currentYear + 1
  }

  /**
   * Valide un numéro de police d'assurance
   * @param {string} policyNumber
   * @returns {boolean}
   */
  static insurancePolicyNumber(policyNumber: string) {
    const regex = /^[A-Z0-9\-\/]{5,30}$/i
    return regex.test(policyNumber)
  }
}
