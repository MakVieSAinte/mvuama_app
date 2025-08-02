import axios from 'axios'
import { config } from './../config/config'

/**
 * Service for student management
 */

export class StudentService {
  constructor() {}

  /**
   * Function to get list of students
   * @param token string
   * @returns object | boolean
   */

  static async getStudents(token: string) {
    try {
      const response = await axios.get(`${config.BASE_URL}/api/student`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data) {
        return response.data
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }
}
