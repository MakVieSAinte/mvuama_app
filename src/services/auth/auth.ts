import { supabase } from '../config/supabaseClient'

export class AuthService {
  static async signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { data, error }
    } catch (error: unknown) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Une erreur est survenue'),
      }
    }
  }

  static async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { data, error }
    } catch (error: unknown) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Une erreur est survenue'),
      }
    }
  }

  static async signInWithFacebook() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { data, error }
    } catch (error: unknown) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Une erreur est survenue'),
      }
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
