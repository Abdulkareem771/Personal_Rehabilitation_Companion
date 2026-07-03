import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  badge,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border mb-6", className)} {...props}>
      <div className="space-y-1.5">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {title}
          </h1>
          {badge && <div>{badge}</div>}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground max-w-2xl font-medium">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
          {actions}
        </div>
      )}
    </header>
  );
}
