-- 04_payments.sql
-- Table des paiements

CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
    
    -- Informations sur le paiement
    amount DECIMAL(12, 2) NOT NULL,
    payment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    payment_type VARCHAR(50) CHECK (payment_type IN ('Salary', 'Maintenance', 'Fuel', 'Insurance', 'Tax', 'Miscellaneous')),
    payment_method VARCHAR(50) CHECK (payment_method IN ('Cash', 'Bank Transfer', 'Credit Card', 'Mobile Payment', 'Other')),
    
    -- Destinataire
    recipient_type VARCHAR(50) CHECK (recipient_type IN ('Driver', 'Vendor', 'Government', 'Insurance', 'Other')),
    recipient_id UUID, -- Peut être lié à drivers.id ou une autre table selon le cas
    recipient_name VARCHAR(255) NOT NULL,
    
    -- Informations supplémentaires
    reference_number VARCHAR(100),
    description TEXT,
    receipt_url TEXT,
    
    -- Lien possible avec d'autres tables
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    maintenance_id UUID REFERENCES public.maintenances(id) ON DELETE SET NULL,
    
    -- Informations comptables
    accounting_category VARCHAR(100),
    tax_deductible BOOLEAN DEFAULT FALSE,
    tax_amount DECIMAL(12, 2),
    
    -- Statut du paiement
    status VARCHAR(50) CHECK (status IN ('Pending', 'Completed', 'Failed', 'Cancelled')),
    
    -- Métadonnées
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX payments_agency_id_idx ON public.payments(agency_id);
CREATE INDEX payments_payment_date_idx ON public.payments(payment_date);
CREATE INDEX payments_payment_type_idx ON public.payments(payment_type);
CREATE INDEX payments_vehicle_id_idx ON public.payments(vehicle_id) WHERE vehicle_id IS NOT NULL;
CREATE INDEX payments_recipient_type_idx ON public.payments(recipient_type);

-- Vue pour les paiements actifs
CREATE OR REPLACE VIEW active_payments AS
SELECT * FROM public.payments WHERE deleted_at IS NULL;

-- Fonction trigger pour mettre à jour le champ updated_at automatiquement
CREATE OR REPLACE FUNCTION public.update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_payments_updated_at();

-- Table des catégories de dépenses (pour faciliter la catégorisation et les rapports)
CREATE TABLE public.expense_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id UUID REFERENCES public.expense_categories(id) ON DELETE SET NULL,
    budget_amount DECIMAL(12, 2),
    is_tax_deductible BOOLEAN DEFAULT FALSE,
    
    -- Métadonnées
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    
    -- Contrainte pour éviter les doublons
    CONSTRAINT expense_categories_unique UNIQUE (agency_id, name)
);

-- Index pour les catégories
CREATE INDEX expense_categories_agency_id_idx ON public.expense_categories(agency_id);
CREATE INDEX expense_categories_parent_id_idx ON public.expense_categories(parent_category_id) WHERE parent_category_id IS NOT NULL;

-- Vue pour les catégories actives
CREATE OR REPLACE VIEW active_expense_categories AS
SELECT * FROM public.expense_categories WHERE deleted_at IS NULL;

-- Trigger pour mise à jour auto de updated_at
CREATE TRIGGER update_expense_categories_updated_at
BEFORE UPDATE ON public.expense_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_payments_updated_at();
