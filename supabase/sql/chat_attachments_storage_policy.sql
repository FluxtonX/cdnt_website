-- ══════════════════════════════════════════════════════════════════════════════
-- STORAGE POLICY: Allow uploads & reads for chat-attachments bucket
-- ══════════════════════════════════════════════════════════════════════════════
-- Run this in your Supabase Dashboard -> SQL Editor if you wish to allow
-- direct client SDK uploads into the chat-attachments bucket.

-- 1. Ensure bucket exists and is public
insert into storage.buckets (id, name, public)
values ('chat-attachments', 'chat-attachments', true)
on conflict (id) do update set public = true;

-- 2. Allow public read access on chat-attachments
create policy "Public Access on chat-attachments"
on storage.objects for select
using ( bucket_id = 'chat-attachments' );

-- 3. Allow authenticated users to upload into chat-attachments
create policy "Authenticated users can upload chat-attachments"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'chat-attachments' );

-- 4. Allow anon to upload into chat-attachments
create policy "Anon can upload chat-attachments"
on storage.objects for insert
to anon
with check ( bucket_id = 'chat-attachments' );
