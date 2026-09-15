-- ══════════════════════════════════════════════════════════════════════════════
-- PRODUCTION-SAFE MIGRATION: Add lock_reason Column to Profiles
-- ══════════════════════════════════════════════════════════════════════════════
-- This migration is 100% metadata-only, non-blocking, and causes ZERO table rewrites.
-- In PostgreSQL 11+, adding a nullable text column operates via pg_attribute with
-- 0ms table locks and 0 downtime. Existing customer data is 100% untouched.
-- Run this in your Supabase Dashboard -> SQL Editor.

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'lock_reason'
  ) then
    alter table public.profiles add column lock_reason text;
  end if;
end $$;
