"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Waveform } from "./Waveform";

const MESSAGES = [
  { id: 1, text: "Hi — I see you're starting a new session. Tell me the main symptom.", delay: 1200 },
  { id: 2, text: "Thanks. Any recent changes in medication or allergies?", delay: 1400 },
  { id: 3, text: "Got it. Based on that, I recommend scheduling a quick vitals check.", delay: 1600 },
];

export default function ChatDemo() {
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [amplitude, setAmplitude] = useState(0.8);
  const timerRef = useRef<number | null>(null);
  const [ttsAllowed, setTtsAllowed] = useState(false);

  // When playing, we speak each message fully then advance. Use SpeechSynthesis `onend` when available,
  // otherwise fallback to a timer based on message length.
  function playMessageAt(i: number) {
    if (i >= MESSAGES.length) {
      setPlaying(false);
      setAmplitude(0.6);
      return;
    }

    const msg = MESSAGES[i];
    // visual amplitude while speaking
    setAmplitude(1.6);
    // cancel any previous fallback
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // prefer SpeechSynthesis if available and user allowed
    try {
      const synth = (window as any).speechSynthesis;
      if (ttsAllowed && synth) {
        synth.cancel();
        const utter = new SpeechSynthesisUtterance(msg.text);
        utter.lang = "en-US";
        utter.rate = 1;
        utter.pitch = 1;
        utter.onend = () => {
          setIndex(i + 1);
          setAmplitude(0.9);
          playMessageAt(i + 1);
        };
        synth.speak(utter);
        return;
      }
    } catch (e) {
      // fall through to timer fallback
    }

    // fallback: estimate speaking time by words (approx 150 wpm -> 400ms per word)
    const words = msg.text.split(/\s+/).length;
    const est = Math.max(800, words * 400);
    timerRef.current = window.setTimeout(() => {
      setIndex(i + 1);
      setAmplitude(0.9);
      playMessageAt(i + 1);
    }, est);
  }

  function startDemo() {
    // allow speech now that the user interacted
    setTtsAllowed(true);
    setIndex(0);
    setAmplitude(1.3);
    setPlaying(true);
    // start playing the first message
    // delay slightly to allow state to settle
    setTimeout(() => playMessageAt(0), 80);
  }

  // speak the newly revealed message using Web Speech API
  useEffect(() => {
    if (!ttsAllowed) return;
    if (index <= 0) return;
    const msg = MESSAGES[index - 1];
    if (!msg) return;
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      // cancel any previous utterance
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(msg.text);
      utter.lang = "en-US";
      utter.rate = 1;
      utter.pitch = 1;
      synth.speak(utter);
    } catch (e) {
      // speech API may be unavailable or blocked
      console.warn("Speech failed", e);
    }
  }, [index, ttsAllowed]);

  // cleanup tts on unmount
  useEffect(() => {
    return () => {
      try {
        const synth = window.speechSynthesis;
        if (synth) synth.cancel();
      } catch (e) {
        /* ignore */
      }
    };
  }, []);

  return (
    <div className="chat-demo-panel bg-glass p-4 rounded-xl shadow-neon neon-border">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-muted-foreground">Demo conversation</div>
        <Button variant="ghost" size="sm" onClick={startDemo}>
          Try Demo
        </Button>
      </div>

      <div className="h-40 mb-3">
        <Waveform height={80} amplitude={amplitude} />
      </div>

      <div className="space-y-2 mb-2">
        {MESSAGES.slice(0, index).map((m) => (
          <div key={m.id} className="p-2 bg-white/6 rounded">
            <div className="text-sm">{m.text}</div>
          </div>
        ))}
      </div>

      <div className="text-xs text-muted-foreground">Simulated medical assistant replies</div>
    </div>
  );
}
