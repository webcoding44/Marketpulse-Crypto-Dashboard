"use client";

import { useState, type ReactNode } from "react";
import { Bell, BellRing, Camera, Download, KeyRound, Lock, Plus, Receipt, Scale, ShieldCheck, Smartphone, Star, TrendingDown, TrendingUp, Trophy, Wallet, Zap } from "lucide-react";
import { COINS } from "@/lib/mock-data/coins";
import { ALERTS, PORTFOLIO_HOLDINGS, PORTFOLIO_TXS, holdingPnl, holdingPnlPct, holdingValue, type Holding } from "@/lib/mock-data/wallet-portfolio";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Switch } from "@/components/ui/switch";
import { Tabs } from "@/components/ui/tabs";
import { Modal } from "@/components/ui/modal";
import { SelectDropdown } from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/shared/metric-card";
import { DataTable, type Column } from "@/components/shared/data-table";
import { CoinLogo } from "@/components/shared/coin-logo";
import { PriceChangeIndicator } from "@/components/shared/price-change-indicator";
import { ProgressBar } from "@/components/shared/key-stats";
import { ChartContainer } from "@/components/charts/chart-container";
import { ChartPlaceholder } from "@/components/charts/chart-placeholder";
import { BarChartPlaceholder } from "@/components/charts/bar-chart-placeholder";
import { DonutChart, Legend } from "@/components/charts/donut-chart";
import { CryptoTable } from "@/features/markets/crypto-table";
import { PortfolioSummary } from "./portfolio-summary";
import { cn, formatNumber, formatPrice, formatUsd, series, usdCompact } from "@/lib/utils";

const TOTAL = PORTFOLIO_HOLDINGS.reduce((s, h) => s + holdingValue(h), 0);
const TOTAL_PNL = PORTFOLIO_HOLDINGS.reduce((s, h) => s + holdingPnl(h), 0);
const SEGMENTS = PORTFOLIO_HOLDINGS.map((h) => ({ label: h.symbol, value: (holdingValue(h) / TOTAL) * 100, color: h.color }));

function PnlText({ v }: { v: number }) {
  return <span className={cn("font-medium tabular-nums", v >= 0 ? "text-success" : "text-danger")}>{v >= 0 ? "+" : "−"}{formatUsd(Math.abs(v))}</span>;
}

function HoldingsTable({ rows, pageSize = 8 }: { rows: Holding[]; pageSize?: number }) {
  const columns: Column<Holding>[] = [
    { key: "a", header: "Asset", sticky: true, sort: (h) => h.name, render: (h) => <span className="flex items-center gap-3"><CoinLogo symbol={h.symbol} color={h.color} size={34} /><span className="leading-tight"><span className="block font-semibold text-ink">{h.name}</span><span className="text-xs text-muted">{h.symbol}</span></span></span> },
    { key: "p", header: "Price", align: "right", sort: (h) => h.price, className: "tabular-nums", render: (h) => formatPrice(h.price) },
    { key: "c", header: "24h", align: "right", sort: (h) => h.c24h, render: (h) => <PriceChangeIndicator value={h.c24h} /> },
    { key: "h", header: "Holdings", align: "right", sort: (h) => h.amount, className: "tabular-nums", render: (h) => <span className="leading-tight"><span className="block font-semibold text-ink">{formatUsd(holdingValue(h))}</span><span className="text-xs text-muted">{formatNumber(h.amount)} {h.symbol}</span></span> },
    { key: "cost", header: "Avg. Buy", align: "right", sort: (h) => h.cost, className: "tabular-nums text-muted", render: (h) => formatPrice(h.cost) },
    { key: "pnl", header: "Profit / Loss", align: "right", sort: holdingPnl, render: (h) => <span className="leading-tight"><PnlText v={holdingPnl(h)} /><span className="block"><PriceChangeIndicator value={holdingPnlPct(h)} variant="text" className="!text-xs" /></span></span> },
    { key: "w", header: "Allocation", align: "right", sort: holdingValue, render: (h) => <span className="ml-auto flex w-36 items-center justify-end gap-2.5"><ProgressBar value={(holdingValue(h) / TOTAL) * 100 * 2} color={h.color} className="w-20" height={5} /><span className="w-10 text-right tabular-nums text-muted">{((holdingValue(h) / TOTAL) * 100).toFixed(1)}%</span></span> },
  ];
  return <DataTable columns={columns} rows={rows} rowKey={(h) => h.symbol} pageSize={pageSize} minWidth={920} initialSort={{ key: "h", dir: "desc" }} />;
}

