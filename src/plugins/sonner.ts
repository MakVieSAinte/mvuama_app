// src/plugins/sonner.ts
import { Toaster, toast } from 'vue-sonner'
import 'vue-sonner/style.css'

// Fonction centralisée pour afficher un toast
export function showToast(options: {
  title?: string
  description?: string
  type?: 'success' | 'error' | 'info' | 'warning'
}) {
  toast(options.title ?? '', {
    description: options.description,
    type: options.type,
    position: 'bottom-right',
    duration: 3500,
  })
}

export { Toaster }
