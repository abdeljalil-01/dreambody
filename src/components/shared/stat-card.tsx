import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";

interface StatCardProps {
  title: string;
  value: number;
  unit?: string;
  icon: LucideIcon;
  description?: string;
  className?: string;
  variant?: "default" | "primary" | "muted";
}

export function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  description,
  className,
  variant = "default",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "card-hover group relative overflow-hidden rounded-[1.3rem] border p-6 transition-all duration-300",
        variant === "primary" &&
          "border-primary/20 bg-gradient-to-br from-primary/8 via-card to-accent/30",
        variant === "muted" && "border-border/40 bg-muted/30",
        variant === "default" && "border-border/50 bg-card shadow-premium",
        className
      )}
    >
      {/* Top shine line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="font-inter tabular-nums text-[2.1rem] font-bold leading-none tracking-tight">
            {formatNumber(value)}
            {unit && (
              <span className="mr-1.5 text-base font-normal text-muted-foreground">
                {unit}
              </span>
            )}
          </p>
          {description && (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.875rem] transition-all duration-300 group-hover:scale-110",
            variant === "primary"
              ? "bg-primary/15 text-primary"
              : "bg-primary/10 text-primary"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {/* Bottom accent bar for primary */}
      {variant === "primary" && (
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      )}
    </div>
  );
}
