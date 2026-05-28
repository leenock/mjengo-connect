"use client";

import { Briefcase, Building2, Handshake, ShieldCheck, Target, Users } from "lucide-react";
import Header from "@/components/landingpage/Header";
import Footer from "@/components/landingpage/Footer";
import Image from "next/image";
import Link from "next/link";

const highlights = [
  {
    title: "Verified job listings",
    description: "Every paid listing is reviewed before publishing to maintain quality and trust.",
    icon: ShieldCheck,
  },
  {
    title: "Built for local realities",
    description: "Trades, locations, and hiring flows are designed for Kenya's construction market.",
    icon: Building2,
  },
  {
    title: "Direct client-fundi connection",
    description: "Clients and fundis communicate directly to agree on timelines, scope, and terms.",
    icon: Handshake,
  },
];

const values = [
  {
    title: "Trust and accountability",
    description: "We prioritize transparent listings, clear job details, and responsible platform standards.",
    icon: ShieldCheck,
  },
  {
    title: "Opportunity for skilled workers",
    description: "We help fundis become visible to more clients and access meaningful work opportunities.",
    icon: Users,
  },
  {
    title: "Practical innovation",
    description: "We focus on tools that simplify hiring and reduce friction for real construction projects.",
    icon: Target,
  },
];

const stats = [
  { value: "500+", label: "Jobs posted" },
  { value: "200+", label: "Skilled fundis" },
  { value: "5+", label: "Counties reached" },
  { value: "Daily", label: "Listing activity" },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      <Header />

      <main className="pt-20">
        <section className="border-b border-slate-200 bg-white py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">About MJENGO Connect</p>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.1rem] lg:leading-[1.14]">
                  A trusted platform for construction hiring in Kenya
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
                  MJENGO Connect helps clients post trusted job listings and helps fundis discover quality
                  opportunities. We are building reliable infrastructure for how construction work is found
                  and delivered.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/auth/job-posting"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    <Briefcase className="h-4 w-4" />
                    Post a job
                  </Link>
                  <Link
                    href="/Jobs-list"
                    className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50"
                  >
                    Browse jobs
                  </Link>
                </div>
              </div>

              <div className="group relative">
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm transition-shadow duration-300 group-hover:shadow-md">
                  <Image
                    src="/images/workers1.jpg"
                    alt="Construction professionals collaborating on site"
                    width={720}
                    height={520}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="absolute -bottom-4 left-4 rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md sm:left-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Our mission</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    Make skilled labour visible, trusted, and easier to hire.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-slate-50 py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {stats.map((stat) => (
                <div className="rounded-lg border border-slate-200 bg-white p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm" key={stat.label}>
                  <p className="text-2xl font-bold text-slate-900 sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Our story</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Why we built MJENGO Connect
                </h2>
                <p className="mt-5 leading-relaxed text-slate-600">
                  Construction hiring has traditionally depended on referrals and fragmented networks. That
                  model leaves clients uncertain and limits visibility for many skilled professionals.
                </p>
                <p className="mt-4 leading-relaxed text-slate-600">
                  We created MJENGO Connect to provide a structured digital marketplace where jobs can be
                  posted clearly and fundis can find opportunities aligned with their trade and location.
                </p>
                <p className="mt-4 leading-relaxed text-slate-600">
                  Our goal is long-term: strengthen trust, improve hiring outcomes, and support sustainable
                  growth across the construction ecosystem.
                </p>
              </div>

              <div className="grid gap-4">
                {highlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article
                      key={item.title}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm sm:p-6"
                    >
                      <div className="inline-flex rounded-md bg-white p-2 text-orange-600 ring-1 ring-slate-200 transition-colors duration-200 hover:bg-orange-50">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">What guides us</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Our core values</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {values.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="rounded-lg border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                  >
                    <div className="inline-flex rounded-md bg-orange-50 p-2 text-orange-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                  </article>
                );
              })}
            </div>

            <div className="mt-12 rounded-lg border border-slate-200 bg-slate-900 p-8 text-center sm:p-10">
              <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Work with us on your next project</h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                Whether you are hiring a fundi or looking for your next opportunity, MJENGO Connect gives
                you a clear and reliable place to start.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/auth/job-posting"
                  className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  Post a job
                </Link>
                <Link
                  href="/auth/job-listing"
                  className="inline-flex items-center justify-center rounded-md border border-slate-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  I&apos;m a fundi
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
