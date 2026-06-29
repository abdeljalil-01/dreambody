"use client";

import { memo } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MealItem } from "@/types";

interface MealCardProps {
  title: string;
  meal: MealItem;
  onReplace?: () => void;
  isReplacing?: boolean;
}

const macros = [
  { key: "calories", label: "سعرات", unit: "kcal", color: "text-amber-500" },
  { key: "protein", label: "بروتين", unit: "g", color: "text-emerald-500" },
  { key: "carbs", label: "كربوهيدرات", unit: "g", color: "text-blue-500" },
  { key: "fat", label: "دهون", unit: "g", color: "text-rose-400" },
] as const;

export const MealCard = memo(function MealCard({
  title,
  meal,
  onReplace,
  isReplacing,
}: MealCardProps) {
  return (
    <article className="card-hover group relative overflow-hidden rounded-[1.4rem] border border-border/50 bg-card pb-6 shadow-premium transition-all duration-300">
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 z-10 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="px-6 pt-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary/80">
              {title}
            </p>
            <h3 className="mt-1.5 text-base font-semibold leading-snug">{meal.name}</h3>
          </div>

          {onReplace && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReplace}
              disabled={isReplacing}
              className="h-8 shrink-0 rounded-xl border border-border/50 bg-muted/40 px-3 text-xs text-muted-foreground opacity-0 transition-all duration-200 hover:border-primary/30 hover:bg-primary/8 hover:text-primary group-hover:opacity-100"
            >
              <RefreshCw
                className={cn(
                  "ml-1 h-3.5 w-3.5",
                  isReplacing && "animate-spin"
                )}
              />
              استبدال
            </Button>
          )}
        </div>

        {/* Ingredients */}
        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
          {meal.ingredients}
        </p>

        {/* Macro grid */}
        <div className="grid grid-cols-4 gap-2 overflow-hidden rounded-[0.875rem] border border-border/40 bg-muted/30 p-3">
          {macros.map((macro) => (
            <div key={macro.key} className="text-center">
              <p className={cn("font-inter tabular-nums text-sm font-bold", macro.color)}>
                {formatNumber(meal[macro.key])}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{macro.label}</p>
              <p className="text-[9px] text-muted-foreground/60">{macro.unit}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
});
