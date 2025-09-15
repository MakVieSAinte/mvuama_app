-- Creation de la table enterprises
CREATE TABLE IF NOT EXISTS public.enterprises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(255),
  description TEXT,
  website VARCHAR(255),
  tax_id VARCHAR(50),
  address VARCHAR(255),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'France',
  country_code VARCHAR(2) DEFAULT 'FR',
  phone VARCHAR(50),
  email VARCHAR(255),
  currency VARCHAR(3) DEFAULT 'EUR',
  timezone VARCHAR(50) DEFAULT 'Europe/Paris',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Ajout de RLS (Row Level Security)
ALTER TABLE public.enterprises ENABLE ROW LEVEL SECURITY;

-- Créer des politiques pour les enterprises
-- Politique pour SELECT: l'utilisateur peut voir ses propres entreprises
CREATE POLICY "Utilisateurs peuvent voir leurs propres entreprises"
ON public.enterprises
FOR SELECT
USING (auth.uid() = created_by);

-- Politique pour INSERT: l'utilisateur peut créer des entreprises
CREATE POLICY "Utilisateurs peuvent créer des entreprises"
ON public.enterprises
FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Politique pour UPDATE: l'utilisateur peut mettre à jour ses propres entreprises
CREATE POLICY "Utilisateurs peuvent mettre à jour leurs propres entreprises"
ON public.enterprises
FOR UPDATE
USING (auth.uid() = created_by);

-- Politique pour DELETE: soft delete uniquement (on ne supprime pas vraiment)
CREATE POLICY "Utilisateurs peuvent soft-delete leurs propres entreprises"
ON public.enterprises
FOR DELETE
USING (auth.uid() = created_by);

-- Mettre à jour la table des agencies pour ajouter une référence vers enterprises
ALTER TABLE public.agencies ADD COLUMN IF NOT EXISTS enterprise_id UUID REFERENCES public.enterprises(id);

-- Créer un index sur enterprise_id pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_agencies_enterprise_id ON public.agencies(enterprise_id);