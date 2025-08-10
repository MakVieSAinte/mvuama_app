-- 01_agencies.sql
-- Création des extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des agences/entreprises
CREATE TABLE public.agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    logo_url TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    website VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    CONSTRAINT agencies_name_unique UNIQUE (name)
);

-- Table des utilisateurs
-- Note: Utilise la table auth.users de Supabase pour les infos d'authentification
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(200),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_sign_in_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Table d'association utilisateurs-agences avec rôles
CREATE TABLE public.memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'chauffeur', 'controleur', 'gestionnaire')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    CONSTRAINT memberships_user_agency_role_unique UNIQUE (user_id, agency_id, role)
);

-- Vue pour utilisateurs actifs
CREATE VIEW public.active_users AS
SELECT * FROM public.users WHERE deleted_at IS NULL;

-- Vue pour agences actives
CREATE VIEW public.active_agencies AS
SELECT * FROM public.agencies WHERE deleted_at IS NULL;

-- Vue pour adhésions actives
CREATE VIEW public.active_memberships AS
SELECT * FROM public.memberships WHERE deleted_at IS NULL;