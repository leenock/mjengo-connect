"use client"
import { useState } from "react"
import Sidebar from "@/components/fundi/Sidebar"
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
} from "lucide-react"

export default function SubscriptionPage() {
  const [isOpen, setIsOpen] = useState(false)

  const currentSubscription = {
    plan: "Premium",
    status: "Active",
    expiryDate: "2025-07-01",
    amountPaid: "KSh 200",
    nextBillingDate: "2025-07-01",
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
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:flex font-inter">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

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
                <h1 className="text-2xl sm:text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  Welcome Kamau
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-semibold">
                  Discover amazing opportunities and connect
                </p>
              </div>
            </div>
          </div>

          {/* Current Subscription */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 mb-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Current Subscription</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-4 border-2 border-indigo-200 shadow-lg flex items-center">
                <ShieldCheck className="w-8 h-8 mr-3 text-indigo-600" />
                <div>
                  <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Plan</p>
                  <p className="text-xl font-black text-slate-900">{currentSubscription.plan}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 border-2 border-emerald-200 shadow-lg flex items-center">
                <CheckCircle className="w-8 h-8 mr-3 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Status</p>
                  <p className="text-xl font-black text-slate-900">{currentSubscription.status}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-2xl p-4 border-2 border-violet-200 shadow-lg flex items-center">
                <CreditCard className="w-8 h-8 mr-3 text-violet-600" />
                <div>
                  <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Amount Paid</p>
                  <p className="text-xl font-black text-slate-900">{currentSubscription.amountPaid}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-4 border-2 border-amber-200 shadow-lg flex items-center">
                <CalendarCheck className="w-8 h-8 mr-3 text-amber-600" />
                <div>
                  <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Next Billing</p>
                  <p className="text-xl font-black text-slate-900">{currentSubscription.nextBillingDate}</p>
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
                    className={`relative rounded-3xl border-2 ${
                      plan.borderColor
                    } p-8 shadow-xl ${
                      plan.bg
                    } hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${
                      plan.recommended ? "ring-4 ring-orange-300/50" : ""
                    }`}
                  >
                    {plan.recommended && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                        Recommended
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            plan.recommended
                              ? "bg-gradient-to-br from-orange-500 to-pink-500"
                              : "bg-white/60"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 ${
                              plan.recommended ? "text-white" : plan.color
                            }`}
                          />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">
                          {plan.name}
                        </h3>
                      </div>
                      {plan.recommended && (
                        <Award className="w-6 h-6 text-orange-500" />
                      )}
                    </div>

                    <div className="mb-6">
                      <p
                        className={`text-3xl font-black mb-2 ${
                          plan.recommended
                            ? "text-orange-600"
                            : "text-slate-900"
                        }`}
                      >
                        {plan.price}
                      </p>
                      <p className="text-slate-600 font-medium">
                        {plan.recommended ? "Premium access" : "Basic access"}
                      </p>
                    </div>

                    <ul className="space-y-4 text-base text-slate-700 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle
                            className={`w-5 h-5 mr-3 ${
                              plan.recommended
                                ? "text-orange-500"
                                : "text-emerald-500"
                            }`}
                          />
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className={`w-full py-4 px-6 text-white rounded-2xl font-bold text-lg ${plan.buttonBg} ${plan.buttonHoverBg} transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2`}
                      onClick={() =>
                        alert(`Proceeding to payment for ${plan.name}`)
                      }
                    >
                      {plan.recommended ? "Upgrade Now" : "Select Plan"}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 mt-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Subscription Benefits</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Premium Support</h3>
                <p className="text-slate-600">
                  Get priority access to our customer support team with faster response times.
                </p>
              </div>

              <div className="bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Unlimited Access</h3>
                <p className="text-slate-600">View contact details for all job listings without restrictions.</p>
              </div>

              <div className="bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Ad-Free Experience</h3>
                <p className="text-slate-600">Enjoy a clean, distraction-free interface without advertisements.</p>
              </div>

              <div className="bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Early Access</h3>
                <p className="text-slate-600">
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
