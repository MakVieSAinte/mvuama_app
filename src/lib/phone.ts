import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js'

export function formatPhoneNumber(phoneNumber: string, countryCode: string = 'FR') {
  const parsed = parsePhoneNumberFromString(phoneNumber, countryCode as any)

  if (!parsed) {
    return {
      valid: false,
      international: '',
      national: '',
    }
  }

  return {
    valid: parsed.isValid(),
    international: parsed.formatInternational(),
    national: parsed.formatNational(),
  }
}

/**
 * Formate le numéro en direct au fur et à mesure de la saisie
 */
export function formatAsYouType(phoneNumber: string, countryCode: string = 'FR') {
  const formatter = new AsYouType(countryCode as any)
  return formatter.input(phoneNumber)
}
