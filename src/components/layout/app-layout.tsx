import { Navbar } from "@/components/layout/navbar";
import { Sidebar, MobileNav } from "@/components/layout/sidebar";
import { Toaster } from "@/components/ui/sonner";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
        <Sidebar />
      </div>
      <MobileNav />
      <Toaster />
    </div>
  );
}
