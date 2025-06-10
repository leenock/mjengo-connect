"use client"

import { useState, useEffect, useRef } from "react"
import { Lightbulb, Heart, Users, Star, TrendingUp, Shield } from "lucide-react"
import Header from "@/components/landingpage/Header"
import Footer from "@/components/landingpage/Footer"
import Image from "next/image"
import Link from "next/link"

export default function AboutUs() {
  const [storyVisible, setStoryVisible] = useState(false)
  const [valuesVisible, setValuesVisible] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const [ctaVisible, setCtaVisible] = useState(false)

  const storyRef = useRef<HTMLElement>(null)
  const valuesRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === storyRef.current) setStoryVisible(true)
            if (entry.target === valuesRef.current) setValuesVisible(true)
            if (entry.target === statsRef.current) setStatsVisible(true)
            if (entry.target === ctaRef.current) setCtaVisible(true)
          }
        })
      },
      { threshold: 0.1 },
    )

    const sections = [storyRef, valuesRef, statsRef, ctaRef]
    sections.forEach((ref) => ref.current && observer.observe(ref.current))

    return () => {
      sections.forEach((ref) => ref.current && observer.unobserve(ref.current))
    }
  }, [])

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Community First",
      description: "Building strong relationships between skilled workers and clients across Kenya.",
      color: "from-rose-500 to-pink-600",
      bgColor: "bg-gradient-to-br from-rose-50 to-pink-100",
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation & Accessibility",
      description: "Making construction services available to everyone, everywhere in Kenya through technology.",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-100",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Growth & Impact",
      description: "Creating economic opportunities and driving industry transformation across communities.",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-100",
    },
  ]

  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      number: "10,000+",
      label: "Skilled Fundis",
      description: "Verified professionals ready to work",
    },
    {
      icon: <Star className="w-8 h-8" />,
      number: "5,000+",
      label: "Jobs Completed",
      description: "Successfully delivered projects",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      number: "98%",
      label: "Success Rate",
      description: "Client satisfaction guarantee",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      number: "24/7",
      label: "Support",
      description: "Always here when you need us",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-inter">
      <Header />
      <main className="pt-20 text-slate-900">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                <Heart className="w-4 h-4 mr-2" />
                About MJENGO CONNECT
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-6 leading-tight">
                Building Kenya
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Construction Future
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed px-4">
                Connecting skilled fundis with opportunities, transforming communities one project at a time
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section ref={storyRef} className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`text-center mb-16 transition-all duration-1000 ${
                storyVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 sm:mb-6">Our Story</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-6" />
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Born from a simple observation: Kenya has incredible skilled workers, but connecting them with those who
                need their services was unnecessarily complicated. We set out to change that.
              </p>
            </div>

            {/* Grid Layout with Text + Image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left Column - Text Content */}
              <div
                className={`transition-all duration-1000 delay-200 ${
                  storyVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
              >
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 sm:mb-6">
                  Empowering Skilled Fundis, Connecting Them to Opportunity
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                    Across Kenya, countless skilled fundis remain unseen — not because they lack talent, but because
                    they lack visibility. Without a platform to showcase their work, many struggle to find consistent
                    jobs or grow their craft into a sustainable business.
                  </p>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                    Meanwhile, clients seeking reliable construction services often rely on word-of-mouth or guesswork,
                    with no easy way to verify skills, compare prices, or ensure quality.
                  </p>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                    We built this platform to solve both problems. By connecting trusted fundis with people who need
                    them, we are unlocking opportunity, restoring trust, and raising the standard of construction across
                    the country.
                  </p>
                </div>
              </div>

              {/* Right Column - Image */}
              <div
                className={`transition-all duration-1000 delay-300 ${
                  storyVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                }`}
              >
                <div className="relative max-w-md mx-auto lg:max-w-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl transform rotate-3"></div>
                  <Image
                    src="/images/workers1.jpg"
                    alt="Our Story"
                    width={600}
                    height={400}
                    className="relative w-full h-auto rounded-2xl object-cover shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-16 sm:py-18 lg:py-20 bg-gradient-to-br from-slate-900 to-blue-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`text-center mb-16 transition-all duration-1000 ${
                statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6">
                Our Impact in Numbers
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Real results from real partnerships across Kenya
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`group transition-all duration-1000 transform hover:scale-105 ${
                    statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="relative p-6 sm:p-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mb-4 sm:mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-white mb-2">{stat.number}</div>
                    <div className="text-base sm:text-lg font-bold text-blue-200 mb-2">{stat.label}</div>
                    <div className="text-xs sm:text-sm text-slate-300">{stat.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section ref={valuesRef} className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`text-center mb-16 transition-all duration-1000 ${
                valuesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 sm:mb-6">
                Our Core Values
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-6" />
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                These values guide everything we do, from how we build our platform to how we serve our community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
              {values.map((value, index) => (
                <div
                  key={index}
                  className={`group relative transition-all duration-1000 transform hover:scale-105 ${
                    valuesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 120}ms` }}
                >
                  <div className="relative p-6 sm:p-8 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:bg-white h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div
                        className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${value.color} text-white flex items-center justify-center rounded-xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        {value.icon}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">{value.title}</h3>
                      <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{value.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section
          ref={ctaRef}
          className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div
              className={`transition-all duration-1000 ${
                ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6">
                Let us Build Our Community Together
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                Whether you are looking for skilled professionals or want to grow your construction business — MJENGO
                Connect is your trusted partner.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-md sm:max-w-none mx-auto">
                <Link href="/auth/job-posting" passHref>
                  <div className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <Star className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Post a Job</span>
                    </div>
                  </div>
                </Link>
                <Link href="/Jobs-list" passHref>
                  <div className="group px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/20 transition-all duration-300 hover:scale-105 w-full sm:w-auto text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Browse Jobs</span>
                    </div>
                  </div>
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
