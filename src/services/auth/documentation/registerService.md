# Documentation du Service d'Inscription

## Vue d'ensemble

Le `RegisterService` est responsable de la gestion du processus d'inscription des nouveaux utilisateurs dans l'application MVUAMA. Il encapsule la logique nécessaire pour créer un compte utilisateur complet, incluant à la fois l'authentification et les données de profil.

## Architecture et conception

Le service suit un modèle orienté objet où chaque instance représente un nouvel utilisateur à enregistrer. Cette approche permet de regrouper de manière cohérente toutes les données d'inscription et les méthodes nécessaires pour traiter ces données.

### Initialisation

```typescript
constructor(
  first_name: string,
  last_name: string,
  email: string,
  country: string,
  currency: string,
  phone_number?: string | null,
  password?: string,
  confirm_password?: string,
)
```

**Description :** Le constructeur initialise une nouvelle instance du service avec les données d'inscription de l'utilisateur.

**Paramètres :**

- **first_name** : Prénom de l'utilisateur
- **last_name** : Nom de famille de l'utilisateur
- **email** : Adresse email (servira d'identifiant)
- **country** : Pays de l'utilisateur
- **currency** : Devise préférée
- **phone_number** : Numéro de téléphone (optionnel)
- **password** : Mot de passe choisi
- **confirm_password** : Confirmation du mot de passe

**Particularités :**

- Les données sont stockées dans les propriétés de l'instance pour être utilisées lors de l'enregistrement
- Les champs optionnels ont des valeurs par défaut appropriées
- La propriété `role` n'est pas initialisée dans le constructeur mais peut être définie ultérieurement

## Fonctionnalités principales

### Enregistrement d'un nouvel utilisateur

```typescript
async save()
```

**Description :** Méthode principale qui crée un nouveau compte utilisateur dans le système.

**Flux d'exécution :**

1. Validation des données essentielles (email et mot de passe)
2. Vérification de la correspondance des mots de passe
3. Création de l'utilisateur dans le système d'authentification Supabase
4. Ajout des informations de profil complètes dans la table `users`

**Processus en détail :**

- **Validation initiale** : Vérifie que l'email et le mot de passe sont fournis
- **Création dans auth** : Utilise `signUp` de Supabase pour créer l'utilisateur de base
- **Configuration de redirection** : Définit l'URL de redirection post-confirmation d'email
- **Stockage de métadonnées** : Inclut les données de profil dans les métadonnées d'authentification
- **Création du profil étendu** : Insère les données complètes dans la table `users` personnalisée

**Gestion des erreurs :**

- Les erreurs de validation sont capturées et renvoyées avec des messages explicites
- Les erreurs d'API Supabase sont également capturées et journalisées
- Un message générique est retourné en cas d'échec


## Intégration avec Supabase

Le service exploite deux aspects distincts de Supabase :

1. **Système d'authentification** : Pour la création des comptes utilisateurs et la gestion des informations d'identification
2. **Base de données** : Pour stocker les informations de profil étendues dans une table personnalisée

Cette double approche permet :

- Une authentification sécurisée gérée par Supabase Auth
- Un modèle de données flexible pour les informations de profil
- Une liaison entre l'identité authentifiée et les données de profil via l'ID utilisateur

## Flux d'inscription complet

Le processus d'inscription se déroule comme suit :

1. L'utilisateur remplit le formulaire d'inscription dans l'interface
2. Les données sont validées côté client
3. Une instance de `RegisterService` est créée avec ces données
4. La méthode `save()` est appelée pour créer le compte
5. Un email de confirmation est envoyé à l'utilisateur
6. L'utilisateur clique sur le lien de confirmation dans l'email
7. L'utilisateur est redirigé vers l'application et peut se connecter

## Considérations de sécurité

Le service implémente plusieurs mesures de sécurité :

- **Validation des données** : Les champs essentiels sont vérifiés
- **Vérification des mots de passe** : Assure que le mot de passe et sa confirmation correspondent
- **Confirmation par email** : L'authentification n'est complète qu'après confirmation de l'email
- **Journalisation sécurisée** : Les erreurs sont journalisées sans exposer d'informations sensibles

## Structure de données

Le service manipule deux structures de données principales :

1. **Utilisateur d'authentification** : Géré par Supabase Auth, contient email, mot de passe et données de base
2. **Profil utilisateur étendu** : Stocké dans la table `users`, contient toutes les informations de profil

La liaison entre ces deux structures est assurée par l'ID utilisateur généré lors de l'inscription.

## Améliorations futures possibles

- Ajout de validation plus robuste des données d'entrée
- Support pour l'upload d'avatar lors de l'inscription
- Intégration avec des systèmes de vérification d'adresse email en temps réel
- Possibilité d'inscription via des fournisseurs d'identité externes (Google, Facebook)
- Implémentation d'un système de parrainage ou de codes d'invitation
- Personnalisation du template d'email de confirmation
