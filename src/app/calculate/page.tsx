import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/app-layout";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "حاسبة السعرات",
};

export default function CalculatePage() {
  return (
    <AppLayout>
      <div className="container-app py-12">
        <PageHeader
          title="احسب احتياجاتك"
          description="أدخل بياناتك للحصول على خطة غذائية دقيقة مبنية على معادلة Mifflin-St Jeor"
        />
        <div className="max-w-2xl">
          <CalculatorForm />
        </div>
      </div>
    </AppLayout>
  );
}
