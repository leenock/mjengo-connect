"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle2, XCircle, Menu, Send, MessageCircle, User } from "lucide-react"
import Sidebar from "@/components/job_posting/Sidebar"


export default function MessageAdminPage() {
  const [isOpen, setIsOpen] = useState(false) // State for sidebar visibility
  const [topic, setTopic] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<"success" | "error" | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmissionStatus(null)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate network delay
      console.log("Message submitted:", { topic, message })
      setSubmissionStatus("success")
      setTopic("")
      setMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
      setSubmissionStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-inter lg:flex">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 lg:ml-0">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="sticky top-0 z-30 mb-8 flex items-center justify-between rounded-2xl border border-white/20 bg-white/80 px-6 py-6 shadow-lg backdrop-blur-xl sm:mb-10 sm:px-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 text-slate-700 shadow-sm transition-all duration-200 hover:bg-white/60 rounded-xl lg:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-xl font-black leading-tight text-transparent sm:text-2xl">
                  Message Admin
                </h1>
                <p className="mt-2 text-base font-extrabold text-slate-600 sm:text-lg">
                  Send a message to our support team.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex w-full flex-col items-center justify-center rounded-3xl border border-white/30 bg-white/70 p-8 shadow-2xl backdrop-blur-xl">
            <div className="w-full max-w-lg">
              <div className="space-y-1 pb-6 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                  <div className="p-3 bg-blue-100 rounded-2xl">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Send Message to Admin</h2>
                </div>
                <p className="text-sm text-slate-600">Have a question or need support? Send us a message.</p>
              </div>
              
              <div className="grid gap-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-2">
                    <label
                      htmlFor="topic"
                      className="text-sm font-semibold leading-none text-slate-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Topic
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500">
                        <User className="h-5 w-5" />
                      </div>
                      <select
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                        className="flex h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 py-3 text-base ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:border-slate-400 focus:shadow-md appearance-none"
                      >
                        <option value="" disabled>
                          Select a topic
                        </option>
                        <option value="general-inquiry">General Inquiry</option>
                        <option value="technical-support">Technical Support</option>
                        <option value="billing-issue">Billing Issue</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-semibold leading-none text-slate-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Message
                    </label>
                    <div className="relative">
                      <textarea
                        id="message"
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={6}
                        required
                        className="flex min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm transition-all duration-200 hover:border-slate-400 focus:shadow-md"
                      />
                      <div className="absolute bottom-3 right-3 text-slate-400">
                        <MessageCircle className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="inline-flex h-12 w-full items-center justify-center whitespace-nowrap rounded-xl text-base font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-lg disabled:from-blue-400 disabled:to-indigo-500 mt-2 py-3 px-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </span>
                    )}
                  </button>
                </form>
                
                {submissionStatus === "success" && (
                  <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4 text-green-800 font-medium border border-green-200">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0" />
                    <span>Message sent successfully! We will get back to you soon.</span>
                  </div>
                )}
                {submissionStatus === "error" && (
                  <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-800 font-medium border border-red-200">
                    <XCircle className="h-6 w-6 flex-shrink-0" />
                    <span>Failed to send message. Please try again later.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}