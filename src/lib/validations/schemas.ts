import { z } from "zod";
import type { ActivityLevel, Gender, Goal } from "@/lib/constants";

const requiredNumber = (min: number, max: number, label: string) =>
  z.coerce
    .number({ message: `${label} مطلوب` })
    .refine((n) => !Number.isNaN(n), { message: `${label} غير صالح` })
    .min(min, `${label} يجب أن يكون ${min} على الأقل`)
    .max(max, `${label} يجب أن لا يتجاوز ${max}`);

const optionalNumber = (min: number, max: number, label: string) =>
  z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : val),
    z
      .union([
        z.null(),
        z.coerce
          .number({ message: `${label} غير صالح` })
          .refine((n) => !Number.isNaN(n), { message: `${label} غير صالح` })
          .min(min, `${label} يجب أن يكون ${min} على الأقل`)
          .max(max, `${label} يجب أن لا يتجاوز ${max}`),
      ])
  );

export interface CalculatorFormData {
  age: number;
  gender: Gender;
  weight: number;
  height: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}

export const calculatorSchema: z.ZodType<CalculatorFormData> = z.object({
  age: requiredNumber(15, 100, "العمر"),
  gender: z.enum(["male", "female"], { message: "اختر الجنس" }),
  weight: requiredNumber(30, 300, "الوزن"),
  height: requiredNumber(100, 250, "الطول"),
  activityLevel: z.enum(
    ["sedentary", "lightly_active", "moderately_active", "very_active", "extra_active"],
    { message: "اختر مستوى النشاط" }
  ),
  goal: z.enum(["lose_fat", "maintain", "gain_muscle"], { message: "اختر هدفك" }),
});

export const authSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
});

export const signupSchema = authSchema.extend({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين",
  path: ["confirmPassword"],
});

export interface ProfileFormData {
  name: string;
  age: number | null;
  gender: Gender | null;
  weight: number | null;
  height: number | null;
  activityLevel: ActivityLevel | null;
  goal: Goal | null;
}

export const profileSchema: z.ZodType<ProfileFormData> = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  age: optionalNumber(15, 100, "العمر"),
  gender: z.enum(["male", "female"]).nullable(),
  weight: optionalNumber(30, 300, "الوزن"),
  height: optionalNumber(100, 250, "الطول"),
  activityLevel: z
    .enum(["sedentary", "lightly_active", "moderately_active", "very_active", "extra_active"])
    .nullable(),
  goal: z.enum(["lose_fat", "maintain", "gain_muscle"]).nullable(),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export const mealPlanRequestSchema = z.object({
  calories: z.coerce.number().positive("السعرات مطلوبة"),
  protein: z.coerce.number().positive("البروتين مطلوب"),
  carbs: z.coerce.number().positive("الكربوهيدرات مطلوبة"),
  fat: z.coerce.number().positive("الدهون مطلوبة"),
});

export const replaceMealSchema = mealPlanRequestSchema.extend({
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  currentMeal: z.object({
    name: z.string(),
    ingredients: z.string(),
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
  }),
});
