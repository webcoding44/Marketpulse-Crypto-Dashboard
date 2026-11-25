import { series } from "@/lib/utils";

export interface TreasuryEntity {
  id: string;
  name: string;
  ticker?: string;
  kind: "Public Company" | "Government";
  country: string;
  color: string;
  btc: number;
  eth?: number;
  costBasis: number;
  since: string;
  change30d: number;
  spark: number[];
  note: string;
}

type R = [string, string, string | undefined, "Public Company" | "Government", string, string, number, number, number, string, number, string];
const ROWS: R[] = [
  ["strategy", "Strategy", "MSTR", "Public Company", "United States", "#E11D48", 214400, 0, 35160, "Aug 2020", 3.1, "Largest corporate holder, funding purchases via convertible notes and equity offerings."],
  ["marathon", "Marathon Digital", "MARA", "Public Company", "United States", "#0F172A", 44893, 0, 41300, "Dec 2020", 1.4, "Bitcoin miner that retains most mined BTC on balance sheet."],
  ["riot", "Riot Platforms", "RIOT", "Public Company", "United States", "#F59E0B", 17722, 0, 38900, "Apr 2021", 0.6, "Vertically integrated miner with large Texas operations."],
  ["galaxy", "Galaxy Digital", "GLXY", "Public Company", "United States", "#6D28D9", 16400, 0, 29100, "Jan 2022", 2.2, "Institutional financial services firm with proprietary holdings."],
  ["hut-8", "Hut 8", "HUT", "Public Company", "Canada", "#0EA5E9", 10264, 0, 33200, "Jun 2021", 0.9, "North American miner and high-performance compute operator."],
  ["cleanspark", "CleanSpark", "CLSK", "Public Company", "United States", "#10B981", 10556, 0, 34800, "Nov 2021", 1.7, "Sustainable miner focused on low-cost energy."],
  ["tesla", "Tesla", "TSLA", "Public Company", "United States", "#DC2626", 9720, 0, 31600, "Feb 2021", 0, "Holds BTC as a treasury reserve alongside cash."],
  ["coinbase", "Coinbase", "COIN", "Public Company", "United States", "#1652F0", 9181, 0, 24700, "May 2022", 0.4, "Largest US exchange; holds BTC for corporate treasury."],
  ["block", "Block, Inc.", "XYZ", "Public Company", "United States", "#111827", 8584, 0, 30600, "Oct 2020", 0, "Payments company with long-standing bitcoin strategy."],
  ["semler", "Semler Scientific", "SMLR", "Public Company", "United States", "#2563EB", 3192, 0, 61200, "May 2024", 4.2, "Healthcare technology firm adopting a bitcoin treasury."],
  ["united-states", "United States", undefined, "Government", "United States", "#1D4ED8", 198100, 0, 0, "Seized assets", 0, "Holdings stem from law-enforcement seizures; reserve policy under discussion."],
  ["china", "China", undefined, "Government", "China", "#DC2626", 190000, 0, 0, "Seized assets", 0, "Estimated holdings from past enforcement actions."],
  ["united-kingdom", "United Kingdom", undefined, "Government", "United Kingdom", "#1E3A8A", 61245, 0, 0, "Seized assets", 0, "Seized in a record-breaking fraud case."],
  ["ukraine", "Ukraine", undefined, "Government", "Ukraine", "#F59E0B", 46351, 0, 0, "Donations", 0.3, "Includes declared officials' holdings and donations."],
  ["bhutan", "Bhutan", undefined, "Government", "Bhutan", "#F97316", 13029, 0, 0, "Mining", -1.4, "Accumulated via state-backed hydropower mining."],
  ["el-salvador", "El Salvador", undefined, "Government", "El Salvador", "#0EA5E9", 5968, 0, 48000, "Sep 2021", 0.5, "Legal tender since 2021; buys 1 BTC per day."],
];

export const TREASURY: TreasuryEntity[] = ROWS.map((r) => ({
  id: r[0],
  name: r[1],
  ticker: r[2],
  kind: r[3],
  country: r[4],
  color: r[5],
  btc: r[6],
  eth: r[7],
  costBasis: r[8],
  since: r[9],
  change30d: r[10],
  spark: series(r[0] + "tr", 28, 18, 0.5),
  note: r[11],
}));

export const COMPANIES = TREASURY.filter((t) => t.kind === "Public Company");
export const GOVERNMENTS = TREASURY.filter((t) => t.kind === "Government");
export const getTreasury = (id: string) => TREASURY.find((t) => t.id === id);

export const BTC_SUPPLY = 19.7e6;
export const BTC_PRICE = 62840.5;