type Tx = (typeof PORTFOLIO_TXS)[number];
function PortfolioTxTable({ rows, pageSize = 8 }: { rows: Tx[]; pageSize?: number }) {
  const columns: Column<Tx>[] = [
    { key: "t", header: "Type", render: (t) => <StatusBadge tone={t.type === "Buy" ? "success" : t.type === "Sell" ? "danger" : t.type === "Stake" ? "accent" : "neutral"}>{t.type}</StatusBadge> },
    { key: "a", header: "Asset", sticky: true, render: (t) => <span className="flex items-center gap-2.5"><CoinLogo symbol={t.symbol} color={t.color} size={28} /><span className="font-semibold text-ink">{t.symbol}</span></span> },
    { key: "d", header: "Date", className: "whitespace-nowrap text-muted", render: (t) => t.date },
    { key: "amt", header: "Amount", align: "right", sort: (t) => t.amount, className: "tabular-nums", render: (t) => `${formatNumber(t.amount)} ${t.symbol}` },
    { key: "p", header: "Price", align: "right", sort: (t) => t.price, className: "tabular-nums", render: (t) => formatPrice(t.price) },
    { key: "tot", header: "Total", align: "right", sort: (t) => t.amount * t.price, className: "font-semibold tabular-nums text-ink", render: (t) => formatUsd(t.amount * t.price) },
    { key: "f", header: "Fee", align: "right", className: "tabular-nums text-muted", render: (t) => `$${t.fee}` },
    { key: "v", header: "Venue", render: (t) => <span className="text-muted">{t.venue}</span> },
  ];
  return <DataTable columns={columns} rows={rows} rowKey={(t) => t.id} pageSize={pageSize} minWidth={880} />;
}

export function PortfolioView() {
  const best = [...PORTFOLIO_HOLDINGS].sort((a, b) => holdingPnlPct(b) - holdingPnlPct(a))[0];
  return (
    <div className="space-y-6">
      <PageHeader title="My Portfolio" description="Your total value, allocation and performance across every connected account." actions={<><Button icon={<Download className="size-4" />}>Export</Button><Button variant="primary" href="/portfolio/transactions" icon={<Plus className="size-4" />}>Add transaction</Button></>} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <PortfolioSummary variant="wide" className="sm:col-span-2 xl:col-span-2" />
        <MetricCard label="24h Profit / Loss" value="+$6,842" change={1.7} icon={<TrendingUp />} sparkSeed="p24" />
        <MetricCard label="Total Profit / Loss" value={usdCompact(TOTAL_PNL)} change={(TOTAL_PNL / (TOTAL - TOTAL_PNL)) * 100} icon={<Wallet />} changeLabel="all time" sparkSeed="pall" />
        <MetricCard label="Best Performer" value={best.symbol} change={holdingPnlPct(best)} icon={<Trophy />} changeLabel="all time" />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartContainer className="xl:col-span-2" title="Portfolio Performance" subtitle="Total value over time" hideToolbar timeframes={["24H", "7D", "1M", "1Y", "ALL"]} defaultTimeframe="1M" headline={<div className="flex items-center gap-3"><span className="text-[26px] font-semibold tabular-nums tracking-tight text-ink">{formatUsd(TOTAL, 2)}</span><PriceChangeIndicator value={1.7} /></div>}>
          <ChartPlaceholder variant="area" height={260} seed="portfolio-main" trend={18} yLabels={["$450K", "$420K", "$390K", "$360K", "$330K"]} xLabels={["Wk 1", "Wk 2", "Wk 3", "Wk 4"]} />
        </ChartContainer>
        <Card><CardHeader title="Asset Allocation" subtitle="By current value" /><div className="flex flex-col items-center gap-5 p-5"><DonutChart size={156} thickness={17} segments={SEGMENTS}><span className="text-[11px] text-muted">Total</span><span className="text-lg font-semibold text-ink">{usdCompact(TOTAL)}</span></DonutChart><div className="grid w-full grid-cols-2 gap-x-6 gap-y-2.5">{SEGMENTS.map((s) => <div key={s.label} className="flex items-center justify-between text-[13px]"><span className="flex items-center gap-2 text-ink"><span className="size-2.5 rounded-[3px]" style={{ background: s.color }} />{s.label}</span><span className="tabular-nums text-muted">{s.value.toFixed(1)}%</span></div>)}</div></div></Card>
      </div>
      <Card className="overflow-hidden"><CardHeader title="Holdings" subtitle={`${PORTFOLIO_HOLDINGS.length} assets`} icon={<Wallet />} /><div className="mt-4"><HoldingsTable rows={PORTFOLIO_HOLDINGS} /></div></Card>
      <Card className="overflow-hidden"><CardHeader title="Recent Transactions" icon={<Receipt />} action={<Button size="xs" variant="ghost" href="/portfolio/transactions">View all</Button>} /><div className="mt-4"><PortfolioTxTable rows={PORTFOLIO_TXS.slice(0, 5)} pageSize={5} /></div></Card>
    </div>
  );
}

