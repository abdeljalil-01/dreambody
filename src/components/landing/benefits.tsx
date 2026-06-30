"use client";

import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";

const benefits = [
  "حسابات دقيقة مبنية على أحدث المعادلات العلمية",
  "برامج غذائية متنوعة ومتوازنة وليست وجبات عامة",
  "واجهة عربية كاملة مع دعم RTL احترافي",
  "إمكانية استبدال أي وجبة ببدائل متعددة",
  "حفظ السجل ومراجعة البرامج السابقة",
  "تصميم أنيق يعمل على جميع الأجهزة",
];

export function BenefitsSection() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-secondary/[0.05] blur-3xl" />

      <div className="container-app relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            <span className="section-label">لماذا نحن</span>
            <h2 className="text-[clamp(1.8rem,4vw,2.75rem)] font-bold leading-tight tracking-tight">
              لماذا{" "}
              <span className="text-gradient">DreamBody</span>؟
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              لأن رحلة التحول تستحق أداة premium حقيقية — ليس مجرد تطبيق عادي.
              نحن نجمع الدقة العلمية مع تجربة مستخدم استثنائية.
            </p>

            {/* Highlight box */}
            <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 to-accent/30 p-5">
              <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-primary/60 to-primary/10 rounded-r" />
              <div className="flex items-center gap-2.5 pr-3">
                <Zap className="h-4 w-4 text-primary shrink-0" />
                <p className="text-sm font-medium leading-snug">
                  نتائج فورية — لا انتظار، لا اشتراك مطلوب للبدء
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: checklist */}
          <motion.ul
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            {benefits.map((benefit, i) => (
              <motion.li
                key={benefit}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.07, duration: 0.45, ease: "easeOut" }}
                className="flex items-start gap-3.5 rounded-[1.1rem] border border-border/40 bg-card/60 px-4 py-3.5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-primary/20 hover:shadow-premium"
              >
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                  <Check className="h-3 w-3 stroke-[2.5]" />
                </div>
                <span className="text-sm leading-relaxed">{benefit}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
