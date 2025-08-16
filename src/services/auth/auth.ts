import { supabase } from '../config/supabaseClient'

export class AuthService {
  static async signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      return { data, error }
    } catch (error: any) {
      return { data: null, error }
    }
  }
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return false
      return data
    } catch (error) {
      return false
    }
  }

  static isAuthenticated(): boolean {
    const session =
      localStorage.getItem('sb-access-token') || localStorage.getItem('supabase.auth.token')
    return !!session
  }

  static isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('sb-user') || 'null')
    return user && user.role === 'admin'
  }
}
