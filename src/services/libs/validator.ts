export class Validator {
  /**
   * Validate Firstname
   * @param {*} firstname
   * @returns
   */
  static validName(name: string) {
    const regex = /^[A-zÀ-ú\s]+-*[A-zÀ-ú\s ]?[0-9]*$/

    if (regex.test(name)) {
      return true
    } else {
      return false
    }
  }

  /**
   * Validate Email
   * @param {*} email
   * @returns
   */
  static email(email: string) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (regex.test(email)) {
      return true
    } else {
      return false
    }
  }
}
