"use client"
import { useState, useEffect } from "react"
import Sidebar from "@/components/fundi/Sidebar"
import FundiAuthService, { type FundiUserData } from "@/app/services/fundi_user"
import {
  CreditCard,
  CalendarCheck,
  CheckCircle,
  ShieldCheck,
  XCircle,
  Menu,
  Star,
  Zap,
  Award,
  ArrowRight,
  X,
  Smartphone,
  Globe,
  Loader2,
  Wallet,
} from "lucide-react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentSuccess: () => void
}

function PaymentModal({ isOpen, onClose, onPaymentSuccess }: PaymentModalProps) {
  const [walletBalance, setWalletBalance] = useState(0)
  const [isLoadingBalance, setIsLoadingBalance] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>("")

  const fetchWalletBalance = async () => {
    setIsLoadingBalance(true)
    try {
      const token = FundiAuthService.getToken()
      if (!token) return

      const response = await fetch("http://localhost:5000/api/fundi/wallet/balance", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setWalletBalance(data.data.balance || 0)
        }
      }
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error)
    } finally {
      setIsLoadingBalance(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchWalletBalance()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const handlePayment = async () => {
    setIsProcessing(true)
    setError("")

    try {
      const token = FundiAuthService.getToken()
      if (!token) {
        throw new Error("Authentication required")
      }

      // Check wallet balance
      if (walletBalance < 200) {
        setError(`Insufficient balance. You need KSh 200 but have KSh ${walletBalance.toFixed(2)}. Please add funds to your wallet.`)
        setIsProcessing(false)
        return
      }

      // Subscribe to premium (deducts 200 KES from wallet)
      const response = await fetch("http://localhost:5000/api/fundi/subscription/premium", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 402) {
          // Insufficient balance
          setError(errorData.message || "Insufficient wallet balance. Please add funds.")
          setIsProcessing(false)
          return
        }
        throw new Error(errorData.message || "Failed to subscribe to premium")
      }

      const data = await response.json()
      console.log("Subscription successful:", data)

      // Update local storage with the updated user data
      const currentUser = FundiAuthService.getUserData()
      if (currentUser && data.data?.fundi) {
        const updatedUser: FundiUserData = {
          ...currentUser,
          subscriptionPlan: data.data.fundi.subscriptionPlan,
          subscriptionStatus: data.data.fundi.subscriptionStatus,
          planStartDate: data.data.fundi.planStartDate,
          planEndDate: data.data.fundi.planEndDate,
        }
        FundiAuthService.saveUserData(updatedUser)
      }

      onPaymentSuccess()
      onClose()
    } catch (error) {
      console.error("Payment failed:", error)
      setError(error instanceof Error ? error.message : "Payment processing failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-900">Upgrade to Premium</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Premium Plan</h4>
            <p className="text-2xl font-black text-orange-600 mb-1">KSh 200/month</p>
            <p className="text-slate-600 text-sm">Unlimited access to all features</p>
          </div>

          {isLoadingBalance ? (
            <div className="text-center py-4">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-600" />
              <p className="text-sm text-slate-600 mt-2">Loading wallet balance...</p>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6 border-2 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Wallet Balance</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">
                      KSh {walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <Wallet className="w-8 h-8 text-blue-600" />
                </div>
                {walletBalance < 200 && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-sm text-yellow-800 font-medium">
                      ⚠️ Insufficient balance. You need KSh 200 to subscribe.
                    </p>
                    <button
                      onClick={() => {
                        onClose()
                        window.location.href = "/clientspace/fundi/wallet"
                      }}
                      className="mt-2 text-sm text-yellow-700 font-bold hover:underline"
                    >
                      Add Funds to Wallet →
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-800 font-medium">{error}</p>
                  {error.includes("Insufficient") && (
                    <button
                      onClick={() => {
                        onClose()
                        window.location.href = "/clientspace/fundi/wallet"
                      }}
                      className="mt-2 text-sm text-red-700 font-bold hover:underline"
                    >
                      Add Funds to Wallet →
                    </button>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing || walletBalance < 200}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white rounded-xl font-bold hover:from-orange-600 hover:via-pink-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Subscribe KSh 200"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SubscriptionPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<FundiUserData | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [subscriptionUpdated, setSubscriptionUpdated] = useState(false)
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingDetails(true)
      const userData = FundiAuthService.getUserData()
      if (userData) {
        setCurrentUser(userData)
      }

      // Fetch subscription details from API
      try {
        const token = FundiAuthService.getToken()
        if (token) {
          const response = await fetch("http://localhost:5000/api/fundi/subscription/details", {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (response.ok) {
            const data = await response.json()
            if (data.success && data.data) {
              setSubscriptionDetails(data.data)
              // Update local user data with latest subscription info
              if (userData) {
                const updatedUser: FundiUserData = {
                  ...userData,
                  subscriptionPlan: data.data.currentPlan,
                  subscriptionStatus: data.data.subscriptionStatus,
                  planStartDate: data.data.planStartDate,
                  planEndDate: data.data.planEndDate,
                }
                FundiAuthService.saveUserData(updatedUser)
                setCurrentUser(updatedUser)
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch subscription details:", error)
      } finally {
        setIsLoadingDetails(false)
      }
    }
    loadData()
  }, [subscriptionUpdated])

  const handlePaymentSuccess = () => {
    setSubscriptionUpdated(!subscriptionUpdated)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return "Invalid date"
    }
  }

  const getSubscriptionStatus = () => {
    if (!currentUser) return "Unknown"

    // Account status is always active since they opened an account
    if (currentUser.subscriptionStatus === "ACTIVE" && currentUser.subscriptionPlan === "PREMIUM") {
      return "Premium Active"
    } else if (currentUser.subscriptionStatus === "TRIAL" || currentUser.subscriptionPlan === "TRIAL") {
      return "Trial"
    } else {
      return "Active"
    }
  }

  const getCurrentPlan = () => {
    if (!currentUser) return "Free Plan"

    if (currentUser.subscriptionPlan === "PREMIUM") {
      return "Premium Plan"
    } else if (currentUser.subscriptionStatus === "TRIAL" || currentUser.subscriptionPlan === "TRIAL") {
      return "Trial Plan"
    } else {
      return "Free Plan"
    }
  }

  const getAmountPaid = () => {
    if (subscriptionDetails?.totalPaid !== undefined) {
      return `KSh ${subscriptionDetails.totalPaid.toLocaleString()}`
    }
    return "KSh 0"
  }

  const getNextBillingDate = () => {
    if (subscriptionDetails?.nextBillingDate) {
      return formatDate(subscriptionDetails.nextBillingDate)
    }
    if (!currentUser || currentUser.subscriptionPlan !== "PREMIUM") {
      return "Not applicable"
    }
    return "Not set"
  }

  const currentSubscription = {
    plan: getCurrentPlan(),
    status: getSubscriptionStatus(),
    amountPaid: getAmountPaid(),
    nextBillingDate: getNextBillingDate(),
  }

  const plans = [
    {
      name: "Free Plan",
      price: "KSh 0",
      features: ["Limited Jobs contact Views", "Basic support", "Ads shown"],
      icon: XCircle,
      bg: "bg-gradient-to-br from-slate-50 to-slate-100",
      color: "text-slate-600",
      borderColor: "border-slate-200",
      buttonBg: "bg-gradient-to-r from-slate-500 to-slate-600",
      buttonHoverBg: "hover:from-slate-600 hover:to-slate-700",
      isCurrent:
        currentUser?.subscriptionPlan === "FREE" ||
        (!currentUser?.subscriptionPlan && currentUser?.subscriptionStatus !== "TRIAL"),
    },
    {
      name: "Premium Plan",
      price: "KSh 200/month",
      features: ["Unlimited Jobs contact Views", "Priority support", "No ads", "Access to All jobs"],
      icon: ShieldCheck,
      bg: "bg-gradient-to-br from-orange-50 to-pink-50",
      color: "text-orange-600",
      borderColor: "border-orange-200",
      buttonBg: "bg-gradient-to-r from-orange-500 via-pink-500 to-red-500",
      buttonHoverBg: "hover:from-orange-600 hover:via-pink-600 hover:to-red-600",
      recommended: true,
      isCurrent: currentUser?.subscriptionPlan === "PREMIUM",
    },
  ]

  const handleUpgrade = (planName: string) => {
    if (planName === "Premium Plan" && currentUser?.subscriptionPlan !== "PREMIUM") {
      setShowPaymentModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:flex font-inter">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <div className="flex-1 lg:ml-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl mb-8 sm:mb-10 flex items-center justify-between px-6 sm:px-8 py-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-3 rounded-xl text-slate-700 hover:bg-white/60 transition-all duration-200 shadow-sm"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-2xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  Welcome{" "}
                  {currentUser?.firstName && currentUser?.lastName
                    ? `${currentUser.firstName} ${currentUser.lastName}`
                    : currentUser?.firstName || currentUser?.lastName || "User"}
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-extrabold">
                  Manage your subscription and unlock premium features
                </p>
              </div>
            </div>
          </div>

          {/* Current Subscription */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-6 sm:p-8 mb-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Current Subscription</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-4 sm:p-5 border-2 border-indigo-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-start">
                <ShieldCheck className="w-6 h-6 mr-3 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">Plan</p>
                  <p className="text-lg sm:text-xl font-black text-slate-900">{currentSubscription.plan}</p>
                </div>
              </div>

              <div
                className={`bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 sm:p-5 border-2 border-emerald-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-start`}
              >
                <CheckCircle className="w-6 h-6 mr-3 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">Status</p>
                  <p className="text-lg sm:text-xl font-black text-slate-900">{currentSubscription.status}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-2xl p-4 sm:p-5 border-2 border-violet-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-start">
                <CreditCard className="w-6 h-6 mr-3 text-violet-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Amount Paid
                  </p>
                  <p className="text-lg sm:text-xl font-black text-slate-900">{currentSubscription.amountPaid}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-4 sm:p-5 border-2 border-amber-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-start">
                <CalendarCheck className="w-6 h-6 mr-3 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Next Billing
                  </p>
                  <p className="text-lg sm:text-xl font-black text-slate-900">{currentSubscription.nextBillingDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Plans */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Available Plans</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {plans.map((plan, index) => {
                const Icon = plan.icon

                return (
                  <div
                    key={index}
                    className={`relative rounded-3xl border-2 ${plan.borderColor} p-6 sm:p-8 shadow-xl ${plan.bg} hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${
                      plan.recommended ? "ring-4 ring-orange-300/50" : ""
                    } ${plan.isCurrent ? "ring-4 ring-green-300/50" : ""} group`}
                  >
                    {plan.recommended && !plan.isCurrent && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                        Recommended
                      </div>
                    )}

                    {plan.isCurrent && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                        Current Plan
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            plan.recommended || plan.isCurrent
                              ? "bg-gradient-to-br from-orange-500 to-pink-500"
                              : "bg-white/60"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 ${plan.recommended || plan.isCurrent ? "text-white" : plan.color}`}
                          />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{plan.name}</h3>
                      </div>
                      {(plan.recommended || plan.isCurrent) && (
                        <Award className={`w-6 h-6 ${plan.isCurrent ? "text-green-500" : "text-orange-500"}`} />
                      )}
                    </div>

                    <div className="mb-6">
                      <p
                        className={`text-2xl sm:text-3xl font-black mb-2 ${
                          plan.recommended || plan.isCurrent ? "text-orange-600" : "text-slate-900"
                        }`}
                      >
                        {plan.price}
                      </p>
                      <p className="text-slate-600 font-medium text-sm sm:text-base">
                        {plan.recommended ? "Premium access" : "Basic access"}
                      </p>
                    </div>

                    <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-slate-700 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle
                            className={`w-5 h-5 mr-3 mt-0.5 ${
                              plan.recommended || plan.isCurrent ? "text-orange-500" : "text-emerald-500"
                            } flex-shrink-0`}
                          />
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className={`w-full py-3 sm:py-4 px-6 text-white rounded-2xl font-bold text-base sm:text-lg ${
                        plan.isCurrent
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 cursor-default"
                          : `${plan.buttonBg} ${plan.buttonHoverBg}`
                      } transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                        !plan.isCurrent ? "group-hover:scale-105" : ""
                      }`}
                      onClick={() => handleUpgrade(plan.name)}
                      disabled={plan.isCurrent}
                    >
                      {plan.isCurrent ? "Current Plan" : plan.recommended ? "Upgrade Now" : "Select Plan"}
                      {!plan.isCurrent && (
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-6 sm:p-8 mt-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Subscription Benefits</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/60 rounded-2xl p-5 sm:p-6 border border-white/40 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Premium Support</h3>
                <p className="text-slate-600 text-sm sm:text-base">
                  Get priority access to our customer support team with faster response times.
                </p>
              </div>

              <div className="bg-white/60 rounded-2xl p-5 sm:p-6 border border-white/40 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Unlimited Access</h3>
                <p className="text-slate-600 text-sm sm:text-base">
                  View contact details for all job listings without restrictions.
                </p>
              </div>

              <div className="bg-white/60 rounded-2xl p-5 sm:p-6 border border-white/40 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Ad-Free Experience</h3>
                <p className="text-slate-600 text-sm sm:text-base">
                  Enjoy a clean, distraction-free interface without advertisements.
                </p>
              </div>

              <div className="bg-white/60 rounded-2xl p-5 sm:p-6 border border-white/40 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Early Access</h3>
                <p className="text-slate-600 text-sm sm:text-base">
                  Get notified about new job opportunities before they are publicly available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
