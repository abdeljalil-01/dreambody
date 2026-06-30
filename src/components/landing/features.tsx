import {
  BarChart3, Brain, Calculator, RefreshCw, Salad, Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Types ──────────────────────────────────────────────
type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
  iconBg: string;
  span: string;
  size: string;
};

const features: Feature[] = [
  {
    icon: Calculator,
    title: "حسابات علمية دقيقة",
    description: "معادلة Mifflin-St Jeor لحساب BMR و TDEE وتوزيع الماكروز بدقة عالية.",
    accent: "from-emerald-500/15 to-teal-500/5",
    iconBg: "bg-emerald-500/10 text-emerald-600",
    span: "lg:col-span-2",
    size: "lg",
  },
  {
    icon: Brain,
    title: "برنامج بالذكاء الاصطناعي",
    description: "وجبات واقعية ومتوازنة مخصصة لسعراتك — بسيطة وسهلة التحضير.",
    accent: "from-violet-500/15 to-purple-500/5",
    iconBg: "bg-violet-500/10 text-violet-600",
    span: "",
    size: "md",
  },
  {
    icon: RefreshCw,
    title: "استبدال مرن",
    description: "بدائل متعددة لكل وجبة مع الحفاظ على الماكروز بدقة.",
    accent: "from-amber-500/15 to-orange-500/5",
    iconBg: "bg-amber-500/10 text-amber-600",
    span: "",
    size: "md",
  },
  {
    icon: BarChart3,
    title: "تتبع التقدم",
    description: "لوحة تحكم واضحة مع إحصائيات وسجل كامل لرحلتك.",
    accent: "from-blue-500/15 to-sky-500/5",
    iconBg: "bg-blue-500/10 text-blue-600",
    span: "",
    size: "md",
  },
  {
    icon: Salad,
    title: "أطعمة متنوعة",
    description: "مكونات شائعة ومتوفرة عالمياً بأسعار معقولة، تناسب كل شخص في أي مكان.",
    accent: "from-lime-500/15 to-green-500/5",
    iconBg: "bg-lime-500/10 text-lime-600",
    span: "lg:col-span-2",
    size: "lg",
  },
  {
    icon: Shield,
    title: "أمان البيانات",
    description: "تشفير كامل و Row Level Security لحماية خصوصيتك.",
    accent: "from-rose-500/15 to-red-500/5",
    iconBg: "bg-rose-500/10 text-rose-600",
    span: "",
    size: "md",
  },
];

function FeatureCard({ feature, idx }: { feature: Feature; idx: number }) {
  const Icon = feature.icon;

  return (
    <div
      className={`feature-card card-hover group relative overflow-hidden rounded-[1.4rem] border border-border/50 bg-gradient-to-br ${feature.accent} p-7 ${feature.span}`}
    >
      {/* Corner ornaments */}
      <div className="corner-ornament corner-ornament--tl text-primary/30" />
      <div className="corner-ornament corner-ornament--br text-primary/30" />

      {/* Parallax glow */}
      <div className="pointer-events-none absolute -inset-12 rounded-full bg-primary/[0.04] blur-3xl" />

      <div
        className={`mb-5 inline-flex items-center justify-center rounded-[0.875rem] p-3 ${feature.iconBg} transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="text-lg font-semibold leading-snug">{feature.title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
        {feature.description}
      </p>

      {/* Bottom border accent */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 transition-transform duration-500 group-hover:scale-x-100" />

      {/* Decorative number */}
      <div className="absolute left-4 top-4 select-none text-[4rem] font-black leading-none text-foreground/[0.025] transition-all duration-500 group-hover:scale-110 group-hover:opacity-[0.04]">
        {String(idx + 1).padStart(2, "0")}
      </div>
    </div>
  );
}

// ── Main Section ───────────────────────────────────────
export function FeaturesSection() {
  return (
    <section id="features" className="section-padding relative overflow-hidden border-t border-border/40">
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/[0.035] blur-3xl" />

      <div className="container-app relative">
        <div className="max-w-2xl">
          <span className="section-label">المميزات</span>
          <h2 className="mt-3 text-[clamp(1.8rem,4vw,2.75rem)] font-bold leading-tight tracking-tight">
            أدوات متكاملة{" "}
            <span className="text-gradient">لرحلة تحولك</span>
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            كل ما تحتاجه في منصة واحدة — مصممة بعناية لتجربة سلسة وفعّالة.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <FeatureCard key={feature.title} feature={feature} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
