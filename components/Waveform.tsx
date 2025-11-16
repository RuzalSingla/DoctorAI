"use client";

import React from "react";

export function Waveform({ className = "", height = 80, amplitude = 1 }: { className?: string; height?: number; amplitude?: number }) {
  // amplitude: 0.6 - 1.8 roughly
  const amp = Math.max(0.4, Math.min(2.2, amplitude));
  return (
    <div className={`waveform-wrapper ${className}`} style={{ height }} aria-hidden>
      <svg viewBox="0 0 800 80" preserveAspectRatio="none" className="w-full h-full wave-svg">
        <defs>
          <linearGradient id="g1" x1="0%" x2="100%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="1" />
            <stop offset="60%" stopColor="var(--secondary)" stopOpacity="1" />
          </linearGradient>
        </defs>
        <g transform={`translate(0,40) scale(1,${amp})`}>
          <path
            d="M0 0 C50 20, 150 -20, 200 0 C250 20, 350 -20, 400 0 C450 20, 550 -20, 600 0 C650 20, 750 -20, 800 0"
            stroke="url(#g1)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            className="wave-path"
          />
          <path
            d="M0 10 C50 30, 150 -10, 200 10 C250 30, 350 -10, 400 10 C450 30, 550 -10, 600 10 C650 30, 750 -10, 800 10"
            stroke="url(#g1)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
            className="wave-path slow"
          />
        </g>
      </svg>
    </div>
  );
}
