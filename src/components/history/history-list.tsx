"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Trash2, Calendar, Loader2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DownloadPdfButton } from "@/components/shared/download-pdf-button";
import { formatNumber } from "@/lib/format";
import { deleteMealPlanAction } from "@/lib/actions/index";
import { formatPlanDate, getMealPreview, mealPlanToPdfData } from "@/lib/meal-plan-utils";
import { toast } from "sonner";
import type { MealPlan } from "@/types";

interface HistoryListProps {
  plans: MealPlan[];
}

export function HistoryList({ plans: initialPlans }: HistoryListProps) {
  const [plans, setPlans] = useState(initialPlans);
  const [isPending, startTransition] = useTransition();

  function handleDelete(planId: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const result = await deleteMealPlanAction(planId);
      if (result.error) {
        toast.error(result.error);
      } else {
        setPlans((prev) => prev.filter((p) => p.id !== planId));
        toast.success("تم حذف البرنامج");
      }
    });
  }

  if (plans.length === 0) {
    return (
      <div className="rounded-3xl border border-border/50 bg-card p-10 text-center shadow-premium sm:p-12">
        <p className="text-muted-foreground">لا توجد برامج محفوظة بعد.</p>
        <Button asChild className="mt-6 rounded-2xl">
          <Link href="/calculate">إنشاء برنامج</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {plans.map((plan) => (
        <Link
          key={plan.id}
          href={`/history/${plan.id}`}
          className="group flex items-center justify-between rounded-2xl border border-border/50 bg-card p-6 transition-all hover:border-primary/20 hover:shadow-premium"
        >
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              {formatPlanDate(plan.created_at)}
            </div>
            <p className="font-inter text-lg font-semibold">
              {formatNumber(plan.calories)} kcal
              <span className="mx-2 font-normal text-muted-foreground">·</span>
              {formatNumber(plan.protein)}g بروتين
            </p>
            {getMealPreview(plan.meals) && (
              <p className="truncate text-xs text-muted-foreground">
                {getMealPreview(plan.meals)}
              </p>
            )}
            <p className="text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
              عرض التفاصيل
              <ChevronLeft className="mr-1 inline h-3 w-3" />
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <DownloadPdfButton
              data={mealPlanToPdfData(plan)}
              size="icon"
              variant="ghost"
              className="opacity-70 hover:opacity-100"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleDelete(plan.id, e)}
              disabled={isPending}
              className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </Link>
      ))}
    </div>
  );
}
