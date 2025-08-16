-- 08_test_data.sql
-- Données de test pour la base de données

-- Agence
INSERT INTO public.agencies (id, name, description, address, contact_email)
VALUES 
('2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', 'Mopayo Transport', 'Agence de transport', 'Avenue de la Liberté, Dakar', 'contact@mopayo.com');

-- Utilisateurs et membres (assurez-vous que ces utilisateurs existent dans auth.users)
-- Note: Pour les ID d'utilisateurs, vous devrez remplacer ceux-ci par de vrais UUID après création dans Supabase Auth
INSERT INTO public.users (id, first_name, last_name, display_name)
VALUES 
('00000000-0000-0000-0000-000000000001', 'Admin', 'User', 'Admin'),
('00000000-0000-0000-0000-000000000002', 'Manager', 'User', 'Manager'),
('00000000-0000-0000-0000-000000000003', 'Driver', 'User', 'Driver'),
('00000000-0000-0000-0000-000000000004', 'Regular', 'User', 'Regular User');

-- Membres d'agence avec différents rôles
INSERT INTO public.memberships (user_id, agency_id, role)
VALUES 
('00000000-0000-0000-0000-000000000001', '2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', 'admin'),
('00000000-0000-0000-0000-000000000002', '2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', 'gestionnaire'),
('00000000-0000-0000-0000-000000000003', '2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', 'chauffeur'),
('00000000-0000-0000-0000-000000000004', '2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', 'utilisateur');

-- Véhicules
INSERT INTO public.vehicles (id, agency_id, immatriculation, marque, modele, annee, type, statut, carburant, kilometrage)
VALUES 
('3f9e2a1c-7a3b-44ed-9f16-82f7c7746f11', '2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', 'DK-1234-AA', 'Toyota', 'Hiace', 2019, 'Utilitaire', 'En service', 'Diesel', 45000),
('3f9e2a1c-7a3b-44ed-9f16-82f7c7746f12', '2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', 'DK-5678-BB', 'Nissan', 'Urvan', 2020, 'Utilitaire', 'Disponible', 'Diesel', 32000),
('3f9e2a1c-7a3b-44ed-9f16-82f7c7746f13', '2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', 'DK-9012-CC', 'Mercedes', 'Sprinter', 2021, 'Utilitaire', 'Maintenance', 'Diesel', 28500);

-- Chauffeurs
INSERT INTO public.drivers (id, agency_id, first_name, last_name, email, phone, license_number, license_type, status, vehicle_id)
VALUES 
('4f9e2a1c-7a3b-44ed-9f16-82f7c7746f11', '2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', 'Amadou', 'Diallo', 'amadou@example.com', '+221700000001', 'DRV001', 'B', 'Active', '3f9e2a1c-7a3b-44ed-9f16-82f7c7746f11'),
('4f9e2a1c-7a3b-44ed-9f16-82f7c7746f12', '2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', 'Moussa', 'Sow', 'moussa@example.com', '+221700000002', 'DRV002', 'B', 'Active', '3f9e2a1c-7a3b-44ed-9f16-82f7c7746f12'),
('4f9e2a1c-7a3b-44ed-9f16-82f7c7746f13', '2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', 'Ibrahima', 'Ndiaye', 'ibrahima@example.com', '+221700000003', 'DRV003', 'B', 'On Leave', NULL);

-- Maintenances (schéma FR: type, statut, date_prevue, cout)
INSERT INTO public.maintenances (agency_id, vehicle_id, type, description, statut, date_prevue, cout)
VALUES 
('2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', '3f9e2a1c-7a3b-44ed-9f16-82f7c7746f13', 'Freins', 'Remplacement des freins', 'En cours', CURRENT_DATE, 75000),
('2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', '3f9e2a1c-7a3b-44ed-9f16-82f7c7746f11', 'Vidange', 'Vidange huile', 'Terminée', CURRENT_DATE - 10, 25000),
('2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', '3f9e2a1c-7a3b-44ed-9f16-82f7c7746f12', 'Révision', 'Inspection pré-voyage', 'Prévue', CURRENT_DATE + 5, 15000);

