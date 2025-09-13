import { test, expect } from '@playwright/test'
import {
  TEST_USERS,
  INVALID_INPUTS,
  setupAuthPage,
  clearStorageAndCookies,
  checkAuthState,
  waitForError,
  waitForSuccess,
} from './fixtures.js'

test.describe('Tests de connexion', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorageAndCookies(page)
    await setupAuthPage(page, '/login')
  })

  test('1. devrait afficher le formulaire de connexion avec tous les éléments requis', async ({
    page,
  }) => {
    // Vérifier la présence des champs et des textes
    await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible()
    await expect(
      page.getByText('Entrez votre email et mot de passe pour accéder à votre espace'),
    ).toBeVisible()

    // Vérifier les champs de formulaire
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Mot de passe')).toBeVisible()

    // Vérifier les boutons et liens
    await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Mot de passe oublié?' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Inscrivez-vous' })).toBeVisible()
    await expect(page.getByLabel('Se souvenir de moi')).toBeVisible()
  })

  test("2. devrait afficher des messages d'erreur pour les champs vides", async ({ page }) => {
    // Soumettre le formulaire sans remplir les champs
    await page.getByRole('button', { name: 'Se connecter' }).click()

    // Vérifier les messages d'erreur
    await expect(page.getByText("L'email est requis")).toBeVisible()
    await expect(page.getByText('Le mot de passe est requis')).toBeVisible()
  })

  test("3. devrait valider le format de l'email avec différents cas invalides", async ({
    page,
  }) => {
    // Tester avec plusieurs formats d'email invalides
    for (const invalidEmail of INVALID_INPUTS.emails.slice(0, 3)) {
      // Limiter à 3 tests pour la démonstration
      await page.getByLabel('Email').fill(invalidEmail)
      await page.getByRole('button', { name: 'Se connecter' }).click()

      if (invalidEmail === '') {
        await expect(page.getByText("L'email est requis")).toBeVisible()
      } else {
        await expect(page.getByText('Veuillez saisir une adresse email valide')).toBeVisible()
      }

      // Nettoyer pour le prochain test
      await page.getByLabel('Email').clear()
    }
  })

  test('4. devrait afficher une erreur pour un mot de passe vide', async ({ page }) => {
    await page.getByLabel('Email').fill(TEST_USERS.valid.email)
    await page.getByRole('button', { name: 'Se connecter' }).click()

    await expect(page.getByText('Le mot de passe est requis')).toBeVisible()
  })

  test('5. devrait afficher une erreur pour des espaces dans le mot de passe', async ({ page }) => {
    await page.getByLabel('Email').fill(TEST_USERS.valid.email)
    await page.getByLabel('Mot de passe').fill(' ' + TEST_USERS.valid.password + ' ')
    await page.getByRole('button', { name: 'Se connecter' }).click()

    await expect(
      page.getByText("Le mot de passe ne doit pas contenir d'espaces au début ou à la fin"),
    ).toBeVisible()
  })

  test('6. devrait mémoriser l\'email quand "Se souvenir de moi" est coché', async ({ page }) => {
    // Mock pour simuler la connexion réussie
    await page.route('**/auth/v1/token?grant_type=password', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'fake-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'fake-refresh-token',
          user: {
            id: '123',
            email: TEST_USERS.valid.email,
          },
        }),
      })
    })

    // Remplir et soumettre le formulaire avec "Se souvenir de moi" coché
    await page.getByLabel('Email').fill(TEST_USERS.valid.email)
    await page.getByLabel('Mot de passe').fill(TEST_USERS.valid.password)
    await page.getByLabel('Se souvenir de moi').check()
    await page.getByRole('button', { name: 'Se connecter' }).click()

    // Vérifier que l'email est stocké dans le localStorage
    const rememberedEmail = await page.evaluate(() => localStorage.getItem('remember_email'))
    expect(rememberedEmail).toBe(TEST_USERS.valid.email)
  })

  test('7. devrait connecter avec succès un utilisateur valide', async ({ page }) => {
    // Mock pour simuler la connexion réussie avec supabase
    await page.route('**/auth/v1/token?grant_type=password', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'fake-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'fake-refresh-token',
          user: {
            id: '123',
            email: TEST_USERS.valid.email,
            user_metadata: {
              first_name: TEST_USERS.valid.first_name,
              last_name: TEST_USERS.valid.last_name,
            },
          },
        }),
      })
    })

    // Mock pour simuler la récupération des agences
    await page.route('**/rest/v1/agencies*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 1, name: 'Agency Test' }]),
      })
    })

    // Remplir et soumettre le formulaire
    await page.getByLabel('Email').fill(TEST_USERS.valid.email)
    await page.getByLabel('Mot de passe').fill(TEST_USERS.valid.password)
    await page.getByRole('button', { name: 'Se connecter' }).click()

    // Vérifier la redirection vers le tableau de bord
    await expect(page).toHaveURL('/dashboard')
  })

  test('8. devrait afficher une erreur pour des identifiants invalides', async ({ page }) => {
    // Mock pour simuler une erreur d'authentification
    await page.route('**/auth/v1/token?grant_type=password', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Invalid login credentials',
          message: 'Email ou mot de passe incorrect',
        }),
      })
    })

    // Remplir et soumettre le formulaire avec des identifiants invalides
    await page.getByLabel('Email').fill(TEST_USERS.invalid.email)
    await page.getByLabel('Mot de passe').fill(TEST_USERS.invalid.password)
    await page.getByRole('button', { name: 'Se connecter' }).click()

    // Vérifier le message d'erreur
    await expect(page.getByText('Email ou mot de passe incorrect')).toBeVisible()
  })

  test('9. devrait désactiver le bouton de connexion pendant la soumission', async ({ page }) => {
    // Mock avec délai pour observer l'état du bouton
    await page.route('**/auth/v1/token?grant_type=password', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'fake-token',
          user: { id: '123', email: TEST_USERS.valid.email },
        }),
      })
    })

    // Remplir et soumettre le formulaire
    await page.getByLabel('Email').fill(TEST_USERS.valid.email)
    await page.getByLabel('Mot de passe').fill(TEST_USERS.valid.password)
    await page.getByRole('button', { name: 'Se connecter' }).click()

    // Vérifier que le bouton est désactivé et affiche un indicateur de chargement
    await expect(page.getByRole('button', { name: 'Se connecter' })).toBeDisabled()
    await expect(page.locator('.animate-spin')).toBeVisible()
  })

  test("10. devrait afficher une erreur pour un compte dont l'email n'est pas confirmé", async ({
    page,
  }) => {
    // Mock pour simuler une erreur d'email non confirmé
    await page.route('**/auth/v1/token?grant_type=password', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Email not confirmed',
          message: 'Veuillez confirmer votre email avant de vous connecter',
        }),
      })
    })

    // Remplir et soumettre le formulaire
    await page.getByLabel('Email').fill(TEST_USERS.valid.email)
    await page.getByLabel('Mot de passe').fill(TEST_USERS.valid.password)
    await page.getByRole('button', { name: 'Se connecter' }).click()

    // Vérifier le message d'erreur
    await expect(
      page.getByText('Veuillez confirmer votre email avant de vous connecter'),
    ).toBeVisible()
  })

  test('11. devrait gérer les erreurs de réseau', async ({ page }) => {
    // Simuler une erreur réseau
    await page.route('**/auth/v1/token?grant_type=password', (route) => route.abort('failed'))

    // Remplir et soumettre le formulaire
    await page.getByLabel('Email').fill(TEST_USERS.valid.email)
    await page.getByLabel('Mot de passe').fill(TEST_USERS.valid.password)
    await page.getByRole('button', { name: 'Se connecter' }).click()

    // Vérifier le message d'erreur
    await expect(page.getByText('Erreur lors de la connexion')).toBeVisible()
  })

  test("12. devrait rediriger vers la page de création d'agence après la première connexion", async ({
    page,
  }) => {
    // Mock pour simuler la connexion réussie
    await page.route('**/auth/v1/token?grant_type=password', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'fake-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'fake-refresh-token',
          user: {
            id: '123',
            email: TEST_USERS.valid.email,
          },
        }),
      })
    })

    // Simuler un utilisateur sans agence
    await page.route('**/rest/v1/agencies*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    })

    // Remplir et soumettre le formulaire
    await page.getByLabel('Email').fill(TEST_USERS.valid.email)
    await page.getByLabel('Mot de passe').fill(TEST_USERS.valid.password)
    await page.getByRole('button', { name: 'Se connecter' }).click()

    // Vérifier la redirection vers la page de création d'agence
    await expect(page).toHaveURL('/create-agency')
  })
})
