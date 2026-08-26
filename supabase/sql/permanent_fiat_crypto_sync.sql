-- Supabase Migration: Consolidate All CAD Funds Directly into Chequing Account & Permanent Auto-Sync
-- Run this in your Supabase SQL Editor.

-- ==============================================================================
-- 1. Helper function: Ensure user has an active Chequing account in user_bank_accounts
-- ==============================================================================
create or replace function public.ensure_user_chequing_account(p_user_id uuid)
returns uuid
language plpgsql
security definer
as $$
declare
  v_account_id uuid;
  v_random_acc text;
begin
  select id into v_account_id
  from public.user_bank_accounts
  where user_id = p_user_id
    and account_type = 'chequing'
    and currency = 'CAD'
  limit 1;

  if v_account_id is null then
    v_random_acc := '05496-' || floor(1000000 + random() * 9000000)::text;
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
      p_user_id,
      'everyday',
      'chequing',
      'Chequing Account',
      v_random_acc,
      'CAD',
      0.00,
      'active',
      now()
    )
    returning id into v_account_id;
  end if;

  return v_account_id;
end;
$$;

-- ==============================================================================
-- 2. Enhanced execute_trade: CAD Buy/Sell Trades operate directly on Chequing Account
-- ==============================================================================
create or replace function public.execute_trade(
  p_user_id uuid,
  p_side text,            -- 'buy' or 'sell'
  p_crypto_symbol text,    -- e.g. 'BTC', 'ETH'
  p_fiat_currency text,   -- 'USDT' or 'CAD'
  p_usd_amount numeric,    -- amount of USD/USDT/CAD
  p_crypto_amount numeric  -- amount of cryptocurrency
)
returns boolean
language plpgsql
security definer
as $$
declare
  v_fiat_balance numeric;
  v_crypto_balance numeric;
  v_chequing_id uuid;
begin
  -- Ensure side is valid
  if p_side not in ('buy', 'sell') then
    raise exception 'Invalid trade side. Must be buy or sell.';
  end if;

  -- Ensure fiat currency is valid
  if p_fiat_currency not in ('USDT', 'CAD') then
    raise exception 'Invalid fiat currency. Must be USDT or CAD.';
  end if;

  if p_side = 'buy' then
    -- BUY: Deduct Fiat (USDT from wallet or CAD from Chequing), Credit Crypto
    if p_fiat_currency = 'CAD' then
      v_chequing_id := public.ensure_user_chequing_account(p_user_id);

      select balance into v_fiat_balance
      from public.user_bank_accounts
      where id = v_chequing_id
      for update;

      if v_fiat_balance is null or v_fiat_balance < p_usd_amount then
        raise exception 'Insufficient CAD Chequing balance to complete this purchase. Available: $%', coalesce(v_fiat_balance, 0);
      end if;

      -- Deduct from Chequing
      update public.user_bank_accounts
      set balance = balance - p_usd_amount,
          updated_at = now()
      where id = v_chequing_id;

    else
      -- USDT from user_wallets
      select balance into v_fiat_balance
      from public.user_wallets
      where user_id = p_user_id and currency = 'USDT'
      for update;

      if v_fiat_balance is null or v_fiat_balance < p_usd_amount then
        raise exception 'Insufficient USDT balance to complete this purchase.';
      end if;

      update public.user_wallets
      set balance = balance - p_usd_amount,
          updated_at = now()
      where user_id = p_user_id and currency = 'USDT';
    end if;

    -- Credit Crypto in user_wallets
    insert into public.user_wallets (user_id, currency, balance, updated_at)
    values (p_user_id, p_crypto_symbol, p_crypto_amount, now())
    on conflict (user_id, currency)
    do update set
      balance = public.user_wallets.balance + p_crypto_amount,
      updated_at = now();

    -- Record ledger logs
    insert into public.wallet_ledger (user_id, type, provider, currency, amount, status)
    values (p_user_id, 'DEPOSIT', 'EXCHANGE_BUY', p_crypto_symbol, p_crypto_amount, 'COMPLETED');

    insert into public.wallet_ledger (user_id, type, provider, currency, amount, status)
    values (p_user_id, 'WITHDRAWAL', 'EXCHANGE_BUY', p_fiat_currency, p_usd_amount, 'COMPLETED');

  else
    -- SELL: Deduct Crypto, Credit Fiat (CAD directly into Chequing, USDT into wallet)
    select balance into v_crypto_balance
    from public.user_wallets
    where user_id = p_user_id and currency = p_crypto_symbol
    for update;

    if v_crypto_balance is null or v_crypto_balance < p_crypto_amount then
      raise exception 'Insufficient % balance to complete this sale.', p_crypto_symbol;
    end if;

    -- Deduct Crypto from user_wallets
    update public.user_wallets
    set balance = balance - p_crypto_amount,
        updated_at = now()
    where user_id = p_user_id and currency = p_crypto_symbol;

    if p_fiat_currency = 'CAD' then
      -- Credit CAD directly into Chequing Bank Account
      v_chequing_id := public.ensure_user_chequing_account(p_user_id);
      update public.user_bank_accounts
      set balance = balance + p_usd_amount,
          updated_at = now()
      where id = v_chequing_id;
    else
      -- Credit USDT into wallet
      insert into public.user_wallets (user_id, currency, balance, updated_at)
      values (p_user_id, 'USDT', p_usd_amount, now())
      on conflict (user_id, currency)
      do update set
        balance = public.user_wallets.balance + p_usd_amount,
        updated_at = now();
    end if;

    -- Record ledger logs
    insert into public.wallet_ledger (user_id, type, provider, currency, amount, status)
    values (p_user_id, 'WITHDRAWAL', 'EXCHANGE_SELL', p_crypto_symbol, p_crypto_amount, 'COMPLETED');

    insert into public.wallet_ledger (user_id, type, provider, currency, amount, status)
    values (p_user_id, 'DEPOSIT', 'EXCHANGE_SELL', p_fiat_currency, p_usd_amount, 'COMPLETED');

  end if;

  return true;
