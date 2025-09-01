// create-tables.js
import { supabase } from './src/services/config/supabaseClient.js'

const createTables = async () => {
  console.log('Création des tables...')

  try {
    // Création de la table users
    console.log('Création de la table users...')
    const { error: usersError } = await supabase.rpc('exec_sql', {
      query_text: `
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
      `,
    })

    if (usersError) {
      throw new Error(`Erreur lors de la création de la table users: ${usersError.message}`)
    }
    console.log('Table users créée avec succès')

    // Création de la table agencies
    console.log('Création de la table agencies...')
    const { error: agenciesError } = await supabase.rpc('exec_sql', {
      query_text: `
        CREATE TABLE IF NOT EXISTS public.agencies (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255) NOT NULL,
            code VARCHAR(50),
            type VARCHAR(50) DEFAULT 'headquarters',
            status VARCHAR(20) DEFAULT 'active',
            country VARCHAR(2),
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
      `,
    })

    if (agenciesError) {
      throw new Error(`Erreur lors de la création de la table agencies: ${agenciesError.message}`)
    }
    console.log('Table agencies créée avec succès')

    // Création de la table memberships
    console.log('Création de la table memberships...')
    const { error: membershipsError } = await supabase.rpc('exec_sql', {
      query_text: `
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
      `,
    })

    if (membershipsError) {
      throw new Error(
        `Erreur lors de la création de la table memberships: ${membershipsError.message}`,
      )
    }
    console.log('Table memberships créée avec succès')

    // Création de la fonction de mise à jour de la date
    console.log('Création de la fonction update_updated_at...')
    const { error: functionError } = await supabase.rpc('exec_sql', {
      query_text: `
        CREATE OR REPLACE FUNCTION update_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `,
    })

    if (functionError) {
      throw new Error(
        `Erreur lors de la création de la fonction update_updated_at: ${functionError.message}`,
      )
    }
    console.log('Fonction update_updated_at créée avec succès')

    // Création des triggers
    console.log('Création des triggers...')
    const { error: triggersError } = await supabase.rpc('exec_sql', {
      query_text: `
        CREATE TRIGGER set_updated_at_agencies
        BEFORE UPDATE ON public.agencies
        FOR EACH ROW EXECUTE FUNCTION update_updated_at();

        CREATE TRIGGER set_updated_at_users
        BEFORE UPDATE ON public.users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at();

        CREATE TRIGGER set_updated_at_memberships
        BEFORE UPDATE ON public.memberships
        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
      `,
    })

    if (triggersError) {
      throw new Error(`Erreur lors de la création des triggers: ${triggersError.message}`)
    }
    console.log('Triggers créés avec succès')

    console.log('Toutes les tables ont été créées avec succès !')
  } catch (error) {
    console.error('Erreur lors de la création des tables:', error)
  }
}

// Exécuter le script
createTables()
