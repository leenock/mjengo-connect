"use client";

import { Globe, Target, TrendingUp, Users } from "lucide-react";

const pillars = [
  {
    icon: Target,
    title: "Our mission",
    description:
      "Make skilled construction labour visible and reachable, so clients can hire with confidence and fundis can access fair opportunities.",
  },
  {
    icon: Users,
    title: "Community first",
    description:
      "We focus on trust between workers and clients — clear listings, direct contact, and support when something needs attention.",
  },
  {
    icon: Globe,
    title: "Nationwide access",
    description:
      "From major cities to growing towns, MJENGO Connect is designed to scale with how construction work actually happens in Kenya.",
  },
];

const principles = [
  {
    icon: TrendingUp,
    title: "Reliable listings",
    description: "Jobs go through review and payment before they are shown to fundis.",
  },
  {
    icon: Users,
    title: "Direct communication",
    description: "Clients and fundis agree terms without unnecessary intermediaries.",
  },
  {
    icon: Target,
    title: "Long-term impact",
    description: "Better access to work supports livelihoods across the construction sector.",
  },
];

export default function Vision() {
  return (
    <section className="border-b border-slate-200 bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">About our approach</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Built for Kenya&apos;s construction industry
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            We are building a dependable marketplace — not a gimmick — where hiring and finding work is clear, professional, and efficient.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-lg border border-slate-200 bg-slate-50 p-8"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-orange-700 shadow-sm ring-1 ring-slate-200">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-12 lg:mt-14">
          <h3 className="text-center text-2xl font-bold text-slate-900">What we stand for</h3>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {principles.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-lg border border-slate-200 bg-white p-6"
                >
                  <Icon className="h-5 w-5 text-orange-600" aria-hidden />
                  <h4 className="mt-4 font-semibold text-slate-900">{item.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
