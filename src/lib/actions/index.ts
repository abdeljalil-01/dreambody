"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { calculateNutrition } from "@/lib/calculator";
import {
  authSchema,
  calculatorSchema,
  mealPlanRequestSchema,
  profileSchema,
  signupSchema,
  resetPasswordSchema,
} from "@/lib/validations/schemas";
import { generateMealPlan, generateMealAlternatives } from "@/lib/gemini/meal-plan";
import {
  getFirstZodError,
  translateAuthError,
  translateDbError,
} from "@/lib/auth/errors";
import { z } from "zod";
import type { GeneratedMealPlan, MealItem, MealPlan, Profile } from "@/types";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const emailSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالحة"),
});

function safeRedirect(path: string) {
  redirect(path);
}

export async function signUp(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: getFirstZodError(parsed.error) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { name: parsed.data.name },
      emailRedirectTo: `${APP_URL}/auth/callback`,
    },
  });

  if (error) return { error: translateAuthError(error.message) };

  if (!data.session) {
    return {
      success: true,
      needsConfirmation: true,
      message: "تم إنشاء حسابك. تحقق من بريدك الإلكتروني لتأكيد الحساب.",
    };
  }

  safeRedirect("/dashboard");
}

export async function signIn(formData: FormData) {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = authSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: getFirstZodError(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return { error: translateAuthError(error.message) };

  const redirectTo = (formData.get("redirect") as string) || "/dashboard";
  safeRedirect(redirectTo.startsWith("/") ? redirectTo : "/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) return { error: translateAuthError(error.message) };
  safeRedirect("/");
}


export async function resetPassword(formData: FormData) {
  const parsed = emailSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: getFirstZodError(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${APP_URL}/auth/callback?type=recovery`,
  });

  if (error) return { error: translateAuthError(error.message) };
  return { success: true };
}

export async function updatePasswordAction(formData: FormData) {
  const raw = {
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = resetPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: getFirstZodError(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) return { error: translateAuthError(error.message) };

  revalidatePath("/profile");
  return { success: true };
}

export async function calculateNutritionAction(formData: FormData) {
  const raw = {
    age: formData.get("age"),
    gender: formData.get("gender"),
    weight: formData.get("weight"),
    height: formData.get("height"),
    activityLevel: formData.get("activityLevel"),
    goal: formData.get("goal"),
  };

  const parsed = calculatorSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: getFirstZodError(parsed.error) };
  }

  try {
    const result = calculateNutrition(parsed.data);
    return { data: result };
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطأ في الحساب";
    return { error: message };
  }
}

export async function createMealPlanAction(
  calories: number,
  protein: number,
  carbs: number,
  fat: number
) {
  const parsed = mealPlanRequestSchema.safeParse({ calories, protein, carbs, fat });
  if (!parsed.success) {
    return { error: getFirstZodError(parsed.error) };
  }

  try {
    const plan = await generateMealPlan(
      parsed.data.calories,
      parsed.data.protein,
      parsed.data.carbs,
      parsed.data.fat
    );
    return { data: plan };
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطأ غير معروف";
    return { error: `تعذّر إنشاء البرنامج الغذائي: ${message}` };
  }
}

export async function replaceMealAction(
  mealType: string,
  currentMeal: MealItem,
  targets: { calories: number; protein: number; carbs: number; fat: number }
) {
  const labels: Record<string, string> = {
    breakfast: "الفطور",
    lunch: "الغداء",
    dinner: "العشاء",
    snack: "وجبة خفيفة",
  };

  try {
    const alternatives = await generateMealAlternatives(
      mealType,
      labels[mealType] || mealType,
      currentMeal,
      targets
    );
    return { data: alternatives };
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطأ غير معروف";
    return { error: `تعذّر إيجاد بدائل: ${message}` };
  }
}

export async function saveMealPlanAction(
  nutrition: { calories: number; protein: number; carbs: number; fat: number },
  plan: GeneratedMealPlan
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "يجب تسجيل الدخول لحفظ البرنامج" };

  const { data: mealPlan, error: planError } = await supabase
    .from("meal_plans")
    .insert({
      user_id: user.id,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
    })
    .select()
    .single();

  if (planError || !mealPlan) {
    return { error: translateDbError(planError?.message || "تعذّر حفظ البرنامج") };
  }

  const meals = Object.entries(plan).map(([mealType, meal]) => ({
    meal_plan_id: mealPlan.id,
    meal_type: mealType,
    name: meal.name,
    ingredients: meal.ingredients,
    calories: meal.calories,
    protein: meal.protein,
    carbs: meal.carbs,
    fat: meal.fat,
  }));

  const { error: mealsError } = await supabase.from("meals").insert(meals);

  if (mealsError) {
    return { error: translateDbError(mealsError.message) };
  }

  revalidatePath("/dashboard");
  revalidatePath("/history");

  return { data: mealPlan };
}

export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "غير مصرح" };

  const raw = {
    name: formData.get("name"),
    age: formData.get("age"),
    gender: formData.get("gender") || null,
    weight: formData.get("weight"),
    height: formData.get("height"),
    activityLevel: formData.get("activityLevel") || null,
    goal: formData.get("goal") || null,
  };

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: getFirstZodError(parsed.error) };
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      name: parsed.data.name,
      age: parsed.data.age,
      gender: parsed.data.gender,
      weight: parsed.data.weight,
      height: parsed.data.height,
      activity_level: parsed.data.activityLevel,
      goal: parsed.data.goal,
    })
    .eq("id", user.id)
    .select()
    .single();

  if (error) return { error: translateDbError(error.message) };
  if (!data) return { error: "لم يتم العثور على الملف الشخصي. حاول تسجيل الخروج والدخول مجدداً." };

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function deleteMealPlanAction(planId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "غير مصرح" };

  const { error } = await supabase
    .from("meal_plans")
    .delete()
    .eq("id", planId)
    .eq("user_id", user.id);

  if (error) return { error: translateDbError(error.message) };

  revalidatePath("/history");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function getUserProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) return null;
  return profile as Profile;
}

export async function getMealPlans(): Promise<MealPlan[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: plans, error } = await supabase
    .from("meal_plans")
    .select("*, meals(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (plans as MealPlan[]) || [];
}

export async function getMealPlanById(planId: string): Promise<MealPlan | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: plan, error } = await supabase
    .from("meal_plans")
    .select("*, meals(*)")
    .eq("id", planId)
    .eq("user_id", user.id)
    .single();

  if (error || !plan) return null;
  return plan as MealPlan;
}

export async function getLatestMealPlan(): Promise<MealPlan | null> {
  const plans = await getMealPlans();
  return plans[0] || null;
}

export async function ensureProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split("@")[0],
    })
    .select()
    .single();

  if (error) return null;
  return data;
}
