import { test, expect, Page } from '@playwright/test'
import {
  loginUser,
  getTestUser,
  setupResetContext,
  mockSupabaseResetToken,
  mockSupabaseSessionResponse,
} from './fixtures'

// Contexte de test pour la page de demande de réinitialisation du mot de passe
test.describe('Test de demande de réinitialisation du mot de passe', () => {
  let page: Page

  test.beforeEach(async ({ browser }) => {
    const context = await browser.newContext()
    page = await context.newPage()
    await page.goto('/auth/forgot-password')
  })

  test('01 - Devrait afficher correctement la page de demande de réinitialisation', async () => {
    // Vérification du titre principal
    await expect(page.locator('h1')).toContainText('Mot de passe oublié')

    // Vérification des éléments du formulaire
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByPlaceholder('votre@email.com')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Envoyer les instructions' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Retour à la connexion' })).toBeVisible()
  })

  test('02 - Devrait afficher une erreur si le champ email est vide', async () => {
    // Soumettre le formulaire sans remplir le champ email
    await page.getByRole('button', { name: 'Envoyer les instructions' }).click()

    // Vérifier l'affichage du message d'erreur
    await expect(page.locator('.text-red-500')).toContainText("L'adresse email est requise")
  })

  test("03 - Devrait afficher une erreur si l'email n'est pas au bon format", async () => {
    // Remplir le formulaire avec un email invalide
    await page.getByLabel('Email').fill('email-invalide')
    await page.getByRole('button', { name: 'Envoyer les instructions' }).click()

    // Vérifier l'affichage du message d'erreur
    await expect(page.locator('.text-red-500')).toContainText(
      'Veuillez entrer une adresse email valide',
    )
  })

  test('04 - Devrait envoyer le formulaire correctement avec un email valide', async ({
    context,
  }) => {
    // Intercepter les appels API Supabase
    await mockSupabaseResetToken(context, true)

    // Remplir le formulaire avec un email valide
    const testUser = getTestUser()
    await page.getByLabel('Email').fill(testUser.email)

    // Soumettre le formulaire
    await page.getByRole('button', { name: 'Envoyer les instructions' }).click()

    // Vérifier la redirection vers la page de confirmation
    await expect(page).toHaveURL(/\/auth\/forgot-password-confirmation/)
  })

  test('05 - Devrait afficher une notification de succès après envoi du formulaire valide', async ({
    context,
  }) => {
    // Intercepter les appels API Supabase
    await mockSupabaseResetToken(context, true)

    // Remplir et soumettre le formulaire
    const testUser = getTestUser()
    await page.getByLabel('Email').fill(testUser.email)
    await page.getByRole('button', { name: 'Envoyer les instructions' }).click()

    // Vérifier l'affichage de la notification de succès
    await expect(page.locator('.Toastify__toast--success')).toBeVisible()
    await expect(page.locator('.Toastify__toast--success')).toContainText('Email envoyé')
  })

  test('06 - Devrait désactiver le bouton pendant la soumission', async ({ context }) => {
    // Intercepter les appels API avec un délai pour observer l'état de chargement
    await mockSupabaseResetToken(context, true, 500) // Ajouter un délai de 500ms

    // Remplir le formulaire
    const testUser = getTestUser()
    await page.getByLabel('Email').fill(testUser.email)

    // Soumettre le formulaire
    await page.getByRole('button', { name: 'Envoyer les instructions' }).click()

    // Vérifier que le bouton est désactivé pendant la soumission
    await expect(page.getByRole('button', { name: 'Envoyer les instructions' })).toBeDisabled()

    // Vérifier la présence de l'indicateur de chargement
    await expect(page.locator('.animate-spin')).toBeVisible()
  })

  test("07 - Devrait afficher une erreur en cas d'échec de l'API", async ({ context }) => {
    // Intercepter les appels API Supabase avec une erreur
    await mockSupabaseResetToken(context, false, 0, 'Erreur serveur')

    // Remplir et soumettre le formulaire
    const testUser = getTestUser()
    await page.getByLabel('Email').fill(testUser.email)
    await page.getByRole('button', { name: 'Envoyer les instructions' }).click()

    // Vérifier l'affichage de la notification d'erreur
    await expect(page.locator('.Toastify__toast--error')).toBeVisible()
    await expect(page.locator('.Toastify__toast--error')).toContainText('Erreur')
  })

  test('08 - Devrait rediriger vers la page de connexion lors du clic sur le lien retour', async () => {
    // Cliquer sur le lien de retour à la connexion
    await page.getByRole('link', { name: 'Retour à la connexion' }).click()

    // Vérifier la redirection vers la page de connexion
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test("09 - Devrait préserver l'email en cas d'erreur de soumission", async ({ context }) => {
    // Intercepter les appels API Supabase avec une erreur
    await mockSupabaseResetToken(context, false)

    // Remplir et soumettre le formulaire
    const testUser = getTestUser()
    await page.getByLabel('Email').fill(testUser.email)
    await page.getByRole('button', { name: 'Envoyer les instructions' }).click()

    // Vérifier que l'email est toujours présent dans le champ
    await expect(page.getByLabel('Email')).toHaveValue(testUser.email)
  })

  test('10 - Devrait permettre de corriger et resoumettre après une erreur de validation', async () => {
    // Soumettre le formulaire avec un email invalide
    await page.getByLabel('Email').fill('email-invalide')
    await page.getByRole('button', { name: 'Envoyer les instructions' }).click()

    // Vérifier l'affichage de l'erreur
    await expect(page.locator('.text-red-500')).toBeVisible()

    // Corriger l'email et resoumettre
    await page.getByLabel('Email').fill('email.valide@example.com')
    await page.getByRole('button', { name: 'Envoyer les instructions' }).click()

    // Vérifier que l'erreur a disparu
    await expect(page.locator('.text-red-500')).toBeHidden()
  })
})

