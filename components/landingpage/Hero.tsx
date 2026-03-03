"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Briefcase, MapPin, Sparkles, ArrowRight, Building2, Users, FileCheck } from "lucide-react";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#0f172a]">
      {/* AI-style mesh gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(251,146,60,0.15),transparent)]" />
        <div className="absolute top-1/2 -right-1/3 w-[80%] h-[80%] bg-[radial-gradient(ellipse_60%_60%_at_100%_50%,rgba(234,88,12,0.08),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-900/40 to-transparent" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-28 lg:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-8rem)]">
            {/* Left column - copy + search + stats */}
            <div
              className={`transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {/* Badge */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Kenya&apos;s construction job platform
                </span>
                <span className="text-slate-500 text-sm">Trusted by clients & fundis</span>
              </div>

              {/* Headline + description */}
              <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Find your next
                <br />
                <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  construction job
                </span>
              </h1>
              <p className="mt-5 text-lg sm:text-xl text-slate-400 max-w-xl leading-relaxed">
                Post jobs or discover skilled fundis — masons, plumbers, electricians, painters & more.{" "}
                <span className="text-slate-300 font-medium">Reliable. Verified. Across Kenya.</span>
              </p>

              {/* Hero search / CTA block */}
              <div
                className={`mt-8 transition-all duration-700 ease-out delay-150 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              >
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 sm:p-5 shadow-2xl shadow-black/20">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Job title, skill or keyword..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={searchQuery.trim() ? `/Jobs-list?q=${encodeURIComponent(searchQuery.trim())}` : "/Jobs-list"}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400 hover:shadow-amber-500/30 transition-all"
                      >
                        <Search className="w-5 h-5" />
                        Find jobs
                      </Link>
                      <Link
                        href="/auth/job-posting"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/15 transition-all"
                      >
                        <Briefcase className="w-5 h-5" />
                        Post a job
                      </Link>
                    </div>
                  </div>
                  <p className="mt-3 text-slate-500 text-sm">
                    e.g. Mason, Plumber, Electrician, Nairobi, Mombasa
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div
                className={`mt-8 flex flex-wrap gap-8 sm:gap-10 transition-all duration-700 ease-out delay-300 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              >
                {[
                  { value: "500+", label: "Live jobs", icon: FileCheck },
                  { value: "200+", label: "Skilled fundis", icon: Users },
                  { value: "Kenya", label: "Nationwide", icon: MapPin },
                ].map(({ value, label, icon: Icon }, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10">
                      <Icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-white">{value}</div>
                      <div className="text-sm text-slate-500 font-medium">{label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Secondary CTAs */}
              <div
                className={`mt-8 flex flex-wrap items-center gap-4 transition-all duration-700 ease-out delay-[400ms] ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              >
                <Link
                  href="/Jobs-list"
                  className="group inline-flex items-center gap-2 text-amber-400 font-semibold hover:text-amber-300 transition-colors"
                >
                  Browse all jobs
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <span className="text-slate-600">|</span>
                <Link
                  href="/auth/job-listing"
                  className="inline-flex items-center gap-2 text-slate-400 font-medium hover:text-white transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  I&apos;m a fundi
                </Link>
              </div>
            </div>

            {/* Right column - image side by side */}
            <div
              className={`relative transition-all duration-700 ease-out delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10 pointer-events-none" />
                  <Image
                    src="/images/workers.jpg"
                    alt="Construction professionals - MJENGO Connect"
                    width={700}
                    height={480}
                    className="w-full h-auto object-cover aspect-[4/3] lg:aspect-[3/2]"
                    priority
                  />
                  <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs z-20">
                    <div className="rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 p-4 shadow-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">Verified jobs daily</p>
                          <p className="text-slate-400 text-xs">New postings from real clients</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-3xl blur-2xl -z-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
