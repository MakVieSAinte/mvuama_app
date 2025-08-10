# Base de données Mopayo - Gestion de flotte

Ce dossier contient les scripts SQL pour créer et configurer la base de données PostgreSQL de l'application Mopayo Gestion de Flotte sur Supabase.

## Structure des fichiers

- `00_deploy_all.sql` - Script principal pour déployer toute la base de données
- `00_extensions.sql` - Création des extensions PostgreSQL nécessaires
- `00_supabase-policies.sql` - Fonctions d'aide pour les politiques RLS
- `01_agencies.sql` - Tables de base (agencies, users, memberships)
- `02_drivers.sql` - Tables liées aux chauffeurs
- `03_vehicles.sql` - Tables liées aux véhicules et à la maintenance
- `04_payments.sql` - Tables liées aux paiements
- `05_receipts.sql` - Tables liées aux recettes
- `06_additional_policies.sql` - Politiques RLS pour les tables additionnelles
- `07_storage.sql` - Configuration du stockage pour les fichiers
- `08_test_data.sql` - Données de test (optionnelles)

## Déploiement

### Option 1 : Déploiement complet

1. Connectez-vous à votre projet Supabase
2. Allez dans la section "SQL Editor"
3. Copiez-collez le contenu du fichier `00_deploy_all.sql`
4. Si vous souhaitez inclure les données de test, décommentez la ligne `-- \i '08_test_data.sql'`
5. Exécutez le script

### Option 2 : Déploiement étape par étape

Exécutez les scripts dans cet ordre :

1. `00_extensions.sql` - Création des extensions
2. `00_supabase-policies.sql` - Fonctions d'aide pour RLS
3. `01_agencies.sql` - Tables de base
4. `02_drivers.sql` - Tables des chauffeurs
5. `03_vehicles.sql` - Tables des véhicules
6. `04_payments.sql` - Tables des paiements
7. `05_receipts.sql` - Tables des recettes
8. `06_additional_policies.sql` - Politiques RLS additionnelles
9. `07_storage.sql` - Configuration du stockage
10. (Optionnel) `08_test_data.sql` - Données de test

## Remarques importantes

- **Utilisateurs de test** : Les données de test dans `08_test_data.sql` contiennent des UUID d'utilisateurs fictifs. Pour que cela fonctionne, vous devez créer des utilisateurs dans Supabase Auth et remplacer les UUID dans le script par les vrais UUID des utilisateurs créés.

- **Sécurité** : Toutes les tables sont protégées par Row Level Security (RLS) pour assurer l'isolation des données entre les agences.

- **Structure Multi-tenant** : Chaque enregistrement contient un `agency_id` qui est utilisé pour la sécurité et l'isolation des données.

- **Stockage** : Un bucket de stockage nommé "agency-assets" est créé avec des politiques de sécurité basées sur le chemin du fichier. Format du chemin : `agency_id/type/fichier`.

## Roles et permissions

Le système utilise quatre rôles principaux :

- **admin** : Accès complet à toutes les données de son agence
- **gestionnaire** : Peut gérer la plupart des données de l'agence
- **chauffeur** : Accès limité, principalement pour les recettes et les checklists
- **utilisateur** : Accès en lecture à la plupart des données de l'agence

Les permissions sont gérées via les fonctions RLS :

- `is_member_of_agency(agency_id)` - Vérifie si l'utilisateur est membre de l'agence
- `user_has_role(role, agency_id)` - Vérifie si l'utilisateur a un rôle spécifique
- `has_management_role(agency_id)` - Vérifie si l'utilisateur a un rôle d'administration
- `is_record_creator()` - Vérifie si l'utilisateur est le créateur de l'enregistrement

## Support

Pour toute question ou problème, contactez l'équipe de développement Mopayo.
