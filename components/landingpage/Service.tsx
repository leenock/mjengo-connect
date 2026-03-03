"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Briefcase, Search, Handshake } from "lucide-react";

export default function Service() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.unobserve(section);
  }, []);

  const services = [
    {
      icon: Briefcase,
      title: "Post a Job",
      description:
        "Need a mason, plumber, or welder? Post your job with location and budget for just Ksh 300. Registered fundis  will see your listing and contact you directly.",
      step: 1,
      delay: 0,
    },
    {
      icon: Search,
      title: "Browse Listings",
      description:
        "Are you a fundi looking for work? Browse listings by trade and location. Create a free account and  access all jobs for just Ksh 200 Monthly Subscription.",
      step: 2,
      delay: 100,
    },
    {
      icon: Handshake,
      title: "Connect & Work",
      description:
        "Post your construction job and let qualified fundis reach out. They browse listings by trade and location, then contact you directly by Email or Phone.",
      step: 3,
      delay: 200,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="services-section"
      className="relative py-20 lg:py-28 overflow-hidden bg-slate-800"
      aria-label="How MJENGO Connect Works"
    >
      {/* Background – slightly different from Hero: lighter slate + soft warm glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-900/50 to-transparent" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            How MJENGO Connect{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Our platform simplifies the construction process by connecting you with skilled professionals in three easy steps.
          </p>
        </div>

        {/* Cards – glass style to match Hero */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 lg:p-8 transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                } hover:border-white/20 hover:bg-white/[0.07]`}
                style={{ transitionDelay: `${service.delay}ms` }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-amber-400/90">
                    Step {service.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA – same orange gradient as Hero */}
        <div
          className={`mt-14 text-center transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <Link
            href="/Jobs-list"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400 hover:shadow-amber-500/30 transition-all"
          >
            Get Started Today
          </Link>
        </div>
      </div>
    </section>
  );
}
