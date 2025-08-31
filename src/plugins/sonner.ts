// src/plugins/sonner.ts
import { Toaster as SonnerToaster, toast as sonnerToast } from 'vue-sonner'
import 'vue-sonner/style.css'
import { h } from 'vue'
import { useUserPrefs } from '../composables/useUserPrefs'

/**
 * Options avancées pour les toasts
 */
interface ToastOptions {
  /** Durée d'affichage en millisecondes */
  duration?: number
  /** Couleurs enrichies pour un meilleur contraste */
  richColors?: boolean
  /** Description supplémentaire */
  description?: string
  /** Action à effectuer (bouton dans le toast) */
  action?: {
    label: string
    onClick: () => void
  }
  /** Rendre le toast non rejetable */
  important?: boolean
  /** Position du toast */
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
}

// Position par défaut pour tous les toasts
const DEFAULT_POSITION = 'bottom-right'

/**
 * Composable pour centraliser l'utilisation des notifications toast
 * Adaptatif au thème de l'application (light/dark)
 */
export function useSonner() {
  // Toaster adaptatif qui suit le thème stocké (light/dark)
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

  /**
   * Toast de succès
   * @param message Message principal
   * @param options Options du toast
   */
  function toastSuccess(message: string, options: ToastOptions = {}) {
    sonnerToast.success(message, {
      richColors: true,
      position: DEFAULT_POSITION,
      duration: 4000,
      ...options,
    })
  }

  /**
   * Toast d'erreur
   * @param message Message d'erreur
   * @param options Options du toast
   */
  function toastError(message: string, options: ToastOptions = {}) {
    sonnerToast.error(message, {
      richColors: true,
      position: DEFAULT_POSITION,
      duration: 5000,
      ...options,
    })
  }

  /**
   * Toast d'avertissement
   * @param message Message d'avertissement
   * @param options Options du toast
   */
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

  /**
   * Toast d'information
   * @param message Message informatif
   * @param options Options du toast
   */
  function toastInfo(message: string, options: ToastOptions = {}) {
    sonnerToast.info(message, {
      richColors: true,
      position: DEFAULT_POSITION,
      duration: 3000,
      ...options,
    })
  }

  /**
   * Toast de chargement avec promesse
   * @param message Message initial pendant le chargement
   * @param promise Promesse à observer
   * @param messages Messages pour chaque état (en attente, succès, erreur)
   */
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
