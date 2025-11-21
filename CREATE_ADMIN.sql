-- Script SQL pour créer l'utilisateur admin
-- À exécuter dans Supabase Dashboard → SQL Editor

-- 1. Créer l'utilisateur dans la table users si elle existe
INSERT INTO users (openId, name, email, role, loginMethod, "createdAt", "updatedAt")
VALUES (
  'bch.film@gmail.com',
  'Admin Jenia',
  'bch.film@gmail.com',
  'admin',
  'email',
  NOW(),
  NOW()
)
ON CONFLICT (openId) 
DO UPDATE SET 
  role = 'admin',
  "updatedAt" = NOW();

-- 2. Vérifier que l'utilisateur a été créé
SELECT id, name, email, role FROM users WHERE role = 'admin';
