import type { ReactNode } from "react";

interface Props {
  title: ReactNode;
  description?: string;
  actions?: ReactNode;
  badge?: ReactNode;
  leading?: ReactNode;
}

export function PageHeader({ title, description, actions, badge, leading }: Props) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex min-w-0 items-center gap-4">
        {leading}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
            {badge}
          </div>
          {description && <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
