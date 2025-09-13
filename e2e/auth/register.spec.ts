import { test, expect } from '@playwright/test'
import {
  TEST_USERS,
  INVALID_INPUTS,
  setupAuthPage,
  clearStorageAndCookies,
  waitForError,
  waitForSuccess,
  fillRegisterFormStep1,
  fillRegisterFormStep2,
  fillRegisterFormStep3,
} from './fixtures.js'

test.describe("Tests d'inscription", () => {
  test.beforeEach(async ({ page }) => {
    await clearStorageAndCookies(page)
    await setupAuthPage(page, '/register')
  })

  test("1. devrait afficher le formulaire d'inscription avec tous les éléments requis", async ({
    page,
  }) => {
    // Vérifier la présence des titres et sous-titres
    await expect(page.getByRole('heading', { name: 'Créer un compte' })).toBeVisible()
    await expect(
      page.getByText('Veuillez renseigner les champs ci-dessous pour créer votre compte'),
    ).toBeVisible()

    // Étape 1 - Vérifier les champs d'informations personnelles
    await expect(page.getByText('Informations personnelles')).toBeVisible()
    await expect(page.getByLabel('Prénom')).toBeVisible()
    await expect(page.getByLabel('Nom')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Téléphone')).toBeVisible()

    // Vérifier le bouton de navigation
    await expect(page.getByRole('button', { name: 'Continuer' })).toBeVisible()
  })

  test("2. devrait valider tous les champs obligatoires de l'étape 1", async ({ page }) => {
    // Cliquer sur Continuer sans remplir les champs
    await page.getByRole('button', { name: 'Continuer' }).click()

    // Vérifier les messages d'erreur pour les champs obligatoires
    await expect(page.getByText('Le prénom est requis')).toBeVisible()
    await expect(page.getByText('Le nom est requis')).toBeVisible()
    await expect(page.getByText("L'email est requis")).toBeVisible()
  })

  test('3. devrait valider le format des noms avec différents cas invalides', async ({ page }) => {
    // Tester quelques noms invalides pour le prénom
    for (const invalidName of INVALID_INPUTS.names.slice(0, 3)) {
      await page.getByLabel('Prénom').fill(invalidName)
      await page.getByLabel('Nom').fill(TEST_USERS.valid.last_name)
      await page.getByLabel('Email').fill(TEST_USERS.valid.email)
      await page.getByRole('button', { name: 'Continuer' }).click()

      if (invalidName === '') {
        await expect(page.getByText('Le prénom est requis')).toBeVisible()
      } else {
        await expect(page.getByText('Veuillez saisir un prénom valide')).toBeVisible()
      }

      // Nettoyer pour le prochain test
      await page.getByLabel('Prénom').clear()
    }
  })

  test("4. devrait valider le format de l'email à l'étape 1", async ({ page }) => {
    // Remplir les autres champs correctement
    await page.getByLabel('Prénom').fill(TEST_USERS.valid.first_name)
    await page.getByLabel('Nom').fill(TEST_USERS.valid.last_name)

    // Tester quelques emails invalides
    for (const invalidEmail of INVALID_INPUTS.emails.slice(0, 3)) {
      await page.getByLabel('Email').fill(invalidEmail)
      await page.getByRole('button', { name: 'Continuer' }).click()

      if (invalidEmail === '') {
        await expect(page.getByText("L'email est requis")).toBeVisible()
      } else {
        await expect(page.getByText('Veuillez saisir une adresse email valide')).toBeVisible()
      }

      // Nettoyer pour le prochain test
      await page.getByLabel('Email').clear()
    }
  })

  test('5. devrait valider le format du numéro de téléphone', async ({ page }) => {
    // Remplir les champs obligatoires
    await page.getByLabel('Prénom').fill(TEST_USERS.valid.first_name)
    await page.getByLabel('Nom').fill(TEST_USERS.valid.last_name)
    await page.getByLabel('Email').fill(TEST_USERS.valid.email)

    // Tester quelques formats de téléphone invalides
    for (const invalidPhone of INVALID_INPUTS.phones.slice(0, 3)) {
      if (invalidPhone !== '') {
        // On saute le cas vide car ce n'est pas obligatoire
        await page.getByLabel('Téléphone').fill(invalidPhone)
        await page.getByRole('button', { name: 'Continuer' }).click()
        await expect(page.getByText('Veuillez saisir un numéro de téléphone valide')).toBeVisible()
        await page.getByLabel('Téléphone').clear()
      }
    }
  })

  test("6. devrait passer à l'étape 2 avec des informations personnelles valides", async ({
    page,
  }) => {
    // Remplir l'étape 1 avec des données valides
    await fillRegisterFormStep1(page, TEST_USERS.valid)

    // Passer à l'étape suivante
    await page.getByRole('button', { name: 'Continuer' }).click()

    // Vérifier que nous sommes à l'étape 2
    await expect(page.getByText('Localisation et devise')).toBeVisible()
    await expect(page.getByRole('combobox', { name: 'Pays' })).toBeVisible()
    await expect(page.getByRole('combobox', { name: 'Devise' })).toBeVisible()
  })

  test("7. devrait valider les champs obligatoires de l'étape 2", async ({ page }) => {
    // Remplir l'étape 1
    await fillRegisterFormStep1(page, TEST_USERS.valid)
    await page.getByRole('button', { name: 'Continuer' }).click()

    // Essayer de passer à l'étape 3 sans remplir les champs
    await page.getByRole('button', { name: 'Continuer' }).click()

    // Vérifier les messages d'erreur
    await expect(page.getByText('Le pays est requis')).toBeVisible()
    await expect(page.getByText('La devise est requise')).toBeVisible()
  })

  test("8. devrait passer à l'étape 3 avec des informations de localisation valides", async ({
    page,
  }) => {
    // Remplir l'étape 1
    await fillRegisterFormStep1(page, TEST_USERS.valid)
    await page.getByRole('button', { name: 'Continuer' }).click()

    // Remplir l'étape 2
    await fillRegisterFormStep2(page, TEST_USERS.valid)

    // Passer à l'étape suivante
    await page.getByRole('button', { name: 'Continuer' }).click()

    // Vérifier que nous sommes à l'étape 3
    await expect(page.getByText('Sécurité du compte')).toBeVisible()
    await expect(page.getByLabel('Mot de passe')).toBeVisible()
    await expect(page.getByLabel('Confirmer le mot de passe')).toBeVisible()
  })

  test("9. devrait valider la complexité du mot de passe à l'étape 3", async ({ page }) => {
    // Naviguer jusqu'à l'étape 3
    await fillRegisterFormStep1(page, TEST_USERS.valid)
    await page.getByRole('button', { name: 'Continuer' }).click()
    await fillRegisterFormStep2(page, TEST_USERS.valid)
    await page.getByRole('button', { name: 'Continuer' }).click()

    // Tester des mots de passe simples qui ne respectent pas les critères de complexité
    for (const invalidPassword of INVALID_INPUTS.passwords.slice(0, 3)) {
      await page.getByLabel('Mot de passe').fill(invalidPassword)
      await page.getByRole('button', { name: "S'inscrire" }).click()

      if (invalidPassword === '') {
        await expect(page.getByText('Le mot de passe est requis')).toBeVisible()
      } else {
        await expect(page.getByText(/Le mot de passe doit contenir au moins/)).toBeVisible()
      }

      await page.getByLabel('Mot de passe').clear()
    }
  })

  test('10. devrait valider la correspondance des mots de passe', async ({ page }) => {
    // Naviguer jusqu'à l'étape 3
    await fillRegisterFormStep1(page, TEST_USERS.valid)
    await page.getByRole('button', { name: 'Continuer' }).click()
    await fillRegisterFormStep2(page, TEST_USERS.valid)
    await page.getByRole('button', { name: 'Continuer' }).click()

    // Remplir avec des mots de passe qui ne correspondent pas
    await page.getByLabel('Mot de passe').fill(TEST_USERS.valid.password)
    await page.getByLabel('Confirmer le mot de passe').fill(TEST_USERS.valid.password + '123')
    await page.getByRole('button', { name: "S'inscrire" }).click()

    // Vérifier le message d'erreur
    await expect(page.getByText('Les mots de passe ne correspondent pas')).toBeVisible()
  })

  test('11. devrait créer un compte avec succès', async ({ page }) => {
    // Mock pour simuler la création de compte
    await page.route('**/auth/v1/signup', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '123',
          email: TEST_USERS.valid.email,
          identities: [],
          aud: 'authenticated',
        }),
      })
    })

    // Remplir toutes les étapes du formulaire
    await fillRegisterFormStep1(page, TEST_USERS.valid)
    await page.getByRole('button', { name: 'Continuer' }).click()
    await fillRegisterFormStep2(page, TEST_USERS.valid)
    await page.getByRole('button', { name: 'Continuer' }).click()
    await fillRegisterFormStep3(page, TEST_USERS.valid.password)

    // S'inscrire
    await page.getByRole('button', { name: "S'inscrire" }).click()

    // Vérifier que l'inscription est réussie
    await expect(page.getByText(/Un email de confirmation a été envoyé/)).toBeVisible()
  })

  test("12. devrait empêcher l'inscription avec un email existant", async ({ page }) => {
    // Mock pour simuler une erreur email existant
    await page.route('**/auth/v1/signup', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'User already registered',
          message: 'Cet email est déjà utilisé',
        }),
      })
    })

    // Remplir toutes les étapes du formulaire
    await fillRegisterFormStep1(page, TEST_USERS.valid)
    await page.getByRole('button', { name: 'Continuer' }).click()
    await fillRegisterFormStep2(page, TEST_USERS.valid)
    await page.getByRole('button', { name: 'Continuer' }).click()
    await fillRegisterFormStep3(page, TEST_USERS.valid.password)

    // S'inscrire
    await page.getByRole('button', { name: "S'inscrire" }).click()

    // Vérifier le message d'erreur
    await expect(page.getByText('Cet email est déjà utilisé')).toBeVisible()
  })
})
