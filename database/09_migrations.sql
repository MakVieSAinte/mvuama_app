-- 09_migrations.sql
-- Corrections de schéma pour aligner la base existante sans réappliquer tout le déploiement

-- 1) Ajouter user_id aux chauffeurs (drivers) si absent
ALTER TABLE public.drivers
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS drivers_user_id_idx ON public.drivers(user_id);

-- 2) Corriger la FK vehicles.chauffeur_id => public.drivers(id)
DO $$
BEGIN
  -- Supprimer la contrainte existante si elle pointe ailleurs
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_schema = 'public' AND table_name = 'vehicles' AND constraint_name = 'vehicles_chauffeur_id_fkey'
  ) THEN
    ALTER TABLE public.vehicles DROP CONSTRAINT vehicles_chauffeur_id_fkey;
  END IF;
END $$;

ALTER TABLE public.vehicles
  ADD CONSTRAINT vehicles_chauffeur_id_fkey FOREIGN KEY (chauffeur_id) REFERENCES public.drivers(id) ON DELETE SET NULL;

-- 3) Harmoniser d'éventuelles colonnes FR/EN (à exécuter uniquement si nécessaires)
-- Exemple: si votre table maintenances avait des colonnes en EN, renommez-les:
-- ALTER TABLE public.maintenances RENAME COLUMN maintenance_type TO type;
-- ALTER TABLE public.maintenances RENAME COLUMN scheduled_date TO date_prevue;
-- ALTER TABLE public.maintenances RENAME COLUMN status TO statut;
-- ALTER TABLE public.maintenances RENAME COLUMN cost TO cout;

-- Idem pour checklists/checklist_items si besoin:
-- ALTER TABLE public.checklists RENAME COLUMN checklist_type TO type;
-- ALTER TABLE public.checklists RENAME COLUMN status TO statut;
-- ALTER TABLE public.checklist_items RENAME COLUMN item_name TO nom;
-- ALTER TABLE public.checklist_items RENAME COLUMN status TO verifie; -- attention: convertir en BOOLEAN si requis
-- ALTER TABLE public.checklist_items RENAME COLUMN comments TO commentaire;

-- NB: Les renommages ci-dessus dépendent de votre état réel de base; vérifiez avant d'exécuter.
