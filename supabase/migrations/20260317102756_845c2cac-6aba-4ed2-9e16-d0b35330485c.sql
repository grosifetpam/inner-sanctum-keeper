
-- Crisis plan table storing JSONB data per user
CREATE TABLE public.crisis_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  warning_signals text[] NOT NULL DEFAULT '{}',
  coping_strategies text[] NOT NULL DEFAULT '{}',
  safe_contacts jsonb NOT NULL DEFAULT '[]',
  safe_actions text[] NOT NULL DEFAULT '{}',
  personal_affirmations text[] NOT NULL DEFAULT '{}',
  avoid_list text[] NOT NULL DEFAULT '{}',
  alter_guidelines jsonb NOT NULL DEFAULT '[]',
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.crisis_plans ENABLE ROW LEVEL SECURITY;

-- Public can read if is_public
CREATE POLICY "Public can read public crisis plans"
ON public.crisis_plans FOR SELECT
USING (is_public = true);

-- Authenticated users can CRUD their own
CREATE POLICY "Users can CRUD own crisis plans"
ON public.crisis_plans FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
