"use client";

import { useState } from "react";
import { ArrowDownUp, Info, SlidersHorizontal } from "lucide-react";
import { COINS } from "@/lib/mock-data/coins";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { CoinLogo } from "@/components/shared/coin-logo";
import { formatPrice } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const OPTIONS = COINS.filter((c) => ["ETH", "BTC", "SOL", "USDT", "BNB", "XRP", "AVAX", "LINK"].includes(c.symbol));
const find = (s: string) => OPTIONS.find((c) => c.symbol === s)!;

function CoinPicker({ value, onChange, exclude }: { value: string; onChange: (s: string) => void; exclude: string }) {
  const c = find(value);
  return (
    <Dropdown
      align="left"
      width="w-52"
      label="Select asset"
      triggerClassName="flex items-center gap-2 rounded-xl bg-card px-2.5 py-1.5 text-sm font-semibold text-ink shadow-sm ring-1 ring-line hover:bg-soft"
      trigger={
        <>
          <CoinLogo symbol={c.symbol} color={c.color} size={24} />
          {c.symbol}
          <ChevronDown className="size-3.5 text-muted" />
        </>
      }
    >
      {OPTIONS.filter((o) => o.symbol !== exclude).map((o) => (
        <DropdownItem key={o.symbol} active={o.symbol === value} icon={<CoinLogo symbol={o.symbol} color={o.color} size={20} />} onClick={() => onChange(o.symbol)}>
          {o.name} <span className="text-muted">{o.symbol}</span>
        </DropdownItem>
      ))}
    </Dropdown>
  );
}

/** Visual prototype of a converter. Does not execute swaps. */
export function ConverterCard() {
  const [from, setFrom] = useState("ETH");
  const [to, setTo] = useState("USDT");
  const [amount, setAmount] = useState("5.2");
  const [open, setOpen] = useState(false);

  const a = parseFloat(amount) || 0;
  const f = find(from);
  const t = find(to);
  const out = (a * f.price) / t.price;
  const rate = f.price / t.price;
  const flip = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader title="Crypto Converter" subtitle="Preview only · no trades executed" action={<button type="button" aria-label="Converter settings" className="rounded-lg p-2 text-muted hover:bg-soft hover:text-ink"><SlidersHorizontal className="size-4" /></button>} />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="rounded-xl border border-line bg-soft/60 p-4">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted">
            <span>From</span>
            <span>Balance: 12.48 {from}</span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <CoinPicker value={from} onChange={setFrom} exclude={to} />
            <input
              inputMode="decimal"
              aria-label="Amount to convert"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              className="w-full min-w-0 bg-transparent text-right text-2xl font-semibold tabular-nums text-ink outline-none"
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted">
            <button type="button" onClick={() => setAmount("12.48")} className="rounded-md bg-card px-2 py-0.5 font-medium ring-1 ring-line hover:text-ink">Max</button>
            <span className="tabular-nums">≈ {formatPrice(a * f.price)}</span>
          </div>
        </div>

        <div className="relative z-[1] -my-4 flex justify-center">
          <button type="button" onClick={flip} aria-label="Swap direction" className="flex size-9 items-center justify-center rounded-xl bg-primary text-white shadow-[0_4px_12px_rgba(49,92,245,0.4)] ring-4 ring-card transition-colors hover:bg-primary-hover">
            <ArrowDownUp className="size-4" />
          </button>
        </div>

        <div className="rounded-xl border border-line bg-soft/60 p-4">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted">
            <span>To</span>
            <span>Balance: 4,820 {to}</span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <CoinPicker value={to} onChange={setTo} exclude={from} />
            <div className="min-w-0 truncate text-right text-2xl font-semibold tabular-nums text-ink">{out.toLocaleString("en-US", { maximumFractionDigits: out > 100 ? 2 : 6 })}</div>
          </div>
          <div className="mt-2 text-right text-xs text-muted tabular-nums">≈ {formatPrice(out * t.price)}</div>
        </div>

        <div className="mt-2 space-y-1.5 text-xs text-muted">
          <div className="flex justify-between"><span>Rate</span><span className="font-medium tabular-nums text-ink">1 {from} = {rate.toLocaleString("en-US", { maximumFractionDigits: rate > 10 ? 2 : 6 })} {to}</span></div>
          <div className="flex justify-between"><span className="inline-flex items-center gap-1">Network fee <Info className="size-3" /></span><span className="font-medium tabular-nums text-ink">$8.50</span></div>
        </div>

        <Button variant="primary" size="lg" block className="mt-auto" onClick={() => setOpen(true)}>Preview Conversion</Button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Conversion preview"
        description="This is a UI prototype — no funds will move."
        footer={<Button variant="primary" onClick={() => setOpen(false)}>Got it</Button>}
      >
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-xl bg-soft p-4">
            <span className="text-muted">You pay</span>
            <span className="font-semibold text-ink">{a} {from}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-soft p-4">
            <span className="text-muted">You receive</span>
            <span className="font-semibold text-ink">{out.toLocaleString("en-US", { maximumFractionDigits: 4 })} {to}</span>
          </div>
          <p className="text-[13px] text-muted">Swap execution, routing and wallet signing will be integrated in a later phase.</p>
        </div>
      </Modal>
    </Card>
  );
}
