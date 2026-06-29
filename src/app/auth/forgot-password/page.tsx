import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/auth-forms";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "نسيت كلمة المرور",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <ForgotPasswordForm />
      </main>
    </div>
  );
}
