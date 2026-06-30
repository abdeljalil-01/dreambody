import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/auth-forms";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "إنشاء حساب",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:py-12">
        <SignupForm />
      </main>
      <Toaster />
    </div>
  );
}
