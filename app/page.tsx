"use client";

import Header from "@/components/landingpage/Header";
import Hero from "@/components/landingpage/Hero";
import Service from "@/components/landingpage/Service";
import Vision from "@/components/landingpage/Vision";
import FAQs from "@/components/landingpage/faqs";
import Footer from "@/components/landingpage/Footer";

export default function Page() {
  return (
    <div>
      <Header />
      <Hero />
      <Service />
      <Vision />
      <FAQs />
      <Footer />
    </div>
  )
}