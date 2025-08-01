export interface Vehicle {
  id: string;
  immatriculation: string;
  marque: string;
  modele: string;
  annee: number;
  type: 'Voiture' | 'Camion' | 'Utilitaire' | 'Moto';
  kilometrage: number;
  statut: 'Disponible' | 'En service' | 'Maintenance' | 'Hors service';
  dateMiseEnService: string;
  prochainEntretien: string;
  carburant: 'Essence' | 'Diesel' | 'Électrique' | 'Hybride';
}

export interface Maintenance {
  id: string;
  vehiculeId: string;
  type: 'Révision' | 'Vidange' | 'Pneus' | 'Freins' | 'Autre';
  description: string;
  datePrevue: string;
  dateRealisee?: string;
  statut: 'Prévue' | 'En cours' | 'Terminée' | 'Annulée';
  cout?: number;
  garage?: string;
}

export interface Checklist {
  id: string;
  vehiculeId: string;
  date: string;
  verificateur: string;
  items: ChecklistItem[];
  commentaires?: string;
}

export interface ChecklistItem {
  id: string;
  nom: string;
  verifie: boolean;
  commentaire?: string;
}

export interface ParkingEntry {
  id: string;
  vehiculeId: string;
  dateEntree: string;
  dateSortie?: string;
  dateEcheance: string; // Date d'échéance (3 mois après l'entrée)
  place: string;
  conducteur: string;
  destination?: string;
  kilometrageSortie?: number;
  kilometrageRetour?: number;
}