import React from "react";

export function Testimonials() {
  const items = [
    {
      quote: "DoctorAI saved our clinic over 100 hours of manual triage last month.",
      author: "Dr. Lina Gomez, Primary Care",
    },
    {
      quote: "Patients love the friendly voice assistant — it feels human and helpful.",
      author: "Clinic Admin, Sunnyvale Health",
    },
    {
      quote: "Reports are concise and ready to attach to the record.",
      author: "Dr. K. Patel, ER",
    },
  ];

  return (
    <section aria-labelledby="testimonials" className="mt-12">
      <h3 id="testimonials" className="mb-6 text-center text-2xl font-bold">
        Trusted by clinicians
      </h3>
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((t, i) => (
          <blockquote key={i} className="testimonial-card neon-border card-clean neon-outline test-animate">
            <div className="testimonial-quote-mark">“</div>
            <p className="testimonial-quote">{t.quote}</p>
            <cite className="testimonial-author">{t.author}</cite>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
