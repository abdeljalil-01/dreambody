"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calculator,
  History,
  LayoutDashboard,
  LogOut,
  Salad,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/lib/actions/auth";

const links = [
  { href: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/calculate", label: "الحاسبة", icon: Calculator },
  { href: "/meal-plan", label: "البرنامج", icon: Salad },
  { href: "/history", label: "السجل", icon: History },
  { href: "/profile", label: "الملف", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[15rem] shrink-0 border-l border-border/40 bg-card/20 backdrop-blur-sm lg:block">
      <nav className="sticky top-[4.5rem] flex flex-col gap-1 p-3">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-[0.875rem] px-4 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
            >
              {/* Active background */}
              {isActive && (
                <div className="absolute inset-0 rounded-[0.875rem] bg-primary/10 shadow-sm" />
              )}

              {/* Active left bar */}
              {isActive && (
                <div className="absolute right-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-l-full bg-primary" />
              )}

              <Icon
                className={cn(
                  "relative h-4 w-4 shrink-0 transition-transform duration-200",
                  isActive ? "text-primary" : "group-hover:scale-110"
                )}
              />
              <span className="relative">{link.label}</span>
            </Link>
          );
        })}

        {/* Logout */}
        <form action={signOutAction} className="mt-3 border-t border-border/40 pt-3">
          <button
            type="submit"
            className="group flex w-full items-center gap-3 rounded-[0.875rem] px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-destructive/8 hover:text-destructive"
          >
            <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
            تسجيل الخروج
          </button>
        </form>
      </nav>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/50 bg-background/90 backdrop-blur-2xl lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {links.slice(0, 4).map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-[10px] font-semibold transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-primary/10" />
              )}
              <Icon className="relative h-5 w-5" />
              <span className="relative">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
