"use client"

import { useState, useEffect, useRef } from "react"
import { Eye, Target, Lightbulb, Users, Globe, TrendingUp } from "lucide-react"

export default function Vision() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeCard, setActiveCard] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  const visionCards = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Our Vision",
      subtitle: "Transforming Construction",
      description:
        "To become Africa's leading digital platform that revolutionizes the construction industry by making skilled labor accessible, affordable, and reliable for everyone.",
      gradient: "from-[#FF6B00] via-[#FF8C42] to-[#FFB26B]",
      stats: "2030 Goal",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Our Mission",
      subtitle: "Connecting Communities",
      description:
        "Empowering skilled fundis and connecting them with opportunities while providing clients with trusted, verified professionals for all construction needs.",
      gradient: "from-[#0057FF] via-[#4169E1] to-[#6CA0DC]",
      stats: "Active Today",
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
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
      icon: <Users className="w-6 h-6" />,
      title: "Community First",
      description: "Building strong relationships between skilled workers and clients across Kenya.",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Accessibility",
      description: "Making construction services available to everyone, everywhere in Kenya.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Growth & Impact",
      description: "Creating economic opportunities and driving industry transformation.",
    },
  ]

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.2 }
    )

    observer.observe(section)

    return () => {
      if (section) observer.unobserve(section)
    }
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
      {/* Background Glow Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-16 left-10 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-40 animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className={`text-center mb-20 transition duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-4">
            <Eye className="w-4 h-4 mr-2" /> Our Vision & Mission
          </div>
          
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Seamless access to skilled, affordable fundis for every construction project — empowering youth through job opportunities
          </p>
        </div>

        {/* Vision Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {visionCards.map((card, index) => (
            <div
              key={index}
              onClick={() => setActiveCard(index)}
              className={`relative rounded-3xl overflow-hidden transition-all duration-700 cursor-pointer group ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              } ${activeCard === index ? "scale-105 shadow-2xl" : "hover:scale-105 shadow-md"}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-90`} />
              <div className="relative z-10 p-8 text-white h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/30 rounded-xl">{card.icon}</div>
                  <span className="text-xs bg-white/30 px-3 py-1 rounded-full">{card.stats}</span>
                </div>
                <div className="mb-3">
                  <h3 className="text-2xl font-semibold">{card.title}</h3>
                  <p className="text-white/80">{card.subtitle}</p>
                </div>
                <p className="text-white/90 flex-grow">{card.description}</p>
                <div className="mt-4 flex gap-1">
                  {visionCards.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 transition-all rounded-full ${i === activeCard ? "w-6 bg-white" : "w-2 bg-white/50"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Core Principles */}
        <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900">Our Core Principles</h3>
            <div className="mt-2 w-16 h-1 mx-auto bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {principles.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 hover:border-orange-300 transition-all hover:shadow-lg"
              >
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-gradient-to-br from-orange-500 to-yellow-400 text-white rounded-xl">
                  {item.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                <p className="mt-2 text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
