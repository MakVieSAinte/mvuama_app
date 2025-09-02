-- Création de la table agencies
CREATE TABLE IF NOT EXISTS public.agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    type VARCHAR(50) DEFAULT 'headquarters',
    status VARCHAR(20) DEFAULT 'active',
    country VARCHAR(2), -- Code pays ISO
    city VARCHAR(100),
    address TEXT,
    postal_code VARCHAR(20),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    phone VARCHAR(50),
    mobile_phone VARCHAR(50),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    website VARCHAR(255),
    logo_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES auth.users(id),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Activation RLS (Row Level Security)
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;

-- Création de la table users (si elle n'existe pas déjà)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(200),
    avatar_url TEXT,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Activation RLS (Row Level Security) pour users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Création de la table memberships
CREATE TABLE IF NOT EXISTS public.memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES public.agencies(id),
    user_id UUID NOT NULL REFERENCES public.users(id),
    role VARCHAR(50) DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES auth.users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(agency_id, user_id) WHERE deleted_at IS NULL
);

-- Activation RLS (Row Level Security) pour memberships
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- Création de politiques RLS pour agencies
-- Politique pour permettre aux utilisateurs de voir leurs propres agences
CREATE POLICY "Users can view their own agencies" ON public.agencies
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id FROM public.memberships 
            WHERE agency_id = id 
            AND deleted_at IS NULL
        )
    );

-- Politique pour permettre aux utilisateurs de créer des agences
CREATE POLICY "Users can create agencies" ON public.agencies
    FOR INSERT
    WITH CHECK (auth.uid() = created_by);

-- Politique pour permettre aux administrateurs de mettre à jour les agences
CREATE POLICY "Admins can update agencies" ON public.agencies
    FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT user_id FROM public.memberships 
            WHERE agency_id = id 
            AND role = 'admin' 
            AND deleted_at IS NULL
        )
    );

-- Création de politiques RLS pour users
-- Politique pour permettre aux utilisateurs de voir leur propre profil
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- Politique pour permettre aux utilisateurs de mettre à jour leur propre profil
CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

-- Création de politiques RLS pour memberships
-- Politique pour permettre aux utilisateurs de voir leurs propres adhésions
CREATE POLICY "Users can view their own memberships" ON public.memberships
    FOR SELECT
    USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Politique pour permettre aux administrateurs de voir les adhésions de leur agence
CREATE POLICY "Admins can view agency memberships" ON public.memberships
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id FROM public.memberships 
            WHERE agency_id = agency_id 
            AND role = 'admin' 
            AND deleted_at IS NULL
        )
    );

-- Politique pour permettre aux administrateurs d'ajouter des membres
CREATE POLICY "Admins can create memberships" ON public.memberships
    FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM public.memberships 
            WHERE agency_id = agency_id 
            AND role = 'admin' 
            AND deleted_at IS NULL
        ) OR auth.uid() = user_id
    );

-- Triggers pour la mise à jour automatique du champ updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création des triggers pour toutes les tables
CREATE TRIGGER set_updated_at_agencies
BEFORE UPDATE ON public.agencies
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER set_updated_at_users
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER set_updated_at_memberships
BEFORE UPDATE ON public.memberships
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_memberships_agency_id ON public.memberships (agency_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON public.memberships (user_id);
CREATE INDEX IF NOT EXISTS idx_agencies_created_by ON public.agencies (created_by);
CREATE INDEX IF NOT EXISTS idx_deleted_at ON public.agencies (deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_memberships_deleted_at ON public.memberships (deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON public.users (deleted_at) WHERE deleted_at IS NOT NULL;
