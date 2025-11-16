import React from "react";

export default function Head() {
  return (
    <>
      <title>DoctorAI — AI-powered Medical Voice Agent</title>
      <meta name="description" content="DoctorAI provides 24/7 intelligent medical voice support: triage symptoms, book appointments, and generate structured reports." />
      <meta name="viewport" content="width=device-width,initial-scale=1" />

      {/* Open Graph */}
      <meta property="og:title" content="DoctorAI — AI-powered Medical Voice Agent" />
      <meta property="og:description" content="DoctorAI provides 24/7 intelligent medical voice support: triage symptoms, book appointments, and generate structured reports." />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/og-image.png" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}
