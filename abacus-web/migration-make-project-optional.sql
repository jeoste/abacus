-- Migration : Rendre project_id optionnel dans systems et supprimer ON DELETE CASCADE
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Supprimer la contrainte NOT NULL sur project_id
ALTER TABLE public.systems 
  ALTER COLUMN project_id DROP NOT NULL;

-- 2. Supprimer la contrainte ON DELETE CASCADE et la remplacer par ON DELETE SET NULL
-- D'abord, supprimer l'ancienne contrainte
ALTER TABLE public.systems 
  DROP CONSTRAINT IF EXISTS systems_project_id_fkey;

-- Recréer la contrainte avec ON DELETE SET NULL
ALTER TABLE public.systems 
  ADD CONSTRAINT systems_project_id_fkey 
  FOREIGN KEY (project_id) 
  REFERENCES public.projects(id) 
  ON DELETE SET NULL;

