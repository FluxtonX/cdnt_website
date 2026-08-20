-- Supabase Migration: Default Chequing Account for All Users & Backfill
-- Run this in your Supabase SQL Editor.

-- 1. Function & Trigger to automatically create an active Chequing Account for all new signups
create or replace function public.handle_new_user_bank_account()
returns trigger
language plpgsql
security definer
as $$
declare
  v_random_acc text;
begin
  -- Generate unique account number format: 05496-XXXXXXX
  v_random_acc := '05496-' || floor(1000000 + random() * 9000000)::text;

  -- Create active default Chequing Account for the new user
  insert into public.user_bank_accounts (
    user_id,
    account_category,
    account_type,
    account_name,
    account_number,
    currency,
    balance,
    status,
    approved_at
  )
  values (
    new.id,
    'everyday',
    'chequing',
    'Chequing Account',
    v_random_acc,
    'CAD',
    0.00,
    'active',
    now()
  )
  on conflict do nothing;

  return new;
end;
$$;

-- Create trigger on auth.users safely
drop trigger if exists on_auth_user_created_bank_account on auth.users;
create trigger on_auth_user_created_bank_account
  after insert on auth.users
  for each row execute procedure public.handle_new_user_bank_account();

-- 2. Backfill: Provision an active default Chequing account for all existing users who don't have one
insert into public.user_bank_accounts (
  user_id,
  account_category,
  account_type,
  account_name,
  account_number,
  currency,
  balance,
  status,
  approved_at
)
select 
  u.id,
  'everyday',
  'chequing',
  'Chequing Account',
  '05496-' || floor(1000000 + random() * 9000000)::text,
  'CAD',
  0.00,
  'active',
  now()
from auth.users u
where not exists (
  select 1 
  from public.user_bank_accounts ba 
  where ba.user_id = u.id 
    and ba.account_type = 'chequing'
);
