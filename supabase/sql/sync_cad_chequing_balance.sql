-- Supabase Migration: Sync CAD user_wallets balance to Chequing Account in user_bank_accounts
-- Run this in your Supabase SQL Editor to synchronize existing CAD funds with the Chequing Account.

-- 1. Update existing Chequing accounts that have 0 balance to match user_wallets CAD balance
update public.user_bank_accounts ba
set 
  balance = uw.balance,
  updated_at = now()
from public.user_wallets uw
where ba.user_id = uw.user_id
  and ba.account_type = 'chequing'
  and ba.currency = 'CAD'
  and uw.currency = 'CAD'
  and ba.balance = 0
  and uw.balance > 0;

-- 2. If a user does not yet have a chequing account but has a CAD wallet, create one with their balance
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
  uw.user_id,
  'everyday',
  'chequing',
  'Chequing Account',
  '05496-' || floor(1000000 + random() * 9000000)::text,
  'CAD',
  uw.balance,
  'active',
  now()
from public.user_wallets uw
where uw.currency = 'CAD'
  and not exists (
    select 1 
    from public.user_bank_accounts ba 
    where ba.user_id = uw.user_id 
      and ba.account_type = 'chequing'
  );
