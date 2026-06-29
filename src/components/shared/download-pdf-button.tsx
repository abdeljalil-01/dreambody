"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadMealPlanPdf } from "@/lib/pdf/download-meal-plan-pdf";
import type { PdfMealPlanData } from "@/lib/meal-plan-utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DownloadPdfButtonProps {
  data: PdfMealPlanData;
  filename?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
  className?: string;
  label?: string;
}

export function DownloadPdfButton({
  data,
  filename,
  variant = "outline",
  size = "default",
  className,
  label = "تحميل PDF",
}: DownloadPdfButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDownload(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      await downloadMealPlanPdf(data, filename);
      toast.success("تم تحميل البرنامج بصيغة PDF");
    } catch {
      toast.error("تعذّر إنشاء ملف PDF");
    } finally {
      setLoading(false);
    }
  }

  if (size === "icon") {
    return (
      <Button
        variant={variant}
        size="icon"
        onClick={handleDownload}
        disabled={loading}
        className={cn("rounded-xl", className)}
        title={label}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={loading}
      className={cn("rounded-2xl", className)}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      {label}
    </Button>
  );
}
