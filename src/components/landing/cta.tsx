import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-app">
        <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/8 via-card to-accent/40 p-8 text-center sm:p-12 lg:p-14">
          {/* Background blobs inside card */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-secondary/10 blur-3xl" />

          {/* Top inset line */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          {/* Badge */}
          <div className="relative inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <Sparkles className="h-3 w-3" />
            ابدأ الآن مجاناً
          </div>

          {/* Headline */}
          <h2 className="relative mt-4 text-[clamp(1.8rem,4.5vw,3rem)] font-bold tracking-tight leading-tight">
            ابدأ رحلة تحولك{" "}
            <span className="text-gradient">اليوم</span>
          </h2>

          {/* Subtext */}
          <p className="relative mx-auto mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
            سعرات اليوم، جسم الأحلام غداً. احسب احتياجاتك واحصل على برنامج غذائي مخصص في دقائق — بدون اشتراك.
          </p>

          {/* Buttons */}
          <div className="relative mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              asChild
              className="group h-13 rounded-2xl px-8 text-base font-semibold shadow-glow transition-all duration-300 hover:shadow-glow-lg hover:-translate-y-0.5"
            >
              <Link href="/calculate">
                احسب احتياجاتك الآن
                <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-13 rounded-2xl border-border/60 px-8 text-base backdrop-blur-sm hover:border-primary/30"
            >
              <Link href="/auth/signup">إنشاء حساب مجاني</Link>
            </Button>
          </div>

          {/* Social proof micro */}
          <p className="relative mt-5 text-xs text-muted-foreground">
            انضم لأكثر من{" "}
            <span className="font-semibold text-foreground">2,500 مستخدم</span>{" "}
            يثقون بـ DreamBody
          </p>
        </div>
      </div>
    </section>
  );
}
