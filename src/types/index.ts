import type { ActivityLevel, Gender, Goal, MealType } from "@/lib/constants";

export type { MealType };

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  age: number | null;
  gender: Gender | null;
  height: number | null;
  weight: number | null;
  activity_level: ActivityLevel | null;
  goal: Goal | null;
  created_at: string;
}

export interface MealPlan {
  id: string;
  user_id: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  created_at: string;
  meals?: Meal[];
}

export interface Meal {
  id: string;
  meal_plan_id: string;
  meal_type: MealType;
  name: string;
  ingredients: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealItem {
  name: string;
  ingredients: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface GeneratedMealPlan {
  breakfast: MealItem;
  lunch: MealItem;
  dinner: MealItem;
  snack: MealItem;
}

export interface NutritionResult {
  bmr: number;
  tdee: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
