"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  User,
  MessageSquare,
  Headphones,
} from "lucide-react"
import Header from "@/components/landingpage/Header"
import Footer from "@/components/landingpage/Footer"
import { API_URL } from "@/app/config"

export default function ContactUsPage() {
  const [visible, setVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          subject: formData.subject,
          message: formData.message,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setSubmitError(data.message || "Something went wrong. Please try again.")
        return
      }
      setIsSubmitted(true)
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      setTimeout(() => setIsSubmitted(false), 4000)
    } catch {
      setSubmitError("Could not send your message. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactCards = [
    {
      icon: Phone,
      title: "Phone",
      items: ["+254 735520926"],
    },
    {
      icon: Mail,
      title: "Email",
      items: ["info@mjengoconnect.com", "support@mjengoconnect.com"],
    },
    {
      icon: MapPin,
      title: "Office",
      items: ["Nairobi, Kenya"],
    },
    {
      icon: Clock,
      title: "Hours",
      items: ["Mon – Fri: 8AM – 6PM", "Sat: 9AM – 4PM"],
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow pt-20">
        {/* Hero */}
        <section className="relative py-16 sm:py-20 bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(251,146,60,0.12),transparent)]" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Contact us
            </h1>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              Have a question or need help? We’re here to support you with the platform, your account, or finding the right fundi.
            </p>
          </div>
        </section>

        {/* Contact cards */}
        <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {contactCards.map((card, i) => {
                const Icon = card.icon
                return (
                  <div
                    key={card.title}
                    className={`rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition-all duration-500 ${
                      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    } hover:border-slate-300 hover:bg-slate-50`}
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="mt-4 text-sm font-semibold text-slate-900 uppercase tracking-wider">
                      {card.title}
                    </h2>
                    <ul className="mt-2 space-y-1">
                      {card.items.map((item, j) => (
                        <li key={j} className="text-slate-600 text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Form + sidebar */}
        <section ref={sectionRef} className="py-16 sm:py-20 lg:py-24 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
              {/* Form */}
              <div className="lg:col-span-3">
                <div
                  className={`transition-all duration-600 ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                >
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      Send a message
                    </h2>
                    <p className="mt-2 text-slate-600 text-sm">
                      We’ll get back to you within 24 hours on business days.
                    </p>

                    {isSubmitted ? (
                      <div className="py-12 text-center">
                        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                          <CheckCircle className="w-7 h-7" />
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-slate-900">
                          Message sent
                        </h3>
                        <p className="mt-2 text-slate-600 text-sm">
                          Thanks for reaching out. We’ll be in touch soon.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                              Full name *
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="Your name"
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                              Email *
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="you@example.com"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                              Phone
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="+254 700 000 000"
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1.5">
                              Subject *
                            </label>
                            <select
                              id="subject"
                              name="subject"
                              value={formData.subject}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                            >
                              <option value="">Select subject</option>
                              <option value="general">General inquiry</option>
                              <option value="services">Services</option>
                              <option value="support">Technical support</option>
                              <option value="partnership">Partnership</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Message *
                          </label>
                          <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <textarea
                              id="message"
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              required
                              rows={4}
                              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                              placeholder="How can we help?"
                            />
                          </div>
                        </div>

                        {submitError && (
                          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                            {submitError}
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full sm:w-auto min-w-[180px] px-6 py-3.5 rounded-xl bg-amber-500 text-white font-semibold shadow-lg shadow-amber-500/20 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none transition-colors inline-flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Sending…
                            </>
                          ) : (
                            <>
                              Send message
                              <Send className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-2 space-y-6">
                <div
                  className={`transition-all duration-600 delay-100 ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                >
                  <h2 className="text-lg font-bold text-slate-900">
                    Get in touch
                  </h2>
                  <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                    Whether you need a skilled fundi, want to post a job, or have feedback — we’d love to hear from you.
                  </p>
                </div>

                <div
                  className={`rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-600 delay-150 ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Response time</h3>
                      <p className="text-sm text-slate-600">Usually 2–4 hours during business hours</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-600 delay-200 ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Urgent support</h3>
                      <p className="text-sm text-slate-600 mt-0.5">For urgent issues, call our hotline:</p>
                      <a
                        href="tel:+254700000000"
                        className="mt-2 inline-flex items-center gap-1.5 text-amber-600 font-semibold hover:text-amber-700"
                      >
                        <Phone className="w-4 h-4" />
                        +254 735520926
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
