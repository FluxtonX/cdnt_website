"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { fetchLiveCADRates, calculateCADBalance } from "@/lib/utils";
import { getCoinBySymbol } from "@/config/coins";
import { clientQueryKeys } from "@/lib/query-keys";

async function getAuthenticatedUserId() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { supabase, user };
}

async function fetchMarketPrices() {
  let btcPrice = 60000;
  let ethPrice = 3000;
  try {
    const [btcRes, ethRes] = await Promise.all([
      fetch("/api/market/ticker?symbol=BTCUSDT"),
      fetch("/api/market/ticker?symbol=ETHUSDT"),
    ]);
    if (btcRes.ok) {
      const btcData = await btcRes.json();
      btcPrice = Number(btcData.lastPrice) || 60000;
    }
    if (ethRes.ok) {
      const ethData = await ethRes.json();
      ethPrice = Number(ethData.lastPrice) || 3000;
    }
  } catch (err) {
    console.error("Failed to fetch live prices:", err);
  }
  return { BTC: btcPrice, ETH: ethPrice, USDT: 1 };
}

export type DashboardMetrics = {
  prices: Record<string, number>;
  btcBalance: number;
  ethBalance: number;
  usdtBalance: number;
  portfolioValue: number;
  cadBalance: number;
  thisMonthDeposits: number;
  percentChange: number;
};

export function useDashboardMetrics() {
  return useQuery({
    queryKey: clientQueryKeys.dashboard(),
    queryFn: async (): Promise<DashboardMetrics> => {
      const { supabase, user } = await getAuthenticatedUserId();

      const pricePromise = fetchMarketPrices();
      const walletsPromise = supabase.from("user_wallets").select("*").eq("user_id", user.id);
      const ledgerPromise = supabase
        .from("wallet_ledger")
        .select("amount, currency, created_at")
        .eq("user_id", user.id)
        .eq("type", "DEPOSIT")
        .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString());

      const [prices, { data: userWallets, error: walletsErr }, { data: ledger }] = await Promise.all([
        pricePromise,
        walletsPromise,
        ledgerPromise,
      ]);

      let btcBalance = 0;
      let ethBalance = 0;
      let usdtBalance = 0;
      let portfolioValue = 0;
      let cadBalance = 0;

      if (!walletsErr && userWallets) {
        const rates = await fetchLiveCADRates();
        btcBalance = Number(userWallets.find((w: { currency: string }) => w.currency === "BTC")?.balance || 0);
        ethBalance = Number(userWallets.find((w: { currency: string }) => w.currency === "ETH")?.balance || 0);
        usdtBalance = Number(userWallets.find((w: { currency: string }) => w.currency === "USDT")?.balance || 0);
        portfolioValue = calculateCADBalance(userWallets, rates);
        cadBalance = portfolioValue;
      }

      let thisMonthDeposits = 0;
      let percentChange = 0;

      if (ledger) {
        const rates = { BTC: prices.BTC, ETH: prices.ETH, USDT: 1, CAD: 1, USDC: 1 };
        let thisMonth = 0;
        let lastMonth = 0;
        const now = new Date();
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

        ledger.forEach((item: { amount: number; currency?: string; created_at: string }) => {
          const date = new Date(item.created_at).getTime();
          const rate = (rates as Record<string, number>)[item.currency?.toUpperCase() || ""] || 1;
          const value = Number(item.amount) * rate;
          if (date >= firstDayThisMonth) {
            thisMonth += value;
          } else {
            lastMonth += value;
          }
        });

        thisMonthDeposits = thisMonth;
        percentChange = lastMonth === 0 ? (thisMonth > 0 ? 100 : 0) : ((thisMonth - lastMonth) / lastMonth) * 100;
      }

      return {
        prices,
        btcBalance,
        ethBalance,
        usdtBalance,
        portfolioValue,
        cadBalance,
        thisMonthDeposits,
        percentChange,
      };
    },
    staleTime: 30_000,
  });
}

export type ClientTransaction = {
  id: string;
  type: string;
  asset: string;
  amount: number;
  status: string;
  date: Date;
  ref?: string;
};

