import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/auth-forms";
import { Navbar } from "@/components/layout/navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
};

function LoginFormFallback() {
  return <Skeleton className="mx-auto h-96 w-full max-w-md rounded-3xl" />;
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:py-12">
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </main>
      <Toaster />
    </div>
  );
}
