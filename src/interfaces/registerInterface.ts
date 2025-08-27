// Model Interface Register

export interface IRegisterModel {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number?: string | null
  country: string
  currency: string
  role?: string
  created_at: string
  updated_at: string
  deleted_at?: string | null
  deleted_by?: string | null
}

// Builder Interface Register

export interface IRegisterBuilder {
  errorFirstName: boolean
  errorFirstNameMessage: string
  errorLastName: boolean
  errorLastNameMessage: string
  errorEmail: boolean
  errorEmailMessage: string
  errorPhoneNumber: boolean
  errorPhoneNumberMessage: string
  errorCountry: boolean
  errorCountryMessage: string
  errorCurrency: boolean
  errorCurrencyMessage: string
  errorPassword: boolean
  errorPasswordMessage: string
  errorConfirmPassword: boolean
  errorConfirmPasswordMessage: string
}
