"use client"
import { useState, useEffect } from "react"
import Header from "@/components/landingpage/Header"
import Footer from "@/components/landingpage/Footer"

import {
  Smartphone,
  Download,
  Bell,
  CheckCircle,
  Star,
  Users,
  Zap,
  Apple,
  PlayCircle,
  TrendingUp,
  Shield,
  Clock,
} from "lucide-react"

export default function ComingSoonPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Countdown timer - set to 300 days from now
  useEffect(() => {
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 100)

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })

      if (distance < 0) {
        clearInterval(timer)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const features = [
    {
      icon: Zap,
      title: "Instant Job Alerts",
      description: "Get notified immediately when jobs matching your skills are posted in your area",
      color: "text-indigo-600",
      bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
    },
    {
      icon: Users,
      title: "Direct Communication",
      description: "Chat directly with employers and clients through our secure messaging system",
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    },
    {
      icon: Star,
      title: "Portfolio Showcase",
      description: "Build your professional profile with photos of your work and client reviews",
      color: "text-amber-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
    },
    {
      icon: CheckCircle,
      title: "Verified Jobs",
      description: "All jobs are verified and payments are secured through our platform",
      color: "text-violet-600",
      bgColor: "bg-gradient-to-br from-violet-50 to-violet-100",
    },
  ]

  const stats = [
    {
      number: "10,000+",
      label: "Registered Fundis",
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-200",
    },
    {
      number: "5,000+",
      label: "Jobs Posted",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
    },
    {
      number: "98%",
      label: "Success Rate",
      icon: Star,
      color: "text-amber-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
    },
    {
      number: "24/7",
      label: "Support",
      icon: Shield,
      color: "text-violet-600",
      bgColor: "bg-gradient-to-br from-violet-50 to-violet-100",
      borderColor: "border-violet-200",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-inter">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 rounded-full text-sm font-bold mb-6 shadow-sm">
                <Bell className="w-4 h-4 mr-2" />
                Coming Soon
              </div>

              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent mb-6 leading-tight">
                MJENGO CONNECT Mobile App
                <span className="block bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  Coming Soon!
                </span>
              </h1>

              <p className="text-xl text-slate-600 mb-8 leading-relaxed font-medium">
                Take your construction business mobile! Find jobs, connect with clients, and manage your projects on the
                go with our powerful mobile app.
              </p>

              {/* Countdown Timer */}
              <div className="grid grid-cols-4 gap-4 mb-8 max-w-md mx-auto lg:mx-0">
                {[
                  { value: timeLeft.days, label: "Days", icon: Clock },
                  { value: timeLeft.hours, label: "Hours", icon: Clock },
                  { value: timeLeft.minutes, label: "Minutes", icon: Clock },
                  { value: timeLeft.seconds, label: "Seconds", icon: Clock },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-4 text-center border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-2xl md:text-3xl font-black text-slate-900">{item.value}</div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Download Buttons Preview */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <div className="flex items-center px-6 py-3 bg-slate-800 text-white rounded-2xl font-bold opacity-50 cursor-not-allowed shadow-lg">
                  <Apple className="w-6 h-6 mr-3" />
                  <div className="text-left">
                    <div className="text-xs font-medium">Download on the</div>
                    <div className="text-sm font-bold">App Store</div>
                  </div>
                </div>
                <div className="flex items-center px-6 py-3 bg-slate-800 text-white rounded-2xl font-bold opacity-50 cursor-not-allowed shadow-lg">
                  <PlayCircle className="w-6 h-6 mr-3" />
                  <div className="text-left">
                    <div className="text-xs font-medium">Get it on</div>
                    <div className="text-sm font-bold">Google Play</div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-500 font-medium">Be the first to download when we launch!</p>
            </div>

            {/* Right Content - Phone Mockup */}
            <div className="relative">
              <div className="relative mx-auto w-80 h-120 lg:w-96 lg:h-[700px]">
                {/* Phone Frame */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] shadow-2xl">
                  {/* Screen */}
                  <div className="absolute inset-4 bg-gradient-to-br from-slate-900 via-indigo-900 to-orange-600 rounded-[2.5rem] overflow-hidden">
                    {/* Status Bar */}
                    <div className="h-8 bg-black/20 flex items-center justify-between px-6 text-white text-xs font-medium">
                      <span>9:41</span>
                      <span>●●●</span>
                    </div>

                    {/* App Content Preview */}
                    <div className="p-6 text-white">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                          <Smartphone className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold">MJENGO CONNECT</h3>
                        <p className="text-white/80 text-sm font-medium">Find Your Next Job</p>
                      </div>

                      {/* Mock Job Cards */}
                      <div className="space-y-3">
                        <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/20">
                          <div className="text-sm font-bold">House Painting</div>
                          <div className="text-xs text-white/70 font-medium">Westlands • KSh 1,000 /day</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/20">
                          <div className="text-sm font-bold">Plumbing Repair</div>
                          <div className="text-xs text-white/70 font-medium">Karen • KSh 800 /day</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/20">
                          <div className="text-sm font-bold">Electrical Work</div>
                          <div className="text-xs text-white/70 font-medium">Kiambu • KSh 1200 /day</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/20">
                          <div className="text-sm font-bold">Floor Work</div>
                          <div className="text-xs text-white/70 font-medium">Kisumu • KSh 1200 /day</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/20">
                          <div className="text-sm font-bold">Welding Work</div>
                          <div className="text-xs text-white/70 font-medium">Embu • KSh 1200 /day</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Home Indicator */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Bell className="w-8 h-8 text-amber-800" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Download className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-16 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Platform Statistics</h2>
            <p className="text-xl text-slate-600 font-medium">Join thousands of successful fundis and employers</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className={`${stat.bgColor} ${stat.borderColor} rounded-2xl shadow-lg border-2 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 text-center`}
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-white/60 rounded-2xl flex items-center justify-center shadow-lg">
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-3xl lg:text-4xl font-black text-slate-900 mb-2">{stat.number}</div>
                  <div className="text-slate-600 font-bold uppercase tracking-wide text-sm">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Powerful Features Coming to Your Phone
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
              Everything you need to grow your construction business, now in your pocket
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] group"
                >
                  <div
                    className={`w-12 h-12 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 rounded-3xl p-8 sm:p-12 text-white shadow-2xl">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Get Notified When We Launch</h2>
            <p className="text-xl mb-8 text-white/90 font-medium">
              Be among the first to experience the future of construction job hunting
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:ring-4 focus:ring-white/20 focus:outline-none"
              />
              <button className="px-8 py-4 bg-white text-orange-600 rounded-2xl font-bold hover:bg-slate-50 transition-colors shadow-lg hover:shadow-xl hover:scale-105 transform">
                Notify Me
              </button>
            </div>
            <p className="text-sm text-white/80 mt-4 font-medium">We all never spam you. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
