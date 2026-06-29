"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-center"
      dir="rtl"
      toastOptions={{
        classNames: {
          toast: "rounded-xl border border-border bg-background text-foreground shadow-lg",
        },
      }}
    />
  );
}
