"use client"

import { useState, useEffect, useRef } from "react"
import { Eye, Target, Lightbulb, Users, Globe, TrendingUp } from "lucide-react"

export default function Vision() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeCard, setActiveCard] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  const visionCards = [
    {
      icon: Eye,
      title: "Our Vision",
      subtitle: "Transforming Construction",
      description:
        "To become Africa's leading digital platform that revolutionizes the construction industry by making skilled labor accessible, affordable, and reliable for everyone.",
      gradient: "from-[#FF6B00] via-[#FF8C42] to-[#FFB26B]",
      stats: "2030 Goal",
    },
    {
      icon: Target,
      title: "Our Mission",
      subtitle: "Connecting Communities",
      description:
        "Empowering skilled fundis and connecting them with opportunities while providing clients with reliable professionals for all construction needs.",
      gradient: "from-[#0057FF] via-[#4169E1] to-[#6CA0DC]",
      stats: "Active Today",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      subtitle: "Technology-Driven Solutions",
      description:
        "Leveraging cutting-edge technology to create seamless experiences, smart matching algorithms, and transparent project management tools.",
      gradient: "from-[#00B894] via-[#00CEC9] to-[#81ECEC]",
      stats: "Always Evolving",
    },
  ]

  const principles = [
    {
      icon: Users,
      title: "Community First",
      description: "Building strong relationships between skilled workers and clients across Kenya.",
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "Making construction services available to everyone, everywhere in Kenya.",
    },
    {
      icon: TrendingUp,
      title: "Growth & Impact",
      description: "Creating economic opportunities and driving industry transformation.",
    },
  ]

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    )
    observer.observe(section)
    return () => observer.unobserve(section)
  }, [])

  useEffect(() => {
    if (!isVisible) return
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % visionCards.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isVisible, visionCards.length])

  return (
    <section ref={sectionRef} className="relative py-24 bg-[#F9F9F9] overflow-hidden">
      {/* Background – keep subtle, same tone */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-16 left-10 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 border border-gray-200/80 text-gray-700 rounded-full text-sm font-semibold shadow-sm mb-6">
            <Eye className="w-4 h-4 text-orange-500" />
            Our Vision & Mission
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight max-w-3xl mx-auto">
            Where construction meets{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
              opportunity
            </span>
          </h2>
          <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Seamless access to skilled, affordable fundis for every construction project — empowering youth through job opportunities.
          </p>
        </div>

        {/* Vision Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {visionCards.map((card, index) => {
            const Icon = card.icon
            return (
              <div
                key={index}
                role="button"
                tabIndex={0}
                onClick={() => setActiveCard(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    setActiveCard(index)
                  }
                }}
                className={`relative rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-400 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                } ${
                  activeCard === index
                    ? "scale-[1.02] shadow-xl ring-2 ring-white/30"
                    : "scale-100 shadow-md hover:scale-[1.02] hover:shadow-lg"
                }`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-95`} />
                <div className="relative z-10 p-6 sm:p-8 text-white min-h-[280px] flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold bg-white/25 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      {card.stats}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-1">{card.title}</h3>
                  <p className="text-white/90 text-sm font-medium mb-4">{card.subtitle}</p>
                  <p className="text-white/95 text-sm leading-relaxed flex-grow">
                    {card.description}
                  </p>
                  <div className="mt-6 flex gap-1.5" aria-hidden>
                    {visionCards.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === activeCard ? "w-6 bg-white" : "w-2 bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Core Principles */}
        <div
          className={`transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Our Core Principles
            </h3>
            <div className="mt-3 w-12 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {principles.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300"
                >
                  <div className="w-12 h-12 mb-4 flex items-center justify-center bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-xl shadow-md group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">{item.title}</h4>
                  <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
