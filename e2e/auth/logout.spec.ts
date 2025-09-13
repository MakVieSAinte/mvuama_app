import { test, expect } from '@playwright/test'
import { TEST_USERS, setupAuthPage, clearStorageAndCookies, checkAuthState } from './fixtures.js'

test.describe('Tests de déconnexion', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorageAndCookies(page)

    // Mock pour simuler une connexion réussie
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

    // Connecter l'utilisateur
    await setupAuthPage(page, '/login')
    await page.getByLabel('Email').fill(TEST_USERS.valid.email)
    await page.getByLabel('Mot de passe').fill(TEST_USERS.valid.password)
    await page.getByRole('button', { name: 'Se connecter' }).click()

    // Attendre que la redirection soit complète
    await page.waitForURL('/dashboard')
  })

  test('1. devrait afficher un menu utilisateur avec option de déconnexion', async ({ page }) => {
    // Vérifier la présence du menu utilisateur
    await expect(page.getByTestId('user-menu')).toBeVisible()

    // Ouvrir le menu utilisateur
    await page.getByTestId('user-menu').click()

    // Vérifier la présence de l'option de déconnexion
    await expect(page.getByRole('menuitem', { name: 'Se déconnecter' })).toBeVisible()
  })

  test('2. devrait demander confirmation avant de se déconnecter', async ({ page }) => {
    // Mock pour intercepter la requête de déconnexion
    await page.route('**/auth/v1/logout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      })
    })

    // Ouvrir le menu utilisateur et cliquer sur déconnexion
    await page.getByTestId('user-menu').click()
    await page.getByRole('menuitem', { name: 'Se déconnecter' }).click()

    // Vérifier qu'une boîte de dialogue de confirmation apparaît
    await expect(page.getByText('Voulez-vous vraiment vous déconnecter?')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Annuler' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Confirmer' })).toBeVisible()
  })

  test("3. devrait rester connecté si l'utilisateur annule la déconnexion", async ({ page }) => {
    // Ouvrir le menu utilisateur et cliquer sur déconnexion
    await page.getByTestId('user-menu').click()
    await page.getByRole('menuitem', { name: 'Se déconnecter' }).click()

    // Cliquer sur Annuler
    await page.getByRole('button', { name: 'Annuler' }).click()

    // Vérifier que nous sommes toujours sur la page dashboard
    await expect(page).toHaveURL('/dashboard')

    // Vérifier que nous sommes toujours connectés
    await expect(page.getByTestId('user-menu')).toBeVisible()
  })

  test('4. devrait se déconnecter avec succès', async ({ page }) => {
    // Mock pour intercepter la requête de déconnexion
    await page.route('**/auth/v1/logout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      })
    })

    // Ouvrir le menu utilisateur et cliquer sur déconnexion
    await page.getByTestId('user-menu').click()
    await page.getByRole('menuitem', { name: 'Se déconnecter' }).click()

    // Confirmer la déconnexion
    await page.getByRole('button', { name: 'Confirmer' }).click()

    // Vérifier la redirection vers la page de login
    await expect(page).toHaveURL('/login')
  })

  test("5. devrait supprimer le token d'authentification après déconnexion", async ({ page }) => {
    // Mock pour intercepter la requête de déconnexion
    await page.route('**/auth/v1/logout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      })
    })

    // Ouvrir le menu utilisateur et cliquer sur déconnexion
    await page.getByTestId('user-menu').click()
    await page.getByRole('menuitem', { name: 'Se déconnecter' }).click()

    // Confirmer la déconnexion
    await page.getByRole('button', { name: 'Confirmer' }).click()

    // Vérifier que le token a été supprimé
    const authToken = await page.evaluate(() => localStorage.getItem('sb-access-token'))
    expect(authToken).toBeNull()
  })

  test("6. devrait empêcher l'accès aux pages protégées après déconnexion", async ({ page }) => {
    // Mock pour intercepter la requête de déconnexion
    await page.route('**/auth/v1/logout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      })
    })

    // Se déconnecter
    await page.getByTestId('user-menu').click()
    await page.getByRole('menuitem', { name: 'Se déconnecter' }).click()
    await page.getByRole('button', { name: 'Confirmer' }).click()

    // Essayer d'accéder à une page protégée
    await page.goto('/dashboard')

    // Vérifier la redirection vers la page de login
    await expect(page).toHaveURL('/login')
  })

  test('7. devrait afficher une notification de déconnexion réussie', async ({ page }) => {
    // Mock pour intercepter la requête de déconnexion
    await page.route('**/auth/v1/logout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      })
    })

    // Se déconnecter
    await page.getByTestId('user-menu').click()
    await page.getByRole('menuitem', { name: 'Se déconnecter' }).click()
    await page.getByRole('button', { name: 'Confirmer' }).click()

    // Vérifier l'affichage de la notification
    await expect(page.getByText('Vous êtes déconnecté')).toBeVisible()
  })

  test('8. devrait gérer les erreurs de déconnexion', async ({ page }) => {
    // Mock pour simuler une erreur lors de la déconnexion
    await page.route('**/auth/v1/logout', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Erreur interne' }),
      })
    })

    // Tentative de déconnexion
    await page.getByTestId('user-menu').click()
    await page.getByRole('menuitem', { name: 'Se déconnecter' }).click()
    await page.getByRole('button', { name: 'Confirmer' }).click()

    // Vérifier l'affichage du message d'erreur
    await expect(page.getByText('Erreur lors de la déconnexion')).toBeVisible()
  })

  test('9. devrait se déconnecter automatiquement après expiration de la session', async ({
    page,
  }) => {
    // Supprimer manuellement le token pour simuler une expiration
    await page.evaluate(() => {
      localStorage.removeItem('sb-access-token')
      localStorage.removeItem('sb-refresh-token')
    })

    // Recharger la page pour déclencher la vérification de session
    await page.reload()

    // Vérifier la redirection vers la page de login
    await expect(page).toHaveURL('/login')
  })

  test('10. devrait se déconnecter correctement sur plusieurs onglets', async ({ browser }) => {
    // Créer un nouveau contexte et deux pages
    const context = await browser.newContext()
    const page1 = await context.newPage()
    const page2 = await context.newPage()

    // Mock pour simuler une connexion réussie (pour les deux pages)
    for (const page of [page1, page2]) {
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

      await page.route('**/rest/v1/agencies*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{ id: 1, name: 'Agency Test' }]),
        })
      })
    }

    // Connecter l'utilisateur sur les deux onglets
    for (const page of [page1, page2]) {
      await page.goto('/login')
      await page.getByLabel('Email').fill(TEST_USERS.valid.email)
      await page.getByLabel('Mot de passe').fill(TEST_USERS.valid.password)
      await page.getByRole('button', { name: 'Se connecter' }).click()
      await page.waitForURL('/dashboard')
    }

    // Mock pour la déconnexion
    await page1.route('**/auth/v1/logout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      })
    })

    // Se déconnecter sur le premier onglet
    await page1.getByTestId('user-menu').click()
    await page1.getByRole('menuitem', { name: 'Se déconnecter' }).click()
    await page1.getByRole('button', { name: 'Confirmer' }).click()

    // Recharger le deuxième onglet et vérifier qu'il est aussi déconnecté
    await page2.reload()
    await expect(page2).toHaveURL('/login')

    // Fermer le contexte
    await context.close()
  })
})
