import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/shared/page-header";
import { HistoryList } from "@/components/history/history-list";
import { getMealPlans } from "@/lib/actions/index";

export const metadata: Metadata = {
  title: "السجل",
};

export default async function HistoryPage() {
  const plans = await getMealPlans();

  return (
    <AppLayout>
      <div className="container-app max-w-3xl py-12">
        <PageHeader
          title="السجل"
          description="جميع برامجك الغذائية المحفوظة — اضغط على أي برنامج لعرض تفاصيله"
        />
        <HistoryList plans={plans} />
      </div>
    </AppLayout>
  );
}
