<template>
  <!-- Mini dashboard -->
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <Tooltip>
      <TooltipTrigger as-child>
        <div class="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div class="p-2 rounded-full bg-green-400 dark:bg-green-900">
            <Car class="h-6 w-6 text-green-600 dark:text-green-300" />
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ data.length }}</div>
            <div class="text-xs text-muted-foreground">Véhicules au total</div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>Nombre total de véhicules</TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger as-child>
        <div class="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div class="p-2 rounded-full bg-blue-400 dark:bg-blue-900">
            <CheckCircle class="h-6 w-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ data.filter((v) => v.statut === 'Disponible').length }}
            </div>
            <div class="text-xs text-muted-foreground">Disponibles</div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>Véhicules disponibles</TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger as-child>
        <div class="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div class="p-2 rounded-full bg-yellow-400 dark:bg-yellow-900">
            <Wrench class="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ data.filter((v) => v.statut === 'Maintenance').length }}
            </div>
            <div class="text-xs text-muted-foreground">En maintenance</div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>Véhicules en maintenance</TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger as-child>
        <div class="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div class="p-2 rounded-full bg-purple-400 dark:bg-purple-900">
            <Gauge class="h-6 w-6 text-purple-600 dark:text-purple-300" />
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ totalKilometrage }}
            </div>
            <div class="text-xs text-muted-foreground">Km cumulés</div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>Kilométrage total cumulé</TooltipContent>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

// Interface Vehicle étendue
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

// Données mockées étendues
const data: Vehicle[] = [
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
    id: '4',
    immatriculation: 'MN-012-OP',
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
    id: '4',
    immatriculation: 'MN-012-OP',
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

const totalKilometrage = computed(() => {
  return data
    .reduce((acc, v) => acc + (typeof v.kilometrage === 'number' ? v.kilometrage : 0), 0)
    .toLocaleString('fr-FR')
})
</script>

<style></style>
