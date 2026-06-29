import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { AppLayout } from "@/components/layout/app-layout";
import { Loader2 } from "lucide-react";

const MealPlanContent = dynamic(
  () => import("@/components/meal-plan/meal-plan-content").then((m) => m.MealPlanContent),
  {
    loading: () => (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: "البرنامج الغذائي",
  description: "برنامج غذائي يومي مخصص بالذكاء الاصطناعي.",
};

export default function MealPlanPage() {
  return (
    <AppLayout>
      <MealPlanContent />
    </AppLayout>
  );
}
