-- supabase-policies.sql
-- Fonctions helper pour les RLS policies

-- Fonction pour vérifier si un utilisateur est membre d'une agence (quelque soit le rôle)
CREATE OR REPLACE FUNCTION public.is_member_of_agency(agency_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.memberships m
    WHERE m.agency_id = $1 
    AND m.user_id = auth.uid() 
    AND m.deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Fonction pour vérifier si un utilisateur a un rôle spécifique dans une agence
CREATE OR REPLACE FUNCTION public.user_has_role(role TEXT, agency_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.memberships m
    WHERE m.agency_id = $1 
    AND m.user_id = auth.uid() 
    AND m.role = $2
    AND m.deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Fonction pour vérifier si l'utilisateur est l'auteur de l'enregistrement
CREATE OR REPLACE FUNCTION public.is_record_creator()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() = created_by;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Fonction pour vérifier si l'utilisateur a un rôle admin ou gestionnaire
CREATE OR REPLACE FUNCTION public.has_management_role(agency_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.memberships m
    WHERE m.agency_id = $1 
    AND m.user_id = auth.uid() 
    AND m.role IN ('admin', 'gestionnaire')
    AND m.deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Activation RLS et politiques pour agencies
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;

-- Les membres peuvent voir leurs agences
CREATE POLICY "Les membres peuvent voir leurs agences" 
ON public.agencies FOR SELECT
USING (
  is_member_of_agency(id)
);

-- Seul l'admin peut créer une agence
CREATE POLICY "Seul l'admin peut créer une agence" 
ON public.agencies FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated'
);

-- Seul l'admin de l'agence peut mettre à jour l'agence
CREATE POLICY "Seul l'admin peut mettre à jour l'agence" 
ON public.agencies FOR UPDATE
USING (
  user_has_role('admin', id)
)
WITH CHECK (
  user_has_role('admin', id)
);

-- Seul l'admin peut supprimer son agence (soft-delete)
CREATE POLICY "Seul l'admin peut supprimer son agence" 
ON public.agencies FOR DELETE
USING (
  user_has_role('admin', id)
);

-- Activation RLS et politiques pour users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs ne peuvent voir que les membres de leurs agences
CREATE POLICY "Les utilisateurs ne peuvent voir que les membres de leurs agences" 
ON public.users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.memberships m
    JOIN public.memberships my_m ON my_m.agency_id = m.agency_id
    WHERE m.user_id = public.users.id
    AND my_m.user_id = auth.uid()
  )
);

-- Un utilisateur peut voir et modifier ses propres données
CREATE POLICY "Un utilisateur peut voir et modifier ses propres données" 
ON public.users FOR ALL
USING (
  id = auth.uid()
)
WITH CHECK (
  id = auth.uid()
);

-- Activation RLS et politiques pour memberships
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs ne peuvent voir que les membres de leurs agences
CREATE POLICY "Les utilisateurs ne peuvent voir que les membres de leurs agences" 
ON public.memberships FOR SELECT
USING (
  is_member_of_agency(agency_id)
);

-- Seul l'admin peut ajouter des membres à son agence
CREATE POLICY "Seul l'admin peut ajouter des membres" 
ON public.memberships FOR INSERT
WITH CHECK (
  user_has_role('admin', agency_id) OR
  (auth.uid() = user_id AND NOT EXISTS (
    SELECT 1 FROM public.memberships WHERE agency_id = public.memberships.agency_id
  ))
);

-- Seul l'admin peut modifier les rôles des membres
CREATE POLICY "Seul l'admin peut modifier les membres" 
ON public.memberships FOR UPDATE
USING (
  user_has_role('admin', agency_id)
)
WITH CHECK (
  user_has_role('admin', agency_id)
);

-- Seul l'admin peut supprimer des membres
CREATE POLICY "Seul l'admin peut supprimer des membres" 
ON public.memberships FOR DELETE
USING (
  user_has_role('admin', agency_id)
);

-- Activation RLS et politiques pour vehicles
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Les membres peuvent voir les véhicules de leurs agences
CREATE POLICY "Les membres peuvent voir les véhicules" 
ON public.vehicles FOR SELECT
USING (
  is_member_of_agency(agency_id)
);

-- Seuls admin et gestionnaire peuvent créer des véhicules
CREATE POLICY "Seuls admin et gestionnaire peuvent créer des véhicules" 
ON public.vehicles FOR INSERT
WITH CHECK (
  has_management_role(agency_id)
);

-- Seuls admin et gestionnaire peuvent modifier des véhicules
CREATE POLICY "Seuls admin et gestionnaire peuvent modifier des véhicules" 
ON public.vehicles FOR UPDATE
USING (
  has_management_role(agency_id)
)
WITH CHECK (
  has_management_role(agency_id)
);

-- Seuls admin et gestionnaire peuvent supprimer des véhicules
CREATE POLICY "Seuls admin et gestionnaire peuvent supprimer des véhicules" 
ON public.vehicles FOR DELETE
USING (
  has_management_role(agency_id)
);

-- Activation RLS et politiques pour checklists
ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;

-- Les membres peuvent voir les checklists de leurs agences
CREATE POLICY "Les membres peuvent voir les checklists" 
ON public.checklists FOR SELECT
USING (
  is_member_of_agency(agency_id)
);

-- Tous les membres peuvent créer des checklists pour leurs agences
CREATE POLICY "Les membres peuvent créer des checklists" 
ON public.checklists FOR INSERT
WITH CHECK (
  is_member_of_agency(agency_id)
);

-- Un membre ne peut modifier que les checklists qu'il a créées ou admin/gestionnaire
CREATE POLICY "Seuls créateur ou admin peuvent modifier des checklists" 
ON public.checklists FOR UPDATE
USING (
  is_record_creator() OR has_management_role(agency_id)
)
WITH CHECK (
  is_record_creator() OR has_management_role(agency_id)
);

-- Seuls admin et gestionnaire peuvent supprimer des checklists
CREATE POLICY "Seuls admin et gestionnaire peuvent supprimer des checklists" 
ON public.checklists FOR DELETE
USING (
  has_management_role(agency_id)
);