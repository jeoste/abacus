-- ============================================================================
-- Schéma complet Supabase pour l'application Abacus
-- Hiérarchie : Projet → Systèmes → Flux
-- ============================================================================
-- À exécuter dans l'éditeur SQL de Supabase
-- Ce script crée toutes les tables, fonctions, triggers, RLS policies et index
-- ============================================================================

-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- Table profiles (extension de auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table systems (anciennement interfaces)
CREATE TABLE IF NOT EXISTS public.systems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table flows
CREATE TABLE IF NOT EXISTS public.flows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  client TEXT,
  tech TEXT NOT NULL CHECK (tech IN ('Talend', 'Blueway')),
  sources INTEGER NOT NULL DEFAULT 1,
  targets INTEGER NOT NULL DEFAULT 1,
  transformations INTEGER NOT NULL DEFAULT 0,
  complexity TEXT NOT NULL CHECK (complexity IN ('simple', 'modérée', 'complexe')),
  user_level TEXT NOT NULL CHECK (user_level IN ('junior', 'confirmé', 'expert')),
  data_volume INTEGER NOT NULL DEFAULT 100,
  frequency TEXT NOT NULL CHECK (frequency IN ('unique', 'quotidien', 'hebdomadaire', 'mensuel')),
  environment TEXT NOT NULL CHECK (environment IN ('dev', 'test', 'prod')),
  type_flux TEXT CHECK (type_flux IN ('job ETL', 'route', 'data service', 'joblet')),
  flow_type TEXT NOT NULL CHECK (flow_type IN ('synchrone', 'asynchrone')),
  max_transcodifications INTEGER NOT NULL DEFAULT 0,
  max_sources INTEGER NOT NULL DEFAULT 1,
  max_targets INTEGER NOT NULL DEFAULT 1,
  max_rules INTEGER NOT NULL DEFAULT 0,
  architecture_pivot BOOLEAN NOT NULL DEFAULT FALSE,
  messaging_queue BOOLEAN NOT NULL DEFAULT FALSE,
  gestion_erreurs_techniques BOOLEAN NOT NULL DEFAULT FALSE,
  gestion_erreurs_fonctionnelles BOOLEAN NOT NULL DEFAULT FALSE,
  gestion_logs BOOLEAN NOT NULL DEFAULT FALSE,
  contract_completeness INTEGER NOT NULL DEFAULT 100 CHECK (contract_completeness >= 0 AND contract_completeness <= 100),
  comments TEXT,
  estimated_days NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table de liaison flows_systems (many-to-many)
CREATE TABLE IF NOT EXISTS public.flows_systems (
  flow_id UUID REFERENCES public.flows(id) ON DELETE CASCADE NOT NULL,
  system_id UUID REFERENCES public.systems(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (flow_id, system_id)
);

-- ============================================================================
-- 2. FONCTIONS
-- ============================================================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 3. TRIGGERS
-- ============================================================================

-- Trigger pour créer le profil automatiquement lors de l'inscription
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_systems_updated_at ON public.systems;
CREATE TRIGGER update_systems_updated_at BEFORE UPDATE ON public.systems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_flows_updated_at ON public.flows;
CREATE TRIGGER update_flows_updated_at BEFORE UPDATE ON public.flows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flows_systems ENABLE ROW LEVEL SECURITY;

-- Supprimer TOUTES les policies existantes pour une réinitialisation propre
-- Cette approche garantit qu'il n'y a pas de conflit lors de la création
DO $$
DECLARE
  r RECORD;
BEGIN
  -- Supprimer toutes les policies de profiles
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', r.policyname);
  END LOOP;
  
  -- Supprimer toutes les policies de projects
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'projects') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.projects', r.policyname);
  END LOOP;
  
  -- Supprimer toutes les policies de systems
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'systems') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.systems', r.policyname);
  END LOOP;
  
  -- Supprimer toutes les policies de flows
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'flows') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.flows', r.policyname);
  END LOOP;
  
  -- Supprimer toutes les policies de flows_systems
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'flows_systems') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.flows_systems', r.policyname);
  END LOOP;
END $$;

-- Policies pour profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can create own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies pour projects
CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- Policies pour systems
CREATE POLICY "Users can view own systems"
  ON public.systems FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own systems"
  ON public.systems FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own systems"
  ON public.systems FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own systems"
  ON public.systems FOR DELETE
  USING (auth.uid() = user_id);

-- Policies pour flows
CREATE POLICY "Users can view own flows"
  ON public.flows FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own flows"
  ON public.flows FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flows"
  ON public.flows FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own flows"
  ON public.flows FOR DELETE
  USING (auth.uid() = user_id);

-- Policies pour flows_systems
CREATE POLICY "Users can view own flows_systems"
  ON public.flows_systems FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.flows f 
      WHERE f.id = flows_systems.flow_id 
      AND f.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own flows_systems"
  ON public.flows_systems FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.flows f 
      WHERE f.id = flows_systems.flow_id 
      AND f.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own flows_systems"
  ON public.flows_systems FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.flows f 
      WHERE f.id = flows_systems.flow_id 
      AND f.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 5. INDEX
-- ============================================================================

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_systems_user_id ON public.systems(user_id);
CREATE INDEX IF NOT EXISTS idx_systems_project_id ON public.systems(project_id);
CREATE INDEX IF NOT EXISTS idx_flows_user_id ON public.flows(user_id);
CREATE INDEX IF NOT EXISTS idx_flows_systems_flow_id ON public.flows_systems(flow_id);
CREATE INDEX IF NOT EXISTS idx_flows_systems_system_id ON public.flows_systems(system_id);

-- ============================================================================
-- 6. CRÉER LES PROFILS MANQUANTS (pour les utilisateurs existants)
-- ============================================================================

-- Ce script crée automatiquement les profils pour les utilisateurs qui existent
-- dans auth.users mais pas dans public.profiles
-- Cette section est optionnelle et peut être exécutée séparément si nécessaire
DO $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data->>'full_name'
  FROM auth.users u
  WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = u.id
  )
  ON CONFLICT (id) DO NOTHING;
END $$;

-- ============================================================================
-- Script de correction : Créer les profils manquants pour les utilisateurs existants
-- ============================================================================
-- Exécutez ce script si des utilisateurs existent dans auth.users mais pas dans public.profiles
-- Ce script est idempotent (peut être exécuté plusieurs fois sans problème)

DO $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data->>'full_name'
  FROM auth.users u
  WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = u.id
  )
  ON CONFLICT (id) DO NOTHING;
END $$;

-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================

