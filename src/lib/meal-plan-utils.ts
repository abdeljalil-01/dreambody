import { MEAL_TYPES } from "@/lib/constants";
import type { GeneratedMealPlan, Meal, MealPlan, MealItem, MealType } from "@/types";

export function calculateMealPlanTotals(plan: GeneratedMealPlan) {
  const meals = [plan.breakfast, plan.lunch, plan.dinner, plan.snack];
  return {
    calories: meals.reduce((sum, m) => sum + Math.max(0, m.calories), 0),
    protein: meals.reduce((sum, m) => sum + Math.max(0, m.protein), 0),
    carbs: meals.reduce((sum, m) => sum + Math.max(0, m.carbs), 0),
    fat: meals.reduce((sum, m) => sum + Math.max(0, m.fat), 0),
  };
}

export function calculatePercentageError(actual: number, target: number): number {
  if (target === 0) return actual === 0 ? 0 : 100;
  return Math.abs((actual - target) / target) * 100;
}

export function validateMealPlanAccuracy(
  plan: GeneratedMealPlan,
  targets: { calories: number; protein: number; carbs: number; fat: number }
) {
  const totals = calculateMealPlanTotals(plan);
  const errors = {
    calories: calculatePercentageError(totals.calories, targets.calories),
    protein: calculatePercentageError(totals.protein, targets.protein),
    carbs: calculatePercentageError(totals.carbs, targets.carbs),
    fat: calculatePercentageError(totals.fat, targets.fat),
  };
  const maxError = Math.max(errors.calories, errors.protein, errors.carbs, errors.fat);
  return { totals, errors, maxError, isValid: maxError <= 3 };
}

export function sanitizeMealItem(item: MealItem): MealItem {
  return {
    name: item.name || "وجبة",
    ingredients: item.ingredients || "",
    calories: Math.max(0, Math.round(item.calories || 0)),
    protein: Math.max(0, Math.round(item.protein || 0)),
    carbs: Math.max(0, Math.round(item.carbs || 0)),
    fat: Math.max(0, Math.round(item.fat || 0)),
  };
}

export function sanitizeMealPlan(plan: GeneratedMealPlan): GeneratedMealPlan {
  return {
    breakfast: sanitizeMealItem(plan.breakfast),
    lunch: sanitizeMealItem(plan.lunch),
    dinner: sanitizeMealItem(plan.dinner),
    snack: sanitizeMealItem(plan.snack),
  };
}

export function mealsToGeneratedPlan(meals: Meal[]): GeneratedMealPlan {
  const plan = {} as GeneratedMealPlan;

  for (const { value } of MEAL_TYPES) {
    const meal = meals.find((m) => m.meal_type === value);
    plan[value as MealType] = meal
      ? {
          name: meal.name,
          ingredients: meal.ingredients,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
        }
      : {
          name: "—",
          ingredients: "",
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        };
  }

  return plan;
}

export function formatPlanDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ar", {
    year: "numeric",
    month: "long",
    day: "numeric",
    numberingSystem: "latn",
  });
}

export interface PdfMealPlanData {
  title: string;
  date?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  plan: GeneratedMealPlan;
}

export function mealPlanToPdfData(plan: MealPlan): PdfMealPlanData {
  return {
    title: "برنامج غذائي — DreamBody",
    date: formatPlanDate(plan.created_at),
    calories: plan.calories,
    protein: plan.protein,
    carbs: plan.carbs,
    fat: plan.fat,
    plan: mealsToGeneratedPlan(plan.meals ?? []),
  };
}

export function draftToPdfData(
  nutrition: { calories: number; protein: number; carbs: number; fat: number },
  plan: GeneratedMealPlan
): PdfMealPlanData {
  return {
    title: "برنامج غذائي — DreamBody",
    date: formatPlanDate(new Date().toISOString()),
    calories: nutrition.calories,
    protein: nutrition.protein,
    carbs: nutrition.carbs,
    fat: nutrition.fat,
    plan,
  };
}

export function getMealPreview(meals: Meal[] | undefined, limit = 2): string {
  if (!meals?.length) return "";
  return meals
    .slice(0, limit)
    .map((m) => m.name)
    .join(" · ");
}
