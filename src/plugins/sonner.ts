// src/plugins/sonner.ts
import { Toaster as SonnerToaster, toast as sonnerToast } from 'vue-sonner'
import 'vue-sonner/style.css'
import { h } from 'vue'
import { useUserPrefs } from '../composables/useUserPrefs'

// Composable pour centraliser l'utilisation de Sonner (adaptatif au thème)
export function useSonner() {
  // Toaster adaptatif qui suit le thème stocké (light/dark)
  const Toaster = {
    name: 'AppToaster',
    setup() {
      const { theme } = useUserPrefs('user_prefs_mvuama')
      return () =>
        h(SonnerToaster, {
          position: 'bottom-left',
          theme: theme.value,
        })
    },
  }

  // Toast d'erreur centralisé
  function toastError(message: string) {
    sonnerToast.error(message, { richColors: true, position: 'bottom-left'})
  }

  // Toast de succès centralisé
  function toastSuccess(message: string) {
    sonnerToast.success(message, { richColors: true, position: 'bottom-left' })
  }

  return { Toaster, toastError, toastSuccess }
}
