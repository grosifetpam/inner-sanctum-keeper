
-- Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Public can read system_info" ON public.system_info;
DROP POLICY IF EXISTS "Users can read own system_info" ON public.system_info;
DROP POLICY IF EXISTS "Users can insert own system_info" ON public.system_info;
DROP POLICY IF EXISTS "Users can update own system_info" ON public.system_info;

CREATE POLICY "Public can read system_info" ON public.system_info FOR SELECT USING (true);
CREATE POLICY "Users can insert own system_info" ON public.system_info FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own system_info" ON public.system_info FOR UPDATE USING (auth.uid() = user_id);
