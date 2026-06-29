import { ACTIVITY_LEVELS, type ActivityLevel, type Gender, type Goal } from "./constants";

export interface CalculatorInput {
  age: number;
  gender: Gender;
  weight: number;
  height: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}

export interface CalculatorResult {
  bmr: number;
  tdee: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const MIN_CALORIES = 1200;
const MIN_FAT_PER_KG = 0.6;
const FAT_CALORIE_RATIO = 0.25;
const KCAL_PER_G_PROTEIN = 4;
const KCAL_PER_G_CARB = 4;
const KCAL_PER_G_FAT = 9;

const TDEE_MULTIPLIER: Record<Goal, number> = {
  lose_fat: 0.8,
  gain_muscle: 1.1,
  maintain: 1,
};

const PROTEIN_PER_KG: Record<Goal, number> = {
  lose_fat: 2.0,
  gain_muscle: 2.0,
  maintain: 1.6,
};

function validateInput(input: CalculatorInput): void {
  if (input.age < 10 || input.age > 100) {
    throw new Error("age must be between 10 and 100");
  }
  if (input.weight < 20 || input.weight > 300) {
    throw new Error("weight must be between 20 and 300 kg");
  }
  if (input.height < 100 || input.height > 250) {
    throw new Error("height must be between 100 and 250 cm");
  }
}

function getActivityMultiplier(activityLevel: ActivityLevel): number {
  return ACTIVITY_LEVELS.find((level) => level.value === activityLevel)?.multiplier ?? 1.2;
}

function calculateBmr(weight: number, height: number, age: number, gender: Gender): number {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return Math.round(gender === "male" ? base + 5 : base - 161);
}

function calculateTdee(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * getActivityMultiplier(activityLevel));
}

function calculateTargetCalories(tdee: number, goal: Goal): number {
  return Math.max(MIN_CALORIES, Math.round(tdee * TDEE_MULTIPLIER[goal]));
}

function calculateProteinGrams(weight: number, goal: Goal): number {
  return Math.round(weight * PROTEIN_PER_KG[goal]);
}

function calculateFatGrams(calories: number, weight: number): number {
  return Math.round(
    Math.max(MIN_FAT_PER_KG * weight, (calories * FAT_CALORIE_RATIO) / KCAL_PER_G_FAT)
  );
}

function calculateCarbGrams(calories: number, protein: number, fat: number): number {
  return Math.round(
    Math.max(0, (calories - protein * KCAL_PER_G_PROTEIN - fat * KCAL_PER_G_FAT) / KCAL_PER_G_CARB)
  );
}

export function calculateNutrition(input: CalculatorInput): CalculatorResult {
  validateInput(input);

  const { age, gender, weight, height, activityLevel, goal } = input;

  const bmr = calculateBmr(weight, height, age, gender);
  const tdee = calculateTdee(bmr, activityLevel);
  const calories = calculateTargetCalories(tdee, goal);
  const protein = calculateProteinGrams(weight, goal);
  const fat = calculateFatGrams(calories, weight);
  const carbs = calculateCarbGrams(calories, protein, fat);

  return { bmr, tdee, calories, protein, carbs, fat };
}
