-- Script de création de la table users si elle n'existe pas déjà
-- À exécuter dans la console SQL de Supabase

-- Création de la table users
CREATE TABLE IF NOT EXISTS public.users (
    id uuid references auth.users on delete cascade primary key,
    first_name text not null default '',
    last_name text not null default '',
    email text not null,
    phone_number text,
    country text default 'République Démocratique du Congo',
    currency text default 'CDF',
    birthday date,
    role text default 'user',
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now()),
    deleted_at timestamp with time zone,
    deleted_by uuid
);

-- Ajout d'un trigger pour mettre à jour la date de mise à jour automatiquement
CREATE OR REPLACE FUNCTION public.update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON public.users;
CREATE TRIGGER users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE PROCEDURE update_users_updated_at();

-- Activer RLS sur la table users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leur propre profil
DROP POLICY IF EXISTS users_select_policy ON public.users;
CREATE POLICY users_select_policy 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

-- Politique pour permettre aux utilisateurs de mettre à jour leur propre profil
DROP POLICY IF EXISTS users_update_policy ON public.users;
CREATE POLICY users_update_policy 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id);

-- Ajouter un trigger pour créer automatiquement un enregistrement dans users après inscription
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer le trigger s'il existe déjà pour éviter les erreurs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Créer le trigger pour les nouveaux utilisateurs
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();