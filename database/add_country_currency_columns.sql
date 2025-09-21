-- Script pour ajouter les colonnes country et currency à la table users

-- Ajout de la colonne country si elle n'existe pas déjà
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'country'
    ) THEN
        ALTER TABLE public.users ADD COLUMN country VARCHAR(2) DEFAULT 'CD';
    END IF;
END $$;

-- Ajout de la colonne currency si elle n'existe pas déjà
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'currency'
    ) THEN
        ALTER TABLE public.users ADD COLUMN currency VARCHAR(3) DEFAULT 'CDF';
    END IF;
END $$;

-- Commentaires sur les colonnes
COMMENT ON COLUMN public.users.country IS 'Code pays ISO à 2 caractères';
COMMENT ON COLUMN public.users.currency IS 'Code devise ISO à 3 caractères';