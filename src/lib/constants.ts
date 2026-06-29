export const APP_NAME = "DreamBody";
export const APP_TAGLINE = "سعرات اليوم، جسم الأحلام غداً";

export const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "قليل الحركة", multiplier: 1.2 },
  { value: "lightly_active", label: "نشاط خفيف", multiplier: 1.375 },
  { value: "moderately_active", label: "نشاط متوسط", multiplier: 1.55 },
  { value: "very_active", label: "نشاط عالي", multiplier: 1.725 },
  { value: "extra_active", label: "نشاط مكثف", multiplier: 1.9 },
] as const;

export const GOALS = [
  { value: "lose_fat", label: "حرق الدهون", calorieAdjust: -500 },
  { value: "maintain", label: "الحفاظ على الوزن", calorieAdjust: 0 },
  { value: "gain_muscle", label: "بناء العضلات", calorieAdjust: 300 },
] as const;

export const GENDERS = [
  { value: "male", label: "ذكر" },
  { value: "female", label: "أنثى" },
] as const;

export const MEAL_TYPES = [
  { value: "breakfast", label: "الفطور" },
  { value: "lunch", label: "الغداء" },
  { value: "dinner", label: "العشاء" },
  { value: "snack", label: "وجبة خفيفة" },
] as const;

export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number]["value"];
export type Goal = (typeof GOALS)[number]["value"];
export type Gender = (typeof GENDERS)[number]["value"];
export type MealType = (typeof MEAL_TYPES)[number]["value"];
