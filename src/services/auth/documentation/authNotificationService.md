# Documentation du Service de Notification d'Authentification

## Vue d'ensemble

Le service `AuthNotificationService` est un composant essentiel de l'expérience utilisateur lié au processus d'authentification dans l'application MVUAMA. Il centralise toutes les notifications affichées à l'utilisateur pendant les différentes phases du flux d'authentification, assurant ainsi une expérience cohérente et informative.

## Architecture et principes

Le service utilise le plugin `sonner` pour afficher des notifications toast élégantes et non-intrusives. Cette approche offre plusieurs avantages :

- **Cohérence** : Toutes les notifications d'authentification suivent le même style et comportement
- **Centralisation** : La logique d'affichage est séparée des composants UI
- **Réutilisabilité** : Les méthodes peuvent être appelées depuis n'importe quel point de l'application
- **Personnalisation** : Chaque type de notification peut avoir son propre style et durée d'affichage

## Fonctionnalités détaillées

### Notification de connexion réussie

```typescript
static notifyLoginSuccess(username: string = 'Utilisateur')
```

**Description :** Informe l'utilisateur que sa connexion a été effectuée avec succès.

**Implémentation :**

- Affiche une notification de type "succès" avec un message de bienvenue personnalisé
- Inclut une description claire confirmant l'état connecté
- Durée d'affichage de 4 secondes, suffisante pour être vue sans interrompre l'expérience

**Utilisation :** Appelée après qu'un utilisateur se soit connecté avec succès via email/mot de passe ou authentification sociale.

### Notification d'erreur de connexion

```typescript
static notifyLoginError(error: string = 'Échec de la connexion')
```

**Description :** Alerte l'utilisateur qu'un problème est survenu lors de la tentative de connexion.

**Implémentation :**

- Affiche une notification de type "erreur" avec le message d'erreur spécifique
- Suggère à l'utilisateur de vérifier ses identifiants
- Durée d'affichage de 5 secondes pour donner le temps de lire le message d'erreur

**Utilisation :** Appelée lorsque la connexion échoue pour diverses raisons (identifiants incorrects, compte inexistant, etc.).

### Notification d'inscription réussie

```typescript
static notifyRegistrationSuccess()
```

**Description :** Informe l'utilisateur que son inscription a été traitée avec succès.

**Implémentation :**

- Affiche une notification de type "succès"
- Indique qu'un email de confirmation a été envoyé
- Durée d'affichage étendue (6 secondes) pour s'assurer que l'utilisateur voit l'instruction importante de vérifier son email

**Utilisation :** Appelée après qu'un nouvel utilisateur ait complété le processus d'inscription.

### Notification d'erreur d'inscription

```typescript
static notifyRegistrationError(error: string = "L'inscription a échoué")
```

**Description :** Alerte l'utilisateur qu'un problème est survenu lors de la tentative d'inscription.

**Implémentation :**

- Affiche une notification de type "erreur" avec le message d'erreur spécifique
- Suggère de vérifier les informations saisies
- Durée d'affichage de 5 secondes

**Utilisation :** Appelée lorsque l'inscription échoue (email déjà utilisé, validation échouée, etc.).

### Notification de déconnexion

```typescript
static notifyLogout()
```

**Description :** Confirme à l'utilisateur qu'il a été déconnecté avec succès.

**Implémentation :**

- Affiche une notification de type "info" avec un message de déconnexion
- Ton amical avec un message d'au revoir
- Durée plus courte (3 secondes) car l'information est simple

**Utilisation :** Appelée après qu'un utilisateur se soit déconnecté volontairement.

### Notification d'action dangereuse

```typescript
static notifyDangerousAction(message: string, description?: string)
```

**Description :** Alerte l'utilisateur avant ou après une action sensible liée à l'authentification.

**Implémentation :**

- Affiche une notification de type "avertissement" avec un message personnalisable
- Marquée comme "importante" pour empêcher un rejet accidentel
- Durée d'affichage longue (7 secondes) pour les actions critiques

**Utilisation :** Utilisée pour des actions comme la suppression de compte, la modification d'informations sensibles, etc.

### Notification d'accès non autorisé

```typescript
static notifyUnauthorized()
```

