"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MealCard } from "@/components/shared/meal-card";
import { MacroChart } from "@/components/shared/macro-chart";
import { DownloadPdfButton } from "@/components/shared/download-pdf-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MEAL_TYPES } from "@/lib/constants";
import { createMealPlanAction, replaceMealAction, saveMealPlanAction } from "@/lib/actions/index";
import { draftToPdfData } from "@/lib/meal-plan-utils";
import { safeJsonParse } from "@/lib/safe-json";
import type { GeneratedMealPlan, MealItem, NutritionResult } from "@/types";
import { toast } from "sonner";

export function MealPlanContent() {
  const router = useRouter();
  const [nutrition, setNutrition] = useState<NutritionResult | null>(null);
  const [plan, setPlan] = useState<GeneratedMealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingMealType, setLoadingMealType] = useState<string | null>(null);
  const [replacingType, setReplacingType] = useState<string | null>(null);
  const [alternatives, setAlternatives] = useState<MealItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const replacingTypeRef = useRef<string | null>(null);

  const generatePlan = useCallback(async (nutr: NutritionResult) => {
    setLoading(true);
    const result = await createMealPlanAction(
      nutr.calories,
      nutr.protein,
      nutr.carbs,
      nutr.fat
    );

    if (result.error) {
      toast.error(result.error);
    } else if (result.data) {
      setPlan(result.data);
      sessionStorage.setItem("mealPlan", JSON.stringify(result.data));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const storedNutrition = sessionStorage.getItem("nutritionResult");
    const storedPlan = sessionStorage.getItem("mealPlan");

    if (storedNutrition) {
      const nutr = safeJsonParse<NutritionResult | null>(storedNutrition, null);
      if (!nutr) {
        setLoading(false);
        return;
      }
      setNutrition(nutr);

      if (storedPlan) {
        const parsed = safeJsonParse<GeneratedMealPlan | null>(storedPlan, null);
        setPlan(parsed);
        setLoading(false);
      } else {
        generatePlan(nutr);
      }
    } else {
      setLoading(false);
    }
  }, [generatePlan]);

  function resetReplaceState() {
    replacingTypeRef.current = null;
    setReplacingType(null);
    setLoadingMealType(null);
    setAlternatives([]);
  }

  function handleDialogChange(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      resetReplaceState();
    }
  }

  async function handleReplace(mealType: string) {
    if (!plan || !nutrition) return;

    setLoadingMealType(mealType);
    replacingTypeRef.current = mealType;
    setReplacingType(mealType);
    setAlternatives([]);
    setDialogOpen(true);

    const currentMeal = plan[mealType as keyof GeneratedMealPlan];
    const result = await replaceMealAction(mealType, currentMeal, nutrition);

    setLoadingMealType(null);

    if (result.error) {
      toast.error(result.error);
      setDialogOpen(false);
      resetReplaceState();
    } else if (result.data?.length) {
      setAlternatives(result.data);
    } else {
      toast.error("لم يتم العثور على بدائل");
      setDialogOpen(false);
      resetReplaceState();
    }
  }

  function selectAlternative(meal: MealItem) {
    const mealType = replacingTypeRef.current;
    if (!mealType || !plan) return;

    const updated = { ...plan, [mealType]: meal };
    setPlan(updated);
    sessionStorage.setItem("mealPlan", JSON.stringify(updated));
    setDialogOpen(false);
    resetReplaceState();
    toast.success("تم استبدال الوجبة");
  }

  async function handleSave() {
    if (!plan || !nutrition) return;

    setSaving(true);
    const result = await saveMealPlanAction(nutrition, plan);

    if (result.error) {
      toast.error(result.error);
    } else if (result.data) {
      sessionStorage.removeItem("mealPlan");
      toast.success("تم حفظ البرنامج بنجاح");
      router.push(`/history/${result.data.id}`);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-9 w-56" />
            <Skeleton className="h-5 w-72" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-28 rounded-2xl" />
            <Skeleton className="h-10 w-36 rounded-2xl" />
          </div>
        </div>
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[1.4rem] border border-border/50 bg-card p-6 shadow-premium">
              <div className="mb-4 space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-40" />
              </div>
              <Skeleton className="mb-5 h-10 w-full" />
              <div className="grid grid-cols-4 gap-2 rounded-[0.875rem] border border-border/40 bg-muted/30 p-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="space-y-1.5 text-center">
                    <Skeleton className="mx-auto h-5 w-12" />
                    <Skeleton className="mx-auto h-3 w-8" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!nutrition) {
    return (
      <div className="mx-auto max-w-md px-4 py-14 text-center">
        <p className="text-muted-foreground">احسب احتياجاتك أولاً.</p>
        <Button asChild className="mt-4">
          <Link href="/calculate">الذهاب للحاسبة</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">برنامجك الغذائي</h1>
          <p className="mt-2 text-muted-foreground">
            برنامج يومي مخصص — استخدم زر استبدال لتغيير وجبة محددة
          </p>
        </div>
        <div className="flex gap-3">
          {plan && (
            <DownloadPdfButton data={draftToPdfData(nutrition, plan)} />
          )}
          <Button onClick={handleSave} disabled={saving || !plan}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            حفظ البرنامج
          </Button>
        </div>
      </div>

      {nutrition && (
        <div className="rounded-2xl border border-border/40 bg-card p-6">
          <MacroChart
            protein={nutrition.protein}
            carbs={nutrition.carbs}
            fat={nutrition.fat}
            calories={nutrition.calories}
          />
        </div>
      )}

      {plan && (
        <div className="grid gap-5 sm:grid-cols-2">
          {MEAL_TYPES.map(({ value, label }) => (
            <MealCard
              key={value}
              title={label}
              meal={plan[value as keyof GeneratedMealPlan]}
              onReplace={() => handleReplace(value)}
              isReplacing={loadingMealType === value}
            />
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>اختر بديلاً</DialogTitle>
            <DialogDescription>
              {replacingType
                ? `بدائل ل${MEAL_TYPES.find((m) => m.value === replacingType)?.label ?? "الوجبة"} بنفس السعرات والماكروز تقريباً`
                : "بدائل بنفس السعرات والماكروز تقريباً"}
            </DialogDescription>
          </DialogHeader>

          {loadingMealType ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">جاري البحث عن بدائل...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alternatives.map((alt, i) => (
                <Button
                  key={`${alt.name}-${i}`}
                  type="button"
                  variant="outline"
                  onClick={() => selectAlternative(alt)}
                  className="h-auto w-full flex-col items-start rounded-xl p-4 text-right whitespace-normal"
                >
                  <span className="font-semibold">{alt.name}</span>
                  <span className="mt-1 text-xs font-normal text-muted-foreground">{alt.ingredients}</span>
                  <span className="mt-2 font-inter text-xs font-normal text-primary">
                    {alt.calories} kcal | {alt.protein}g بروتين
                  </span>
                </Button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