// Contexte de test pour la page de réinitialisation du mot de passe
test.describe('Test de réinitialisation du mot de passe', () => {
  let page: Page

  test.beforeEach(async ({ browser }) => {
    // Créer un contexte avec un token de réinitialisation simulé
    const { page: resetPage } = await setupResetContext(browser)
    page = resetPage
    await page.goto('/auth/reset-password')
  })

  test('01 - Devrait afficher correctement la page de réinitialisation', async () => {
    // Vérification du titre principal
    await expect(page.locator('h1')).toContainText('Réinitialiser le mot de passe')

    // Vérification des éléments du formulaire
    await expect(page.getByLabel('Nouveau mot de passe')).toBeVisible()
    await expect(page.getByLabel('Confirmer le mot de passe')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Réinitialiser le mot de passe' })).toBeVisible()
  })

  test('02 - Devrait afficher une erreur si le champ mot de passe est vide', async () => {
    // Soumettre le formulaire sans remplir le champ mot de passe
    await page.getByRole('button', { name: 'Réinitialiser le mot de passe' }).click()

    // Vérifier l'affichage du message d'erreur
    await expect(page.locator('.text-red-500')).toContainText('Le mot de passe est requis')
  })

  test('03 - Devrait afficher une erreur si le mot de passe est trop court', async () => {
    // Remplir le formulaire avec un mot de passe trop court
    await page.getByLabel('Nouveau mot de passe').fill('abc12')
    await page.getByRole('button', { name: 'Réinitialiser le mot de passe' }).click()

    // Vérifier l'affichage du message d'erreur
    await expect(page.locator('.text-red-500')).toContainText(
      'Le mot de passe doit contenir au moins 6 caractères',
    )
  })

  test('04 - Devrait afficher une erreur si le mot de passe ne respecte pas les critères de complexité', async () => {
    // Remplir le formulaire avec un mot de passe qui ne respecte pas les critères
    await page.getByLabel('Nouveau mot de passe').fill('password123')
    await page.getByRole('button', { name: 'Réinitialiser le mot de passe' }).click()

    // Vérifier l'affichage du message d'erreur
    await expect(page.locator('.text-red-500')).toContainText(
      'Le mot de passe doit contenir au moins une lettre majuscule',
    )
  })

  test('05 - Devrait afficher une erreur si le champ de confirmation est vide', async () => {
    // Remplir uniquement le champ mot de passe
    await page.getByLabel('Nouveau mot de passe').fill('Password123')
    await page.getByRole('button', { name: 'Réinitialiser le mot de passe' }).click()

    // Vérifier l'affichage du message d'erreur pour la confirmation
    await expect(page.locator('.text-red-500')).toContainText(
      'La confirmation du mot de passe est requise',
    )
  })

  test('06 - Devrait afficher une erreur si les mots de passe ne correspondent pas', async () => {
    // Remplir les deux champs avec des valeurs différentes
    await page.getByLabel('Nouveau mot de passe').fill('Password123')
    await page.getByLabel('Confirmer le mot de passe').fill('DifferentPassword123')
    await page.getByRole('button', { name: 'Réinitialiser le mot de passe' }).click()

    // Vérifier l'affichage du message d'erreur
    await expect(page.locator('.text-red-500')).toContainText(
      'Les mots de passe ne correspondent pas',
    )
  })

  test('07 - Devrait envoyer le formulaire correctement avec des données valides', async ({
    context,
  }) => {
    // Simuler une réponse valide de Supabase pour la mise à jour du mot de passe
    await mockSupabaseSessionResponse(context, true)

    // Remplir le formulaire avec des données valides
    await page.getByLabel('Nouveau mot de passe').fill('Password123')
    await page.getByLabel('Confirmer le mot de passe').fill('Password123')

    // Soumettre le formulaire
    await page.getByRole('button', { name: 'Réinitialiser le mot de passe' }).click()

    // Vérifier la redirection vers la page de connexion après succès
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('08 - Devrait afficher une notification de succès après réinitialisation', async ({
    context,
  }) => {
    // Simuler une réponse valide de Supabase
    await mockSupabaseSessionResponse(context, true)

    // Remplir et soumettre le formulaire
    await page.getByLabel('Nouveau mot de passe').fill('Password123')
    await page.getByLabel('Confirmer le mot de passe').fill('Password123')
    await page.getByRole('button', { name: 'Réinitialiser le mot de passe' }).click()

    // Vérifier l'affichage de la notification de succès
    await expect(page.locator('.Toastify__toast--success')).toBeVisible()
    await expect(page.locator('.Toastify__toast--success')).toContainText(
      'Mot de passe réinitialisé',
    )
  })

  test('09 - Devrait désactiver le bouton pendant la soumission', async ({ context }) => {
    // Simuler une réponse valide de Supabase avec délai
    await mockSupabaseSessionResponse(context, true, 500) // Ajouter un délai de 500ms

    // Remplir le formulaire
    await page.getByLabel('Nouveau mot de passe').fill('Password123')
    await page.getByLabel('Confirmer le mot de passe').fill('Password123')

    // Soumettre le formulaire
    await page.getByRole('button', { name: 'Réinitialiser le mot de passe' }).click()

    // Vérifier que le bouton est désactivé pendant la soumission
    await expect(page.getByRole('button', { name: 'Réinitialiser le mot de passe' })).toBeDisabled()

    // Vérifier la présence de l'indicateur de chargement
    await expect(page.locator('.animate-spin')).toBeVisible()
  })

  test('10 - Devrait afficher une erreur en cas de token invalide ou expiré', async ({
    context,
  }) => {
    // Simuler une réponse d'erreur de Supabase pour un token expiré
    await mockSupabaseSessionResponse(context, false, 0, 'Le lien de réinitialisation a expiré')

    // Remplir et soumettre le formulaire
    await page.getByLabel('Nouveau mot de passe').fill('Password123')
    await page.getByLabel('Confirmer le mot de passe').fill('Password123')
    await page.getByRole('button', { name: 'Réinitialiser le mot de passe' }).click()

    // Vérifier l'affichage de la notification d'erreur
    await expect(page.locator('.Toastify__toast--error')).toBeVisible()
    await expect(page.locator('.Toastify__toast--error')).toContainText('expiré')

    // Vérifier la redirection vers la page de demande de réinitialisation
    await expect(page).toHaveURL(/\/auth\/forgot-password/)
  })

  test("11 - Devrait permettre d'alterner entre l'affichage et le masquage du mot de passe", async () => {
    // Remplir le champ mot de passe
    await page.getByLabel('Nouveau mot de passe').fill('Password123')

    // Vérifier que le type du champ est "password" (mot de passe masqué)
    await expect(page.getByLabel('Nouveau mot de passe')).toHaveAttribute('type', 'password')

    // Cliquer sur l'icône pour afficher le mot de passe
    await page.locator('.grid.gap-1.mt-2.relative').first().locator('button').click()

    // Vérifier que le type du champ est "text" (mot de passe visible)
    await expect(page.getByLabel('Nouveau mot de passe')).toHaveAttribute('type', 'text')

    // Cliquer à nouveau pour masquer le mot de passe
    await page.locator('.grid.gap-1.mt-2.relative').first().locator('button').click()

    // Vérifier que le type du champ est redevenu "password"
    await expect(page.getByLabel('Nouveau mot de passe')).toHaveAttribute('type', 'password')
  })

  test('12 - Devrait valider le mot de passe avec tous les critères requis', async () => {
    // Test de validation du mot de passe conforme à tous les critères
    // 1. Tester avec un mot de passe sans majuscule
    await page.getByLabel('Nouveau mot de passe').fill('password123')
    await page.getByRole('button', { name: 'Réinitialiser le mot de passe' }).click()
    await expect(page.locator('.text-red-500')).toContainText('majuscule')

    // 2. Tester avec un mot de passe sans minuscule
    await page.getByLabel('Nouveau mot de passe').fill('PASSWORD123')
    await page.getByRole('button', { name: 'Réinitialiser le mot de passe' }).click()
    await expect(page.locator('.text-red-500')).toContainText('minuscule')

    // 3. Tester avec un mot de passe sans chiffre
    await page.getByLabel('Nouveau mot de passe').fill('PasswordTest')
    await page.getByRole('button', { name: 'Réinitialiser le mot de passe' }).click()
    await expect(page.locator('.text-red-500')).toContainText('chiffre')

    // 4. Tester avec un mot de passe valide qui répond à tous les critères
    await page.getByLabel('Nouveau mot de passe').fill('PasswordTest123')
    await page.getByLabel('Confirmer le mot de passe').fill('PasswordTest123')
    // Ne pas cliquer sur le bouton, juste vérifier qu'on peut atteindre ce point sans erreur
    // L'erreur devrait avoir disparu
    await expect(page.locator('.text-red-500')).toBeHidden()
  })
})
