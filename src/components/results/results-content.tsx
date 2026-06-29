"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Flame, Loader2, Beef, Wheat, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { MacroChart } from "@/components/shared/macro-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { safeJsonParse } from "@/lib/safe-json";
import type { NutritionResult } from "@/types";

export function ResultsContent() {
  const router = useRouter();
  const [result, setResult] = useState<NutritionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("nutritionResult");
    if (stored) {
      setResult(safeJsonParse<NutritionResult | null>(stored, null));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-12">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-muted-foreground">لا توجد نتائج. ابدأ بالحساب أولاً.</p>
        <Button asChild className="mt-4">
          <Link href="/calculate">احسب احتياجاتك</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-12 sm:px-6">
      <div>
        <h1 className="text-3xl font-bold">نتائجك الغذائية</h1>
        <p className="mt-2 text-muted-foreground">
          احتياجاتك اليومية المحسوبة بدقة
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="BMR" value={result.bmr} unit="kcal" icon={Flame} description="معدل الأيض الأساسي" />
        <StatCard title="TDEE" value={result.tdee} unit="kcal" icon={Flame} description="الاحتياج اليومي" variant="muted" />
        <StatCard title="السعرات المستهدفة" value={result.calories} unit="kcal" icon={Flame} variant="primary" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="البروتين" value={result.protein} unit="g" icon={Beef} />
        <StatCard title="الكربوهيدرات" value={result.carbs} unit="g" icon={Wheat} />
        <StatCard title="الدهون" value={result.fat} unit="g" icon={Droplets} />
      </div>

      <div className="rounded-2xl border border-border/40 bg-card p-8">
        <h2 className="mb-6 text-lg font-semibold">توزيع الماكروز</h2>
        <MacroChart
          protein={result.protein}
          carbs={result.carbs}
          fat={result.fat}
          calories={result.calories}
        />
      </div>

      <div className="flex justify-center pt-4">
        <Button size="lg" onClick={() => router.push("/meal-plan")}>
          إنشاء البرنامج الغذائي
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function ResultsLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
