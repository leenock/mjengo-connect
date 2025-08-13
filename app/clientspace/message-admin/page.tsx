"use client"
import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { CheckCircle2, XCircle, Menu, Send, MessageCircle, User } from "lucide-react"
import Sidebar from "@/components/job_posting/Sidebar"
import ClientAuthService, { type ClientUserData } from "@/app/services/client_user"
import Toast from "@/components/ui/Toast"
import { createSupportTicketSchema } from "@/server/utils/validation/supportTicketValidation"


// Add this interface after the imports
interface SupportTicket {
  id: string
  category: string
  priority: string
  subject: string
  message: string
  status: string
  clientId: string
  adminResponse?: string
  createdAt: string
  updatedAt: string
  client?: {
    id: string
    email: string
    phone: string
    firstName: string
    lastName: string
    company: string
  }
}

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

  // Add these new state variables after the existing ones
  const [activeTab, setActiveTab] = useState<"submit" | "tickets">("submit")
  const [userTickets, setUserTickets] = useState<SupportTicket[]>([])
  const [isLoadingTickets, setIsLoadingTickets] = useState(false)
  const [ticketsError, setTicketsError] = useState<string | null>(null)
    const [isLoadingPage, setIsLoadingPage] = useState(true); // New state for page loading
  
      useEffect(() => {
        // Simulate initial page data loading
        const loadPageData = async () => {
          setIsLoadingPage(true);
          await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate a quick load
          // In a real app, you'd fetch the actual currentBalance here
          setIsLoadingPage(false);
        };
        loadPageData();
      }, []);

  const fetchUserTickets = useCallback(async () => {
    if (!currentUser?.id) return

    setIsLoadingTickets(true)
    setTicketsError(null)

    try {
      const token = ClientAuthService.getToken()
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`http://localhost:5000/api/support/getClientTickets/${currentUser.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch tickets")
      }

      const data = await response.json()
      setUserTickets(data.tickets || [])
    } catch (error) {
      console.error("Failed to fetch user tickets:", error)
      setTicketsError(error instanceof Error ? error.message : "Failed to fetch tickets")
    } finally {
      setIsLoadingTickets(false)
    }
  }, [currentUser?.id])

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

  // Add this useEffect after the existing useEffect
  useEffect(() => {
    if (activeTab === "tickets" && currentUser) {
      fetchUserTickets()
    }
  }, [activeTab, currentUser, fetchUserTickets])

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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      OPEN: { bg: "bg-blue-100", text: "text-blue-800", label: "Open" },
      IN_PROGRESS: { bg: "bg-yellow-100", text: "text-yellow-800", label: "In Progress" },
      RESOLVED: { bg: "bg-green-100", text: "text-green-800", label: "Resolved" },
      CLOSED: { bg: "bg-gray-100", text: "text-gray-800", label: "Closed" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.OPEN

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    )
  }
    if (isLoadingPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-slate-600">Loading page...</p>
        </div>
      </div>
    );
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
            <div className="w-full max-w-4xl">
              {/* Tab Navigation */}
              <div className="flex justify-center mb-6 sm:mb-8">
                <div className="flex bg-white/60 rounded-xl sm:rounded-2xl p-1 border border-white/40 w-full max-w-sm sm:max-w-none sm:w-auto">
                  <button
                    onClick={() => setActiveTab("submit")}
                    className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-200 ${
                      activeTab === "submit"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span className="sm:hidden">New Ticket</span>
                    <span className="hidden sm:inline">Submit New Ticket</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("tickets")}
                    className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-200 ${
                      activeTab === "tickets"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span className="sm:hidden">My Tickets</span>
                    <span className="hidden sm:inline">My Tickets</span>
                  </button>
                </div>
              </div>

              {/* Submit Ticket Tab */}
              {activeTab === "submit" && (
                <div className="max-w-lg mx-auto">
                  <div className="space-y-1 pb-6 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                      <div className="p-3 bg-blue-100 rounded-2xl">
                        <MessageCircle className="h-6 w-6 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">Send Message to Admin</h2>
                    </div>
                    <p className="text-sm text-slate-600">
                      Have a question or need support? Send us a message and we will get back to you soon.
                    </p>
                  </div>
                  <div className="grid gap-6">
                    {/* Keep the existing form here - no changes needed */}
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
              )}

              {/* My Tickets Tab */}
              {activeTab === "tickets" && (
                <div>
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                        <MessageCircle className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                          My Support Tickets
                        </h2>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm sm:text-lg px-4 sm:px-0">
                      Track the status and progress of your submitted tickets
                    </p>
                  </div>

                  {isLoadingTickets ? (
                    <div className="text-center py-12 sm:py-16">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-slate-200 border-t-blue-600 mx-auto mb-4 sm:mb-6"></div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 animate-pulse"></div>
                      </div>
                      <p className="text-slate-600 text-base sm:text-lg font-medium">Loading your tickets...</p>
                      <p className="text-slate-500 text-sm mt-2 px-4 sm:px-0">
                        Please wait while we fetch your support history
                      </p>
                    </div>
                  ) : ticketsError ? (
                    <div className="text-center py-16">
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-3xl p-8 max-w-md mx-auto shadow-lg">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <XCircle className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-red-900 mb-3">Unable to Load Tickets</h3>
                        <p className="text-red-700 font-medium mb-6">{ticketsError}</p>
                        <button
                          onClick={fetchUserTickets}
                          className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  ) : userTickets.length === 0 ? (
                    <div className="text-center py-12 sm:py-16">
                      <div className="bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-slate-200 rounded-2xl sm:rounded-3xl p-8 sm:p-12 max-w-sm sm:max-w-lg mx-auto shadow-xl">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-400 to-slate-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                          <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">
                          No Support Tickets Yet
                        </h3>
                        <p className="text-slate-600 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0">
                          You have not submitted any support tickets. When you need help, we are here for you!
                        </p>
                        <button
                          onClick={() => setActiveTab("submit")}
                          className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                        >
                          Submit Your First Ticket
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Tickets Header with Stats */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">Your Support History</h3>
                            <p className="text-slate-600 text-sm sm:text-base">
                              {userTickets.length} ticket{userTickets.length !== 1 ? "s" : ""} total
                            </p>
                          </div>
                          <div className="flex gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                            {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((status) => {
                              const count = userTickets.filter((ticket) => ticket.status === status).length
                              if (count === 0) return null
                              return (
                                <div key={status} className="text-center">
                                  <div className="text-lg sm:text-2xl font-bold text-slate-900">{count}</div>
                                  <div className="text-xs text-slate-600 capitalize">
                                    {status.replace("_", " ").toLowerCase()}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Tickets List */}
                      <div className="grid gap-4 sm:gap-6">
                        {userTickets.map((ticket, index) => (
                          <div
                            key={ticket.id}
                            className="group bg-white/80 backdrop-blur-sm border-2 border-white/60 rounded-2xl sm:rounded-3xl p-4 sm:p-8 hover:bg-white/95 hover:border-blue-200 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-[1.01] sm:hover:scale-[1.02]"
                            style={{
                              animationDelay: `${index * 100}ms`,
                              animation: "fadeInUp 0.6s ease-out forwards",
                            }}
                          >
                            {/* Ticket Header */}
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg"></div>
                                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2">
                                      {ticket.subject}
                                    </h3>
                                  </div>
                                  <div className="ml-5 sm:ml-0">{getStatusBadge(ticket.status)}</div>
                                </div>

                                {/* Ticket Meta Information */}
                                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm">
                                  <div className="flex items-center gap-2 bg-slate-100 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-2 w-fit">
                                    <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                                    <span className="font-medium text-slate-700 text-xs sm:text-sm">
                                      {ticket.category
                                        .replace(/_/g, " ")
                                        .toLowerCase()
                                        .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 bg-slate-100 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-2 w-fit">
                                    <div
                                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                                        ticket.priority === "URGENT"
                                          ? "bg-red-500"
                                          : ticket.priority === "HIGH"
                                            ? "bg-orange-500"
                                            : ticket.priority === "MEDIUM"
                                              ? "bg-yellow-500"
                                              : "bg-green-500"
                                      }`}
                                    ></div>
                                    <span className="font-medium text-slate-700 text-xs sm:text-sm">
                                      {ticket.priority} Priority
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 text-slate-600">
                                    <svg
                                      className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                    <span className="font-medium text-xs sm:text-sm">
                                      {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        ...(window.innerWidth >= 640 && {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        }),
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Ticket Message */}
                            <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
                              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                </div>
                                <span className="text-xs sm:text-sm font-semibold text-slate-700">Your Message</span>
                              </div>
                              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">{ticket.message}</p>
                            </div>

                            {/* Admin Response */}
                            {ticket.adminResponse && (
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                  </div>
                                  <div>
                                    <span className="text-xs sm:text-sm font-bold text-blue-900">Admin Response</span>
                                    <div className="text-xs text-blue-700">Support Team</div>
                                  </div>
                                </div>
                                <div className="bg-white/60 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
                                  <p className="text-blue-900 leading-relaxed font-medium text-sm sm:text-base">
                                    {ticket.adminResponse}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Ticket Footer */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200 gap-2 sm:gap-0">
                              <div className="text-xs text-slate-500">
                                Ticket ID: <span className="font-mono font-medium">{ticket.id.slice(-8)}</span>
                              </div>
                              <div className="text-xs text-slate-500">
                                Last updated:{" "}
                                {new Date(ticket.updatedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  ...(window.innerWidth >= 640 && {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }),
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
