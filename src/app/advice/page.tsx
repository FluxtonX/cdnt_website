import { BookOpen, Lightbulb, TrendingUp, Users } from "lucide-react";
import { FeatureGrid, SectionHeader } from "@/components/public/page-blocks";
import { SiteShell } from "@/components/public/site-shell";

export default function AdvicePage() {
  return (
    <SiteShell>
      <section className="bg-banking-navy py-24 text-white">
        <div className="mx-auto max-w-7xl px-5 text-center">
          <h1 className="text-4xl font-bold md:text-6xl">Advice & Insights</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            Expert guidance to help you navigate your financial journey, from first savings to retirement planning.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHeader 
            eyebrow="Financial Education" 
            title="Make informed decisions" 
            description="Our library of articles, tools, and guides is designed to empower your financial future."
          />
          <div className="mt-16">
            <FeatureGrid
              items={[
                {
                  title: "Budgeting Basics",
                  body: "Learn how to track your spending and save more every month with our simple budgeting framework.",
                  icon: BookOpen,
                },
                {
                  title: "Investment Strategies",
                  body: "From GICs to Mutual Funds, understand how to grow your wealth according to your risk tolerance.",
                  icon: TrendingUp,
                },
                {
                  title: "Home Buying Guide",
                  body: "Everything you need to know about mortgages, down payments, and closing costs in today's market.",
                  icon: Lightbulb,
                },
                {
                  title: "Retirement Planning",
                  body: "Start planning today for the lifestyle you want tomorrow with our RRSP and TFSA insights.",
                  icon: Users,
                },
              ]}
            />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
