import { Toaster as SonnerToaster, toast as sonnerToast } from 'vue-sonner'
import 'vue-sonner/style.css'
import { h } from 'vue'
import { useUserPrefs } from '../composables/useUserPrefs'

interface ToastOptions {
  duration?: number // Durée d'affichage en millisecondes
  richColors?: boolean // Couleurs enrichies
  description?: string // Description supplémentaire
  action?: {
    label: string
    onClick: () => void
  } // Action à effectuer (bouton dans le toast)
  important?: boolean // Rendre le toast non rejetable
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right' // Position du toast
}

// Position par défaut pour tous les toasts
const DEFAULT_POSITION = 'bottom-right'

export function useSonner() {
  const Toaster = {
    name: 'AppToaster',
    setup() {
      const { theme } = useUserPrefs('user_prefs_mvuama')
      return () =>
        h(SonnerToaster, {
          position: DEFAULT_POSITION,
          theme: theme.value,
          closeButton: true,
          expand: false,
          richColors: true,
          className: 'rounded-md',
        })
    },
  }

  function toastSuccess(message: string, options: ToastOptions = {}) {
    sonnerToast.success(message, {
      richColors: true,
      position: DEFAULT_POSITION,
      duration: 4000,
      ...options,
    })
  }

  function toastError(message: string, options: ToastOptions = {}) {
    sonnerToast.error(message, {
      richColors: true,
      position: DEFAULT_POSITION,
      duration: 5000,
      ...options,
    })
  }

  function toastWarning(message: string, options: ToastOptions = {}) {
    sonnerToast(message, {
      richColors: true,
      position: DEFAULT_POSITION,
      duration: 4000,
      ...options,
      style: {
        backgroundColor: 'var(--warning)',
        color: 'var(--warning-foreground)',
        borderColor: 'var(--warning)',
      },
    })
  }

  function toastInfo(message: string, options: ToastOptions = {}) {
    sonnerToast.info(message, {
      richColors: true,
      position: DEFAULT_POSITION,
      duration: 4000,
      ...options,
    })
  }

  // Toast de chargement avec promesse

  function toastPromise<T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    },
    options: ToastOptions = {},
  ) {
    return sonnerToast.promise(promise, {
      ...messages,
      ...options,
      position: options.position || DEFAULT_POSITION,
      richColors: options.richColors !== false,
    })
  }

  return {
    Toaster,
    toastSuccess,
    toastError,
    toastWarning,
    toastInfo,
    toastPromise,
  }
}
