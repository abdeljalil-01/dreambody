"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "سارة بنعلي",
    role: "مدربة لياقة",
    avatar: "س",
    avatarBg: "bg-emerald-500",
    content:
      "أخيراً منصة عربية تفهم احتياجاتنا. البرامج الغذائية واقعية وبسيطة وتناسب أي شخص.",
    rating: 5,
  },
  {
    name: "يوسف الحمادي",
    role: "رائد أعمال",
    avatar: "ي",
    avatarBg: "bg-violet-500",
    content:
      "الحاسبة دقيقة والواجهة راقية. استخدمتها لتحديد سعراتي اليومية وكانت النتائج ممتازة.",
    rating: 5,
  },
  {
    name: "نادية الزهراني",
    role: "أخصائية تغذية",
    avatar: "ن",
    avatarBg: "bg-amber-500",
    content:
      "أنصح عملائي بها. خاصية استبدال الوجبات ممتازة والماكروز محسوبة بدقة احترافية.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/20 via-muted/25 to-transparent" />
      <div className="blob-bg pointer-events-none bottom-0 right-1/4 h-72 w-72 bg-secondary/[0.05]" />

      <div className="container-app relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <span className="section-label">الآراء</span>
          <h2 className="mt-5 text-[clamp(1.8rem,4vw,2.75rem)] font-bold tracking-tight">
            ماذا يقول مستخدمونا
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground">
            تجارب حقيقية من أشخاص حققوا أهدافهم مع DreamBody
          </p>
        </motion.div>

        {/* Cards */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                delay: i * 0.1,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="card-hover group relative overflow-hidden rounded-[1.4rem] border border-border/50 bg-card p-7 shadow-premium"
            >
              {/* Quote mark */}
              <div className="absolute -top-3 -right-2 text-primary/[0.06]">
                <Quote className="h-20 w-20 fill-current" />
              </div>

              {/* Stars */}
              <div className="mb-4 flex items-center gap-0.5">
                {Array.from({ length: item.rating }).map((_, si) => (
                  <Star
                    key={si}
                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="relative text-sm leading-relaxed text-muted-foreground">
                &ldquo;{item.content}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-5">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.avatarBg} font-inter text-sm font-bold text-white shadow-sm`}
                >
                  {item.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>

              {/* Bottom accent line */}
              <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-primary/40 via-primary/60 to-transparent transition-transform duration-500 group-hover:scale-x-100 rounded-b-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
