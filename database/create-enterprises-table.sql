-- Script pour créer la table enterprises uniquement
-- À exécuter sur Supabase

-- Créer la table enterprises
CREATE TABLE IF NOT EXISTS enterprises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    address TEXT,
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(30),
    mobile_phone VARCHAR(30),
    email VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    logo_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Activer RLS pour la table enterprises
ALTER TABLE enterprises ENABLE ROW LEVEL SECURITY;

-- Politique pour la sélection: l'utilisateur peut voir ses propres entreprises
CREATE POLICY enterprises_select_policy
ON enterprises FOR SELECT
USING (
    auth.uid() = created_by
);

-- Politique pour l'insertion: l'utilisateur peut créer des entreprises
CREATE POLICY enterprises_insert_policy
ON enterprises FOR INSERT
WITH CHECK (
    auth.uid() = created_by
);

-- Politique pour la mise à jour: l'utilisateur peut modifier ses propres entreprises
CREATE POLICY enterprises_update_policy
ON enterprises FOR UPDATE
USING (
    auth.uid() = created_by
);

-- Politique pour la suppression: l'utilisateur peut supprimer ses propres entreprises
CREATE POLICY enterprises_delete_policy
ON enterprises FOR DELETE
USING (
    auth.uid() = created_by
);

-- Ajouter le trigger pour la mise à jour automatique du champ updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enterprises_updated_at_trigger ON enterprises;
CREATE TRIGGER enterprises_updated_at_trigger
BEFORE UPDATE ON enterprises
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();