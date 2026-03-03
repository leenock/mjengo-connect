"use client"

import { useState, useEffect, useRef } from "react"
import { Heart, Lightbulb, Users, ArrowRight, Briefcase, Shield, Target, Zap } from "lucide-react"
import Header from "@/components/landingpage/Header"
import Footer from "@/components/landingpage/Footer"
import Image from "next/image"
import Link from "next/link"

export default function AboutUs() {
  const [visible, setVisible] = useState<Record<string, boolean>>({})
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({
    story: null,
    stats: null,
    values: null,
    cta: null,
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setVisible((v) => ({ ...v, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    )
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const values = [
    {
      icon: Heart,
      title: "Community first",
      description: "We build trust between skilled workers and clients. Every feature we ship is designed to strengthen those connections across Kenya.",
    },
    {
      icon: Lightbulb,
      title: "Access through innovation",
      description: "Technology should make construction hiring simple and transparent. We’re here to make quality labour visible and bookable for everyone.",
    },
    {
      icon: Users,
      title: "Growth and impact",
      description: "We care about sustainable livelihoods for fundis and better outcomes for clients. Our success is measured by theirs.",
    },
  ]

  const stats = [
    { value: "200+", label: "Skilled fundis", sub: "professionals" },
    { value: "500+", label: "Jobs posted", sub: "Across the platform" },
    { value: "5+", label: "Counties", sub: "Nationwide reach" },
    { value: "24/7", label: "Support", sub: "When you need us" },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section className="relative bg-slate-900 px-4 pt-16 pb-24 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(251,146,60,0.12),transparent)]" />
          <div className="relative max-w-4xl mx-auto text-center">
            <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-slate-300 text-sm font-medium mb-8">
              <Heart className="w-4 h-4 text-amber-400" />
              About MJENGO Connect
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15]">
              Building Kenya’s construction future, together
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              We connect skilled fundis with people who need them — so projects get done well, and workers get the opportunities they deserve.
            </p>
          </div>
        </section>

        {/* Story */}
        <section
          id="story"
          ref={(el) => { sectionRefs.current.story = el }}
          className="py-16 sm:py-20 lg:py-24 bg-white"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div
                className={`transition-all duration-700 ${
                  visible.story ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Why we started
                </h2>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  Kenya has no shortage of talented fundis. What was missing was a simple, trusted way to find them. Clients relied on word-of-mouth; skilled workers had no central place to be seen. We built MJENGO Connect to fix that.
                </p>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  Today we help clients post jobs and get in touch with fundis — and we help fundis find work, grow their reputation. One platform, two sides of the same goal: better construction outcomes for everyone.
                </p>
                <div className="mt-8 flex items-center gap-3">
                  <div className="flex items-center gap-2 text-amber-600 font-semibold">
                    <Target className="w-5 h-5" />
                    <span>Our mission</span>
                  </div>
                  <p className="text-slate-500 text-sm max-w-xs">
                    Make skilled labour visible, bookable, and trusted across Kenya.
                  </p>
                </div>
              </div>
              <div
                className={`relative transition-all duration-700 delay-150 ${
                  visible.story ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3] shadow-xl">
                  <Image
                    src="/images/workers1.jpg"
                    alt="Skilled fundis and construction professionals in Kenya"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={false}
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500/20 rounded-2xl blur-2xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section
          id="stats"
          ref={(el) => { sectionRefs.current.stats = el }}
          className="py-16 sm:py-20 bg-slate-800"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-white mb-12">
              Our impact in numbers
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center transition-all duration-600 ${
                    visible.stats ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm font-semibold text-amber-400/90">{stat.label}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section
          id="values"
          ref={(el) => { sectionRefs.current.values = el }}
          className="py-16 sm:py-20 lg:py-24 bg-slate-50"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                What we believe
              </h2>
              <p className="mt-3 text-slate-600 leading-relaxed">
                These principles guide how we build the product and serve our community.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {values.map((item, i) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.title}
                    className={`rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 ${
                      visible.values ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-slate-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          id="cta"
          ref={(el) => { sectionRefs.current.cta = el }}
          className="py-16 sm:py-20 lg:py-24 bg-slate-900"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div
              className={`transition-all duration-700 ${
                visible.cta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Ready to get started?
              </h2>
              <p className="mt-4 text-slate-400 leading-relaxed">
                Post a job and find skilled fundis, or sign up as a fundi and browse opportunities.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/job-posting"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 text-white font-semibold shadow-lg shadow-amber-500/25 hover:bg-amber-400 transition-colors"
                >
                  <Briefcase className="w-5 h-5" />
                  Post a job
                </Link>
                <Link
                  href="/Jobs-list"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  <Zap className="w-5 h-5" />
                  Browse jobs
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
