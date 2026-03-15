CREATE TABLE public.system_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL DEFAULT 'interne',
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.system_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read public rules"
  ON public.system_rules
  FOR SELECT
  TO anon
  USING (is_public = true);

CREATE POLICY "Users can CRUD own rules"
  ON public.system_rules
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
