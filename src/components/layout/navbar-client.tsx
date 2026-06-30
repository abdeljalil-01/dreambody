"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/calculate", label: "الحاسبة" },
  { href: "/#features", label: "المميزات" },
  { href: "/#how-it-works", label: "كيف يعمل" },
  { href: "/#faq", label: "الأسئلة" },
];

export function NavbarClient({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLanding = pathname === "/";
  const showAuth = mounted;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/50 bg-background/80 backdrop-blur-2xl shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container-app flex h-[4.5rem] items-center justify-between">
        <Logo priority />

        <nav className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "link-underline relative rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl text-muted-foreground hover:text-foreground"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="تبديل الوضع"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}

          {showAuth && isAuthenticated ? (
            <Button asChild className="rounded-xl px-5 shadow-glow hover:shadow-glow-lg hover:-translate-y-px transition-all duration-200">
              <Link href="/dashboard">لوحة التحكم</Link>
            </Button>
          ) : showAuth ? (
            <>
              <Button variant="ghost" asChild className="rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground">
                <Link href="/auth/login">تسجيل الدخول</Link>
              </Button>
              <Button asChild className="rounded-xl px-5 text-sm shadow-glow hover:shadow-glow-lg hover:-translate-y-px transition-all duration-200">
                <Link href={isLanding ? "/calculate" : "/auth/signup"}>
                  {isLanding ? "ابدأ الآن" : "إنشاء حساب"}
                </Link>
              </Button>
            </>
          ) : (
            <div className="h-9 w-36 animate-pulse rounded-xl bg-muted" />
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="القائمة"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="overflow-hidden border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="container-app flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {showAuth && (
              <div className="mt-3 flex flex-col gap-2 border-t border-border/40 pt-4">
                {isAuthenticated ? (
                  <Button asChild className="w-full rounded-xl">
                    <Link href="/dashboard">لوحة التحكم</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild className="w-full rounded-xl">
                      <Link href="/auth/login">تسجيل الدخول</Link>
                    </Button>
                    <Button asChild className="w-full rounded-xl">
                      <Link href="/calculate">ابدأ الآن</Link>
                    </Button>
                  </>
                )}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
