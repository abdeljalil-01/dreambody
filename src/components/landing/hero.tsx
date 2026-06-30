"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowLeft, Sparkles, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect } from "react";

const stats = [
  { value: "2,500+", label: "مستخدم نشط", icon: Users },
  { value: "15K+", label: "برنامج مُنشأ", icon: TrendingUp },
  { value: "98%", label: "رضا المستخدمين", icon: Sparkles },
];

const floatingPills = [
  { text: "بروتين 38%", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200/60", delay: 0 },
  { text: "سعرات 1,850 kcal", color: "bg-amber-500/10 text-amber-600 border-amber-200/60", delay: 0.4 },
  { text: "كربوهيدرات 45%", color: "bg-blue-500/10 text-blue-600 border-blue-200/60", delay: 0.8 },
  { text: "دهون 17%", color: "bg-rose-500/10 text-rose-600 border-rose-200/60", delay: 1.2 },
];

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  return (
    <section ref={ref} className="relative flex min-h-[calc(100svh-4.5rem)] items-center overflow-hidden">
      {/* Background blobs */}
      <motion.div style={{ y, opacity }} className="pointer-events-none absolute inset-0">
        <motion.div
          className="blob-bg -top-40 -right-40 h-[36rem] w-[36rem] bg-primary/[0.07]"
          style={{ x: useTransform(smoothX, [0, 1], [-20, 20]), y: useTransform(smoothY, [0, 1], [-20, 20]) }}
        />
        <motion.div
          className="blob-bg bottom-0 -left-32 h-80 w-80 bg-secondary/[0.06]"
          style={{ x: useTransform(smoothX, [0, 1], [15, -15]), y: useTransform(smoothY, [0, 1], [10, -10]) }}
        />
        <motion.div
          className="blob-bg top-1/3 left-1/2 h-48 w-48 bg-primary/[0.04]"
          style={{ x: useTransform(smoothX, [0, 1], [-10, 10]), y: useTransform(smoothY, [0, 1], [-8, 8]) }}
        />
      </motion.div>

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="container-app relative py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="section-label"
            >
              <Sparkles className="h-3 w-3" />
              تغذية ذكية · برامج مخصصة بالذكاء الاصطناعي
            </motion.div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="max-w-xl text-[clamp(2.2rem,5.5vw,4rem)] font-bold leading-[1.08] tracking-tight">
                احسب احتياجك الغذائي{" "}
                <span className="relative whitespace-nowrap">
                  <span className="text-gradient">وابنِ جسمك</span>
                  {/* Underline accent */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 220 12"
                    fill="none"
                    className="absolute -bottom-2 inset-x-0 w-full"
                  >
                    <path
                      d="M2 9 Q55 2 110 9 Q165 16 218 9"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0.45"
                    />
                  </svg>
                </span>{" "}
                بطريقة ذكية
              </h1>
              <p className="max-w-md text-[1.05rem] leading-relaxed text-muted-foreground">
                احصل على برنامج غذائي مخصص حسب أهدافك — سعرات، ماكروز، ووجبات واقعية سهلة التحضير.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                asChild
                className="group relative h-13 overflow-hidden rounded-2xl px-7 text-base font-semibold shadow-glow transition-all duration-300 hover:shadow-glow-lg hover:-translate-y-0.5"
              >
                <Link href="/calculate">
                  ابدأ الآن مجاناً
                  <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-13 rounded-2xl border-border/60 px-7 text-base backdrop-blur-sm hover:border-primary/30 hover:bg-accent"
              >
                <Link href="/#how-it-works">كيف يعمل؟</Link>
              </Button>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border/50 pt-5">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-2.5"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <stat.icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-inter tabular-nums text-xl font-bold leading-none tracking-tight">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: visual card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:mr-auto lg:max-w-[440px] w-full"
          >
            {/* Glow behind card */}
            <div className="absolute inset-0 rounded-[2.5rem] bg-primary/10 blur-3xl scale-90" />

            {/* Main card */}
            <div className="glass-strong relative overflow-hidden rounded-[2.5rem] p-6 shadow-premium-lg sm:p-7">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-border/60 to-transparent" />

              {/* Logo with floating effect */}
              <div className="animate-float-slow mx-auto flex h-[180px] w-[180px] items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-primary/8 via-accent to-primary/5 p-5 shadow-md">
                <Image
                  src="/logo.png"
                  alt="DreamBody"
                  width={160}
                  height={160}
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>

              {/* Progress-like bar */}
              <div className="mt-5 space-y-3">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>توزيع الماكروز اليومي</span>
                  <span className="font-medium text-foreground">1,850 kcal</span>
                </div>
                <div className="flex h-2.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: "38%" }} />
                  <div className="h-full rounded-full bg-amber-400" style={{ width: "45%" }} />
                  <div className="h-full rounded-full bg-rose-400" style={{ width: "17%" }} />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    بروتين 38%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
                    كربوهيدرات 45%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-400" />
                    دهون 17%
                  </span>
                </div>
              </div>
            </div>

            {/* Floating pills */}
            {floatingPills.map((pill, i) => (
              <motion.div
                key={pill.text}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + pill.delay, duration: 0.4 }}
                className={`absolute animate-float rounded-full border px-3 py-1.5 text-xs font-semibold shadow-md ${pill.color}`}
                style={{
                  top: i === 0 ? "-1rem" : i === 1 ? "38%" : i === 2 ? "72%" : "88%",
                  right: i % 2 === 0 ? "-1.5rem" : "auto",
                  left: i % 2 !== 0 ? "-1.5rem" : "auto",
                  animationDelay: `${pill.delay}s`,
                  animationDuration: `${5 + i}s`,
                }}
              >
                {pill.text}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
