"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ACTIVITY_LEVELS, GENDERS, GOALS } from "@/lib/constants";
import { calculatorSchema, type CalculatorFormData } from "@/lib/validations/schemas";
import { calculateNutritionAction } from "@/lib/actions/index";
import { getFirstZodError } from "@/lib/auth/errors";
import { toast } from "sonner";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}

export function CalculatorForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CalculatorFormData>({
    defaultValues: {
      gender: "male",
      activityLevel: "moderately_active",
      goal: "maintain",
    },
  });

  const gender = watch("gender");
  const activityLevel = watch("activityLevel");
  const goal = watch("goal");

  async function onSubmit(raw: CalculatorFormData) {
    const parsed = calculatorSchema.safeParse(raw);

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CalculatorFormData;
        if (field) setError(field, { message: issue.message });
      });
      toast.error(getFirstZodError(parsed.error));
      return;
    }

    const formData = new FormData();
    Object.entries(parsed.data).forEach(([key, value]) =>
      formData.append(key, String(value))
    );

    const result = await calculateNutritionAction(formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (result.data) {
      sessionStorage.setItem("nutritionResult", JSON.stringify(result.data));
      sessionStorage.setItem("calculatorInput", JSON.stringify(parsed.data));
      router.push("/results");
    }
  }

  return (
    <div className="rounded-3xl border border-border/50 bg-card p-8 shadow-premium sm:p-10">
      <div className="mb-8 space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">حاسبة السعرات والماكروز</h2>
        <p className="text-sm text-muted-foreground">
          أدخل بياناتك للحصول على احتياجاتك الغذائية اليومية
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="age">العمر</Label>
            <Input id="age" type="number" inputMode="numeric" placeholder="25" className="font-inter h-12 rounded-2xl" {...register("age")} />
            <FieldError message={errors.age?.message} />
          </div>
          <div className="space-y-2">
            <Label>الجنس</Label>
            <Select value={gender} onValueChange={(v) => setValue("gender", v as CalculatorFormData["gender"], { shouldValidate: true })}>
              <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="اختر الجنس" /></SelectTrigger>
              <SelectContent>
                {GENDERS.map((g) => (<SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>))}
              </SelectContent>
            </Select>
            <FieldError message={errors.gender?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">الوزن (kg)</Label>
            <Input id="weight" type="number" inputMode="decimal" placeholder="75" className="font-inter h-12 rounded-2xl" {...register("weight")} />
            <FieldError message={errors.weight?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">الطول (cm)</Label>
            <Input id="height" type="number" inputMode="numeric" placeholder="175" className="font-inter h-12 rounded-2xl" {...register("height")} />
            <FieldError message={errors.height?.message} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>مستوى النشاط</Label>
          <Select value={activityLevel} onValueChange={(v) => setValue("activityLevel", v as CalculatorFormData["activityLevel"], { shouldValidate: true })}>
            <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="اختر مستوى النشاط" /></SelectTrigger>
            <SelectContent>
              {ACTIVITY_LEVELS.map((level) => (<SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>))}
            </SelectContent>
          </Select>
          <FieldError message={errors.activityLevel?.message} />
        </div>

        <div className="space-y-2">
          <Label>الهدف</Label>
          <Select value={goal} onValueChange={(v) => setValue("goal", v as CalculatorFormData["goal"], { shouldValidate: true })}>
            <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="اختر هدفك" /></SelectTrigger>
            <SelectContent>
              {GOALS.map((g) => (<SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>))}
            </SelectContent>
          </Select>
          <FieldError message={errors.goal?.message} />
        </div>

        <Button type="submit" size="lg" className="h-12 w-full rounded-2xl text-base" disabled={isSubmitting}>
          {isSubmitting ? (<><Loader2 className="h-4 w-4 animate-spin" /> جاري الحساب...</>) : "احسب احتياجاتي"}
        </Button>
      </form>
    </div>
  );
}
