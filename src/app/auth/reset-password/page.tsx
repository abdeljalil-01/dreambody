import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/auth-forms";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "كلمة مرور جديدة",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:py-12">
        <ResetPasswordForm />
      </main>
      <Toaster />
    </div>
  );
}
