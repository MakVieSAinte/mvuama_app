-- 05_receipts.sql
-- Table des recettes (revenus quotidiens des véhicules)

CREATE TABLE public.receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
    
    -- Informations sur la recette
    date DATE NOT NULL,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
    
    -- Montants
    gross_amount DECIMAL(12, 2) NOT NULL, -- Montant brut collecté
    fuel_cost DECIMAL(12, 2), -- Coût du carburant
    repair_cost DECIMAL(12, 2), -- Coûts de réparation mineure
    other_expenses DECIMAL(12, 2), -- Autres dépenses
    net_amount DECIMAL(12, 2) NOT NULL, -- Montant net (après déduction des dépenses)
    
    -- Kilométrage
    starting_km INTEGER,
    ending_km INTEGER,
    total_km INTEGER GENERATED ALWAYS AS (ending_km - starting_km) STORED,
    
    -- Informations supplémentaires
    notes TEXT,
    
    -- Statut
    status VARCHAR(50) CHECK (status IN ('Pending', 'Verified', 'Contested', 'Approved')),
    
    -- Métadonnées
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX receipts_agency_id_idx ON public.receipts(agency_id);
CREATE INDEX receipts_date_idx ON public.receipts(date);
CREATE INDEX receipts_vehicle_id_idx ON public.receipts(vehicle_id);
CREATE INDEX receipts_driver_id_idx ON public.receipts(driver_id) WHERE driver_id IS NOT NULL;
CREATE INDEX receipts_status_idx ON public.receipts(status);

-- Vue pour les recettes actives
CREATE OR REPLACE VIEW active_receipts AS
SELECT * FROM public.receipts WHERE deleted_at IS NULL;

-- Vue pour les statistiques quotidiennes par véhicule
CREATE OR REPLACE VIEW daily_vehicle_stats AS
SELECT 
    r.agency_id,
    r.date,
    r.vehicle_id,
    v.immatriculation,
    v.marque,
    v.modele,
    COUNT(r.id) AS receipt_count,
    SUM(r.gross_amount) AS total_gross,
    SUM(r.fuel_cost) AS total_fuel_cost,
    SUM(r.repair_cost) AS total_repair_cost,
    SUM(r.other_expenses) AS total_other_expenses,
    SUM(r.net_amount) AS total_net,
    AVG(r.net_amount) AS avg_net_per_receipt,
    SUM(r.total_km) AS total_km
FROM 
    public.receipts r
JOIN 
    public.vehicles v ON r.vehicle_id = v.id
WHERE 
    r.deleted_at IS NULL
GROUP BY 
    r.agency_id, r.date, r.vehicle_id, v.immatriculation, v.marque, v.modele;

-- Fonction trigger pour mettre à jour le champ updated_at automatiquement
CREATE OR REPLACE FUNCTION public.update_receipts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_receipts_updated_at
BEFORE UPDATE ON public.receipts
FOR EACH ROW
EXECUTE FUNCTION public.update_receipts_updated_at();

-- Table pour les objectifs de recette
CREATE TABLE public.revenue_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
    
    -- Cible
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
    target_type VARCHAR(50) CHECK (target_type IN ('Daily', 'Weekly', 'Monthly')),
    
    -- Période 
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Montant cible
    target_amount DECIMAL(12, 2) NOT NULL,
    
    -- Bonus/malus
    bonus_threshold DECIMAL(12, 2),
    bonus_amount DECIMAL(12, 2),
    penalty_threshold DECIMAL(12, 2),
    penalty_amount DECIMAL(12, 2),
    
    -- Métadonnées
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    
    -- Contraintes
    CHECK (start_date <= end_date),
    CHECK (vehicle_id IS NOT NULL OR driver_id IS NOT NULL)
);

-- Index pour les objectifs
CREATE INDEX revenue_targets_agency_id_idx ON public.revenue_targets(agency_id);
CREATE INDEX revenue_targets_vehicle_id_idx ON public.revenue_targets(vehicle_id) WHERE vehicle_id IS NOT NULL;
CREATE INDEX revenue_targets_driver_id_idx ON public.revenue_targets(driver_id) WHERE driver_id IS NOT NULL;
CREATE INDEX revenue_targets_date_range_idx ON public.revenue_targets(start_date, end_date);

-- Trigger pour mise à jour auto de updated_at
CREATE TRIGGER update_revenue_targets_updated_at
BEFORE UPDATE ON public.revenue_targets
FOR EACH ROW
EXECUTE FUNCTION public.update_receipts_updated_at();
