"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Briefcase, Search } from "lucide-react";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const jobsHref = searchQuery.trim()
    ? `/Jobs-list?q=${encodeURIComponent(searchQuery.trim())}`
    : "/Jobs-list";

  return (
    <section className="border-b border-slate-200 bg-white pt-[72px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-12 lg:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
              Construction workforce platform
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
              Connect with skilled fundis for every build
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              MJENGO Connect helps clients post construction jobs and helps fundis find verified work across Kenya — masons, plumbers, electricians, painters, and more.
            </p>

            <div className="mt-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">Search verified construction jobs</p>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  New listings daily
                </span>
              </div>

              <label htmlFor="hero-search" className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Job title, trade, or location
              </label>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="hero-search"
                    type="search"
                    placeholder="Try: Mason in Nairobi"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 w-full rounded-md border border-slate-300 bg-white pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
                <Link
                  href={jobsHref}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-slate-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  <Search className="h-4 w-4" />
                  Search jobs
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {["Mason", "Plumber", "Electrician", "Nairobi"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSearchQuery(tag)}
                    className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/auth/job-posting"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                <Briefcase className="h-4 w-4" />
                Post a job
              </Link>
              <Link
                href="/auth/job-listing"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
              >
                I&apos;m a fundi
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-slate-200 pt-8">
              {[
                { value: "500+", label: "Jobs listed" },
                { value: "200+", label: "Skilled fundis" },
                { value: "Kenya", label: "Coverage" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-2xl font-bold text-slate-900">{stat.value}</dt>
                  <dd className="mt-1 text-sm text-slate-500">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
              <Image
                src="/images/workers.jpg"
                alt="Construction professionals on site"
                width={720}
                height={540}
                className="aspect-[4/3] w-full object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-4 left-4 right-4 rounded-md border border-slate-200 bg-white p-4 shadow-md sm:left-6 sm:right-auto sm:max-w-xs">
              <p className="text-sm font-semibold text-slate-900">Verified job listings</p>
              <p className="mt-1 text-sm text-slate-600">
                Paid listings reviewed before they go live for fundis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
