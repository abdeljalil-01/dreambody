"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "أدخل بياناتك",
    description: "العمر، الوزن، الطول، مستوى النشاط، وهدفك — كل شيء في دقيقة واحدة.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/8",
    border: "border-emerald-200/50",
  },
  {
    step: "02",
    title: "احصل على النتائج",
    description: "سعراتك اليومية وتوزيع البروتين والكربوهيدرات والدهون بدقة علمية.",
    color: "text-amber-500",
    bg: "bg-amber-500/8",
    border: "border-amber-200/50",
  },
  {
    step: "03",
    title: "برنامج غذائي مخصص",
    description: "الذكاء الاصطناعي يبني لك برنامجاً يومياً متوازناً يناسب أهدافك تماماً.",
    color: "text-violet-500",
    bg: "bg-violet-500/8",
    border: "border-violet-200/50",
  },
  {
    step: "04",
    title: "تابع تقدمك",
    description: "احفظ برامجك، راجع سجلك، واستبدل الوجبات حسب رغبتك في أي وقت.",
    color: "text-blue-500",
    bg: "bg-blue-500/8",
    border: "border-blue-200/50",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/20 via-muted/30 to-muted/10" />
      <div className="blob-bg pointer-events-none left-0 top-1/4 h-80 w-80 bg-primary/[0.04]" />

      <div className="container-app relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <span className="section-label">الخطوات</span>
          <h2 className="mt-3 text-[clamp(1.8rem,4vw,2.75rem)] font-bold tracking-tight">
            كيف يعمل؟
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
            أربع خطوات بسيطة تفصلك عن جسم أحلامك
          </p>
        </motion.div>

        {/* Steps */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                delay: index * 0.1,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative"
            >
              {/* Connector line (desktop) */}
              {index < steps.length - 1 && (
                <div className="absolute top-10 left-0 hidden lg:block">
                  <svg width="28" height="2" viewBox="0 0 28 2" fill="none" className="text-border">
                    <path d="M0 1 H28" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
                  </svg>
                </div>
              )}

              <div
                className={`relative h-full overflow-hidden rounded-[1.3rem] border ${item.border} ${item.bg} p-6 transition-all duration-300 hover:shadow-premium`}
              >
                {/* Step number with circle backdrop */}
                <div className="mb-5 flex items-center gap-3">
                  <div className="relative">
                    <span
                      className={`font-inter tabular-nums text-4xl font-black leading-none ${item.color} opacity-90`}
                    >
                      {item.step}
                    </span>
                    <motion.div
                      className={`absolute -inset-3 rounded-full ${item.color} opacity-[0.06]`}
                      whileInView={{ scale: [1, 1.3, 1] }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeInOut", delay: index * 0.15 }}
                    />
                  </div>
                  {/* Thin decorative line */}
                  <div className={`h-px flex-1 bg-current ${item.color} opacity-15`} />
                </div>

                <h3 className="text-base font-semibold leading-snug">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>

                {/* Corner accent */}
                <div
                  className={`absolute -bottom-4 -right-4 h-16 w-16 rounded-full ${item.color} opacity-[0.06] transition-transform duration-500 group-hover:scale-150`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
