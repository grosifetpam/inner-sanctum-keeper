CREATE TABLE public.exercise_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT NOT NULL DEFAULT '',
  UNIQUE(user_id, exercise_id)
);

ALTER TABLE public.exercise_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own exercise completions"
  ON public.exercise_completions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
