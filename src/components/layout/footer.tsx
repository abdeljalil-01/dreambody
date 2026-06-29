import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { APP_TAGLINE } from "@/lib/constants";

const footerLinks = {
  product: [
    { href: "/calculate", label: "حاسبة السعرات" },
    { href: "/meal-plan", label: "البرنامج الغذائي" },
    { href: "/dashboard", label: "لوحة التحكم" },
  ],
  explore: [
    { href: "/#features", label: "المميزات" },
    { href: "/#how-it-works", label: "كيف يعمل" },
    { href: "/#faq", label: "الأسئلة الشائعة" },
  ],
};

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/40">
      {/* Subtle gradient top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/20 to-muted/5" />

      <div className="container-app relative py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {APP_TAGLINE}
            </p>
            <p className="text-xs text-muted-foreground/70">
              منصة تغذية عربية premium لحساب السعرات وإنشاء برامج غذائية مخصصة بالذكاء الاصطناعي.
            </p>

            {/* Mini stats pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {["2,500+ مستخدم", "15K+ برنامج", "98% رضا"].map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-[11px] font-medium text-muted-foreground"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-foreground/70">
              المنتج
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-underline text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore links */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-foreground/70">
              اكتشف
            </h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-underline text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} DreamBody. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/60" />
            <p className="font-inter text-xs text-muted-foreground">
              Crafted with care
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
