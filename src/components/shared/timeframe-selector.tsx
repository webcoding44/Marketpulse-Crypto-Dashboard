"use client";

import { Tabs } from "@/components/ui/tabs";

export const DEFAULT_TIMEFRAMES = ["1H", "24H", "7D", "1M", "3M", "1Y", "ALL"];

interface Props {
  items?: string[];
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  className?: string;
}

export function TimeframeSelector({ items = DEFAULT_TIMEFRAMES, value, defaultValue, onChange, className }: Props) {
  return (
    <Tabs
      ariaLabel="Timeframe"
      className={className}
      items={items.map((i) => ({ id: i, label: i }))}
      value={value}
      defaultValue={defaultValue ?? items[Math.min(2, items.length - 1)]}
      onChange={onChange}
    />
  );
}
