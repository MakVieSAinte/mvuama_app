-- 07_storage.sql
-- Configuration du stockage Supabase pour les fichiers et images

-- Création du bucket de stockage principal pour les assets de l'agence
INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES ('agency-assets', 'Agency Assets', false, false);

-- Politique pour permettre à tous les utilisateurs de lire les fichiers de leur agence
CREATE POLICY "Les membres peuvent lire les fichiers de leur agence"
ON storage.objects FOR SELECT
USING (
  -- Vérifie si l'utilisateur est membre de l'agence mentionnée dans le chemin du fichier
  -- Format du chemin : agency_id/type/file
  EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = auth.uid()
    AND m.agency_id::text = SPLIT_PART(storage.objects.name, '/', 1)
    AND m.deleted_at IS NULL
  )
);

-- Politique pour permettre aux administrateurs et gestionnaires de créer des fichiers pour leur agence
CREATE POLICY "Admin et gestionnaires peuvent téléverser des fichiers pour leur agence"
ON storage.objects FOR INSERT
WITH CHECK (
  -- Vérifie si l'utilisateur est admin/gestionnaire de l'agence mentionnée dans le chemin
  EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = auth.uid()
    AND m.agency_id::text = SPLIT_PART(storage.objects.name, '/', 1)
    AND m.role IN ('admin', 'gestionnaire')
    AND m.deleted_at IS NULL
  )
);

-- Politique pour permettre aux administrateurs et gestionnaires de mettre à jour des fichiers
CREATE POLICY "Admin et gestionnaires peuvent mettre à jour des fichiers de leur agence"
ON storage.objects FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = auth.uid()
    AND m.agency_id::text = SPLIT_PART(storage.objects.name, '/', 1)
    AND m.role IN ('admin', 'gestionnaire')
    AND m.deleted_at IS NULL
  )
);

-- Politique pour permettre aux administrateurs et gestionnaires de supprimer des fichiers
CREATE POLICY "Admin et gestionnaires peuvent supprimer des fichiers de leur agence"
ON storage.objects FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = auth.uid()
    AND m.agency_id::text = SPLIT_PART(storage.objects.name, '/', 1)
    AND m.role IN ('admin', 'gestionnaire')
    AND m.deleted_at IS NULL
  )
);
