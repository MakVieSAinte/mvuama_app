# Guidelines du projet MVOUMA

## 1. Structure du projet

- **src/** : Contient tout le code source de l’application Vue 3 (TypeScript).
  - **components/** : Composants réutilisables, organisés par domaine (chauffeurs, checklist, dashboard, etc.).
  - **composables/** : Fonctions réutilisables (hooks Vue 3).
  - **data/** : Données mockées pour le développement.
  - **formBuilder/** : Logique de génération de formulaires dynamiques.
  - **interfaces/** et **types/** : Définition des interfaces et types TypeScript pour la robustesse du code.
  - **lib/** : Fonctions utilitaires génériques.
  - **locales/** : Fichiers de traduction (i18n).
  - **router/** : Configuration du routeur Vue.
  - **services/** : Gestion des appels API, logique métier, intégration Supabase (à centraliser ici).
  - **stores/** : Stores Pinia pour la gestion d’état globale.
  - **views/** : Vues principales de l’application (une par page).

## 2. Bonnes pratiques générales

- **TypeScript** : Toujours typer les props, les retours de fonctions, et les objets manipulés.
- **Composants** : Privilégier des composants petits, spécialisés et réutilisables.
- **Dossiers** : Organiser les composants et services par domaine métier.
- **Nommage** : Utiliser l’anglais pour le code, le français pour l’UI (sauf exceptions métier).
- **Commentaires** : Documenter les fonctions complexes et les choix techniques importants.
- **Sécurité** : Ne jamais exposer de secrets ou de clés sensibles côté client.

## 3. Intégration Supabase

- Installer `@supabase/supabase-js` et centraliser l’initialisation dans `src/services/supabaseClient.ts`.
- Utiliser des services ou des composables pour interagir avec Supabase (CRUD, auth, etc.).
- Toujours gérer les erreurs et afficher des messages clairs à l’utilisateur.
- Utiliser les types générés par Supabase pour sécuriser les accès aux données.

## 4. Gestion d’état

- Utiliser Pinia pour la gestion d’état globale (stores dans `src/stores`).
- Garder les stores simples, découper par domaine métier.
- Ne pas stocker de données sensibles dans le store.

## 5. UI/UX

- Utiliser les composants UI du dossier `ui/` pour garantir la cohérence visuelle.
- Respecter la charte graphique définie dans `assets/base.css` et `assets/main.css`.
- Privilégier l’accessibilité (labels, contrastes, navigation clavier).

## 6. Internationalisation

- Centraliser toutes les chaînes de caractères dans `src/locales/fr.json` et `en.json`.
- Utiliser un composable ou un plugin i18n pour la traduction dynamique.

## 7. Tests

- Écrire des tests E2E avec Playwright (voir `e2e/vue.spec.ts`).
- Ajouter des tests unitaires pour les fonctions critiques (composables, services).

## 8. SQL & Backend

- Les scripts SQL sont versionnés à la racine pour la gestion du schéma et des politiques Supabase.
- Documenter chaque script SQL (but, impact, dépendances).

## 9. Déploiement & Sécurité

- Ne jamais commiter de clés privées ou de secrets.
- Utiliser des variables d’environnement pour les clés publiques.
- Documenter la procédure de déploiement dans le README.

## 10. Documentation

- Tenir à jour ce fichier et le README.
- Documenter chaque module métier (chauffeurs, véhicules, paiements, etc.) dans les fichiers `info*.md`.

---

**Résumé** :
Ce projet est conçu pour être modulaire, typé, sécurisé et maintenable. Respecte ces guidelines pour garantir la qualité, la sécurité et la pérennité de l’application Mopayo.
