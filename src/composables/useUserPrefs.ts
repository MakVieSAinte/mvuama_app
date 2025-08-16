// src/composables/useUserPrefs.ts
import { ref, watch, watchEffect } from 'vue'

export type UserPrefs = {
  viewType?: 'table' | 'card'
  theme?: 'light' | 'dark'
}

export function useUserPrefs(key: string) {
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

  return {
    viewType,
    theme,
    toggleTheme,
    setTheme,
    getUserPrefs,
    setUserPrefs,
  }
}
