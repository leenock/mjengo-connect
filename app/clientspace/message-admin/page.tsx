"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { CheckCircle2, XCircle, Menu, Send, MessageCircle, User } from "lucide-react"
import Sidebar from "@/components/job_posting/Sidebar"
import ClientAuthService, { type ClientUserData } from "@/app/services/client_user"
import Toast from "@/components/ui/Toast"
import { createSupportTicketSchema } from "@/server/utils/validation/supportTicketValidation"

export default function MessageAdminPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [category, setCategory] = useState("") // New Category field
  const [message, setMessage] = useState("")
  const [priority, setPriority] = useState("")
  const [subject, setSubject] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<"success" | "error" | null>(null)
  const [currentUser, setCurrentUser] = useState<ClientUserData | null>(null)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error" | "loading"
  } | null>(null)

  // Add new state variables for validation errors
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [priorityError, setPriorityError] = useState<string | null>(null)
  const [subjectError, setSubjectError] = useState<string | null>(null)
  const [messageError, setMessageError] = useState<string | null>(null)

  // Load user data on component mount
  useEffect(() => {
    const userData = ClientAuthService.getUserData()
    if (userData) {
      setCurrentUser(userData)
    } else {
      // Redirect to login if no user data found
      setToast({
        message: "Please log in to send a support ticket.",
        type: "error",
      })
    }
  }, [])

  // Helper function to add minimum loading time for better UX
  const withMinimumLoadingTime = (asyncOperation: () => Promise<unknown>, minimumTime = 2000) => {
    const startTime = Date.now()
    return new Promise((resolve, reject) => {
      asyncOperation()
        .then((result) => {
          const elapsedTime = Date.now() - startTime
          const remainingTime = minimumTime - elapsedTime
          if (remainingTime > 0) {
            setTimeout(() => resolve(result), remainingTime)
          } else {
            resolve(result)
          }
        })
        .catch((error) => {
          const elapsedTime = Date.now() - startTime
          const remainingTime = minimumTime - elapsedTime
          if (remainingTime > 0) {
            setTimeout(() => reject(error), remainingTime)
          } else {
            reject(error)
          }
        })
    })
  }

  const submitSupportTicket = async (ticketData: {
    category: string
    priority: string
    message: string
    subject: string
    clientId: string
  }) => {
    const token = ClientAuthService.getToken()
    if (!token) {
      throw new Error("No authentication token found")
    }
    const response = await fetch("http://localhost:5000/api/support/createTicket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ticketData),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || errorData.message || "Failed to submit support ticket")
    }
    return response.json()
  }

  // Modify handleSubmit function
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Clear previous errors
    setCategoryError(null)
    setPriorityError(null)
    setSubjectError(null)
    setMessageError(null)

    // Log currentUser to inspect its value before submission
    console.log("handleSubmit called. Current User:", currentUser)

    // More robust check for currentUser.id
    if (!currentUser || typeof currentUser.id !== "string" || currentUser.id.trim() === "") {
      setToast({
        message: "User ID not found or invalid. Please log in again.",
        type: "error",
      })
      console.error("Submission blocked: currentUser or currentUser.id is missing/invalid.", currentUser)
      return
    }

    // Prepare ticket data for validation
    const ticketData = {
      category: category.toUpperCase().replace("-", "_"), // Convert category to match backend enum
      priority: priority.toUpperCase(), // Convert priority to match backend enum
      message,
      subject,
      clientId: currentUser.id,
    }

    // Perform client-side validation using Joi schema
    const { error } = createSupportTicketSchema.validate(ticketData, { abortEarly: false })

    if (error) {
      // Map Joi errors to state variables
      error.details.forEach((detail) => {
        switch (detail.context?.key) {
          case "category":
            setCategoryError(detail.message)
            break
          case "priority":
            setPriorityError(detail.message)
            break
          case "subject":
            setSubjectError(detail.message)
            break
          case "message":
            setMessageError(detail.message)
            break
          default:
            // Handle other potential errors or log them
            console.error("Unhandled validation error:", detail.message)
        }
      })
      setToast({
        message: "Please correct the errors in the form.",
        type: "error",
      })
      return // Stop submission if validation fails
    }

    setIsSubmitting(true)
    setSubmissionStatus(null)
    // Show loading toast immediately
    setToast({
      message: "Sending your support ticket...",
      type: "loading",
    })
    try {
      console.log("Sending ticketData:", ticketData) // Log the data being sent

      // Submit ticket with minimum loading time for better UX
      await withMinimumLoadingTime(() => submitSupportTicket(ticketData), 2500)
      // Show success message
      setToast({
        message: "Support ticket submitted successfully! We will get back to you soon.",
        type: "success",
      })
      setSubmissionStatus("success")
      // Clear form fields
      setCategory("")
      setSubject("")
      setMessage("")
      setPriority("")
    } catch (error) {
      console.error("Failed to send support ticket:", error)
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send support ticket. Please try again later."
      setToast({
        message: errorMessage,
        type: "error",
      })
      setSubmissionStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state if user data hasn't loaded yet
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading user data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-inter lg:flex">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
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
            {/* User Info Display */}
            <div className="hidden sm:flex items-center gap-3 bg-white/60 rounded-xl px-4 py-2 border border-white/40">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-900">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-slate-600">{currentUser.email}</p>
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
                <p className="text-sm text-slate-600">
                  Have a question or need support? Send us a message and we all get back to you soon.
                </p>
              </div>
              <div className="grid gap-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Category Field */}
                  <div className="grid gap-2">
                    <label
                      htmlFor="category"
                      className="text-sm font-semibold leading-none text-slate-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Category
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500">
                        <MessageCircle className="h-5 w-5" />
                      </div>
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value)
                          setCategoryError(null) // Clear error on change
                        }}
                        required
                        disabled={isSubmitting}
                        className="flex h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 py-3 text-base ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:border-slate-400 focus:shadow-md appearance-none"
                      >
                        <option value="" disabled>
                          Select a category
                        </option>
                        <option value="general-inquiry">General Inquiry</option>
                        <option value="payment-issues">Payment Issues</option>
                        <option value="account-verification">Account Verification</option>
                        <option value="harassment-report">Harassment Report</option>
                        <option value="other">Other</option>
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg
                          className="h-5 w-5 text-slate-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {categoryError && <p className="text-red-500 text-sm mt-1">{categoryError}</p>}

                  <div className="grid gap-2">
                    <label htmlFor="priority" className="text-sm font-semibold text-slate-700">
                      Priority
                    </label>
                    <select
                      id="priority"
                      value={priority}
                      onChange={(e) => {
                        setPriority(e.target.value)
                        setPriorityError(null) // Clear error on change
                      }}
                      required
                      disabled={isSubmitting}
                      className="flex h-12 w-full rounded-xl border border-slate-300 bg-white pl-4 pr-4 py-3 text-base ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 shadow-sm hover:border-slate-400 focus:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="" disabled>
                        Select priority
                      </option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  {priorityError && <p className="text-red-500 text-sm mt-1">{priorityError}</p>}

                  <div className="grid gap-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-semibold leading-none text-slate-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Subject
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500">
                        <MessageCircle className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        id="subject"
                        placeholder="Brief description of your issue..."
                        value={subject}
                        onChange={(e) => {
                          setSubject(e.target.value)
                          setSubjectError(null) // Clear error on change
                        }}
                        required
                        disabled={isSubmitting}
                        className="flex h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 py-3 text-base ring-offset-background transition-all duration-200 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:border-slate-400 focus:shadow-md"
                      />
                    </div>
                  </div>
                  {subjectError && <p className="text-red-500 text-sm mt-1">{subjectError}</p>}

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
                        onChange={(e) => {
                          setMessage(e.target.value)
                          setMessageError(null) // Clear error on change
                        }}
                        rows={6}
                        required
                        disabled={isSubmitting}
                        minLength={10}
                        className="flex min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm transition-all duration-200 hover:border-slate-400 focus:shadow-md"
                      />
                      <div className="absolute bottom-3 right-3 text-slate-400">
                        <MessageCircle className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                  {messageError && <p className="text-red-500 text-sm mt-1">{messageError}</p>}
                  <button
                    type="submit"
                    className="inline-flex h-12 w-full items-center justify-center whitespace-nowrap rounded-xl text-base font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-lg disabled:from-blue-400 disabled:to-indigo-500 mt-2 py-3 px-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
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
                    <span>Support ticket submitted successfully! We will get back to you soon.</span>
                  </div>
                )}
                {submissionStatus === "error" && (
                  <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-800 font-medium border border-red-200">
                    <XCircle className="h-6 w-6 flex-shrink-0" />
                    <span>Failed to send support ticket. Please try again later.</span>
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
