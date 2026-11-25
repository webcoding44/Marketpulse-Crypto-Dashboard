"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  const set = (v: boolean) => {
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
    try {
      localStorage.setItem("cv-theme", v ? "dark" : "light");
    } catch {}
  };
  return { dark, set };
}

export function ThemeToggleRow() {
  const { dark, set } = useTheme();
  return (
    <div className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium text-muted">
      <span className="flex items-center gap-3">
        {dark ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
        {dark ? "Dark Mode" : "Light Mode"}
      </span>
      <Switch checked={dark} onChange={set} label="Toggle dark mode" />
    </div>
  );
}
