"use client";

import { useEffect, useState } from "react";
import type { NutritionResult } from "@/types";

const NUTRITION_KEY = "nutritionResult";
const MEAL_PLAN_KEY = "mealPlan";

export function useNutritionStorage() {
  const [nutrition, setNutritionState] = useState<NutritionResult | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(NUTRITION_KEY);
    if (stored) setNutritionState(JSON.parse(stored));
    setLoaded(true);
  }, []);

  function setNutrition(result: NutritionResult) {
    sessionStorage.setItem(NUTRITION_KEY, JSON.stringify(result));
    setNutritionState(result);
  }

  function clearNutrition() {
    sessionStorage.removeItem(NUTRITION_KEY);
    sessionStorage.removeItem(MEAL_PLAN_KEY);
    setNutritionState(null);
  }

  return { nutrition, loaded, setNutrition, clearNutrition };
}
