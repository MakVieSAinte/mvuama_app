# Documentation du Service de Connexion

## Vue d'ensemble

Le `LoginService` gère le processus d'authentification des utilisateurs dans l'application MVUAMA. Il sert d'intermédiaire entre les composants d'interface utilisateur de connexion et les API d'authentification de Supabase, tout en ajoutant des fonctionnalités spécifiques comme la mémorisation d'email et la gestion des sessions.

## Architecture et fonctionnement

Le service est conçu selon une approche orientée objet, où chaque instance représente une tentative de connexion. Cette conception permet d'encapsuler les données de connexion et les méthodes associées de manière élégante.

### Initialisation

```typescript
constructor(loginData: ILoginModel)
```

**Description :** Le service est initialisé avec les données de connexion de l'utilisateur.

**Fonctionnement :**

- Reçoit un objet `ILoginModel` contenant l'email, le mot de passe et l'option "se souvenir de moi"
- Ces données sont stockées dans une propriété privée pour une utilisation ultérieure
- Cette approche permet de conserver l'état de la tentative de connexion

## Fonctionnalités principales

### Processus de connexion

```typescript
async login()
```

**Description :** Méthode principale qui gère l'authentification de l'utilisateur.

**Flux d'exécution :**

1. Nettoyage de l'email (suppression des espaces, conversion en minuscules)
2. Journalisation de la tentative (sans exposer le mot de passe)
3. Délégation de l'authentification au `AuthService`
4. Gestion de l'option "se souvenir de moi"
5. Stockage manuel des jetons et informations utilisateur dans le localStorage
6. Gestion détaillée des erreurs avec des messages appropriés

**Particularités :**

- Double stockage des informations d'authentification pour assurer la compatibilité avec les différentes méthodes de vérification
- Traitement spécifique des erreurs courantes (identifiants invalides, email non confirmé)
- Journalisation pour faciliter le débogage

### Récupération de l'email mémorisé

```typescript
static getRememberedEmail(): string | null
```

**Description :** Récupère l'email précédemment sauvegardé si l'utilisateur avait coché "se souvenir de moi".

**Fonctionnement :**

- Accède au localStorage pour récupérer l'email mémorisé
- Retourne null si aucun email n'a été mémorisé
- Méthode statique pour un accès facile sans instanciation

**Utilisation :** Utilisée principalement dans le composant de formulaire de connexion pour pré-remplir le champ email.

### Vérification de l'état de connexion

```typescript
static async isUserLoggedIn(): Promise<boolean>
```

**Description :** Détermine si un utilisateur est actuellement connecté en vérifiant la session active.

**Fonctionnement :**

- Utilise l'API Supabase pour récupérer la session courante
- Vérifie l'existence d'une session valide
- Gère les erreurs potentielles et retourne false en cas de problème

**Utilisation :** Peut être utilisée pour des vérifications dynamiques de l'état d'authentification, notamment dans les composants UI.

### Récupération des informations utilisateur

```typescript
static async getCurrentUser()
```

**Description :** Obtient les détails de l'utilisateur actuellement connecté.

**Fonctionnement :**

- Utilise l'API Supabase pour récupérer les informations de l'utilisateur
- Gère les erreurs potentielles et retourne null en cas de problème
- Fournit les données utilisateur pour personnalisation de l'UI

**Utilisation :** Utilisée pour obtenir des informations sur l'utilisateur après une connexion réussie.

## Intégration dans le flux d'authentification

Le `LoginService` s'intègre dans le flux d'authentification de plusieurs façons :

1. **Composant LoginForm** : Utilise le service pour traiter la soumission du formulaire
2. **Mémorisation d'email** : Facilite l'expérience utilisateur en restaurant les informations précédentes
3. **Vérification d'authentification** : Permet de vérifier l'état de connexion sans recourir à des méthodes plus complexes

## Gestion des erreurs et sécurité

Le service implémente plusieurs bonnes pratiques de sécurité et de gestion d'erreurs :

- **Nettoyage des entrées** : L'email est nettoyé avant utilisation
- **Messages d'erreur spécifiques** : Les erreurs sont traduites en messages compréhensibles pour l'utilisateur
- **Journalisation sécurisée** : Les informations sensibles ne sont pas exposées dans les logs
- **Gestion robuste des sessions** : Double vérification de la présence des jetons d'authentification

## Considérations et bonnes pratiques

- **Séparation des responsabilités** : Le service délègue l'authentification réelle au `AuthService`
- **État encapsulé** : Les données de connexion sont encapsulées dans l'instance du service
- **Méthodes utilitaires** : Les fonctionnalités communes sont exposées comme méthodes statiques
- **Gestion du localStorage** : Utilisation cohérente pour la persistance des données de session

## Améliorations futures potentielles

- Ajout de méthodes pour gérer l'authentification via réseaux sociaux
- Implémentation d'une gestion de session plus sophistiquée (refresh tokens)
- Support pour l'authentification à deux facteurs
- Mémorisation sécurisée des informations d'authentification (via des cookies sécurisés)