end;
$$;

-- ==============================================================================
-- 3. Deposit Trigger: Approved CAD deposits go directly into Chequing Account
-- ==============================================================================
create or replace function public.handle_manual_deposit_approval()
returns trigger
language plpgsql
security definer
as $$
declare
  v_chequing_id uuid;
begin
  if new.status = 'approved' and (old.status is null or old.status != 'approved') then
    if upper(new.asset) = 'CAD' then
      -- Credit directly to user's Chequing Account
      v_chequing_id := public.ensure_user_chequing_account(new.user_id);
      update public.user_bank_accounts
      set balance = balance + new.expected_amount,
          updated_at = now()
      where id = v_chequing_id;
    else
      -- Crypto deposits credit user_wallets
      insert into public.user_wallets (user_id, currency, balance, updated_at)
      values (new.user_id, new.asset, new.expected_amount, now())
      on conflict (user_id, currency)
      do update set
        balance = public.user_wallets.balance + new.expected_amount,
        updated_at = now();
    end if;

    -- Log in wallet_ledger
    insert into public.wallet_ledger (user_id, type, provider, currency, amount, status)
    values (new.user_id, 'DEPOSIT', 'MANUAL_DEPOSIT', new.asset, new.expected_amount, 'COMPLETED');
  end if;
  
  return new;
end;
$$;

drop trigger if exists on_deposit_requests_approved on public.deposit_requests;
create trigger on_deposit_requests_approved
  after update on public.deposit_requests
  for each row execute procedure public.handle_manual_deposit_approval();

-- ==============================================================================
-- 4. Withdrawal Trigger: Approved CAD withdrawals deduct directly from Chequing Account
-- ==============================================================================
create or replace function public.handle_manual_withdrawal_approval()
returns trigger
language plpgsql
security definer
as $$
declare
  v_asset text;
  v_chequing_id uuid;
begin
  if new.status in ('approved', 'completed') and (old.status is null or old.status not in ('approved', 'completed')) then
    v_asset := coalesce(new.asset, case when new.method = 'interac' then 'CAD' else 'USDT' end);

    if upper(v_asset) = 'CAD' then
      v_chequing_id := public.ensure_user_chequing_account(new.user_id);
      update public.user_bank_accounts
      set balance = greatest(0, balance - new.amount),
          updated_at = now()
      where id = v_chequing_id;
    else
      update public.user_wallets
      set balance = greatest(0, balance - new.amount),
          updated_at = now()
      where user_id = new.user_id and currency = v_asset;
    end if;

    -- Log in wallet_ledger
    insert into public.wallet_ledger (user_id, type, provider, currency, amount, status)
    values (new.user_id, 'WITHDRAWAL', 'MANUAL_WITHDRAWAL', v_asset, new.amount, 'COMPLETED');
  end if;

  return new;
end;
$$;

drop trigger if exists on_withdrawal_requests_approved on public.withdrawal_requests;
create trigger on_withdrawal_requests_approved
  after update on public.withdrawal_requests
  for each row execute procedure public.handle_manual_withdrawal_approval();

-- ==============================================================================
-- 5. One-Time Consolidation: Move all existing Wallet CAD into Chequing Account
-- ==============================================================================
-- 5a. Ensure every user with a CAD wallet has an active Chequing account
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
  0.00,
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

-- 5b. Add the wallet CAD balance directly into Chequing
update public.user_bank_accounts ba
set 
  balance = ba.balance + uw.balance,
  updated_at = now()
from public.user_wallets uw
where ba.user_id = uw.user_id
  and ba.account_type = 'chequing'
  and ba.currency = 'CAD'
  and uw.currency = 'CAD'
  and uw.balance > 0;

-- 5c. Reset the background CAD wallet balance to 0 (since it is now in Chequing)
update public.user_wallets
set balance = 0.00,
    updated_at = now()
where currency = 'CAD';
