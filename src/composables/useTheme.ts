import { ref, watchEffect } from 'vue'
import { useUserPrefs } from './useUserPrefs'

// Détection du thème système
function getSystemTheme() {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

const USER_PREFS_KEY = 'user_prefs_mvuama'
const { setUserPrefs, getUserPrefs } = useUserPrefs(USER_PREFS_KEY)
const theme = ref(getUserPrefs().theme || getSystemTheme())

watchEffect(() => {
  const root = document.documentElement
  if (theme.value === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  setUserPrefs({ theme: theme.value })
})

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }
  return {
    theme,
    toggleTheme,
    setTheme: (val: 'light' | 'dark') => (theme.value = val),
  }
}