**Description :** Informe l'utilisateur qu'il n'a pas les permissions nécessaires pour accéder à une ressource.

**Implémentation :**

- Affiche une notification de type "erreur" claire et directe
- Message descriptif expliquant le problème d'autorisation
- Durée standard de 5 secondes

**Utilisation :** Appelée lorsqu'un utilisateur tente d'accéder à une ressource protégée sans les droits nécessaires.

### Notification de session expirée

```typescript
static notifySessionExpired()
```

**Description :** Alerte l'utilisateur que sa session d'authentification a expiré et qu'une reconnexion est nécessaire.

**Implémentation :**

- Affiche une notification de type "avertissement"
- Inclut un bouton d'action permettant d'accéder directement à la page de connexion
- Durée standard de 5 secondes

**Utilisation :** Appelée lorsque le système détecte que le token d'authentification de l'utilisateur a expiré.

### Notification d'email de réinitialisation envoyé

```typescript
static notifyResetEmailSent()
```

**Description :** Confirme à l'utilisateur qu'un email de réinitialisation de mot de passe a été envoyé.

**Implémentation :**

- Affiche une notification de type "succès"
- Instructions détaillées pour vérifier la boîte de réception et les spams
- Durée étendue (6 secondes) pour s'assurer que l'utilisateur comprend les étapes suivantes

**Utilisation :** Appelée après qu'un utilisateur ait demandé une réinitialisation de mot de passe.

### Notification d'erreur d'envoi d'email de réinitialisation

```typescript
static notifyResetEmailError(error: string = "L'envoi de l'email a échoué")
```

**Description :** Alerte l'utilisateur qu'un problème est survenu lors de l'envoi de l'email de réinitialisation.

**Implémentation :**

- Affiche une notification de type "erreur" avec le message d'erreur spécifique
- Suggère de vérifier l'adresse email
- Durée standard de 5 secondes

**Utilisation :** Appelée lorsque l'envoi de l'email de réinitialisation échoue.

### Notification de réinitialisation de mot de passe réussie

```typescript
static notifyPasswordResetSuccess()
```

**Description :** Confirme à l'utilisateur que son mot de passe a été réinitialisé avec succès.

**Implémentation :**

- Affiche une notification de type "succès"
- Inclut un bouton d'action pour se connecter immédiatement
- Durée standard de 5 secondes

**Utilisation :** Appelée après qu'un utilisateur ait complété le processus de réinitialisation de mot de passe.

### Notification d'erreur de réinitialisation de mot de passe

```typescript
static notifyPasswordResetError(error: string = 'La réinitialisation du mot de passe a échoué')
```

**Description :** Alerte l'utilisateur qu'un problème est survenu lors de la réinitialisation du mot de passe.

**Implémentation :**

- Affiche une notification de type "erreur" avec le message d'erreur spécifique
- Suggère de réessayer ou de demander un nouveau lien
- Durée standard de 5 secondes

**Utilisation :** Appelée lorsque la réinitialisation du mot de passe échoue (lien expiré, problème de serveur, etc.).

## Intégration avec l'application

Le service `AuthNotificationService` est utilisé dans :

1. **Services d'authentification** : Pour notifier les résultats des opérations d'authentification
2. **Composants d'interface utilisateur** : Pour informer l'utilisateur des actions effectuées
3. **Middleware d'authentification** : Pour signaler les problèmes d'accès

## Bonnes pratiques et considérations

- **Messages clairs et humains** : Toutes les notifications utilisent un langage compréhensible
- **Instructions utiles** : Les messages incluent souvent des suggestions sur la marche à suivre
- **Actions directes** : Certaines notifications incluent des boutons permettant d'agir immédiatement
- **Durées appropriées** : Les notifications importantes restent affichées plus longtemps
- **Personnalisation** : Les messages d'erreur peuvent être adaptés en fonction de la situation

## Améliorations futures possibles

- Internationalisation des messages pour supporter plusieurs langues
- Adaptation plus fine de la durée d'affichage en fonction du contexte d'utilisation
- Support pour des notifications plus interactives (avec plusieurs actions)
- Mémorisation des notifications importantes pour consultation ultérieure
