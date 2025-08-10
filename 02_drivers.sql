-- 02_drivers.sql
-- Table des chauffeurs

CREATE TABLE public.drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
    
    -- Informations personnelles
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    birth_date DATE,
    id_number VARCHAR(100),
    
    -- Informations de conduite
    license_number VARCHAR(100) NOT NULL,
    license_type VARCHAR(50),
    license_expiry_date DATE,
    status VARCHAR(50) CHECK (status IN ('Active', 'Inactive', 'Suspended', 'On Leave')),
    
    -- Informations générales
    hire_date DATE,
    termination_date DATE,
    notes TEXT,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    
    -- Métadonnées
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX drivers_agency_id_idx ON public.drivers(agency_id);
CREATE INDEX drivers_vehicle_id_idx ON public.drivers(vehicle_id);
CREATE INDEX drivers_status_idx ON public.drivers(status);
CREATE INDEX drivers_license_expiry_date_idx ON public.drivers(license_expiry_date);

-- Vue pour les chauffeurs actifs
CREATE OR REPLACE VIEW active_drivers AS
SELECT * FROM public.drivers WHERE deleted_at IS NULL;

-- Fonction trigger pour mettre à jour le champ updated_at automatiquement
CREATE OR REPLACE FUNCTION public.update_drivers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_drivers_updated_at
BEFORE UPDATE ON public.drivers
FOR EACH ROW
EXECUTE FUNCTION public.update_drivers_updated_at();

-- Table des infractions/incidents pour les chauffeurs
CREATE TABLE public.driver_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
    
    -- Informations sur l'incident
    incident_date TIMESTAMPTZ NOT NULL,
    incident_type VARCHAR(100) CHECK (incident_type IN ('Traffic Violation', 'Accident', 'Complaint', 'Other')),
    location TEXT,
    description TEXT NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('Minor', 'Moderate', 'Major', 'Critical')),
    
    -- Actions et conséquences
    action_taken TEXT,
    penalty TEXT,
    points INTEGER DEFAULT 0,
    
    -- Documents associés
    documents TEXT[],
    
    -- Métadonnées
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Index pour les incidents
CREATE INDEX driver_incidents_agency_id_idx ON public.driver_incidents(agency_id);
CREATE INDEX driver_incidents_driver_id_idx ON public.driver_incidents(driver_id);
CREATE INDEX driver_incidents_incident_date_idx ON public.driver_incidents(incident_date);

-- Vue pour les incidents actifs
CREATE OR REPLACE VIEW active_driver_incidents AS
SELECT * FROM public.driver_incidents WHERE deleted_at IS NULL;

-- Trigger pour mise à jour auto de updated_at
CREATE TRIGGER update_driver_incidents_updated_at
BEFORE UPDATE ON public.driver_incidents
FOR EACH ROW
EXECUTE FUNCTION public.update_drivers_updated_at();
