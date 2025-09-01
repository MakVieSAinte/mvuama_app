# Documentation du Service d'Authentification Principal

## Vue d'ensemble

Le service `AuthService` est la pierre angulaire du système d'authentification de l'application MVUAMA. Il encapsule toutes les interactions avec le backend d'authentification Supabase et fournit une interface cohérente pour les fonctionnalités liées à l'authentification dans l'ensemble de l'application.

## Fonctionnalités principales

### Inscription utilisateur (`signUp`)

```typescript
static async signUp(email: string, password: string)
```

**Description :** Cette méthode permet la création d'un nouveau compte utilisateur dans le système.

**Implémentation :**

- Utilise l'API Supabase pour créer un nouvel utilisateur avec l'e-mail et le mot de passe fournis
- Configure l'URL de redirection après vérification de l'e-mail vers `/auth/callback`
- Retourne les données et les erreurs éventuelles pour permettre une gestion flexible dans les composants UI

**Considérations :**

- La notification de succès/échec est déléguée au composant appelant pour plus de flexibilité
- Gère les exceptions de manière élégante pour éviter les interruptions dans le flux utilisateur

### Connexion avec Google (`signInWithGoogle`)

```typescript
static async signInWithGoogle()
```

**Description :** Permet l'authentification via un compte Google, offrant une alternative à la connexion par e-mail/mot de passe.

**Implémentation :**

- Utilise l'API OAuth de Supabase avec le provider 'google'
- Redirige l'utilisateur vers la page de consentement Google puis de retour vers l'application
- Gère les erreurs potentielles durant le processus d'authentification

### Connexion avec Facebook (`signInWithFacebook`)

```typescript
static async signInWithFacebook()
```

**Description :** Permet l'authentification via un compte Facebook, offrant une autre alternative d'authentification sociale.

**Implémentation :**

- Similaire à la connexion Google mais avec le provider 'facebook'
- Maintient une structure de retour cohérente avec les autres méthodes d'authentification

### Connexion par e-mail et mot de passe (`signIn`)

```typescript
static async signIn(email: string, password: string)
```

**Description :** Méthode standard d'authentification utilisant un couple e-mail/mot de passe.

**Implémentation :**

- Utilise `signInWithPassword` de Supabase pour la validation des identifiants
- Gère les erreurs d'authentification avec des messages explicites
- Génère des logs détaillés pour faciliter le débogage

### Vérification de l'état d'authentification (`isAuthenticated`)

```typescript
static isAuthenticated(): boolean
```

**Description :** Détermine si un utilisateur est actuellement connecté à l'application.

**Implémentation :**

- Vérifie la présence des tokens d'authentification Supabase dans le localStorage
- Utilise plusieurs emplacements de stockage potentiels pour une robustesse accrue
- Retourne un booléen simple pour une utilisation facile dans les guards de routes

### Vérification du statut administrateur (`isAdmin`)

```typescript
static isAdmin(): boolean
```

**Description :** Vérifie si l'utilisateur connecté possède des privilèges d'administrateur.

**Implémentation :**

- Récupère et analyse les données utilisateur du localStorage
- Vérifie si le rôle de l'utilisateur est 'admin'

### Déconnexion (`signOut`)

```typescript
static async signOut(): Promise<boolean>
```

**Description :** Déconnecte l'utilisateur actuel et nettoie les données de session.

**Implémentation :**

- Appelle l'API `signOut` de Supabase
- Affiche une notification à l'utilisateur via `AuthNotificationService`
- Retourne un booléen indiquant le succès de l'opération

### Récupération de la session courante (`getCurrentSession`)

```typescript
static async getCurrentSession()
```

**Description :** Obtient la session active de l'utilisateur connecté.

**Implémentation :**

- Utilise `getSession` de Supabase pour récupérer les informations de session
- Gère les erreurs et retourne null si aucune session n'est disponible
- Utile pour les vérifications d'authentification côté client

### Récupération des données utilisateur (`getCurrentUser`)

```typescript
static async getCurrentUser()
```

**Description :** Récupère les informations détaillées sur l'utilisateur connecté.

**Implémentation :**

- Utilise `getUser` de Supabase pour obtenir le profil utilisateur actuel
- Gère les erreurs et retourne null si aucun utilisateur n'est connecté
- Fournit des données utilisateur pour personnaliser l'interface

## Intégration avec l'application

Le `AuthService` est utilisé à plusieurs endroits clés dans l'application :

1. **Navigation Guard** : Pour protéger les routes nécessitant une authentification
2. **Composants d'authentification** : Pour gérer les processus de connexion/inscription
3. **Middleware d'authentification** : Pour vérifier les autorisations d'accès
4. **Composants UI** : Pour afficher des informations spécifiques à l'utilisateur

## Bonnes pratiques et considérations

- **Sécurité** : Aucune information sensible n'est stockée en clair dans le localStorage
- **Gestion des erreurs** : Les erreurs sont soigneusement capturées et traitées
- **Séparation des préoccupations** : Les notifications sont déléguées à un service distinct
- **Robustesse** : Multiples vérifications pour déterminer l'état d'authentification
- **Extensibilité** : Structure permettant l'ajout facile de nouveaux fournisseurs d'authentification

## Évolution future

- Ajout de l'authentification à deux facteurs
- Support pour d'autres fournisseurs OAuth (Twitter, Apple, etc.)
- Amélioration de la gestion des sessions pour les applications multi-onglets
- Implémentation du rafraîchissement automatique des tokens
