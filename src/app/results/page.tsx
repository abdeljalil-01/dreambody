import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { AppLayout } from "@/components/layout/app-layout";
import { Skeleton } from "@/components/ui/skeleton";

const ResultsContent = dynamic(
  () => import("@/components/results/results-content").then((m) => m.ResultsContent),
  {
    loading: () => (
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-8 sm:py-10">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: "النتائج",
  description: "نتائج حساب السعرات والماكروز اليومية.",
};

export default function ResultsPage() {
  return (
    <AppLayout>
      <ResultsContent />
    </AppLayout>
  );
}
