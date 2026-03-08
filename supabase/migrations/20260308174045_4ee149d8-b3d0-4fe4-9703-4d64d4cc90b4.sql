
-- System info table
CREATE TABLE public.system_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  current_front_alter_id TEXT NOT NULL DEFAULT '',
  mood_of_day TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.system_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own system_info" ON public.system_info FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own system_info" ON public.system_info FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own system_info" ON public.system_info FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Public can read system_info" ON public.system_info FOR SELECT TO anon USING (true);

-- Alters table
CREATE TABLE public.alters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT '',
  role_type TEXT NOT NULL DEFAULT 'autre',
  apparent_age TEXT,
  pronouns TEXT NOT NULL DEFAULT '',
  personality TEXT NOT NULL DEFAULT '',
  strengths TEXT NOT NULL DEFAULT '',
  difficulties TEXT NOT NULL DEFAULT '',
  relations TEXT NOT NULL DEFAULT '',
  internal_notes TEXT NOT NULL DEFAULT '',
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.alters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own alters" ON public.alters FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read public alters" ON public.alters FOR SELECT TO anon USING (is_public = true);

-- Journal entries
CREATE TABLE public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date TEXT NOT NULL,
  alter_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_public BOOLEAN NOT NULL DEFAULT false,
  is_private_alter_journal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own journal" ON public.journal_entries FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read public journal" ON public.journal_entries FOR SELECT TO anon USING (is_public = true);

-- Mood entries
CREATE TABLE public.mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date TEXT NOT NULL,
  alter_id TEXT NOT NULL,
  mood TEXT NOT NULL DEFAULT '',
  energy_level INTEGER NOT NULL DEFAULT 5,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own moods" ON public.mood_entries FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Front entries
CREATE TABLE public.front_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  alter_id TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.front_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own front" ON public.front_entries FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Citations
CREATE TABLE public.citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  alter_id TEXT NOT NULL,
  date TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.citations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own citations" ON public.citations FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read public citations" ON public.citations FOR SELECT TO anon USING (is_public = true);

-- Resources
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'articles',
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own resources" ON public.resources FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read public resources" ON public.resources FOR SELECT TO anon USING (is_public = true);

-- Inner world places
CREATE TABLE public.inner_world_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image TEXT,
  significance TEXT NOT NULL DEFAULT '',
  linked_alter_ids TEXT[] NOT NULL DEFAULT '{}',
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.inner_world_places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own places" ON public.inner_world_places FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read public places" ON public.inner_world_places FOR SELECT TO anon USING (is_public = true);

-- Timeline events
CREATE TABLE public.timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  alter_id TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own timeline" ON public.timeline_events FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read public timeline" ON public.timeline_events FOR SELECT TO anon USING (is_public = true);

-- Alter relations
CREATE TABLE public.alter_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  from_alter_id TEXT NOT NULL,
  to_alter_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'allié',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.alter_relations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own relations" ON public.alter_relations FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read relations" ON public.alter_relations FOR SELECT TO anon USING (true);
