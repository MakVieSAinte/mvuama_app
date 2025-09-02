-- 03_vehicles.sql
-- Table des véhicules
CREATE TABLE public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
    
    -- Informations essentielles
    immatriculation VARCHAR(50) NOT NULL,
    marque VARCHAR(100) NOT NULL,
    modele VARCHAR(100) NOT NULL,
    annee INTEGER,
    type VARCHAR(50) CHECK (type IN ('Voiture', 'Camion', 'Utilitaire', 'Moto')),
    statut VARCHAR(50) CHECK (statut IN ('Disponible', 'En service', 'Maintenance', 'Hors service', 'En reserve')),
    couleur VARCHAR(50),
    vin VARCHAR(100),
    affectation VARCHAR(100),
    chauffeur_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
    
    -- Caractéristiques techniques
    carburant VARCHAR(50) CHECK (carburant IN ('Essence', 'Diesel', 'Électrique', 'Hybride')),
    kilometrage INTEGER NOT NULL DEFAULT 0,
    date_mise_en_service TIMESTAMPTZ,
    capacite_passagers INTEGER,
    charge_utile DECIMAL(10, 2),
    etat VARCHAR(50),
    description TEXT,
    
    -- Suivi technique & réglementaire
    prochain_controle_technique TIMESTAMPTZ,
    prochaine_maintenance TIMESTAMPTZ,
    compagnie_assurance VARCHAR(100),
    numero_contrat_assurance VARCHAR(100),
    echeance_assurance TIMESTAMPTZ,
    
    -- Localisation & suivi
    localisation_actuelle VARCHAR(255),
    zone_utilisation VARCHAR(255),
    
    -- Gestion financière & planning
    montant_journalier DECIMAL(10, 2),
    jours_sortie VARCHAR(255), -- Stocké sous forme "lun,mar,jeu,ven"
    heure_sortie TIME,
    heure_entree_max TIME,
    
    -- Métadonnées
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    
    -- Contraintes
    CONSTRAINT vehicles_agency_immat_unique UNIQUE (agency_id, immatriculation)
);

-- Table des maintenances
CREATE TABLE public.maintenances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    type VARCHAR(50) CHECK (type IN ('Révision', 'Vidange', 'Pneus', 'Freins', 'Autre')),
    description TEXT,
    date_prevue TIMESTAMPTZ NOT NULL,
    date_realisee TIMESTAMPTZ,
    statut VARCHAR(50) CHECK (statut IN ('Prévue', 'En cours', 'Terminée', 'Annulée')),
    cout DECIMAL(10, 2),
    garage VARCHAR(255),
    kilometrage_lors_maintenance INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Table des checklists
CREATE TABLE public.checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    date TIMESTAMPTZ NOT NULL DEFAULT now(),
    verificateur VARCHAR(255) NOT NULL,
    commentaires TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Table des éléments de checklist
CREATE TABLE public.checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
    checklist_id UUID NOT NULL REFERENCES public.checklists(id) ON DELETE CASCADE,
    nom VARCHAR(255) NOT NULL,
    verifie BOOLEAN NOT NULL DEFAULT false,
    commentaire TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- Table des enregistrements parking
CREATE TABLE public.parking_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    date_entree TIMESTAMPTZ NOT NULL DEFAULT now(),
    date_sortie TIMESTAMPTZ,
    date_echeance TIMESTAMPTZ NOT NULL,
    place VARCHAR(50) NOT NULL,
    conducteur VARCHAR(255) NOT NULL,
    destination TEXT,
    kilometrage_sortie INTEGER,
    kilometrage_retour INTEGER,
    commentaires TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Vues pour les véhicules actifs
CREATE VIEW public.active_vehicles AS
SELECT * FROM public.vehicles WHERE deleted_at IS NULL;

-- Vue pour les maintenances actives
CREATE VIEW public.active_maintenances AS
SELECT * FROM public.maintenances WHERE deleted_at IS NULL;

-- Vue pour les checklists actives
CREATE VIEW public.active_checklists AS
SELECT * FROM public.checklists WHERE deleted_at IS NULL;

-- Vue pour les logs de parking actifs
CREATE VIEW public.active_parking_logs AS
SELECT * FROM public.parking_logs WHERE deleted_at IS NULL;

-- Index pour optimiser les recherches
CREATE INDEX vehicles_agency_id_idx ON public.vehicles(agency_id);
CREATE INDEX maintenances_agency_vehicle_idx ON public.maintenances(agency_id, vehicle_id);
CREATE INDEX checklists_agency_vehicle_idx ON public.checklists(agency_id, vehicle_id);
CREATE INDEX checklist_items_checklist_idx ON public.checklist_items(checklist_id);
CREATE INDEX parking_logs_agency_vehicle_idx ON public.parking_logs(agency_id, vehicle_id);