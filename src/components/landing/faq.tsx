"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "كيف يتم حساب السعرات اليومية؟",
    answer:
      "نستخدم معادلة Mifflin-St Jeor لحساب BMR، ثم TDEE بضربها في معامل النشاط. بعدها نعدّل السعرات حسب هدفك (عجز 20%، حفاظ، أو فائض 10%)، ونوزّع الماكروز حسب معايير علمية (بروتين g/kg، دهون دنيا 0.6 g/kg، والكربوهيدرات من الباقي).",
  },
  {
    question: "هل البرامج الغذائية مناسبة للجميع؟",
    answer:
      "نعم، الذكاء الاصطناعي يقترح وجبات بسيطة وعملية بمكونات شائعة ومتوفرة عالمياً، مناسبة لأي مستخدم في أي بلد.",
  },
  {
    question: "هل أحتاج حساباً لاستخدام الحاسبة؟",
    answer:
      "لا، يمكنك حساب احتياجاتك مجاناً بدون تسجيل. الحساب مطلوب فقط لحفظ البرامج والوصول للوحة التحكم.",
  },
  {
    question: "هل يمكنني استبدال وجبة لا تعجبني؟",
    answer:
      "بالتأكيد. لكل وجبة زر استبدال يعرض 3 بدائل بنفس السعرات والماكروز تقريباً.",
  },
  {
    question: "هل بياناتي آمنة؟",
    answer:
      "نعم، نستخدم Supabase مع Row Level Security. لا يمكن لأي مستخدم الوصول لبيانات غيره.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />

      <div className="container-app relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <span className="section-label">الأسئلة</span>
          <h2 className="mt-3 text-[clamp(1.8rem,4vw,2.75rem)] font-bold tracking-tight">
            الأسئلة الشائعة
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-muted-foreground">
            إجابات على أكثر الأسئلة شيوعاً — إذا لم تجد ما تبحث عنه، تواصل معنا.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="mx-auto mt-10 max-w-2xl space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: index * 0.06, duration: 0.45, ease: "easeOut" }}
                className={cn(
                  "overflow-hidden rounded-[1.1rem] border transition-all duration-300",
                  isOpen
                    ? "border-primary/25 bg-gradient-to-br from-primary/4 to-accent/20 shadow-premium"
                    : "border-border/50 bg-card hover:border-border/80"
                )}
              >
                <button
                  className="flex w-full items-center justify-between gap-4 p-5 text-right group/btn"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span
                    className={cn(
                      "text-sm font-semibold leading-snug transition-colors",
                      isOpen ? "text-primary" : "text-foreground group-hover/btn:text-primary/80"
                    )}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                      isOpen
                        ? "border-primary/30 bg-primary text-primary-foreground shadow-glow"
                        : "border-border/60 bg-muted text-muted-foreground group-hover/btn:border-primary/30 group-hover/btn:bg-primary/8"
                    )}
                  >
                    {isOpen ? (
                      <Minus className="h-3 w-3 stroke-[2.5]" />
                    ) : (
                      <Plus className="h-3 w-3 stroke-[2.5] transition-transform duration-300 group-hover/btn:rotate-90" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
