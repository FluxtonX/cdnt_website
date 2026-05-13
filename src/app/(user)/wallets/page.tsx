import { PageTitle } from "@/components/dashboard/blocks";
import { WalletCard } from "@/components/dashboard/wallet-card";
import { portfolioAssets } from "@/data/mock";

export default function WalletsPage() {
  return (
    <>
      <PageTitle
        title="Wallets"
        description="View assigned deposit addresses, networks, balances, and deposit safety warnings."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {portfolioAssets.map((asset) => (
          <WalletCard key={asset.symbol} {...asset} />
        ))}
      </div>
    </>
  );
}
