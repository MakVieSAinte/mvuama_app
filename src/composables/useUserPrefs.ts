// src/composables/useUserPrefs.ts
import { ref, watch, watchEffect } from 'vue'
import { supabase } from '@/services/config/supabaseClient'

export type UserPrefs = {
  viewType?: 'table' | 'card'
  theme?: 'light' | 'dark' | 'system'
  language?: string
  timezone?: string
  dateFormat?: string
  [key: string]: any
}

export interface UserPreferences {
  language: string
  theme: 'light' | 'dark' | 'system'
  timezone: string
  dateFormat: string
  viewType?: 'table' | 'card'
  [key: string]: any
}

// Version originale de useUserPrefs pour la compatibilité avec le code existant
export function useUserPrefs(key: string = 'user-prefs') {
  // Détection du thème système
  function getSystemTheme() {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark'
    }
    return 'light'
  }

  function getUserPrefs(): UserPrefs {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  }

  function setUserPrefs(prefs: Partial<UserPrefs>) {
    const current = getUserPrefs()
    const updated = { ...current, ...prefs }
    localStorage.setItem(key, JSON.stringify(updated))
  }

  // Vue state for viewType
  const viewType = ref<'table' | 'card'>(getUserPrefs().viewType || 'table')
  watch(viewType, (val) => {
    setUserPrefs({ viewType: val })
  })

  // Vue state for theme (par défaut: préférence utilisateur ou thème système)
  const theme = ref<'light' | 'dark'>(getUserPrefs().theme || getSystemTheme())
  // Applique le thème au document et persiste la préférence
  watchEffect(() => {
    const root = typeof document !== 'undefined' ? document.documentElement : null
    if (root) {
      if (theme.value === 'dark') root.classList.add('dark')
      else root.classList.remove('dark')
    }
    setUserPrefs({ theme: theme.value })
  })

  // Helpers pour changer le thème
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function setTheme(val: 'light' | 'dark') {
    theme.value = val
  }

  // Nouvelle fonction pour charger les préférences depuis Supabase
  async function loadPrefsFromDatabase() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return null

      const { data, error } = await supabase
        .from('user_preferences')
        .select('preferences')
        .eq('user_id', user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Si le profil n'existe pas
        }
        throw error
      }

      if (data?.preferences) {
        const dbPrefs = data.preferences as UserPrefs
        // Mettre à jour les préférences locales
        if (dbPrefs.theme) setTheme(dbPrefs.theme as 'light' | 'dark')
        if (dbPrefs.viewType) viewType.value = dbPrefs.viewType

        // Mettre à jour le localStorage
        setUserPrefs(dbPrefs)
        return dbPrefs
      }

      return null
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error)
      return null
    }
  }

  // Nouvelle fonction pour sauvegarder les préférences dans Supabase
  async function savePrefsToDatabase() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Utilisateur non connecté')

      const currentPrefs = getUserPrefs()

      const { error } = await supabase.from('user_preferences').upsert({
        user_id: user.id,
        preferences: currentPrefs,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      return true
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences:', error)
      return false
    }
  }

  return {
    viewType,
    theme,
    toggleTheme,
    setTheme,
    getUserPrefs,
    setUserPrefs,
    loadPrefsFromDatabase,
    savePrefsToDatabase,
  }
}

// Nouvelle version étendue pour les pages de préférences utilisateur
export function useUserPrefsFull() {
  const prefs = ref<UserPreferences>({
    language: 'fr',
    theme: 'system',
    timezone: 'Africa/Kinshasa',
    dateFormat: 'DD/MM/YYYY',
    viewType: 'table',
  })

  /**
   * Charge les préférences utilisateur depuis Supabase
   */
  const loadPrefs = async (): Promise<UserPreferences | null> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return null
      }

      const { data, error } = await supabase
        .from('user_preferences')
        .select('preferences')
        .eq('user_id', user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Si le profil n'existe pas, on retourne null
          return null
        }
        throw error
      }

      if (data?.preferences) {
        prefs.value = data.preferences as UserPreferences
        applyTheme(prefs.value.theme)
        return data.preferences as UserPreferences
      }

      return null
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error)
      return null
    }
  }

  /**
   * Enregistre les préférences utilisateur dans Supabase
   */
  const savePrefs = async (preferences: UserPreferences): Promise<boolean> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Utilisateur non connecté')
      }

      const { error } = await supabase.from('user_preferences').upsert({
        user_id: user.id,
        preferences: preferences,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        throw error
      }

      prefs.value = { ...preferences }
      applyTheme(preferences.theme)

      return true
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences:', error)
      return false
    }
  }

  /**
   * Applique le thème en fonction des préférences
   */
  const applyTheme = (theme: string) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      // Mode système
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  // Initialiser les préférences au démarrage
  loadPrefs()

  return {
    prefs,
    loadPrefs,
    savePrefs,
  }
}
