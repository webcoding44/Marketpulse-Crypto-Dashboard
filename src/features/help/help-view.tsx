import { BookOpen, ChevronDown, LifeBuoy, Mail, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FAQ = [
  ["Where does CryptoVerse data come from?", "This prototype uses local mock data. Production data will come from licensed market data providers and on-chain indexers."],
  ["Can I trade or swap on CryptoVerse?", "No. The converter and any trade-style buttons are visual prototypes only; CryptoVerse never executes trades."],
  ["How are trust scores calculated?", "Trust scores combine liquidity depth, regulatory compliance, proof of reserves, web traffic and incident history."],
  ["What is the difference between a tokenized asset and the underlying?", "A tokenized asset is a blockchain token issued by a third party that tracks the value of a real-world asset. It does not necessarily carry the same rights or protections."],
  ["How do I set a price alert?", "Open Portfolio → Price Alerts and choose New alert. Pick an asset, a condition and a target value."],
];

export function HelpView() {
  return (
    <div className="space-y-6">
      <PageHeader title="Help Center" description="Guides, answers and ways to reach the CryptoVerse team." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[[BookOpen, "Documentation", "Guides for every section of the platform"], [MessageCircle, "Community", "Ask questions and share ideas"], [Mail, "Contact support", "Typically replies within a few hours"]].map(([I, t, d]) => {
          const Icon = I as typeof BookOpen;
          return <Card key={t as string} className="p-5"><span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary"><Icon className="size-5" /></span><h3 className="mt-4 text-[15px] font-semibold text-ink">{t as string}</h3><p className="mt-1 text-[13px] text-muted">{d as string}</p></Card>;
        })}
      </div>
      <Card>
        <CardHeader title="Frequently Asked Questions" icon={<LifeBuoy />} />
        <div className="divide-y divide-line px-5 pb-2 pt-3">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-medium text-ink [&::-webkit-details-marker]:hidden">{q}<ChevronDown className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180" /></summary>
              <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </Card>
      <Card className="flex flex-wrap items-center justify-between gap-4 p-5"><div><div className="text-sm font-semibold text-ink">Still need help?</div><div className="text-[13px] text-muted">Our team is happy to walk you through the platform.</div></div><Button variant="primary" icon={<Mail className="size-4" />}>Contact support</Button></Card>
    </div>
  );
}
