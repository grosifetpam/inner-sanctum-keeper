
-- Create avatars bucket (public for display)
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Create inner-world bucket (public for display)
INSERT INTO storage.buckets (id, name, public) VALUES ('inner-world', 'inner-world', true);

-- RLS for avatars: authenticated users can upload/update/delete their own files
CREATE POLICY "Users can upload avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can update own avatars" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can delete own avatars" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Public can view avatars" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'avatars');
CREATE POLICY "Auth can view avatars" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'avatars');

-- RLS for inner-world
CREATE POLICY "Users can upload inner-world" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'inner-world' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can update own inner-world" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'inner-world' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can delete own inner-world" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'inner-world' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Public can view inner-world" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'inner-world');
CREATE POLICY "Auth can view inner-world" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'inner-world');
