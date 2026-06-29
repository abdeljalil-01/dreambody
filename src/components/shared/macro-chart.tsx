"use client";

import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

interface MacroChartProps {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  className?: string;
}

const macroConfig = [
  { label: "بروتين", unit: "g", barColor: "bg-emerald-500", textColor: "text-emerald-600", dotColor: "bg-emerald-500" },
  { label: "كربوهيدرات", unit: "g", barColor: "bg-amber-400", textColor: "text-amber-600", dotColor: "bg-amber-400" },
  { label: "دهون", unit: "g", barColor: "bg-rose-400", textColor: "text-rose-500", dotColor: "bg-rose-400" },
];

export function MacroChart({ protein, carbs, fat, calories, className }: MacroChartProps) {
  const proteinCal = protein * 4;
  const carbsCal = carbs * 4;
  const fatCal = fat * 9;
  const total = proteinCal + carbsCal + fatCal || 1;

  const segments = [
    { ...macroConfig[0], value: protein, pct: (proteinCal / total) * 100 },
    { ...macroConfig[1], value: carbs, pct: (carbsCal / total) * 100 },
    { ...macroConfig[2], value: fat, pct: (fatCal / total) * 100 },
  ];

  return (
    <div className={cn("space-y-5", className)}>
      {/* Segmented bar */}
      <div className="flex h-3 overflow-hidden rounded-full bg-muted/60">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={cn("transition-all duration-700", seg.barColor)}
            style={{ width: `${seg.pct}%` }}
          />
        ))}
      </div>

      {/* Macro breakdown cards */}
      <div className="grid grid-cols-3 gap-3">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className="group relative overflow-hidden rounded-[0.875rem] border border-border/40 bg-card/60 p-3 text-center transition-all duration-200 hover:border-border/70 hover:shadow-sm"
          >
            {/* Dot indicator */}
            <div className={cn("mx-auto mb-2 h-2 w-2 rounded-full", seg.dotColor)} />

            <p className="text-[11px] text-muted-foreground">{seg.label}</p>
            <p className={cn("font-inter tabular-nums text-lg font-bold leading-none mt-1", seg.textColor)}>
              {formatNumber(seg.value)}
              <span className="mr-0.5 text-[11px] font-normal text-muted-foreground">
                {" "}{seg.unit}
              </span>
            </p>
            <p className="mt-1 font-inter text-[11px] text-muted-foreground/70">
              {Math.round(seg.pct)}%
            </p>
          </div>
        ))}
      </div>

      {/* Total calories */}
      <div className="flex items-center justify-center gap-2 rounded-[0.875rem] border border-border/40 bg-muted/30 px-4 py-2.5">
        <span className="text-sm text-muted-foreground">إجمالي السعرات</span>
        <span className="font-inter tabular-nums font-bold text-foreground">
          {formatNumber(calories)}
          <span className="mr-1 text-xs font-normal text-muted-foreground">kcal</span>
        </span>
      </div>
    </div>
  );
}
