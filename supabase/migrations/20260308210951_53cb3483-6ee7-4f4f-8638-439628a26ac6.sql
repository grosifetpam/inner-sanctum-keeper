CREATE TABLE public.lexicon_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  term text NOT NULL,
  definition text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'général',
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.lexicon_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read public lexicon" ON public.lexicon_entries FOR SELECT USING (is_public = true);
CREATE POLICY "Users can CRUD own lexicon" ON public.lexicon_entries FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);