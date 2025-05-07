/*
  # Ajouter un utilisateur administrateur par défaut
  
  1. Ajout d'un utilisateur
    - Crée un utilisateur admin avec:
      - email: admin@example.com
      - mot de passe: admin123
      - droits administrateur
*/

INSERT INTO public.users (username, email, password, is_admin)
VALUES (
  'admin',
  'admin@example.com',
  'admin123',
  true
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.users (username, email, password, is_admin)
VALUES (
  'user',
  'user@example.com',
  'user123',
  false
)
ON CONFLICT (email) DO NOTHING;