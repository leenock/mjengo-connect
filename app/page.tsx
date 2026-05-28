"use client";

import Header from "@/components/landingpage/Header";
import Hero from "@/components/landingpage/Hero";
import Service from "@/components/landingpage/Service";
import Vision from "@/components/landingpage/Vision";
import FAQs from "@/components/landingpage/faqs";
import Footer from "@/components/landingpage/Footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <Header />
      <main>
        <Hero />
        <Service />
        <Vision />
        <FAQs />
      </main>
      <Footer />
    </div>
  );
}
