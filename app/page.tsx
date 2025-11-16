"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { FeatureCard } from "@/components/FeatureCard";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import ChatDemo from "@/components/ChatDemo";
import { FloatingContact } from "@/components/FloatingContact";
import { Mic, FileText, ShieldCheck } from "lucide-react";
import { Waveform } from "@/components/Waveform";
import { useRouter } from "next/navigation";

export default function Page() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".feature-animate, .test-animate"));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.2 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <header className="mx-auto max-w-6xl px-6 py-16 hero-bg">
        <div className="blob b1" aria-hidden />
        <div className="blob b2" aria-hidden />

        
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 text-3xl font-extrabold leading-tight md:text-5xl"
            >
              DoctorAI — Conversational medical voice agents for modern clinics
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 max-w-lg text-lg text-neutral-600 dark:text-neutral-400 lead"
            >
              Provide 24/7 intelligent medical support using voice-first AI. Triage
              symptoms, book appointments, and create structured reports — with
              empathy and clinical-grade accuracy.
            </motion.p>

            <div className="flex gap-4">
              <Button asChild size="lg" className="cta-shimmer cta-text">
                <Link href="/sign-in">Explore Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="cta-text">
                <Link href="/contact-support">Contact Support</Link>
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-6">
              <div>
                <p className="text-sm text-neutral-500">Saved time</p>
                <p className="text-2xl font-bold">100+ hrs</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Clinics onboarded</p>
                <p className="text-2xl font-bold">25+</p>
              </div>
            </div>
          </div>

          <aside aria-hidden>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="mx-auto max-w-sm"
            >
              <div className="neon-border rounded-2xl p-4" style={{ background: "var(--glass-bg)", backdropFilter: "blur(8px)" }}>
                <ChatDemo />
              </div>
            </motion.div>
          </aside>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6">
        <div className="mt-4 rounded-2xl px-4 py-2" style={{ background: "var(--glass-bg)", backdropFilter: "blur(8px)", boxShadow: "var(--neon-shadow)" }}>
          <Waveform height={72} />
        </div>
      </div>

      <section aria-labelledby="features" className="mx-auto max-w-6xl px-6 pb-12">
        <h2 id="features" className="mb-6 text-center text-2xl font-bold">
          Key features
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <FeatureCard
            className="feature-animate"
            icon={<Mic className="h-5 w-5 text-white" />}
            title="Voice-first Triage"
            description="Fast symptom intake via conversational voice with natural language understanding."
          />
          <FeatureCard
            className="feature-animate"
              icon={<FileText className="h-5 w-5 text-white" />}
              iconGradient="var(--grad-peach-lavender)"
            title="Structured Reports"
            description="Generate standardized medical reports automatically after each session."
          />
          <FeatureCard
            className="feature-animate"
              icon={<ShieldCheck className="h-5 w-5 text-white" />}
              iconGradient="var(--grad-sky-mint)"
            title="Secure & Compliant"
            description="Built with security and auditability in mind — deploy on your cloud."
          />
        </div>
      </section>

      <HowItWorks />

      <Testimonials />

      <FloatingContact />
    </main>
  );
}

const Navbar = () => {
  const { user } = useUser();
  return (
    <nav className="sticky top-0 z-50 bg-background/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" aria-hidden />
          <span className="font-bold">DoctorAI</span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {!user ? (
            <Link href="/sign-in">
              <Button variant="ghost">Login</Button>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <UserButton />
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
