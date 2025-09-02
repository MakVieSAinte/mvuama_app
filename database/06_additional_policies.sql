-- 06_additional_policies.sql
-- Politiques RLS pour les tables chauffeurs, paiements et recettes

-- Politiques pour la table drivers
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- Les membres peuvent voir les chauffeurs de leurs agences
CREATE POLICY "Les membres peuvent voir les chauffeurs" 
ON public.drivers FOR SELECT
USING (
  is_member_of_agency(agency_id)
);

-- Seuls admin et gestionnaire peuvent créer des chauffeurs
CREATE POLICY "Seuls admin et gestionnaire peuvent créer des chauffeurs" 
ON public.drivers FOR INSERT
WITH CHECK (
  has_management_role(agency_id)
);

-- Seuls admin et gestionnaire peuvent modifier des chauffeurs
CREATE POLICY "Seuls admin et gestionnaire peuvent modifier des chauffeurs" 
ON public.drivers FOR UPDATE
USING (
  has_management_role(agency_id)
)
WITH CHECK (
  has_management_role(agency_id)
);

-- Seuls admin et gestionnaire peuvent supprimer des chauffeurs
CREATE POLICY "Seuls admin et gestionnaire peuvent supprimer des chauffeurs" 
ON public.drivers FOR DELETE
USING (
  has_management_role(agency_id)
);

-- Politiques pour la table driver_incidents
ALTER TABLE public.driver_incidents ENABLE ROW LEVEL SECURITY;

-- Les membres peuvent voir les incidents des chauffeurs de leurs agences
CREATE POLICY "Les membres peuvent voir les incidents" 
ON public.driver_incidents FOR SELECT
USING (
  is_member_of_agency(agency_id)
);

-- Seuls admin et gestionnaire peuvent créer des incidents
CREATE POLICY "Seuls admin et gestionnaire peuvent créer des incidents" 
ON public.driver_incidents FOR INSERT
WITH CHECK (
  has_management_role(agency_id)
);

-- Seuls admin, gestionnaire ou créateur peuvent modifier des incidents
CREATE POLICY "Seuls admin, gestionnaire ou créateur peuvent modifier des incidents" 
ON public.driver_incidents FOR UPDATE
USING (
  has_management_role(agency_id) OR is_record_creator()
)
WITH CHECK (
  has_management_role(agency_id) OR is_record_creator()
);

-- Seuls admin et gestionnaire peuvent supprimer des incidents
CREATE POLICY "Seuls admin et gestionnaire peuvent supprimer des incidents" 
ON public.driver_incidents FOR DELETE
USING (
  has_management_role(agency_id)
);

-- Politiques pour la table payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Les membres peuvent voir les paiements de leurs agences
CREATE POLICY "Les membres peuvent voir les paiements" 
ON public.payments FOR SELECT
USING (
  is_member_of_agency(agency_id)
);

-- Seuls admin et gestionnaire peuvent créer des paiements
CREATE POLICY "Seuls admin et gestionnaire peuvent créer des paiements" 
ON public.payments FOR INSERT
WITH CHECK (
  has_management_role(agency_id)
);

-- Seuls admin, gestionnaire ou créateur peuvent modifier des paiements
CREATE POLICY "Seuls admin, gestionnaire ou créateur peuvent modifier des paiements" 
ON public.payments FOR UPDATE
USING (
  has_management_role(agency_id) OR is_record_creator()
)
WITH CHECK (
  has_management_role(agency_id) OR is_record_creator()
);

-- Seuls admin et gestionnaire peuvent supprimer des paiements
CREATE POLICY "Seuls admin et gestionnaire peuvent supprimer des paiements" 
ON public.payments FOR DELETE
USING (
  has_management_role(agency_id)
);

-- Politiques pour la table expense_categories
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;

-- Les membres peuvent voir les catégories de dépenses de leurs agences
CREATE POLICY "Les membres peuvent voir les catégories de dépenses" 
ON public.expense_categories FOR SELECT
USING (
  is_member_of_agency(agency_id)
);

-- Seuls admin et gestionnaire peuvent gérer les catégories de dépenses
CREATE POLICY "Seuls admin et gestionnaire peuvent gérer les catégories de dépenses" 
ON public.expense_categories FOR ALL
USING (
  has_management_role(agency_id)
)
WITH CHECK (
  has_management_role(agency_id)
);

-- Politiques pour la table receipts
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- Les membres peuvent voir les recettes de leurs agences
CREATE POLICY "Les membres peuvent voir les recettes" 
ON public.receipts FOR SELECT
USING (
  is_member_of_agency(agency_id)
);

-- Tous les membres peuvent créer des recettes
CREATE POLICY "Tous les membres peuvent créer des recettes" 
ON public.receipts FOR INSERT
WITH CHECK (
  is_member_of_agency(agency_id)
);

-- Seuls admin, gestionnaire, créateur ou chauffeur concerné peuvent modifier des recettes
CREATE POLICY "Seuls admin, gestionnaire, créateur ou chauffeur concerné peuvent modifier des recettes" 
ON public.receipts FOR UPDATE
USING (
  has_management_role(agency_id) OR is_record_creator() OR 
  (driver_id = (SELECT id FROM public.drivers WHERE user_id = auth.uid() LIMIT 1))
)
WITH CHECK (
  has_management_role(agency_id) OR is_record_creator() OR 
  (driver_id = (SELECT id FROM public.drivers WHERE user_id = auth.uid() LIMIT 1))
);

-- Seuls admin et gestionnaire peuvent supprimer des recettes
CREATE POLICY "Seuls admin et gestionnaire peuvent supprimer des recettes" 
ON public.receipts FOR DELETE
USING (
  has_management_role(agency_id)
);

-- Politiques pour la table revenue_targets
ALTER TABLE public.revenue_targets ENABLE ROW LEVEL SECURITY;

-- Les membres peuvent voir les objectifs de recettes
CREATE POLICY "Les membres peuvent voir les objectifs de recettes" 
ON public.revenue_targets FOR SELECT
USING (
  is_member_of_agency(agency_id)
);

-- Seuls admin et gestionnaire peuvent gérer les objectifs de recettes
CREATE POLICY "Seuls admin et gestionnaire peuvent gérer les objectifs de recettes" 
ON public.revenue_targets FOR ALL
USING (
  has_management_role(agency_id)
)
WITH CHECK (
  has_management_role(agency_id)
);
