"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/auth/auth-card";
import {
  authSchema,
  resetPasswordSchema,
  signupSchema,
} from "@/lib/validations/schemas";
import {
  resetPassword,
  signIn,
  signUp,
  updatePasswordAction,
} from "@/lib/actions/index";
import { translateAuthError } from "@/lib/auth/errors";
import { toast } from "sonner";
import { z } from "zod";

type LoginData = z.infer<typeof authSchema>;
type SignupData = z.infer<typeof signupSchema>;
type ResetData = z.infer<typeof resetPasswordSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({ resolver: zodResolver(authSchema) });

  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) toast.error(translateAuthError(decodeURIComponent(urlError)));
  }, [searchParams]);

  async function onSubmit(data: LoginData) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("redirect", redirect);

      const result = await signIn(formData);
      if (result?.error) {
        toast.error(result.error);
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="تسجيل الدخول" description="مرحباً بعودتك إلى DreamBody">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" type="email" dir="ltr" className="font-inter" autoComplete="email" {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input id="password" type="password" dir="ltr" autoComplete="current-password" {...register("password")} />
          <FieldError message={errors.password?.message} />
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          تسجيل الدخول
        </Button>
      </form>
      <div className="mt-6 space-y-2 text-center text-sm">
        <Link href="/auth/forgot-password" className="text-primary hover:underline">
          نسيت كلمة المرور؟
        </Link>
        <p className="text-muted-foreground">
          ليس لديك حساب؟{" "}
          <Link href="/auth/signup" className="font-medium text-primary hover:underline">
            إنشاء حساب
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(data: SignupData) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);

      const result = await signUp(formData);
      if (result?.error) {
        toast.error(result.error);
        setLoading(false);
        return;
      }
      if (result?.needsConfirmation) {
        setConfirmationSent(true);
        toast.success(result.message || "تحقق من بريدك الإلكتروني");
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  if (confirmationSent) {
    return (
      <AuthCard title="تحقق من بريدك" description="أرسلنا رابط تأكيد إلى بريدك الإلكتروني">
        <p className="text-center text-sm leading-relaxed text-muted-foreground">
          افتح الرابط في بريدك لتفعيل حسابك، ثم سجّل الدخول.
        </p>
        <Button asChild className="mt-6 w-full">
          <Link href="/auth/login">الذهاب لتسجيل الدخول</Link>
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="إنشاء حساب" description="ابدأ رحلة تحولك مع DreamBody">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">الاسم</Label>
          <Input id="name" autoComplete="name" {...register("name")} />
          <FieldError message={errors.name?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" type="email" dir="ltr" className="font-inter" autoComplete="email" {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input id="password" type="password" dir="ltr" autoComplete="new-password" {...register("password")} />
          <FieldError message={errors.password?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
          <Input id="confirmPassword" type="password" dir="ltr" autoComplete="new-password" {...register("confirmPassword")} />
          <FieldError message={errors.confirmPassword?.message} />
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          إنشاء حساب
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        لديك حساب؟{" "}
        <Link href="/auth/login" className="font-medium text-primary hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </AuthCard>
  );
}

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: zodResolver(z.object({ email: z.string().email("البريد الإلكتروني غير صالح") })),
  });

  async function onSubmit(data: { email: string }) {
    setLoading(true);
    const formData = new FormData();
    formData.append("email", data.email);

    const result = await resetPassword(formData);

    if (result?.error) {
      toast.error(result.error);
    } else {
      setSent(true);
      toast.success("تم إرسال رابط إعادة التعيين");
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <AuthCard title="تحقق من بريدك" description="أرسلنا رابط إعادة تعيين كلمة المرور">
        <p className="text-center text-sm text-muted-foreground">
          افتح الرابط في بريدك لإنشاء كلمة مرور جديدة.
        </p>
        <Button asChild className="mt-6 w-full">
          <Link href="/auth/login">العودة لتسجيل الدخول</Link>
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="نسيت كلمة المرور" description="سنرسل لك رابطاً لإعادة التعيين">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" type="email" dir="ltr" className="font-inter" {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          إرسال الرابط
        </Button>
      </form>
    </AuthCard>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetData>({ resolver: zodResolver(resetPasswordSchema) });

  async function onSubmit(data: ResetData) {
    setLoading(true);
    const formData = new FormData();
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);

    const result = await updatePasswordAction(formData);

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    toast.success("تم تحديث كلمة المرور");
    router.push("/dashboard");
  }

  return (
    <AuthCard title="كلمة مرور جديدة" description="أدخل كلمة المرور الجديدة">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور الجديدة</Label>
          <Input id="password" type="password" dir="ltr" {...register("password")} />
          <FieldError message={errors.password?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
          <Input id="confirmPassword" type="password" dir="ltr" {...register("confirmPassword")} />
          <FieldError message={errors.confirmPassword?.message} />
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          حفظ كلمة المرور
        </Button>
      </form>
    </AuthCard>
  );
}
