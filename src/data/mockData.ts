import type { Vehicle, Maintenance, Checklist, ParkingEntry } from '../types/fleet'

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    immatriculation: 'AB-123-CD',
    marque: 'Peugeot',
    modele: '308',
    annee: 2022,
    type: 'Voiture',
    kilometrage: 25000,
    statut: 'Disponible',
    dateMiseEnService: '2022-03-15',
    prochainEntretien: '2024-08-15',
    carburant: 'Essence'
  },
  {
    id: '2',
    immatriculation: 'EF-456-GH',
    marque: 'Renault',
    modele: 'Master',
    annee: 2021,
    type: 'Utilitaire',
    kilometrage: 45000,
    statut: 'En service',
    dateMiseEnService: '2021-01-20',
    prochainEntretien: '2024-08-05',
    carburant: 'Diesel'
  },
  {
    id: '3',
    immatriculation: 'IJ-789-KL',
    marque: 'Tesla',
    modele: 'Model 3',
    annee: 2023,
    type: 'Voiture',
    kilometrage: 15000,
    statut: 'Maintenance',
    dateMiseEnService: '2023-06-10',
    prochainEntretien: '2024-09-10',
    carburant: 'Électrique'
  },
  {
    id: '4',
    immatriculation: 'MN-012-OP',
    marque: 'Mercedes',
    modele: 'Sprinter',
    annee: 2020,
    type: 'Camion',
    kilometrage: 75000,
    statut: 'Disponible',
    dateMiseEnService: '2020-09-05',
    prochainEntretien: '2024-08-20',
    carburant: 'Diesel'
  }
]

export const mockMaintenances: Maintenance[] = [
  {
    id: '1',
    vehiculeId: '1',
    type: 'Révision',
    description: 'Révision annuelle complète',
    datePrevue: '2024-08-15',
    statut: 'Prévue',
    garage: 'Garage Central'
  },
  {
    id: '2',
    vehiculeId: '2',
    type: 'Vidange',
    description: 'Vidange moteur et filtres',
    datePrevue: '2024-08-05',
    statut: 'Prévue',
    garage: 'Garage Renault'
  },
  {
    id: '3',
    vehiculeId: '3',
    type: 'Autre',
    description: 'Mise à jour logiciel',
    datePrevue: '2024-09-10',
    statut: 'En cours',
    garage: 'Tesla Service'
  },
  {
    id: '4',
    vehiculeId: '1',
    type: 'Vidange',
    description: 'Vidange effectuée',
    datePrevue: '2024-07-15',
    dateRealisee: '2024-07-15',
    statut: 'Terminée',
    cout: 85,
    garage: 'Garage Central'
  }
]

export const mockChecklists: Checklist[] = [
  {
    id: '1',
    vehiculeId: '1',
    date: '2024-07-30',
    verificateur: 'Jean Dupont',
    items: [
      { id: '1', nom: 'Niveau d\'huile', verifie: true },
      { id: '2', nom: 'Pression des pneus', verifie: true },
      { id: '3', nom: 'Éclairage', verifie: false, commentaire: 'Ampoule avant gauche à changer' },
      { id: '4', nom: 'Freins', verifie: true },
      { id: '5', nom: 'Batterie', verifie: true }
    ],
    commentaires: 'Véhicule en bon état général'
  }
]

// Fonction helper pour calculer la date d'échéance (3 mois après l'entrée)
const calculateExpiryDate = (entryDate: string): string => {
  const date = new Date(entryDate)
  date.setMonth(date.getMonth() + 3)
  return date.toISOString()
}

export const mockParkingEntries: ParkingEntry[] = [
  {
    id: '1',
    vehiculeId: '1',
    dateEntree: '2024-07-31T08:30:00',
    dateEcheance: calculateExpiryDate('2024-07-31T08:30:00'),
    place: 'A-15',
    conducteur: 'Marie Martin',
    destination: 'Client Paris',
    kilometrageSortie: 25000
  },
  {
    id: '2',
    vehiculeId: '2',
    dateEntree: '2024-07-30T14:15:00',
    dateSortie: '2024-07-30T18:30:00',
    dateEcheance: calculateExpiryDate('2024-07-30T14:15:00'),
    place: 'B-08',
    conducteur: 'Pierre Durand',
    destination: 'Livraison Lyon',
    kilometrageSortie: 44800,
    kilometrageRetour: 45200
  },
  {
    id: '3',
    vehiculeId: '3',
    dateEntree: '2024-05-05T10:00:00',
    dateEcheance: calculateExpiryDate('2024-05-05T10:00:00'), // Échéance proche pour tester les alertes
    place: 'C-12',
    conducteur: 'Sophie Leroy',
    destination: 'Mission longue durée',
    kilometrageSortie: 15000
  }
]

// Fonction utilitaire exportée pour calculer les échéances
export const addThreeMonths = (date: Date): Date => {
  const newDate = new Date(date)
  newDate.setMonth(newDate.getMonth() + 3)
  return newDate
}