-- Checklists (schéma FR: verificateur, commentaires)
INSERT INTO public.checklists (agency_id, vehicle_id, verificateur, commentaires)
VALUES 
('2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', '3f9e2a1c-7a3b-44ed-9f16-82f7c7746f11', 'Contrôleur A', 'Pré-voyage OK'),
('2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', '3f9e2a1c-7a3b-44ed-9f16-82f7c7746f12', 'Contrôleur B', 'Checklist quotidienne en attente');

-- Éléments de checklist (schéma FR: nom, verifie, commentaire)
INSERT INTO public.checklist_items (checklist_id, agency_id, nom, verifie, commentaire)
VALUES 
((SELECT id FROM public.checklists LIMIT 1), '2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', 'Freins', true, NULL),
((SELECT id FROM public.checklists LIMIT 1), '2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', 'Éclairage', true, NULL),
((SELECT id FROM public.checklists LIMIT 1), '2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', 'Pneus', false, 'Pression basse sur pneu avant droit');

-- Paiements
INSERT INTO public.payments (agency_id, amount, payment_date, payment_type, payment_method, recipient_type, recipient_name, vehicle_id, status)
VALUES 
('2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', 75000, CURRENT_DATE - 2, 'Maintenance', 'Cash', 'Vendor', 'Garage Central', '3f9e2a1c-7a3b-44ed-9f16-82f7c7746f13', 'Completed'),
('2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', 50000, CURRENT_DATE - 5, 'Fuel', 'Mobile Payment', 'Vendor', 'Station Total', '3f9e2a1c-7a3b-44ed-9f16-82f7c7746f11', 'Completed'),
('2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', 200000, CURRENT_DATE, 'Salary', 'Bank Transfer', 'Driver', 'Amadou Diallo', NULL, 'Pending');

-- Catégories de dépenses
INSERT INTO public.expense_categories (agency_id, name, description, is_tax_deductible)
VALUES 
('2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', 'Carburant', 'Dépenses de carburant pour véhicules', true),
('2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', 'Entretien', 'Entretien régulier des véhicules', true),
('2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', 'Salaires', 'Salaires du personnel', false);

-- Recettes
INSERT INTO public.receipts (agency_id, date, vehicle_id, driver_id, gross_amount, fuel_cost, net_amount, starting_km, ending_km, status)
VALUES 
('2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', CURRENT_DATE - 1, '3f9e2a1c-7a3b-44ed-9f16-82f7c7746f11', '4f9e2a1c-7a3b-44ed-9f16-82f7c7746f11', 45000, 10000, 35000, 45000, 45120, 'Verified'),
('2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', CURRENT_DATE - 2, '3f9e2a1c-7a3b-44ed-9f16-82f7c7746f11', '4f9e2a1c-7a3b-44ed-9f16-82f7c7746f11', 52000, 12000, 40000, 44880, 45000, 'Verified'),
('2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', CURRENT_DATE - 1, '3f9e2a1c-7a3b-44ed-9f16-82f7c7746f12', '4f9e2a1c-7a3b-44ed-9f16-82f7c7746f12', 48000, 11000, 37000, 32000, 32150, 'Pending');

-- Objectifs de recette
INSERT INTO public.revenue_targets (agency_id, vehicle_id, target_type, start_date, end_date, target_amount)
VALUES 
('2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', '3f9e2a1c-7a3b-44ed-9f16-82f7c7746f11', 'Daily', CURRENT_DATE - 5, CURRENT_DATE + 25, 40000),
('2f9e2a1c-7a3b-44ed-9f16-82f7c7746f15', '3f9e2a1c-7a3b-44ed-9f16-82f7c7746f12', 'Daily', CURRENT_DATE - 5, CURRENT_DATE + 25, 38000);
