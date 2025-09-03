 --- Brute ---

 je veux que tu m'ecris un prompt complet que je vais donner a github copilot de mon vscode qui va analyse toute ma code base, et me donner une structure comlet d'un base de donnees que je dois implementer, (entite, relation, attribut et autre) sachant que je vais le faire avec supabase, donc pense aussi au polities de supabase, dit lui aussi parmie mes fonctionnalite il y a aussi corbeille, parametre et parking et check-list (qui est une liste quon peut cree des trucs a check). n'oublie pas que dans mon appli il faut cree une entreprise (agence) est les donnees de chaque agence et totalement isole des autres, il doit avoir aussi un systeme de role (admin, chaufeur/controlleur, gestionnaire), le admin celui qui creais l'entreprise sur l'appli a toute les acces et c'est lui qui va donner des access au autres. dans le prompt ajout que il trouvera dans les fichiers md qui sont a la racine du projet, les differents champs que j'aurai besoin peut etre pour chque table. dit lui qu'il doit me guider etapes par etapes a cree toutes ses table sur supabase ainsi que les policies supabase et les differents configuration.

 --- Good ---


Tu es un assistant expert en bases de données PostgreSQL et en déploiement sur Supabase.
Ta tâche : **analyser automatiquement toute la codebase ouverte dans VS Code** (tous les dossiers `src`, `server`, `api`, `routes`, `models`, composants frontend, fichiers backend, et tous les `.md` à la racine) et **générer une proposition complète prête à déployer** d'une base de données PostgreSQL adaptée à cette application.

Contraintes et exigences fonctionnelles (à prendre en compte impérativement) :
- L'application est multi-agence : il faut que **les données de chaque agence (entreprise)** soient **totalement isolées** des autres. Propose la stratégie recommandée (option 1 recommandée) et fournis la mise en œuvre concrète :
  - **Option recommandée (single DB + multi-tenant)** : colonne `agency_id UUID` sur toutes les tables + Row Level Security (RLS) strict avec fonctions `is_member_of_agency(...)` et `user_has_role(...)`.
  - Donne aussi une note courte sur l'option multi-schema (quand la recommander).
