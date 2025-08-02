import { Validator } from './../../services/libs/validator'

export class StudentForm {
  firstname: string
  email: string
  // Errors
  errorFirstname: boolean
  errorEmail: boolean

  constructor() {
    this.firstname = ''
    this.email = ''
    // Errors
    this.errorFirstname = false
    this.errorEmail = false
  }

  /**
   * Verif Firstname
   * @param {*} firstname
   * @returns
   */
  setFirstname(firstname: string) {
    this.firstname = firstname

    let isValid = Validator.validName(this.firstname)

    if (this.firstname.trim() === '' || !isValid) {
      this.errorFirstname = true
    } else {
      this.errorFirstname = false
    }
    return this
  }

  /**
   * Verif Email
   * @param {*} email
   * @returns
   */
  setEmail(email: string) {
    this.email = email

    const isValidEmail = Validator.email(this.email)

    if (this.email.trim() === '' || !isValidEmail) {
      this.errorEmail = true
    } else {
      this.errorEmail = false
    }
    return this
  }

  builderStudentForm() {
    return {
      errorFirstname: this.errorFirstname,
      errorEmail: this.errorEmail,
    }
  }
}