export function useWithdrawalRequests() {
  return useQuery({
    queryKey: clientQueryKeys.withdrawalRequests(),
    queryFn: async () => {
      const { supabase, user } = await getAuthenticatedUserId();
      const { data, error } = await supabase
        .from("withdrawal_requests")
        .select("id, amount, status, created_at, interac_email, asset, network, wallet_address, method")
        .eq("user_id", user.id);

      if (error) throw error;
      return data || [];
    },
    staleTime: 0,
  });
}

export function useRecentTransactions() {
  return useQuery({
    queryKey: [...clientQueryKeys.transactions(), "recent"],
    queryFn: async (): Promise<ClientTransaction[]> => {
      const { supabase, user } = await getAuthenticatedUserId();

      const [depositsRes, withdrawalsRes] = await Promise.all([
        supabase
          .from("deposit_requests")
          .select("id, asset, expected_amount, status, created_at, tx_hash")
          .eq("user_id", user.id),
        supabase
          .from("withdrawal_requests")
          .select("id, amount, status, created_at, interac_email, asset, network, wallet_address")
          .eq("user_id", user.id),
      ]);

      const depErr = depositsRes.error;
      const wdrErr = withdrawalsRes.error;
      const dbError = (depErr && depErr.code === "PGRST205") || (wdrErr && wdrErr.code === "PGRST205");

      if (dbError) {
        return [
          { id: "1", type: "Deposit", asset: "BTC", amount: 5000, status: "approved", date: new Date(Date.now() - 2 * 60 * 60 * 1000) },
          { id: "2", type: "Withdrawal", asset: "ETH", amount: 1250, status: "completed", date: new Date(Date.now() - 5 * 60 * 60 * 1000) },
          { id: "3", type: "Deposit", asset: "USDT", amount: 3000, status: "approved", date: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          { id: "4", type: "Withdrawal", asset: "BTC", amount: 500, status: "completed", date: new Date(Date.now() - 48 * 60 * 60 * 1000) },
        ];
      }

      const list: ClientTransaction[] = [];
      (depositsRes.data || []).forEach((d) => {
        list.push({
          id: d.id,
          type: "Deposit",
          asset: d.asset,
          amount: d.expected_amount,
          status: d.status,
          date: new Date(d.created_at),
          ref: d.tx_hash,
        });
      });
      (withdrawalsRes.data || []).forEach((w) => {
        list.push({
          id: w.id,
          type: "Withdrawal",
          asset: w.asset || "CAD",
          amount: w.amount,
          status: w.status,
          date: new Date(w.created_at),
          ref: w.wallet_address || w.interac_email,
        });
      });

      list.sort((a, b) => b.date.getTime() - a.date.getTime());
      return list.slice(0, 4);
    },
    staleTime: 0,
  });
}

export type TransactionRow = {
  id: string;
  type: string;
  asset: string;
  amount: string;
  fiat: string;
  status: string;
  date: string;
  description?: string;
  rawDate: Date;
  rawAmount: number;
};

export function useClientTransactions() {
  return useQuery({
    queryKey: clientQueryKeys.transactions(),
    queryFn: async (): Promise<TransactionRow[]> => {
      const { supabase, user } = await getAuthenticatedUserId();

      const [depositsRes, withdrawalsRes] = await Promise.all([
        supabase
          .from("deposit_requests")
          .select("id, created_at, amount, currency, status")
          .eq("user_id", user.id),
        supabase
          .from("withdrawal_requests")
          .select("id, created_at, amount, method, status")
          .eq("user_id", user.id),
      ]);

      const deposits: TransactionRow[] = (depositsRes.data || []).map((d) => ({
        id: d.id,
        type: "deposit",
        asset: d.currency || "USD",
        amount: String(d.amount),
        rawAmount: Number(d.amount),
        fiat: "USD",
        status: d.status,
        date: new Date(d.created_at).toLocaleDateString(),
        description: `TXN-${d.id.substring(0, 8).toUpperCase()}`,
        rawDate: new Date(d.created_at),
      }));

      const withdrawals: TransactionRow[] = (withdrawalsRes.data || []).map((w) => ({
        id: w.id,
        type: "withdrawal",
        asset: w.method === "interac" ? "CAD" : "USD",
        amount: String(w.amount),
        rawAmount: Number(w.amount),
        fiat: "USD",
        status: w.status,
        date: new Date(w.created_at).toLocaleDateString(),
        description: `TXN-${w.id.substring(0, 8).toUpperCase()}`,
        rawDate: new Date(w.created_at),
      }));

      return [...deposits, ...withdrawals].sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
    },
    staleTime: 0,
  });
}

export type MappedWallet = {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  rawBalance: number;
  value: string;
  change: string;
  changeType: string;
  network: string;
  address: string;
  image?: string;
  activities: Array<{
    id: string;
    type: string;
    time: string;
    amount: string;
    amountType: string;
    status: string;
    currency: string;
    createdAt: Date;
  }>;
};

export function useClientWallets() {
  return useQuery({
    queryKey: clientQueryKeys.wallets(),
    queryFn: async (): Promise<MappedWallet[]> => {
      const { supabase, user } = await getAuthenticatedUserId();

      const [
        userWalletsRes,
        platformWalletsRes,
        ledgerRes,
        depositsRes,
        withdrawalsRes,
        btcRes,
        ethRes,
      ] = await Promise.all([
        supabase.from("user_wallets").select("*").eq("user_id", user.id),
        supabase.from("platform_wallets").select("*").eq("type", "Hot"),
        supabase.from("wallet_ledger").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("deposit_requests").select("*").eq("user_id", user.id).eq("status", "pending").order("created_at", { ascending: false }),
        supabase.from("withdrawal_requests").select("*").eq("user_id", user.id).eq("status", "pending").order("created_at", { ascending: false }),
        fetch("/api/market/ticker?symbol=BTCUSDT").catch(() => null),
        fetch("/api/market/ticker?symbol=ETHUSDT").catch(() => null),
      ]);

      if (userWalletsRes.error) throw userWalletsRes.error;
      if (platformWalletsRes.error) throw platformWalletsRes.error;
      if (ledgerRes.error) throw ledgerRes.error;
      if (depositsRes.error) throw depositsRes.error;
      if (withdrawalsRes.error) throw withdrawalsRes.error;

      const userWallets = userWalletsRes.data;
      const platformWallets = platformWalletsRes.data;
      const ledger = ledgerRes.data;
      const deposits = depositsRes.data;
      const withdrawals = withdrawalsRes.data;

      let btcPrice = 60000;
      let ethPrice = 3000;
      if (btcRes && btcRes.ok) {
        const btcData = await btcRes.json();
        btcPrice = Number(btcData.lastPrice);
      }
      if (ethRes && ethRes.ok) {
        const ethData = await ethRes.json();
        ethPrice = Number(ethData.lastPrice);
      }

      const platformAddressMap = (platformWallets || []).reduce((acc: Record<string, string>, w: { crypto: string; address: string }) => {
        acc[w.crypto] = w.address;
        return acc;
      }, {});

      const allActivities = [
        ...(ledger || []).map((l: { id: string; type: string; created_at: string; amount: number; currency: string; status?: string }) => ({
          id: l.id,
          type: l.type === "DEPOSIT" ? "Deposit" : "Withdrawal",
          time: `${new Date(l.created_at).toLocaleDateString()} ${new Date(l.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          amount: `${l.type === "DEPOSIT" ? "+" : "-"}${Number(l.amount).toLocaleString(undefined, { maximumFractionDigits: 8 })} ${l.currency}`,
          amountType: l.type === "DEPOSIT" ? "positive" : "negative",
          status: l.status || "Confirmed",
          currency: l.currency,
          createdAt: new Date(l.created_at),
        })),
        ...(deposits || []).map((d: { id: string; created_at: string; expected_amount: number; asset: string }) => ({
          id: d.id,
          type: "Deposit",
          time: `${new Date(d.created_at).toLocaleDateString()} ${new Date(d.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          amount: `+${Number(d.expected_amount).toLocaleString(undefined, { maximumFractionDigits: 8 })} ${d.asset}`,
          amountType: "positive",
          status: "Pending Approval",
          currency: d.asset,
          createdAt: new Date(d.created_at),
        })),
        ...(withdrawals || []).map((w: { id: string; created_at: string; amount: number; asset?: string }) => ({
          id: w.id,
          type: "Withdrawal",
          time: `${new Date(w.created_at).toLocaleDateString()} ${new Date(w.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          amount: `-${Number(w.amount).toLocaleString(undefined, { maximumFractionDigits: 8 })} ${w.asset || "CAD"}`,
          amountType: "negative",
          status: "Pending Approval",
          currency: w.asset || "CAD",
          createdAt: new Date(w.created_at),
        })),
      ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      const btcBalance = Number(userWallets?.find((w: { currency: string }) => w.currency === "BTC")?.balance || 0);
      const ethBalance = Number(userWallets?.find((w: { currency: string }) => w.currency === "ETH")?.balance || 0);
      const usdtBalance = Number(userWallets?.find((w: { currency: string }) => w.currency === "USDT")?.balance || 0);

      return [
        {
          id: "bitcoin",
          name: "Bitcoin",
          symbol: "BTC",
          balance: btcBalance.toFixed(8),
          rawBalance: btcBalance,
          value: `$${(btcBalance * btcPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: "Live",
          changeType: "positive",
          network: "Bitcoin Network",
          address: platformAddressMap["BTC"] || "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
          image: getCoinBySymbol("BTCUSDT")?.logoUrl,
          activities: allActivities.filter((act) => act.currency === "BTC").slice(0, 5),
        },
        {
          id: "ethereum",
          name: "Ethereum",
          symbol: "ETH",
          balance: ethBalance.toFixed(8),
          rawBalance: ethBalance,
          value: `$${(ethBalance * ethPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: "Live",
          changeType: "positive",
          network: "Ethereum Mainnet",
          address: platformAddressMap["ETH"] || "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
          image: getCoinBySymbol("ETHUSDT")?.logoUrl,
          activities: allActivities.filter((act) => act.currency === "ETH").slice(0, 5),
        },
        {
          id: "tether",
          name: "Tether",
          symbol: "USDT",
          balance: usdtBalance.toFixed(2),
          rawBalance: usdtBalance,
          value: `$${usdtBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: "Stable",
          changeType: "neutral",
          network: "ERC-20",
          address: platformAddressMap["USDT"] || "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
          image: "https://cryptologos.cc/logos/tether-usdt-logo.png",
          activities: allActivities.filter((act) => act.currency === "USDT").slice(0, 5),
        },
      ];
    },
  });
}

export function useWithdrawBalance() {
  return useQuery({
    queryKey: clientQueryKeys.withdrawBalance(),
    queryFn: async () => {
      const { supabase, user } = await getAuthenticatedUserId();
      const { data: wallets } = await supabase
        .from("user_wallets")
        .select("currency, balance")
        .eq("user_id", user.id);

      const rates = await fetchLiveCADRates();
      if (wallets && wallets.length > 0) {
        return calculateCADBalance(wallets, rates);
      }
      return 0;
    },
  });
}

type CreateWithdrawalInput = {
  amount: number;
  interacEmail: string;
  securityQuestion: string;
  securityAnswer: string;
};

export function useCreateWithdrawalRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateWithdrawalInput) => {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("User session not found. Please log in again.");
      }

      const { error: insertError } = await supabase.from("withdrawal_requests").insert({
        user_id: user.id,
        amount: input.amount,
        method: "interac",
        interac_email: input.interacEmail,
        security_question: input.securityQuestion,
        security_answer: input.securityAnswer,
        status: "pending",
      });

      if (insertError) {
        throw new Error(insertError.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientQueryKeys.withdrawalRequests() });
      queryClient.invalidateQueries({ queryKey: clientQueryKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: clientQueryKeys.wallets() });
      queryClient.invalidateQueries({ queryKey: clientQueryKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: clientQueryKeys.withdrawBalance() });
    },
  });
}
