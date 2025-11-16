import React from "react";
import { CheckCircle, Zap, Repeat } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Start a Voice Session",
      desc: "Speak naturally — DoctorAI listens and captures symptoms in real time.",
    },
    {
      icon: <Repeat className="h-6 w-6" />,
      title: "AI Triage & History",
      desc: "The agent triages, asks follow-ups, and builds a structured history.",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Actionable Report",
      desc: "Receive a standardized report with recommendations and next steps.",
    },
  ];

  return (
    <section aria-labelledby="how-it-works" className="mt-12">
      <h3 id="how-it-works" className="mb-6 text-center text-2xl font-bold how-title">
        How It Works
      </h3>
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-start gap-3 rounded-lg border p-6 dark:border-neutral-800 neon-border neon-outline card-clean">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-accent/5 text-accent">
              {s.icon}
            </div>
            <h4 className="how-title">{s.title}</h4>
            <p className="how-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
