/*
Ce fichier explique comment ajouter un utilisateur en tant qu'admin ou gestionnaire
de l'agence pour lui permettre de créer des véhicules.

Voici la commande SQL à exécuter dans l'interface SQL de Supabase :
*/

-- Option 1: Insérer un nouveau membership pour l'utilisateur
INSERT INTO public.memberships (user_id, agency_id, role)
VALUES 
(
  '[VOTRE_USER_ID]', -- Remplacez par l'ID de votre utilisateur
  '2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', -- ID de l'agence de test
  'admin' -- ou 'gestionnaire'
);

-- Option 2: Mettre à jour un membership existant
UPDATE public.memberships
SET role = 'admin' -- ou 'gestionnaire'
WHERE user_id = '[VOTRE_USER_ID]' -- Remplacez par l'ID de votre utilisateur
AND agency_id = '2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15';
