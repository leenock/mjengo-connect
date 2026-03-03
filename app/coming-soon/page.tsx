"use client"

import { useState } from "react"
import Header from "@/components/landingpage/Header"
import Footer from "@/components/landingpage/Footer"
import { API_URL } from "@/app/config"
import { Smartphone, Bell, Mail, CheckCircle } from "lucide-react"

export default function ComingSoonPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stats = [
    { number: "200+", label: "Fundis" },
    { number: "500+", label: "Jobs" },
    { number: "24/7", label: "Support" },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <Header />

      {/* Hero */}
      <section className="relative pt-20 pb-16 lg:pt-24 lg:pb-24 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(251,146,60,0.15),transparent)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <p className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-slate-300 text-sm font-medium mb-6">
                <Bell className="w-4 h-4 text-amber-400" />
                Coming soon
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                MJENGO Connect
                <br />
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  mobile app
                </span>
              </h1>
              <p className="mt-5 text-lg text-slate-400 max-w-xl">
                Find jobs, message clients, and manage your work from your phone. Built for fundis on the go.
              </p>

              {/* Store badges */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <div className="inline-flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 cursor-not-allowed">
                  <svg className="w-8 h-8 text-slate-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className="text-left">
                    <span className="block text-[10px] leading-tight">Download on the</span>
                    <span className="block text-sm font-semibold">App Store</span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 cursor-not-allowed">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.21,13.18L17.89,12L20.21,10.82C20.53,10.1 20.82,10.81 20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"
                    />
                  </svg>
                  <div className="text-left">
                    <span className="block text-[10px] leading-tight">Get it on</span>
                    <span className="block text-sm font-semibold">Google Play</span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500">We’ll notify you when the app is ready to download.</p>
            </div>

            {/* Phone mockup – more appealing */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glow behind phone */}
                <div className="absolute inset-0 top-8 bg-gradient-to-b from-amber-500/20 to-orange-500/10 rounded-full blur-3xl scale-90" />
                {/* Device frame */}
                <div className="relative w-[280px] sm:w-[300px] mx-auto">
                  <div className="relative rounded-[2.75rem] p-2 bg-slate-800 shadow-2xl ring-1 ring-slate-700/50">
                    {/* Bezel */}
                    <div className="rounded-[2.25rem] overflow-hidden bg-slate-900 ring-1 ring-black/20">
                      {/* Dynamic Island style notch */}
                      <div className="h-7 flex items-center justify-center">
                        <div className="w-24 h-5 rounded-full bg-black" />
                      </div>
                      {/* Screen */}
                      <div className="aspect-[9/19] bg-gradient-to-b from-slate-800 to-slate-900">
                        <div className="h-full overflow-hidden flex flex-col">
                          {/* App icon + branding – hero of the screen */}
                          <div className="pt-8 pb-6 px-6 text-center">
                            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30 flex items-center justify-center ring-4 ring-amber-400/20">
                              <Smartphone className="w-10 h-10 text-white" />
                            </div>
                            <p className="mt-4 text-white font-bold text-lg tracking-tight">MJENGO Connect</p>
                            <p className="text-slate-400 text-xs font-medium">Construction jobs in your pocket</p>
                          </div>
                          {/* Mini job list preview */}
                          <div className="flex-1 px-4 space-y-2">
                            {["Painting • Westlands", "Plumbing • Karen", "Electrical • Kiambu"].map((job, i) => (
                              <div
                                key={i}
                                className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5"
                              >
                                <p className="text-white text-xs font-semibold truncate">{job}</p>
                                <p className="text-slate-500 text-[10px]">KSh 800 – 1,200 / day</p>
                              </div>
                            ))}
                          </div>
                          {/* Home indicator */}
                          <div className="pb-3 flex justify-center">
                            <div className="w-28 h-1 rounded-full bg-white/20" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">{s.number}</p>
                <p className="text-sm text-slate-500 font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notify CTA */}
      <section className="py-16 sm:py-20 bg-slate-900">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Get notified at launch
          </h2>
          <p className="mt-3 text-slate-400 text-sm">
            Be the first to know when the MJENGO Connect app is available for download.
          </p>

          {isSubmitted ? (
            <div className="mt-8 py-6 px-4 rounded-xl bg-slate-800/50 border border-slate-700 inline-flex items-center gap-3 text-emerald-400">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-medium">You&apos;re on the list! We&apos;ll email you when the app launches.</span>
            </div>
          ) : (
            <form
              className="mt-8 flex flex-col sm:flex-row gap-3"
              onSubmit={async (e) => {
                e.preventDefault()
                setError(null)
                const value = email.trim()
                if (!value) {
                  setError("Please enter your email.")
                  return
                }
                setIsSubmitting(true)
                try {
                  const res = await fetch(`${API_URL}/api/contact/notify`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: value }),
                  })
                  const data = await res.json().catch(() => ({}))
                  if (!res.ok) {
                    setError(data.message || "Something went wrong. Please try again.")
                    return
                  }
                  setIsSubmitted(true)
                  setEmail("")
                } catch {
                  setError("Could not sign up. Please try again.")
                } finally {
                  setIsSubmitting(false)
                }
              }}
            >
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-600 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-400 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
              >
                {isSubmitting ? "Sending…" : (
                  <>
                    <Mail className="w-4 h-4" />
                    Notify me
                  </>
                )}
              </button>
            </form>
          )}

          {error && (
            <p className="mt-3 text-amber-400 text-sm">{error}</p>
          )}
          <p className="mt-4 text-slate-500 text-xs">
            We’ll never spam you. Unsubscribe anytime.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
