import { h } from 'vue'
import { createColumnHelper } from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import {
  ChevronsUpDown,
  Edit,
  Car,
  Eye,
  Trash2,
  MoreHorizontal,
  Truck,
  User,
} from 'lucide-vue-next'

// Interface Vehicle
export interface Vehicle {
  id: string
  immatriculation: string
  libelle: string
  marque: string
  modele: string
  annee: number
  type: 'Voiture' | 'Camion' | 'Utilitaire' | 'Moto'
  statut: 'Disponible' | 'En service' | 'Maintenance' | 'Hors service' | 'En reserve'
  kilometrage: number
  carburant: 'Essence' | 'Diesel' | 'Électrique' | 'Hybride'
  dateMiseEnService: string
  prochainEntretien: string
  chauffeur?: {
    nom: string
    avatar?: string
  }
  echeanceAssurance: string
  dateControletechnique: string
}

// Données mockées
export const vehiclesData: Vehicle[] = [
  {
    id: '1',
    immatriculation: 'AB-123-CD',
    libelle: 'Berline compacte fiable',
    marque: 'Toyota',
    modele: 'Corolla',
    annee: 2022,
    type: 'Voiture',
    statut: 'Disponible',
    dateMiseEnService: '2022-03-15',
    prochainEntretien: '2025-09-01',
    kilometrage: 32000,
    carburant: 'Essence',
    chauffeur: {
      nom: 'Ahmed Ben Ali',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
    echeanceAssurance: '2026-03-15',
    dateControletechnique: '2025-12-15',
  },
  {
    id: '2',
    immatriculation: 'EF-456-GH',
    libelle: 'Fourgon grande capacité',
    marque: 'Renault',
    modele: 'Master',
    annee: 2020,
    type: 'Utilitaire',
    statut: 'En service',
    dateMiseEnService: '2020-07-10',
    prochainEntretien: '2025-08-10',
    kilometrage: 87000,
    carburant: 'Diesel',
    chauffeur: {
      nom: 'Fatima Zahra',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b123?w=100&h=100&fit=crop&crop=face',
    },
    echeanceAssurance: '2025-12-31',
    dateControletechnique: '2025-11-20',
  },
  {
    id: '3',
    immatriculation: 'IJ-789-KL',
    libelle: 'Camion longue distance',
    marque: 'Mercedes',
    modele: 'Actros',
    annee: 2019,
    type: 'Camion',
    statut: 'Maintenance',
    dateMiseEnService: '2019-11-20',
    prochainEntretien: '2025-08-05',
    kilometrage: 210000,
    carburant: 'Diesel',
    chauffeur: {
      nom: 'Mohamed Tounsi',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    echeanceAssurance: '2025-10-01',
    dateControletechnique: '2025-09-15',
  },
  {
    id: '4',
    immatriculation: 'MN-012-OP',
    libelle: 'Citadine électrique',
    marque: 'Peugeot',
    modele: '208',
    annee: 2023,
    type: 'Voiture',
    statut: 'Hors service',
    dateMiseEnService: '2023-01-05',
    prochainEntretien: '2026-01-05',
    kilometrage: 12000,
    carburant: 'Électrique',
    echeanceAssurance: '2026-01-05',
    dateControletechnique: '2026-02-10',
  },
  {
    id: '5',
    immatriculation: 'QR-345-ST',
    libelle: 'Citadine électrique',
    marque: 'Peugeot',
    modele: '208',
    annee: 2023,
    type: 'Voiture',
    statut: 'En reserve',
    dateMiseEnService: '2023-01-05',
    prochainEntretien: '2026-01-05',
    kilometrage: 12000,
    carburant: 'Électrique',
    echeanceAssurance: '2026-01-05',
    dateControletechnique: '2026-02-10',
  },
  {
    id: '6',
    immatriculation: 'UV-678-WX',
    libelle: 'Citadine électrique',
    marque: 'Peugeot',
    modele: '208',
    annee: 2023,
    type: 'Voiture',
    statut: 'Disponible',
    dateMiseEnService: '2023-01-05',
    prochainEntretien: '2026-01-05',
    kilometrage: 12000,
    carburant: 'Électrique',
    echeanceAssurance: '2026-01-05',
    dateControletechnique: '2026-02-10',
  },
]

// Fonction pour formater les dates
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

// Actions interface
interface VehicleActions {
  viewVehicle: (vehicle: Vehicle) => void
  editVehicle: (vehicle: Vehicle) => void
  deleteVehicle: (vehicle: Vehicle) => void
}

// Fonction pour créer les colonnes du tableau
export function createVehicleColumns(actions: VehicleActions) {
  const columnHelper = createColumnHelper<Vehicle>()

  return [
    columnHelper.display({
      id: 'select',
      header: ({ table }) =>
        h(Checkbox, {
          modelValue:
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate'),
          'onUpdate:modelValue': (value) => table.toggleAllPageRowsSelected(!!value),
          ariaLabel: 'Tout sélectionner',
        }),
      cell: ({ row }) => {
        return h(Checkbox, {
          modelValue: row.getIsSelected(),
          'onUpdate:modelValue': (value) => row.toggleSelected(!!value),
          ariaLabel: 'Sélectionner la ligne',
        })
      },
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor('statut', {
      enablePinning: true,
      header: 'Statut',
      cell: ({ row }) => {
        const statut = row.getValue('statut') as string
        const colors: Record<string, string> = {
          Disponible:
            'bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30',
          'En service': 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30',
          Maintenance:
            'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30',
          'Hors service': 'bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30',
          'En reserve':
            'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30',
        }
        return h(
          'div',
          {
            class: `capitalize px-1.5 py-0.5 rounded text-xs font-semibold flex items-center justify-center ${colors[statut] || 'bg-muted text-muted-foreground border border-muted'}`,
          },
          statut,
        )
      },
    }),
    columnHelper.display({
      id: 'vehicle',
      header: 'Véhicule',
      cell: ({ row }) => {
        const vehicle = row.original
        return h('div', { class: 'min-w-0 flex-1' }, [
          h('div', { class: 'text-sm font-semibold text-foreground truncate' }, vehicle.libelle),
          h(
            'div',
            { class: 'text-xs text-muted-foreground truncate' },
            `${vehicle.marque} ${vehicle.modele}`,
          ),
        ])
      },
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor('immatriculation', {
      header: ({ column }) => {
        return h(
          Button,
          {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
          },
          () => ['Immatriculation', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })],
        )
      },
      cell: ({ row }) =>
        h('div', { class: 'font-semibold text-foreground' }, row.getValue('immatriculation')),
    }),
    columnHelper.accessor('marque', {
      header: 'Marque',
      cell: ({ row }) => h('div', { class: 'text-foreground' }, row.getValue('marque')),
    }),
    columnHelper.accessor('modele', {
      header: 'Modèle',
      cell: ({ row }) => h('div', { class: 'text-foreground' }, row.getValue('modele')),
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: ({ row }) => h('div', { class: 'text-foreground' }, row.getValue('type')),
    }),
    columnHelper.accessor('carburant', {
      header: 'Carburant',
      cell: ({ row }) => {
        const carburant = row.getValue('carburant') as string
        return h('div', { class: 'font-medium text-muted-foreground' }, carburant)
      },
    }),
    columnHelper.display({
      id: 'chauffeur',
      header: () => h('span', { class: 'text-foreground' }, 'Chauffeur'),
      cell: ({ row }) => {
        const chauffeur = row.original.chauffeur
        const vehicle = row.original
        if (!chauffeur) {
          return h('div', { class: 'flex items-center gap-2 text-muted-foreground' }, [
            h('div', { class: 'flex-shrink-0' }, [
              h(Avatar, { class: 'h-8 w-8' }, () => [
                h(AvatarFallback, { class: 'bg-muted text-foreground' }, () =>
                  h(User, { class: 'h-4 w-4' }),
                ),
              ]),
            ]),
            h('span', { class: 'text-sm' }, 'Non assigné'),
          ])
        }
        return h(HoverCard, {}, () => [
          h(HoverCardTrigger, {}, () =>
            h('div', { class: 'flex items-center gap-2 cursor-pointer' }, [
              h('div', { class: 'flex-shrink-0' }, [
                h(Avatar, { class: 'h-8 w-8' }, () => [
                  chauffeur.avatar
                    ? h(AvatarImage, { src: chauffeur.avatar, alt: chauffeur.nom })
                    : null,
                  h(AvatarFallback, { class: 'text-foreground' }, () =>
                    chauffeur.nom
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase(),
                  ),
                ]),
              ]),
              h('span', { class: 'text-sm font-medium text-foreground' }, chauffeur.nom),
            ]),
          ),
          h(HoverCardContent, { class: 'w-80 p-4 flex flex-row items-start gap-4' }, () => [
            h(Avatar, { class: 'h-16 w-16 flex-shrink-0' }, () => [
              chauffeur.avatar
                ? h(AvatarImage, { src: chauffeur.avatar, alt: chauffeur.nom })
                : null,
              h(AvatarFallback, { class: 'text-foreground text-2xl' }, () =>
                chauffeur.nom
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase(),
              ),
            ]),
            h('div', {}, [
              h('div', { class: 'font-semibold text-lg mb-1 text-foreground' }, chauffeur.nom),
              h('div', { class: 'text-sm text-muted-foreground' }, vehicle.immatriculation),
              h(
                'div',
                { class: 'text-sm text-muted-foreground' },
                vehicle.marque + ' ' + vehicle.modele,
              ),
            ]),
          ]),
        ])
      },
      enableSorting: false,
    }),
    columnHelper.accessor('echeanceAssurance', {
      header: 'Échéance assurance',
      cell: ({ row }) => {
        const date = formatDate(row.getValue('echeanceAssurance'))
        return h('div', { class: 'text-sm text-muted-foreground' }, date)
      },
    }),
    columnHelper.accessor('dateControletechnique', {
      header: 'Contrôle technique',
      cell: ({ row }) => {
        const date = formatDate(row.getValue('dateControletechnique'))
        return h('div', { class: 'text-sm text-muted-foreground' }, date)
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const vehicle = row.original
        return h('div', { class: 'relative' }, [
          h(DropdownMenu, {}, () => [
            h(DropdownMenuTrigger, { asChild: true }, () =>
              h(Button, { variant: 'ghost', size: 'icon' }, () =>
                h(MoreHorizontal, { class: 'h-4 w-4 text-muted-foreground' }),
              ),
            ),
            h(DropdownMenuContent, { align: 'end', class: 'w-48' }, () => [
              h(DropdownMenuItem, { onClick: () => actions.editVehicle(vehicle) }, () => [
                h(Edit, { class: 'mr-2 h-4 w-4' }),
                'Modifier',
              ]),
              h(DropdownMenuItem, { onClick: () => actions.viewVehicle(vehicle) }, () => [
                h(Eye, { class: 'mr-2 h-4 w-4' }),
                "Voir l'aperçu",
              ]),
              h(DropdownMenuSeparator),
              h(
                DropdownMenuItem,
                {
                  onClick: () => actions.deleteVehicle(vehicle),
                  class: 'text-red-600 focus:text-red-600',
                },
                () => [h(Trash2, { class: 'mr-2 h-4 w-4 text-red-600' }), 'Supprimer'],
              ),
            ]),
          ]),
        ])
      },
      enableSorting: false,
      enableHiding: false,
    }),
  ]
}
