import { test, Page, expect, BrowserContext, Browser } from '@playwright/test'

// Données de test pour différents scénarios
export const TEST_USERS = {
  valid: {
    email: 'test@example.com',
    password: 'TestPassword123!',
    nom: 'Test',
    prenom: 'User',
    telephone: '+33612345678',
  },
  invalid: {
    email: 'invalid@example.com',
    password: 'WrongPassword123!',
    nom: 'Invalid',
    prenom: 'User',
    telephone: '+33612345679',
  },
  blocked: {
    email: 'blocked@example.com',
    password: 'BlockedUser123!',
    nom: 'Blocked',
    prenom: 'User',
    telephone: '+33612345670',
  },
  admin: {
    email: 'admin@example.com',
    password: 'AdminPass123!',
    nom: 'Admin',
    prenom: 'User',
    telephone: '+33612345671',
  },
}

export const INVALID_INPUTS = {
  emails: [
    'invalid-email',
    'test@',
    '@example.com',
    'test@.com',
    'test@example.',
    'test@ex ample.com',
    '',
    ' ',
    'abc'.repeat(100) + '@example.com', // Email trop long
  ],
  passwords: [
    '',
    ' ',
    '123',
    'password',
    'PASSWORD',
    '12345678',
    'abcdefgh',
    'ABCDEFGH',
    '!@#$%^&*',
    'a'.repeat(100), // Mot de passe trop long
  ],
  phones: [
    '',
    '123',
    'abc',
    '+123',
    '+33',
    '0612345678',
    '+3361234567', // Manque un chiffre
    '+336123456789', // Un chiffre en trop
    '+33abcdefghi',
    '+99612345678', // Code pays invalide
  ],
}

// Configuration commune pour les pages de test
export async function setupAuthPage(page: Page, route: string = '/login') {
  await page.goto(route)
  await page.waitForLoadState('networkidle')
}

// Fonctions helpers communes
export async function clearStorageAndCookies(page: Page) {
  await page.evaluate(() => window.localStorage.clear())
  await page.evaluate(() => window.sessionStorage.clear())
  await page.context().clearCookies()
}

// Vérification de l'état de connexion
export async function checkAuthState(page: Page, isLoggedIn: boolean) {
  if (isLoggedIn) {
    await page.waitForSelector('[data-testid="user-menu"]', { state: 'visible' })
  } else {
    await page.waitForSelector('[data-testid="login-form"]', { state: 'visible' })
  }
}

// Attendre et vérifier les messages d'erreur
export async function waitForError(page: Page, errorMessage: string) {
  await page.waitForSelector(`text=${errorMessage}`, {
    state: 'visible',
    timeout: 5000,
  })
}

// Attendre et vérifier les messages de succès
export async function waitForSuccess(page: Page, successMessage: string) {
  await page.waitForSelector(`text=${successMessage}`, {
    state: 'visible',
    timeout: 5000,
  })
}

// Types pour les tests
export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  nom: string
  prenom: string
  telephone: string
}
/**
 * Remplit le premier step du formulaire d'inscription
 * @param page Page Playwright
 * @param user Données utilisateur
 */
export async function fillRegisterFormStep1(page: Page, user: RegisterData) {
  await page.fill('input[name="email"]', user.email)
  await page.fill('input[name="password"]', user.password)
  await page.fill('input[name="nom"]', user.nom)
  await page.fill('input[name="prenom"]', user.prenom)
  await page.fill('input[name="telephone"]', user.telephone)
}

/**
 * Remplit le deuxième step du formulaire d'inscription
 * @param page Page Playwright
 * @param user Données utilisateur
 */
export async function fillRegisterFormStep2(page: Page, user: RegisterData) {
  // Exemple : suppose qu'il y a un champ adresse et un champ ville
  await page.fill('input[name="adresse"]', user.adresse || '')
  await page.fill('input[name="ville"]', user.ville || '')
  // Ajoute ici les autres champs du step 2 si besoin
}

/**
 * Retourne un utilisateur de test avec des données valides
 */
export function getTestUser() {
  return TEST_USERS.valid
}

/**
 * Simule le comportement de l'API Supabase pour la réinitialisation de mot de passe
 */
export async function mockSupabaseResetToken(
  context: BrowserContext,
  success: boolean = true,
  delay: number = 0,
  errorMessage?: string,
) {
  await context.route('**/auth/v1/recover**', async (route) => {
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    if (success) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      })
    } else {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: errorMessage || 'Failed to send reset email',
          message: errorMessage || 'Failed to send reset email',
        }),
      })
    }
  })
}

/**
 * Simule le comportement de l'API Supabase pour la validation d'une session
 */
export async function mockSupabaseSessionResponse(
  context: BrowserContext,
  success: boolean = true,
  delay: number = 0,
  errorMessage?: string,
) {
  await context.route('**/auth/v1/user**', async (route) => {
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    if (success) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '123',
          email: 'test@example.com',
          user_metadata: {
            nom: 'Test',
            prenom: 'User',
          },
        }),
      })
    } else {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: errorMessage || 'Invalid or expired token',
          message: errorMessage || 'Invalid or expired token',
        }),
      })
    }
  })
}

/**
 * Configure un contexte pour simuler la réinitialisation de mot de passe
 */
export async function setupResetContext(browser: Browser) {
  // Créer un nouveau contexte
  const context = await browser.newContext()

  // Intercepter les appels à getSession pour simuler un token valide
  await context.route('**/auth/v1/token?grant_type=recover**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: 'fake-reset-token',
        refresh_token: 'fake-refresh-token',
        user: {
          id: '123',
          email: 'test@example.com',
        },
      }),
    })
  })

  // Intercepter les appels à getSession pour simuler une session valide
  await context.route('**/auth/v1/session**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        session: {
          access_token: 'fake-access-token',
          refresh_token: 'fake-refresh-token',
          user: {
            id: '123',
            email: 'test@example.com',
          },
        },
      }),
    })
  })

  // Créer une nouvelle page dans ce contexte
  const page = await context.newPage()

  return { context, page }
}
