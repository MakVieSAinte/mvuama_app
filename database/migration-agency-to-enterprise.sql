-- Migration script: Agency to Enterprise
-- Ce script modifie la structure de la base de données pour passer d'un modèle basé sur "agency" à un modèle "enterprise > agency"

-- Désactiver temporairement les RLS pour faciliter la migration
ALTER TABLE agencies DISABLE ROW LEVEL SECURITY;

-- 1. Créer la table enterprises
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

-- 2. Ajouter la colonne enterprise_id à la table agencies
ALTER TABLE agencies ADD COLUMN IF NOT EXISTS enterprise_id UUID REFERENCES enterprises(id) ON DELETE CASCADE;

-- 3. Créer une entreprise pour chaque agence existante
-- Ceci est un exemple de migration, à adapter selon les données réelles
INSERT INTO enterprises (
    name, code, type, status, country, city, address, postal_code, 
    latitude, longitude, phone, mobile_phone, email, website, 
    logo_url, description, created_at, created_by
)
SELECT 
    name, code, type, status, country, city, address, postal_code,
    latitude, longitude, phone, mobile_phone, email, website,
    logo_url, description, created_at, created_by
FROM agencies
ON CONFLICT DO NOTHING;

-- 4. Mettre à jour la colonne enterprise_id dans la table agencies
-- Pour chaque agence, lier à l'entreprise créée à partir de ses données
UPDATE agencies a
SET enterprise_id = (
    SELECT e.id 
    FROM enterprises e 
    WHERE e.created_by = a.created_by 
    LIMIT 1
)
WHERE a.enterprise_id IS NULL;

-- 5. Simplifier la structure de la table agencies en supprimant les colonnes dupliquées
-- À exécuter uniquement après avoir vérifié que toutes les agencies ont une enterprise_id
-- ALTER TABLE agencies DROP COLUMN IF EXISTS type;
-- ALTER TABLE agencies DROP COLUMN IF EXISTS country;
-- ALTER TABLE agencies DROP COLUMN IF EXISTS latitude;
-- ALTER TABLE agencies DROP COLUMN IF EXISTS longitude;
-- ALTER TABLE agencies DROP COLUMN IF EXISTS mobile_phone;
-- ALTER TABLE agencies DROP COLUMN IF EXISTS website;

-- 6. Création des politiques RLS pour enterprises
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

-- 7. Réactiver les RLS pour agencies
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;

-- 8. Mettre à jour les politiques pour agencies
DROP POLICY IF EXISTS agencies_select_policy ON agencies;
CREATE POLICY agencies_select_policy
ON agencies FOR SELECT
USING (
    auth.uid() = created_by OR
    EXISTS (
        SELECT 1 FROM enterprises e
        WHERE e.id = agencies.enterprise_id
        AND e.created_by = auth.uid()
    )
);

DROP POLICY IF EXISTS agencies_insert_policy ON agencies;
CREATE POLICY agencies_insert_policy
ON agencies FOR INSERT
WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
        SELECT 1 FROM enterprises e
        WHERE e.id = agencies.enterprise_id
        AND e.created_by = auth.uid()
    )
);

DROP POLICY IF EXISTS agencies_update_policy ON agencies;
CREATE POLICY agencies_update_policy
ON agencies FOR UPDATE
USING (
    auth.uid() = created_by OR
    EXISTS (
        SELECT 1 FROM enterprises e
        WHERE e.id = agencies.enterprise_id
        AND e.created_by = auth.uid()
    )
);

DROP POLICY IF EXISTS agencies_delete_policy ON agencies;
CREATE POLICY agencies_delete_policy
ON agencies FOR DELETE
USING (
    auth.uid() = created_by OR
    EXISTS (
        SELECT 1 FROM enterprises e
        WHERE e.id = agencies.enterprise_id
        AND e.created_by = auth.uid()
    )
);

-- 9. Ajouter les triggers pour la mise à jour automatique du champ updated_at
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

DROP TRIGGER IF EXISTS agencies_updated_at_trigger ON agencies;
CREATE TRIGGER agencies_updated_at_trigger
BEFORE UPDATE ON agencies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();