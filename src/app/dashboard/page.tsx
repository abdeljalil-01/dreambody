import type { Metadata } from "next";
import Link from "next/link";
import { Flame, Beef, Wheat, Droplets, Salad, ArrowLeft, History } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { StatCard } from "@/components/shared/stat-card";
import { MacroChart } from "@/components/shared/macro-chart";
import { MealCard } from "@/components/shared/meal-card";
import { DownloadPdfButton } from "@/components/shared/download-pdf-button";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { getLatestMealPlan, getMealPlans } from "@/lib/actions/index";
import { mealPlanToPdfData } from "@/lib/meal-plan-utils";
import { MEAL_TYPES } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import type { Meal, MealType } from "@/types";

export const metadata: Metadata = {
  title: "لوحة التحكم",
};

export default async function DashboardPage() {
  const latestPlan = await getLatestMealPlan();
  const allPlans = await getMealPlans();

  const meals = (latestPlan?.meals ?? []) as Meal[];
  const mealsByType = meals.reduce(
    (acc: Record<MealType, Meal>, meal) => {
      acc[meal.meal_type as MealType] = meal;
      return acc;
    },
    {} as Record<MealType, Meal>
  );

  return (
    <AppLayout>
      <div className="container-app space-y-7 py-8 sm:py-10">
        <PageHeader
          title="لوحة التحكم"
          description="نظرة شاملة على تقدمك الغذائي"
          action={
            <Button asChild className="rounded-2xl">
              <Link href="/calculate">
                حساب جديد
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          }
        />

        {latestPlan ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard title="السعرات" value={latestPlan.calories} unit="kcal" icon={Flame} variant="primary" />
              <StatCard title="البروتين" value={latestPlan.protein} unit="g" icon={Beef} />
              <StatCard title="الكربوهيدرات" value={latestPlan.carbs} unit="g" icon={Wheat} />
              <StatCard title="الدهون" value={latestPlan.fat} unit="g" icon={Droplets} />
            </div>

            <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-premium">
              <h2 className="mb-4 text-lg font-semibold">توزيع الماكروز</h2>
              <MacroChart
                protein={latestPlan.protein}
                carbs={latestPlan.carbs}
                fat={latestPlan.fat}
                calories={latestPlan.calories}
              />
            </div>

            {meals.length > 0 && (
              <div>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold">البرنامج الحالي</h2>
                  <div className="flex gap-2">
                    <DownloadPdfButton data={mealPlanToPdfData(latestPlan)} size="sm" />
                    <Button variant="outline" size="sm" asChild className="rounded-xl">
                      <Link href={`/history/${latestPlan.id}`}>عرض التفاصيل</Link>
                    </Button>
                  </div>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
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
            )}
          </>
        ) : (
          <div className="rounded-3xl border border-border/50 bg-card p-10 text-center shadow-premium sm:p-12">
            <Salad className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="text-lg font-semibold">لا يوجد برنامج غذائي بعد</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              ابدأ بحساب احتياجاتك ثم أنشئ برنامجك الغذائي الأول.
            </p>
            <Button asChild className="mt-6 rounded-2xl">
              <Link href="/calculate">ابدأ الآن</Link>
            </Button>
          </div>
        )}

        <div className="rounded-3xl border border-border/50 bg-muted/30 p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h3 className="text-base font-semibold">إحصائيات</h3>
            {allPlans.length > 0 && (
              <Button variant="outline" size="sm" asChild className="rounded-xl">
                <Link href="/history">
                  <History className="h-4 w-4" />
                  عرض السجل
                </Link>
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-card p-5 text-center shadow-premium">
              <p className="font-inter text-3xl font-semibold">{formatNumber(allPlans.length)}</p>
              <p className="mt-1 text-xs text-muted-foreground">برنامج محفوظ</p>
            </div>
            <div className="rounded-2xl bg-card p-5 text-center shadow-premium">
              <p className="font-inter text-3xl font-semibold">
                {latestPlan ? formatNumber(latestPlan.calories) : "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">سعرات اليوم</p>
            </div>
            <div className="col-span-2 rounded-2xl bg-card p-5 text-center shadow-premium sm:col-span-1">
              <p className="font-inter text-3xl font-semibold">
                {latestPlan ? formatNumber(latestPlan.protein) : "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">بروتين (g)</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
