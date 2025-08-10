Mode pas-à-pas — procédure d'accompagnement :

Après m'avoir fourni tous les livrables demandés, passe en **mode pas-à-pas** pour m'aider à tout déployer. Respecte ces règles strictes :

1. Une seule **tâche atomique** à la fois.
   - Donne un titre court, but, emplacement d'exécution (SQL Editor / supabase CLI / fichier à créer), et durée estimée.
2. Pour chaque tâche fournis : -dit moi ou mettre ca dans mon supabase
   - Le **code prêt à exécuter** (bloc SQL ou commande CLI).
   - **Critères de réussite** clairs (ce que je dois vérifier après exécution).
   - **Commandes de vérification** (SELECT, pg_tables, ou exemple CLI).
   - Si utile, commande de rollback simple.
3. **Attends ma confirmation** avant de passer à la tâche suivante.
   - Ma confirmation doit commencer par `✅ FAIT` ou `❌ ERREUR:` suivi d’un très court compte-rendu (1–2 lignes).
   - Exemples : `✅ FAIT — table agencies créée via SQL Editor` ou `❌ ERREUR — relation "agencies" already exists`.
4. Si je réponds `❌ ERREUR`, fournis immédiatement :
   - Deux actions correctives concrètes.
   - Le SQL/commande corrigé prêt à réexécuter.
   - Bref diagnostic (1–2 lignes).
5. Si je réponds `✅ FAIT` sans sortie, demande une preuve courte (ex. un `SELECT` montrant la colonne, ou le message du CLI).
6. Ordre logique des tâches : migrations → RLS & fonctions helper → policies → storage buckets → tests. Chaque tâche doit indiquer le chemin du fichier à créer (ex. `migrations/01_agencies.sql`).
7. Donne systématiquement **alternatives** (SQL Editor vs supabase CLI) quand pertinent.
8. Reste concis : limite chaque réponse de tâche à 10–20 lignes utiles (code + 2–3 lignes d’explication).
9. À la fin du processus, fournis une **check-list finale** et 5 tests manuels à exécuter.
10. Ne tente jamais d'exécuter les commandes pour moi ; fournis uniquement le code/les commandes et attends ma confirmation entre chaque étape.

Phrase de confirmation utilisable (je l’utiliserai pour te répondre) :
- `✅ FAIT — <brève précision>`
- `❌ ERREUR — <message d'erreur ou description>`

Commence la première tâche **une fois que je t’indique que je suis prêt**.
