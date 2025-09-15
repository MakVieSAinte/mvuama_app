c

-- Ajout des contraintes pour la table enterprises
ALTER TABLE public.enterprises ADD CONSTRAINT enterprises_email_check CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$');

-- Création d'un déclencheur pour mettre à jour la date de mise à jour
CREATE OR REPLACE FUNCTION update_enterprises_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enterprises_updated_at
BEFORE UPDATE ON public.enterprises
FOR EACH ROW
EXECUTE PROCEDURE update_enterprises_updated_at();

-- Création de la table "agencies"
CREATE TABLE IF NOT EXISTS public.agencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  enterprise_id UUID REFERENCES public.enterprises(id) NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- active, closed, suspended
  country VARCHAR(100) NOT NULL,
  city VARCHAR(100),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  description TEXT,
  manager_name VARCHAR(255),
  manager_position VARCHAR(255),
  manager_phone VARCHAR(20),
  manager_email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Ajout des contraintes pour la table agencies
ALTER TABLE public.agencies ADD CONSTRAINT agencies_email_check CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$');
ALTER TABLE public.agencies ADD CONSTRAINT agencies_status_check CHECK (status IN ('active', 'closed', 'suspended'));

-- Création d'un déclencheur pour mettre à jour la date de mise à jour des agences
CREATE TRIGGER agencies_updated_at
BEFORE UPDATE ON public.agencies
FOR EACH ROW
EXECUTE PROCEDURE update_enterprises_updated_at();

-- Ajout des politiques Row Level Security (RLS) pour la table enterprises
ALTER TABLE public.enterprises ENABLE ROW LEVEL SECURITY;

CREATE POLICY enterprises_owner_insert_policy ON public.enterprises
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY enterprises_owner_select_policy ON public.enterprises
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY enterprises_owner_update_policy ON public.enterprises
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY enterprises_owner_delete_policy ON public.enterprises
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = created_by);

-- Ajout des politiques Row Level Security (RLS) pour la table agencies
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY agencies_owner_insert_policy ON public.agencies
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Politique permettant aux propriétaires d'entreprise de voir leurs agences
CREATE POLICY agencies_enterprise_owner_select_policy ON public.agencies
  FOR SELECT 
  TO authenticated
  USING (
    auth.uid() = created_by OR 
    auth.uid() IN (
      SELECT created_by FROM public.enterprises 
      WHERE id = enterprise_id
    )
  );

-- Politique permettant aux propriétaires d'entreprise de mettre à jour leurs agences
CREATE POLICY agencies_enterprise_owner_update_policy ON public.agencies
  FOR UPDATE 
  TO authenticated
  USING (
    auth.uid() = created_by OR 
    auth.uid() IN (
      SELECT created_by FROM public.enterprises 
      WHERE id = enterprise_id
    )
  );

-- Politique permettant aux propriétaires d'entreprise de supprimer leurs agences
CREATE POLICY agencies_enterprise_owner_delete_policy ON public.agencies
  FOR DELETE 
  TO authenticated
  USING (
    auth.uid() = created_by OR 
    auth.uid() IN (
      SELECT created_by FROM public.enterprises 
      WHERE id = enterprise_id
    )
  );

-- Indices pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_enterprises_created_by ON public.enterprises(created_by);
CREATE INDEX IF NOT EXISTS idx_agencies_enterprise_id ON public.agencies(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_agencies_created_by ON public.agencies(created_by);