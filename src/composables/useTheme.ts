import { ref, watchEffect } from 'vue'

// Détection du thème système
function getSystemTheme() {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

const theme = ref(localStorage.getItem('theme') || getSystemTheme())

watchEffect(() => {
  const root = document.documentElement
  if (theme.value === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  localStorage.setItem('theme', theme.value)
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
