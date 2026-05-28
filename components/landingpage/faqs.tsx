"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Clock3, MessageCircle } from "lucide-react";

type FaqCategory = "all" | "general" | "clients" | "fundis";

interface FaqItem {
  id: string;
  category: Exclude<FaqCategory, "all">;
  question: string;
  answer: string;
}

const categories: { id: FaqCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "general", label: "General" },
  { id: "clients", label: "For clients" },
  { id: "fundis", label: "For fundis" },
];

const faqItems: FaqItem[] = [
  {
    id: "what-is-mjengo",
    category: "general",
    question: "What is MJENGO Connect?",
    answer:
      "MJENGO Connect is a platform that connects clients who need construction work with skilled fundis — masons, plumbers, painters, welders, electricians, and related trades.",
  },
  {
    id: "how-does-it-help",
    category: "general",
    question: "How does the platform help me?",
    answer:
      "Clients post jobs and fundis browse listings by trade and location. Fundis contact clients directly using the details on each listing.",
  },
  {
    id: "who-can-use",
    category: "general",
    question: "Who can use MJENGO Connect?",
    answer:
      "Anyone hiring for construction work, and any skilled worker looking for job opportunities in Kenya.",
  },
  {
    id: "how-to-post-job",
    category: "clients",
    question: "How do I post a job?",
    answer:
      "Create a client account, submit your job details, and pay the listing fee. After admin verification, your job is published for fundis to view.",
  },
  {
    id: "how-contact",
    category: "clients",
    question: "How do fundis contact me?",
    answer:
      "Fundis view your listing and reach out using the phone number or email you provide on the job post.",
  },
  {
    id: "how-to-see-jobs",
    category: "fundis",
    question: "How do I find jobs?",
    answer:
      "Register as a fundi, browse listings by location and trade, and open a job to see full details before contacting the client.",
  },
  {
    id: "how-to-apply",
    category: "fundis",
    question: "Is there a subscription?",
    answer:
      "Fundis can subscribe for expanded access to listings and saved jobs. Pricing and plan details are shown in your fundi account.",
  },
];

export default function FAQs() {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("general");
  const [expandedId, setExpandedId] = useState<string | null>("what-is-mjengo");

  const filteredFaqs = faqItems.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  return (
    <section id="faqs-section" className="border-b border-slate-200 bg-slate-50 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Support</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Quick answers about posting jobs, finding work, and using the platform.
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="mt-10 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {filteredFaqs.map((faq) => {
            const isOpen = expandedId === faq.id;
            return (
              <div key={faq.id}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50"
                  onClick={() => setExpandedId(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-slate-900">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid overflow-hidden transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-lg border border-slate-200 bg-white p-6 sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                Chat with support
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Still need help?
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                We can guide you on account setup, job listings, payments, and subscriptions. Send us a
                message and our team will assist you quickly.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2">
                  <Clock3 className="h-4 w-4 text-slate-500" />
                  Typical response: same day
                </span>
                <span className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2">
                  <MessageCircle className="h-4 w-4 text-slate-500" />
                  Friendly human support
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <Link
                href="/contact-us"
                className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 lg:w-auto"
              >
                Start a chat
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex w-full items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 lg:w-auto"
              >
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
