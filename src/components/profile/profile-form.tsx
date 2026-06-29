"use client";

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
import { profileSchema, type ProfileFormData } from "@/lib/validations/schemas";
import { updateProfileAction } from "@/lib/actions/index";
import { getFirstZodError } from "@/lib/auth/errors";
import { toast } from "sonner";
import type { Profile } from "@/types";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}

interface ProfileFormProps {
  profile: Profile | null;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: profile?.name || "",
      age: profile?.age ?? null,
      gender: profile?.gender ?? null,
      weight: profile?.weight ?? null,
      height: profile?.height ?? null,
      activityLevel: profile?.activity_level ?? null,
      goal: profile?.goal ?? null,
    },
  });

  const gender = watch("gender");
  const activityLevel = watch("activityLevel");
  const goal = watch("goal");

  async function onSubmit(raw: ProfileFormData) {
    const parsed = profileSchema.safeParse(raw);

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ProfileFormData;
        if (field) setError(field, { message: issue.message });
      });
      toast.error(getFirstZodError(parsed.error));
      return;
    }

    const formData = new FormData();
    formData.append("name", parsed.data.name);
    if (parsed.data.age != null) formData.append("age", String(parsed.data.age));
    if (parsed.data.gender) formData.append("gender", parsed.data.gender);
    if (parsed.data.weight != null) formData.append("weight", String(parsed.data.weight));
    if (parsed.data.height != null) formData.append("height", String(parsed.data.height));
    if (parsed.data.activityLevel) formData.append("activityLevel", parsed.data.activityLevel);
    if (parsed.data.goal) formData.append("goal", parsed.data.goal);

    const result = await updateProfileAction(formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("تم تحديث الملف الشخصي");
  }

  return (
    <div className="rounded-3xl border border-border/50 bg-card p-8 shadow-premium">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">الاسم</Label>
          <Input id="name" className="h-12 rounded-2xl" {...register("name")} />
          <FieldError message={errors.name?.message} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="age">العمر</Label>
            <Input id="age" type="number" className="font-inter h-12 rounded-2xl" {...register("age")} />
            <FieldError message={errors.age?.message} />
          </div>
          <div className="space-y-2">
            <Label>الجنس</Label>
            <Select value={gender || undefined} onValueChange={(v) => setValue("gender", v as ProfileFormData["gender"], { shouldValidate: true })}>
              <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="اختر" /></SelectTrigger>
              <SelectContent>
                {GENDERS.map((g) => (<SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>))}
              </SelectContent>
            </Select>
            <FieldError message={errors.gender?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">الوزن (kg)</Label>
            <Input id="weight" type="number" className="font-inter h-12 rounded-2xl" {...register("weight")} />
            <FieldError message={errors.weight?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">الطول (cm)</Label>
            <Input id="height" type="number" className="font-inter h-12 rounded-2xl" {...register("height")} />
            <FieldError message={errors.height?.message} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>مستوى النشاط</Label>
          <Select value={activityLevel || undefined} onValueChange={(v) => setValue("activityLevel", v as ProfileFormData["activityLevel"], { shouldValidate: true })}>
            <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="اختر" /></SelectTrigger>
            <SelectContent>
              {ACTIVITY_LEVELS.map((l) => (<SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>))}
            </SelectContent>
          </Select>
          <FieldError message={errors.activityLevel?.message} />
        </div>

        <div className="space-y-2">
          <Label>الهدف</Label>
          <Select value={goal || undefined} onValueChange={(v) => setValue("goal", v as ProfileFormData["goal"], { shouldValidate: true })}>
            <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="اختر" /></SelectTrigger>
            <SelectContent>
              {GOALS.map((g) => (<SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>))}
            </SelectContent>
          </Select>
          <FieldError message={errors.goal?.message} />
        </div>

        <Button type="submit" disabled={isSubmitting} className="h-12 rounded-2xl px-8">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          حفظ التغييرات
        </Button>
      </form>
    </div>
  );
}