- Roles : prévoir `admin` (créateur de l'agence — a tous les droits pour son agence), `chauffeur`/`controleur` (peuvent appartenir à la même personne ou distincts), `gestionnaire`. L’admin peut créer l'agence et attribuer des rôles (par membership).
- Fonctionnalités spécifiques à prévoir : **corbeille (trash)**, **paramètre (settings)**, **parking**, **check-list** (création de checklist et items à cocher). Implémente soft-delete + mécanisme de restauration pour la corbeille.
- Tu dois **lire les fichiers `.md` à la racine** : si des champs sont listés dans ces MD, intègre-les comme suggestions pour les tables correspondantes.
- Génère tout en français clair et concis, et fournis des exemples pratiques.

Livrables demandés (génère chacun) :
1. **Résumé des entités** (liste courte) : pour chaque entité => nom de la table, colonne clé(s), type recommandé, relations principales, contraintes importantes (unique/index), et pourquoi.
2. **Fichiers SQL de migration** (prêts à coller dans Supabase SQL Editor ou à utiliser via supabase CLI) :
   - `00_extensions.sql` (ex. `pgcrypto`),
   - `01_agencies.sql`,
   - `02_users_memberships.sql`,
   - `03_vehicles.sql`,
   - `04_parking.sql`,
   - `05_checklists.sql`,
   - `06_payments_recettes.sql`,
   - `07_settings.sql`,
   - `08_attachments.sql`,
   - `09_audit_logs.sql`,
   - etc.
   Chaque fichier : `CREATE TABLE`, `PRIMARY KEY`, `FOREIGN KEYS`, `DEFAULTs`, `UNIQUE` et `INDEX` utiles.
   Utilise `UUID` PKs par défaut (`DEFAULT gen_random_uuid()`), champs `created_at`, `updated_at`, `created_by`, `deleted_at`.
3. **Policies RLS** : pour chaque table active (au minimum : agencies, users, memberships, vehicles, parking, checklists, payments, settings, attachments) :
   - `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`
   - fonctions helper SQL (`is_member_of_agency(agency_id)`, `user_has_role(role, agency_id)`) et exemples de `CREATE POLICY` pour `SELECT`, `INSERT`, `UPDATE`, `DELETE` (avec `USING` et `WITH CHECK`).
   - politique stricte pour `memberships` : seule un `admin` de l'agence peut créer/supprimer/mettre à jour des memberships.
   - exemples explicites d’expressions (utiliser `auth.uid()` pour l’utilisateur courant).
4. **Stratégie de stockage (Supabase Storage)** :
   - buckets recommandés (ex. `agency-assets`), convention de chemin `agency/{agency_id}/{...}` ;
   - recommandation pour accès : `private` buckets + génération d’URL signée côté serveur ou via fonction Edge qui vérifie RLS/roles.
5. **Guide pas-à-pas pour déployer sur Supabase** (commandes / actions) :
   - activer extensions si nécessaire,
   - importer les fichiers SQL dans SQL Editor ou via `supabase migrations` (donner exemple de commandes génériques),
   - activer RLS et ajouter policies,
   - créer fonctions helper,
   - créer buckets et règles d’accès,
   - short checklist pour tests (création d'agence, création user, assign role, test SELECT/INSERT via JWT).
6. **Scénarios de test (curl / httpie / Postman)** : 6 exemples concrets pour vérifier RLS (ex. user A (admin de agence X) peut CRUD sur X mais pas Y; chauffeur peut créer checklists pour son agency; non-membre n’a aucun accès).
7. **Mapping code → tables** : fichier `db-mapping.md` listant pour chaque table les fichiers / routes / composants analysés qui justifient la présence de la table et suggestions de champs trouvés dans `.md`.
8. **Plan d’évolution & notes de sécurité** : indices sur indexation, backup, gestion des clés service_role, et précautions (ne pas exposer service_role côté client).

Contraintes techniques SQL/Postgres à respecter :
- Utiliser `CREATE EXTENSION IF NOT EXISTS pgcrypto;` puis `DEFAULT gen_random_uuid()` pour les UUID.
- Champs timestamp en `timestamptz` avec `DEFAULT now()`.
- Prévoir `UNIQUE (agency_id, some_field)` si champ doit être unique par agence (ex : plaque véhicule).
- Soft delete : `deleted_at timestamptz DEFAULT NULL` + vues utiles (`CREATE VIEW public.active_vehicles AS SELECT * FROM vehicles WHERE deleted_at IS NULL;`).
- Pour RLS, privilégier fonctions stable SQL (`LANGUAGE sql STABLE`) pour checks.
- Fournis des exemples de `WITH CHECK` corrects pour INSERT/UPDATE.

Format de sortie attendu (ordre) :
1. Résumé des entités (quelques lignes)
2. Contenu d’exemple d’un fichier SQL de migration complet (fournis 2 fichiers complets en exemple : `01_agencies.sql` et `03_vehicles.sql`)
3. Exemple complet d’un fichier de policies (`supabase-policies.sql`) avec fonctions helper et au moins 6 policies différentes (users, memberships, agencies, vehicles, checklists, attachments)
4. Guide pas-à-pas (10 à 15 étapes) pour appliquer tout ceci sur Supabase (SQL Editor + Storage)
5. 6 requêtes de test (curl) prêtes à exécuter
6. Liste de fichiers à ajouter dans le repo (noms + brève description) : `db-schema.sql`, `supabase-policies.sql`, `db-mapping.md`, `supabase-setup.md`, `tests/rbac-tests.http`.
7. Bref plan d’évolution & recommandations de sécurité.

Règles de comportement pendant l’analyse :
- Lis automatiquement les `.md` à la racine et incorpore les champs proposés.
- Si une entité n'est pas clairement déduite du code, propose une version minimaliste et marque-la comme `suggestion` avec la raison.
- Si tu as des choix (ex : tenant via `agency_id` vs schema), expose brièvement les avantages/inconvénients et choisis par défaut l’option RLS + `agency_id`.
- N’écris pas de code backend qui utilise la `service_role` côté client. Indique comment et où stocker les clés sensibles (env côté serveur).
- Fournis des exemples concrets et succincts (pas de verbiage inutile).

Commence maintenant. Réponds strictement dans l’ordre demandé (1 → 7). Sois concis, clair, et génère les deux fichiers SQL d’exemple complets demandés (`01_agencies.sql`, `03_vehicles.sql`) et un extrait du fichier `supabase-policies.sql` (avec fonctions helper et policies). Puis fournis le guide pas-à-pas et les tests curl. Merci.
