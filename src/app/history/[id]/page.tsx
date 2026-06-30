import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { HistoryPlanDetail } from "@/components/history/history-plan-detail";
import { getMealPlanById } from "@/lib/actions/index";

export const metadata: Metadata = {
  title: "تفاصيل البرنامج",
};

interface HistoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function HistoryDetailPage({ params }: HistoryDetailPageProps) {
  const { id } = await params;
  const plan = await getMealPlanById(id);

  if (!plan) {
    notFound();
  }

  return (
    <AppLayout>
      <div className="container-app max-w-5xl py-8 sm:py-10">
        <HistoryPlanDetail plan={plan} />
      </div>
    </AppLayout>
  );
}
