export interface StatusConfig {
  value: string
  label: string
  color: string
  bgColor: string
}

export interface FuelConfig {
  value: string
  label: string
  color: string
  icon?: string
}

export interface ChauffeurConfig {
  id: string | number
  nom: string
  photo?: string
  initiales: string
  couleurInitiales: string
}

// Configuration des statuts véhicules
export const VEHICLE_STATUSES: StatusConfig[] = [
  {
    value: 'disponible',
    label: 'Disponible',
    color: '#10b981', // vert
    bgColor: '#10b981',
  },
  {
    value: 'en_cours',
    label: "En cours d'utilisation",
    color: '#f59e0b', // orange
    bgColor: '#f59e0b',
  },
  {
    value: 'maintenance',
    label: 'En maintenance / Réparation',
    color: '#ef4444', // rouge
    bgColor: '#ef4444',
  },
  {
    value: 'hors_service',
    label: 'Hors service / Indisponible',
    color: '#6b7280', // gris
    bgColor: '#6b7280',
  },
]

// Configuration des types de carburant
export const FUEL_TYPES: FuelConfig[] = [
  {
    value: 'essence',
    label: 'Essence',
    color: '#3b82f6', // bleu
    icon: '⛽',
  },
  {
    value: 'diesel',
    label: 'Diesel',
    color: '#1f2937', // gris foncé
    icon: '🚛',
  },
  {
    value: 'hybride',
    label: 'Hybride',
    color: '#10b981', // vert
    icon: '🔋',
  },
  {
    value: 'electrique',
    label: 'Électrique',
    color: '#22c55e', // vert clair
    icon: '⚡',
  },
  {
    value: 'gpl',
    label: 'GPL',
    color: '#8b5cf6', // violet
    icon: '🔥',
  },
]

// Fonction utilitaire pour générer les initiales
export const generateInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

// Couleurs pour les initiales des chauffeurs
export const INITIALS_COLORS = [
  '#ef4444', // rouge
  '#f97316', // orange
  '#eab308', // jaune
  '#22c55e', // vert
  '#06b6d4', // cyan
  '#3b82f6', // bleu
  '#8b5cf6', // violet
  '#ec4899', // rose
]

// Fonction pour obtenir une couleur d'initiales basée sur le nom
export const getInitialsColor = (name: string): string => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return INITIALS_COLORS[hash % INITIALS_COLORS.length]
}

// Configuration GPS
export interface GpsConfig {
  imei?: string
  numeroSerie?: string
  fournisseur?: string
  modele?: string
  dateInstallation?: Date
  statut?: 'actif' | 'inactif' | 'maintenance'
}
