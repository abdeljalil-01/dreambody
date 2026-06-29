"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MealCard } from "@/components/shared/meal-card";
import { MacroChart } from "@/components/shared/macro-chart";
import { DownloadPdfButton } from "@/components/shared/download-pdf-button";
import { Button } from "@/components/ui/button";
import { MEAL_TYPES } from "@/lib/constants";
import { formatPlanDate, mealPlanToPdfData } from "@/lib/meal-plan-utils";
import type { Meal, MealPlan, MealType } from "@/types";

interface HistoryPlanDetailProps {
  plan: MealPlan;
}

export function HistoryPlanDetail({ plan }: HistoryPlanDetailProps) {
  const meals = (plan.meals ?? []) as Meal[];
  const mealsByType = meals.reduce(
    (acc: Record<MealType, Meal>, meal) => {
      acc[meal.meal_type as MealType] = meal;
      return acc;
    },
    {} as Record<MealType, Meal>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{formatPlanDate(plan.created_at)}</p>
          <h1 className="mt-1 text-2xl font-bold">برنامج غذائي محفوظ</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            هذا البرنامج محفوظ ولا يمكن تعديله. لإنشاء برنامج جديد، استخدم الحاسبة.
          </p>
        </div>
        <div className="flex gap-3">
          <DownloadPdfButton data={mealPlanToPdfData(plan)} />
          <Button variant="outline" asChild className="rounded-2xl">
            <Link href="/history">
              <ArrowRight className="h-4 w-4" />
              العودة للسجل
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-3xl border border-border/50 bg-card p-8 shadow-premium">
        <h2 className="mb-6 text-lg font-semibold">توزيع الماكروز</h2>
        <MacroChart
          protein={plan.protein}
          carbs={plan.carbs}
          fat={plan.fat}
          calories={plan.calories}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {MEAL_TYPES.map(({ value, label }) => {
          const meal = mealsByType[value];
          if (!meal) return null;
          return (
            <MealCard
              key={value}
              title={label}
              meal={{
                name: meal.name,
                ingredients: meal.ingredients,
                calories: meal.calories,
                protein: meal.protein,
                carbs: meal.carbs,
                fat: meal.fat,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