export function WatchlistView() {
  const [list, setList] = useState("main");
  const sets: Record<string, string[]> = {
    main: ["bitcoin", "ethereum", "solana", "chainlink", "injective", "render", "near-protocol", "avalanche"],
    defi: ["uniswap", "aave", "maker", "chainlink", "jupiter", "injective"],
    memes: ["dogecoin", "shiba-inu", "pepe", "bonk"],
  };
  const coins = COINS.filter((c) => sets[list].includes(c.id));
  return (
    <div className="space-y-6">
      <PageHeader title="My Watchlist" description="Track the assets you care about, organised into custom lists." actions={<Button variant="primary" icon={<Plus className="size-4" />}>New list</Button>} />
      <Tabs variant="pill" ariaLabel="Watchlists" value={list} onChange={setList} items={[{ id: "main", label: "Main", count: sets.main.length }, { id: "defi", label: "DeFi blue chips", count: sets.defi.length }, { id: "memes", label: "Memes", count: sets.memes.length }]} />
      <CryptoTable key={list} coins={coins} compactMode showCategories={false} pageSize={10} title={`${list === "main" ? "Main" : list === "defi" ? "DeFi blue chips" : "Memes"} watchlist`} subtitle={`${coins.length} assets`} />
    </div>
  );
}

export function AlertsView() {
  const [alerts, setAlerts] = useState(ALERTS);
  const [open, setOpen] = useState(false);
  const [coin, setCoin] = useState("BTC");
  const [cond, setCond] = useState("Price rises above");
  const toggle = (id: string) => setAlerts((a) => a.map((x) => (x.id === id ? { ...x, active: !x.active } : x)));
  const remove = (id: string) => setAlerts((a) => a.filter((x) => x.id !== id));
  const active = alerts.filter((a) => a.active).length;
  return (
    <div className="space-y-6">
      <PageHeader title="Price Alerts" description="Get notified when an asset hits your target price or moves unusually." actions={<Button variant="primary" icon={<Plus className="size-4" />} onClick={() => setOpen(true)}>New alert</Button>} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Active Alerts" value={active} icon={<BellRing />} changeLabel="" hint={`of ${alerts.length} total`} />
        <MetricCard label="Triggered (30d)" value="14" change={27} icon={<Zap />} />
        <MetricCard label="Channels" value="Push · Email" icon={<Bell />} changeLabel="" hint="2 enabled" />
      </div>
      <Card className="overflow-hidden">
        <CardHeader title="Your Alerts" icon={<Bell />} />
        {alerts.length === 0 ? (
          <EmptyState icon={<BellRing />} title="No alerts yet" description="Create an alert to be notified when an asset reaches your target." action={<Button variant="primary" onClick={() => setOpen(true)}>Create alert</Button>} />
        ) : (
          <ul className="mt-3 divide-y divide-line">
            {alerts.map((a) => {
              const dist = ((a.target - a.current) / a.current) * 100;
              return (
                <li key={a.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                  <CoinLogo symbol={a.symbol} color={a.color} size={38} />
                  <div className="min-w-[160px] flex-1 leading-tight"><div className="text-[13px] font-semibold text-ink">{a.name}</div><div className="mt-0.5 text-xs text-muted">{a.condition} <b className="text-ink">{formatPrice(a.target)}</b></div></div>
                  <div className="hidden w-40 sm:block"><div className="text-xs text-muted">Current {formatPrice(a.current)}</div><div className="mt-1.5"><ProgressBar value={Math.max(0, 100 - Math.abs(dist) * 4)} /></div></div>
                  <PriceChangeIndicator value={dist} />
                  <StatusBadge>{a.channel}</StatusBadge>
                  <Switch checked={a.active} onChange={() => toggle(a.id)} label={`Toggle alert for ${a.name}`} />
                  <button type="button" onClick={() => remove(a.id)} className="text-xs font-medium text-muted hover:text-danger">Delete</button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Create price alert" description="UI prototype — alerts are not saved." footer={<><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" onClick={() => setOpen(false)}>Create alert</Button></>}>
        <div className="space-y-4">
          <div className="space-y-1.5"><label className="text-xs font-medium text-muted">Asset</label><div><SelectDropdown options={["BTC", "ETH", "SOL", "LINK", "DOGE", "AVAX"]} value={coin} onChange={setCoin} /></div></div>
          <div className="space-y-1.5"><label className="text-xs font-medium text-muted">Condition</label><div><SelectDropdown options={["Price rises above", "Price drops below", "24h change above", "24h change below"]} value={cond} onChange={setCond} /></div></div>
          <div className="space-y-1.5"><label htmlFor="target" className="text-xs font-medium text-muted">Target value</label><input id="target" placeholder="e.g. 65,000" className="h-10 w-full rounded-xl border border-line bg-card px-3 text-sm text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" /></div>
        </div>
      </Modal>
    </div>
  );
}

export function AnalyticsView() {
  const monthly = series("an-m", 12, 0, 2).map((v, i) => (v - 100) * (i % 4 === 2 ? -0.6 : 1) + 3);
  const sectors = [{ label: "Layer 1", value: 58, color: "#315CF5" }, { label: "DeFi", value: 14, color: "#8B5CF6" }, { label: "Stablecoins", value: 6, color: "#16A879" }, { label: "Meme", value: 2, color: "#E8A33C" }, { label: "Other", value: 20, color: "#B8C2D8" }];
  return (
    <div className="space-y-6">
      <PageHeader title="Portfolio Analytics" description="Risk, return and diversification metrics for your portfolio." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Return" value="+84.2%" change={5.1} icon={<TrendingUp />} changeLabel="vs 30d ago" sparkSeed="an-r" />
        <MetricCard label="Sharpe Ratio" value="1.82" change={0.12} icon={<Scale />} changeLabel="" hint="risk-adjusted" />
        <MetricCard label="Volatility (30d)" value="42.6%" change={-3.4} icon={<Zap />} changeLabel="" hint="annualised" />
        <MetricCard label="Max Drawdown" value="−21.4%" icon={<TrendingDown />} changeLabel="" hint="trailing 12m" />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartContainer className="xl:col-span-2" title="Performance vs Benchmarks" subtitle="Portfolio · BTC · ETH · S&P 500" hideToolbar timeframes={["1M", "3M", "1Y", "ALL"]} defaultTimeframe="1Y">
          <ChartPlaceholder variant="line" height={280} seed="an-bench" trend={30} yLabels={["+120%", "+90%", "+60%", "+30%", "0%"]} xLabels={["Q3", "Q4", "Q1", "Q2"]} />
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">{[["Portfolio", "#315CF5"], ["Bitcoin", "#F7931A"], ["Ethereum", "#627EEA"], ["S&P 500", "#B8C2D8"]].map(([l, c]) => <span key={l} className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ background: c }} />{l}</span>)}</div>
        </ChartContainer>
        <Card><CardHeader title="Diversification" subtitle="By sector" /><div className="flex flex-col items-center gap-5 p-5"><DonutChart size={150} thickness={16} segments={sectors}><span className="text-[11px] text-muted">Score</span><span className="text-xl font-semibold text-ink">7.4</span></DonutChart><div className="w-full"><Legend segments={sectors} /></div></div></Card>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartContainer title="Monthly Returns" subtitle="% change per month" hideToolbar hideTimeframes><BarChartPlaceholder data={monthly} signed height={200} labels={["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]} /></ChartContainer>
        <Card><CardHeader title="Profit & Loss by Asset" icon={<Trophy />} /><ul className="space-y-4 p-5">{[...PORTFOLIO_HOLDINGS].sort((a, b) => holdingPnl(b) - holdingPnl(a)).slice(0, 6).map((h) => <li key={h.symbol} className="flex items-center gap-3"><CoinLogo symbol={h.symbol} color={h.color} size={28} /><span className="w-12 text-[13px] font-medium text-ink">{h.symbol}</span><ProgressBar className="flex-1" value={Math.min(Math.abs(holdingPnlPct(h)) / 2, 100)} color={holdingPnl(h) >= 0 ? "var(--success)" : "var(--danger)"} /><span className="w-24 text-right"><PnlText v={holdingPnl(h)} /></span></li>)}</ul></Card>
      </div>
    </div>
  );
}

export function PortfolioTransactionsView() {
  const [type, setType] = useState("all");
  const [open, setOpen] = useState(false);
  const rows = PORTFOLIO_TXS.filter((t) => type === "all" || t.type.toLowerCase() === type);
  return (
    <div className="space-y-6">
      <PageHeader title="Transaction History" description="Every buy, sell, transfer and stake recorded in your portfolio." actions={<><Button icon={<Download className="size-4" />}>Export CSV</Button><Button variant="primary" icon={<Plus className="size-4" />} onClick={() => setOpen(true)}>Add transaction</Button></>} />
      <Card className="overflow-hidden">
        <div className="border-b border-line p-5"><Tabs ariaLabel="Transaction type" value={type} onChange={setType} items={[{ id: "all", label: "All", count: PORTFOLIO_TXS.length }, { id: "buy", label: "Buys" }, { id: "sell", label: "Sells" }, { id: "transfer", label: "Transfers" }, { id: "stake", label: "Staking" }]} /></div>
        <PortfolioTxTable rows={rows} pageSize={10} />
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Add transaction" description="Manual entry — UI prototype only, nothing is saved." footer={<><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" onClick={() => setOpen(false)}>Add transaction</Button></>}>
        <div className="grid grid-cols-2 gap-4">{["Asset", "Type", "Amount", "Price per coin", "Date", "Fee"].map((f) => <div key={f} className="space-y-1.5"><label className="text-xs font-medium text-muted">{f}</label><input placeholder={f} className="h-10 w-full rounded-xl border border-line bg-card px-3 text-sm text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" /></div>)}</div>
      </Modal>
    </div>
  );
}

function Field({ label, value, type = "text", hint }: { label: string; value?: string; type?: string; hint?: string }) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5"><label htmlFor={id} className="text-[13px] font-medium text-ink">{label}</label><input id={id} type={type} defaultValue={value} className="h-10 w-full rounded-xl border border-line bg-card px-3 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10" />{hint && <p className="text-xs text-muted">{hint}</p>}</div>
  );
}

function SettingRow({ title, desc, children }: { title: string; desc: string; children: ReactNode }) {
  return <div className="flex items-center justify-between gap-4 py-4"><div><div className="text-[13px] font-medium text-ink">{title}</div><div className="mt-0.5 text-xs text-muted">{desc}</div></div>{children}</div>;
}

export function ProfileSettingsView() {
  const [n, setN] = useState({ alerts: true, news: false, digest: true });
  const [cur, setCur] = useState("USD — US Dollar");
  return (
    <div className="space-y-6">
      <PageHeader title="Profile Settings" description="Manage your public profile, preferences and notifications." actions={<Button variant="primary">Save changes</Button>} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Personal Information" />
          <div className="space-y-6 p-5">
            <div className="flex items-center gap-4"><span className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-semibold text-white">AM</span><div className="space-x-2"><Button size="sm" icon={<Camera className="size-3.5" />}>Upload photo</Button><Button size="sm" variant="ghost">Remove</Button><p className="mt-2 text-xs text-muted">JPG or PNG, max 2 MB.</p></div></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Field label="First name" value="Alex" /><Field label="Last name" value="Morgan" /><Field label="Email" value="alex@cryptoverse.io" type="email" /><Field label="Username" value="alexmorgan" hint="Shown on shared watchlists." /></div>
            <div className="space-y-1.5"><label htmlFor="bio" className="text-[13px] font-medium text-ink">Bio</label><textarea id="bio" rows={3} defaultValue="Long-term investor focused on Layer 1 infrastructure and on-chain analytics." className="w-full rounded-xl border border-line bg-card px-3 py-2.5 text-sm text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" /></div>
          </div>
        </Card>
        <div className="space-y-6">
          <Card><CardHeader title="Preferences" /><div className="space-y-4 p-5"><div className="space-y-1.5"><label className="text-[13px] font-medium text-ink">Currency</label><div><SelectDropdown options={["USD — US Dollar", "EUR — Euro", "GBP — British Pound", "JPY — Japanese Yen"]} value={cur} onChange={setCur} /></div></div><Field label="Time zone" value="UTC−05:00 New York" /></div></Card>
          <Card><CardHeader title="Notifications" /><div className="divide-y divide-line px-5"><SettingRow title="Price alerts" desc="Push when targets are hit"><Switch checked={n.alerts} onChange={(v) => setN({ ...n, alerts: v })} label="Price alerts" /></SettingRow><SettingRow title="Market news" desc="Breaking headlines"><Switch checked={n.news} onChange={(v) => setN({ ...n, news: v })} label="Market news" /></SettingRow><SettingRow title="Weekly digest" desc="Portfolio summary by email"><Switch checked={n.digest} onChange={(v) => setN({ ...n, digest: v })} label="Weekly digest" /></SettingRow></div></Card>
        </div>
      </div>
    </div>
  );
}

export function AccountSettingsView() {
  const [twofa, setTwofa] = useState(true);
  return (
    <div className="space-y-6">
      <PageHeader title="Account Settings" description="Security, plan and connected services." />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card><CardHeader title="Security" icon={<ShieldCheck />} /><div className="divide-y divide-line px-5"><SettingRow title="Two-factor authentication" desc="Authenticator app · recommended"><Switch checked={twofa} onChange={setTwofa} label="Two-factor authentication" /></SettingRow><SettingRow title="Password" desc="Last changed 3 months ago"><Button size="sm" icon={<Lock className="size-3.5" />}>Change</Button></SettingRow><SettingRow title="Active sessions" desc="MacBook Pro · New York · now"><Button size="sm" variant="danger">Sign out others</Button></SettingRow></div></Card>
          <Card><CardHeader title="API Keys" icon={<KeyRound />} action={<Button size="xs" icon={<Plus className="size-3" />}>Create key</Button>} /><ul className="divide-y divide-line px-5">{[["Portfolio sync", "cv_live_••••••••9f2a", "Read-only"], ["Trading bot", "cv_live_••••••••c81d", "Read-only"]].map(([n, k, p]) => <li key={n} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><div className="text-[13px] font-medium text-ink">{n}</div><div className="mt-0.5 font-mono text-xs text-muted">{k}</div></div><StatusBadge tone="success">{p}</StatusBadge></li>)}</ul></Card>
          <Card><CardHeader title="Connected Wallets" icon={<Wallet />} action={<Button size="xs" icon={<Plus className="size-3" />}>Connect</Button>} /><ul className="divide-y divide-line px-5">{[["MetaMask", "0x71C7…976F"], ["Ledger", "0x9aB2…41e0"], ["Phantom", "7xKX…gAsU"]].map(([n, a]) => <li key={n} className="flex items-center justify-between py-4"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-primary-soft text-primary"><Smartphone className="size-4" /></span><div><div className="text-[13px] font-medium text-ink">{n}</div><div className="font-mono text-xs text-muted">{a}</div></div></div><Button size="xs" variant="ghost">Disconnect</Button></li>)}</ul></Card>
        </div>
        <div className="space-y-6">
          <Card className="overflow-hidden"><div className="bg-gradient-to-br from-primary to-[#2449d8] p-5 text-white"><StatusBadge className="!bg-white/20 !text-white">Current plan</StatusBadge><div className="mt-3 text-2xl font-semibold">CryptoVerse Pro</div><div className="mt-1 text-sm text-white/80">$29 / month · renews Jul 28</div></div><div className="space-y-3 p-5 text-[13px]">{["Unlimited watchlists & alerts", "Advanced on-chain analytics", "Wallet intelligence & PnL", "Priority data refresh"].map((f) => <div key={f} className="flex items-center gap-2 text-ink"><Star className="size-3.5 fill-primary text-primary" />{f}</div>)}<Button block className="mt-2">Manage billing</Button></div></Card>
          <Card className="border-danger/30"><CardHeader title="Danger Zone" /><div className="space-y-3 p-5"><p className="text-[13px] text-muted">Deleting your account permanently removes your portfolio, watchlists and alerts.</p><Button variant="danger" block>Delete account</Button></div></Card>
        </div>
      </div>
    </div>
  );
}

export type { ReactNode };
