-- 00_deploy_all.sql
-- Script principal pour déployer toute la base de données dans le bon ordre

-- Extensions
\i '00_extensions.sql'

-- Fonctions d'aide pour RLS
\i '00_supabase-policies.sql'

-- Tables principales
\i '01_agencies.sql'

-- Tables des chauffeurs
\i '02_drivers.sql'

-- Tables des véhicules et maintenances
\i '03_vehicles.sql'

-- Tables des paiements
\i '04_payments.sql'

-- Tables des recettes
\i '05_receipts.sql'

-- Politiques RLS additionnelles
\i '06_additional_policies.sql'

-- Configuration du stockage
\i '07_storage.sql'

-- Données de test (optionnelles - décommentez pour les utiliser)
-- \i '08_test_data.sql'

-- Vérification finale
SELECT 'Base de données déployée avec succès !' as message;
