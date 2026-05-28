"use client"

import type React from "react"
import { useState } from "react"
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

export default function ContactUsPage() {
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
      const res = await fetch("/api/contact", {
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
      items: ["info@mjengoconnect.com", "mjengoconnect@gmail.com"],
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
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow pt-20">
        <section className="border-b border-slate-200 bg-white py-12 sm:py-14">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Support</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Contact us
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Have a question or need help with your account, listings, or hiring process? Our team is here to help.
            </p>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-slate-50 py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {contactCards.map((card) => {
                const Icon = card.icon
                return (
                  <div
                    key={card.title}
                    className="rounded-lg bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-orange-50 text-orange-600">
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

        <section className="bg-white py-12 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
              <div className="lg:col-span-3">
                <div className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Send a message</h2>
                    <p className="mt-2 text-slate-600 text-sm">
                      We usually reply within one business day.
                    </p>

                    {isSubmitted ? (
                      <div className="py-12 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
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
                                className="w-full rounded-md border border-slate-300 py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
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
                                className="w-full rounded-md border border-slate-300 py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
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
                                className="w-full rounded-md border border-slate-300 py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
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
                              className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
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
                              className="w-full resize-none rounded-md border border-slate-300 py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                              placeholder="How can we help?"
                            />
                          </div>
                        </div>

                        {submitError && (
                          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {submitError}
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex w-full min-w-[180px] items-center justify-center gap-2 rounded-md bg-slate-900 px-6 py-3.5 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
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

              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Get in touch
                  </h2>
                  <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                    Reach out for account help, listing support, partnership questions, or general feedback.
                  </p>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-orange-50 text-orange-600">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Response time</h3>
                      <p className="text-sm text-slate-600">Usually within one business day</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Urgent support</h3>
                      <p className="text-sm text-slate-600 mt-0.5">For urgent issues, call our hotline:</p>
                      <a
                        href="tel:+254700000000"
                        className="mt-2 inline-flex items-center gap-1.5 font-semibold text-orange-600 transition-colors hover:text-orange-700"
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
