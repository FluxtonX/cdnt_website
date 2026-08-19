-- Supabase Migration: User Bank Accounts & Applications
-- This script creates the user_bank_accounts table to manage bank and investment account applications,
-- active accounts, balances, and admin approvals.

create table if not exists public.user_bank_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_category text not null check (account_category in ('everyday', 'registered', 'other')),
  account_type text not null check (account_type in (
    'chequing', 'savings', 'tfsa', 'rrsp', 'fhsa', 'resp', 'rrif',
    'non_registered', 'joint', 'business', 'usd'
  )),
  account_name text not null,
  account_number text, -- e.g. '01822-4518262' or '05496-1007517'
  currency text not null default 'CAD',
  balance numeric(36, 2) not null default 0.00,
  status text not null default 'pending' check (status in ('pending', 'active', 'rejected', 'closed')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid references auth.users(id)
);

-- Enable Row Level Security
alter table public.user_bank_accounts enable row level security;

-- Policies for authenticated users
drop policy if exists "Users can read their own bank accounts" on public.user_bank_accounts;
create policy "Users can read their own bank accounts"
  on public.user_bank_accounts for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users can apply for bank accounts" on public.user_bank_accounts;
create policy "Users can apply for bank accounts"
  on public.user_bank_accounts for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending');

drop policy if exists "Users can update their own bank account balance during transfer" on public.user_bank_accounts;
create policy "Users can update their own bank account balance during transfer"
  on public.user_bank_accounts for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Policies for admins
drop policy if exists "Admins can read all bank accounts" on public.user_bank_accounts;
create policy "Admins can read all bank accounts"
  on public.user_bank_accounts for select to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

drop policy if exists "Admins can update bank accounts" on public.user_bank_accounts;
create policy "Admins can update bank accounts"
  on public.user_bank_accounts for update to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

drop policy if exists "Admins can delete bank accounts" on public.user_bank_accounts;
create policy "Admins can delete bank accounts"
  on public.user_bank_accounts for delete to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

-- Indexes for performance
create index if not exists idx_user_bank_accounts_user_id on public.user_bank_accounts(user_id);
create index if not exists idx_user_bank_accounts_status on public.user_bank_accounts(status);

-- Enable Realtime
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'user_bank_accounts'
  ) then
    alter publication supabase_realtime add table public.user_bank_accounts;
  end if;
end $$;

-- Trigger to auto update updated_at
drop trigger if exists update_user_bank_accounts_updated_at on public.user_bank_accounts;
create trigger update_user_bank_accounts_updated_at
  before update on public.user_bank_accounts
  for each row
  execute function public.handle_updated_at();
