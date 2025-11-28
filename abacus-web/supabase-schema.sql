-- Schéma Supabase pour l'application Abacus
-- À exécuter dans l'éditeur SQL de Supabase

-- Table profiles (extension de auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table interfaces
CREATE TABLE IF NOT EXISTS public.interfaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table flows
CREATE TABLE IF NOT EXISTS public.flows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  interface_id UUID REFERENCES public.interfaces(id) ON DELETE SET NULL,
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

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interfaces_updated_at BEFORE UPDATE ON public.interfaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flows_updated_at BEFORE UPDATE ON public.flows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer le profil automatiquement
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Row Level Security (RLS)

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interfaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flows ENABLE ROW LEVEL SECURITY;

-- Policies pour profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies pour interfaces
CREATE POLICY "Users can view own interfaces"
  ON public.interfaces FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own interfaces"
  ON public.interfaces FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interfaces"
  ON public.interfaces FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own interfaces"
  ON public.interfaces FOR DELETE
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

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_interfaces_user_id ON public.interfaces(user_id);
CREATE INDEX IF NOT EXISTS idx_flows_user_id ON public.flows(user_id);
CREATE INDEX IF NOT EXISTS idx_flows_interface_id ON public.flows(interface_id);

