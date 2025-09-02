CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Ajouter les politiques d'accès RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir uniquement leurs propres préférences
CREATE POLICY user_preferences_select ON public.user_preferences
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de mettre à jour uniquement leurs propres préférences
CREATE POLICY user_preferences_update ON public.user_preferences
    FOR UPDATE 
    USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs d'insérer uniquement leurs propres préférences
CREATE POLICY user_preferences_insert ON public.user_preferences
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de supprimer uniquement leurs propres préférences
CREATE POLICY user_preferences_delete ON public.user_preferences
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Créer les fonctions pour gérer la table profiles si elle n'existe pas déjà
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Ajouter les politiques d'accès RLS pour profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tous les utilisateurs de voir les profils
CREATE POLICY profiles_select ON public.profiles
    FOR SELECT 
    USING (true);

-- Politique pour permettre aux utilisateurs de mettre à jour uniquement leur propre profil
CREATE POLICY profiles_update ON public.profiles
    FOR UPDATE 
    USING (auth.uid() = id);

-- Politique pour permettre aux utilisateurs d'insérer uniquement leur propre profil
CREATE POLICY profiles_insert ON public.profiles
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Politique pour permettre aux utilisateurs de supprimer uniquement leur propre profil
CREATE POLICY profiles_delete ON public.profiles
    FOR DELETE 
    USING (auth.uid() = id);
