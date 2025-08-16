// src/composables/useUserPrefs.ts
import { ref, watch } from 'vue'

export type UserPrefs = {
  viewType?: 'table' | 'card'
  theme?: string
}

export function useUserPrefs(key: string) {
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

  return {
    viewType,
    getUserPrefs,
    setUserPrefs,
  }
}
