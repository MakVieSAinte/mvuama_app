# Copilot Instructions

## Règles générales

- Code lisible, typé, documenté (JSDoc pour fonctions, interfaces, composants, endpoints).
- Respecter la structure des dossiers : composants, vues, router, store, assets, types, composables, utils (frontend) ; controllers, models, routes, middleware, config, types (backend), formBuilder, services, interfaces, libs.
- Ne jamais inclure de secrets, mots de passe, tokens, clés ou credentials dans le code.
- Fichiers à ignorer : .env\*, node_modules, dist, .git, coverage, .nyc_output.

## Langue et commentaires

- Tous les noms de fonctions, composants, variables, types, etc. doivent être en anglais simple.
- Les commentaires doivent être rédigés en français, brefs mais très explicatifs et humains.

## Conventions de nommage

- Composants, interfaces, types, modèles : PascalCase
- Fonctions, variables, routes, contrôleurs : camelCase
- Constantes : UPPER_CASE
- Fichiers composants : PascalCase, routes/controllers : camelCase

## Interfaces et modèles de données

- Interfaces de modèle: préfixées par "I", ex: `IVehicleModel`
- Interfaces de validation: préfixées par "I" et suffixées par "Builder", ex: `IVehicleBuilder`
- Les champs obligatoires sont définis sans modificateur optionnel
- Les champs optionnels sont définis avec `?: type | null`
- Champs de métadonnées standards: `id`, `created_at`, `updated_at`, `created_by`, `deleted_at`

## Architecture et relations entre composants

### Interface ↔ FormBuilder ↔ Service

- Les interfaces (dans `/interfaces`) définissent la structure des données et des validations
- Les FormBuilder (dans `/formBuilder`) implémentent la validation des formulaires
- Les services (dans `/services`) gèrent les interactions avec la base de données Supabase

### Validation de données

- Toutes les validations utilisent la classe `Validator` centralisée dans `/services/libs/validator.ts`
- Les règles de validation sont définies par des méthodes statiques dans cette classe
- Chaque FormBuilder doit inclure des flags d'erreur pour chaque champ validé

## FormBuilder

- Chaque formulaire est une classe dans le répertoire `formBuilder`
- Nommage des classes: nomDeEntité + "Form", ex: `VehiculeForm`
- Propriétés regroupées par: obligatoires (avec erreurs), puis optionnelles
- Chaque champ a un flag d'erreur associé: `error` + NomDuChamp
- Méthodes setter en chaînage avec retour de `this`
- Pattern d'utilisation: `form.setField(value).setField2(value2)`
- Méthode `builderXXXForm()` retourne l'objet de validation (`IXXXBuilder`)
- Méthode `getXXXData()` retourne un objet prêt pour l'API/BDD

## Services

- Classes de service dans `services/[domaine]/`
- Interaction avec Supabase via le client importé de `../config/supabaseClient`
- Méthodes async pour les opérations CRUD
- Gestion des erreurs avec try/catch
- Nommage des classes: nom de l'entité + "Service", ex: `VehicleService`

## Vue.js

- Composants en PascalCase, structure : name, components, data, props, computed, watch, methods, created, mounted.
- Indentation template/script/style : 2 espaces.
- Privilégier Options API. Il est strictement interdit d'utiliser le mode setup dans les balises <script> des composants Vue (pas de <script setup>).
- Utiliser Tailwind avec classes triées alphabétiquement.

## TypeScript

- Mode strict non obligatoire, noImplicitAny désactivé, allowJs autorisé.
- Le code dois toujours être assez simple et facilement maintenable.

## Sécurité

- Bloquer tout code ou fichier contenant des patterns sensibles (voir plus haut).
- Sensible aux mots-clés : password, secret, key, token, auth.

## Documentation

- Documenter composants, interfaces, fonctions, endpoints API (JSDoc).

## Tests

- Tests requis pour : composants, endpoints API, utils.
- Fichiers de test : \_.spec.ts, fonctions de test : should\_\_

## Performance

- Taille max fichier : 500kb, ligne max : 100 caractères, complexité max : 15.

## Accessibilité

- Toujours penser accessibilité (ARIA, HTML sémantique).

## Spécificités projet

- Utiliser Supabase pour la base de données
- Validation centralisée des formulaires via la classe `Validator` dans `/services/libs/validator.ts`
- Routes nommées de façon unique et logique
- Composants Vue organisés par domaine métier
- Préférer les interfaces génériques pour la réutilisabilité
- Respecter le pattern Interface ↔ FormBuilder ↔ Service

Merci d'utiliser Copilot de façon responsable et collaborative !
