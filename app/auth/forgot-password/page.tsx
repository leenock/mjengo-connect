"use client"

import type React from "react"

import { useState } from "react"
import { Phone, ArrowRight, CheckCircle, ArrowLeft, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import Header from "@/components/landingpage/Header"
import Footer from "@/components/landingpage/Footer"

export default function ForgotPasswordPage() {
  const [currentStep, setCurrentStep] = useState<"phone" | "code" | "reset" | "success">("phone")
  const [isLoading, setIsLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [resetCode, setResetCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setCurrentStep("code")
    setCountdown(60) // Start 60 second countdown

    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setCurrentStep("reset")
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setCurrentStep("success")
  }

  const handleResendCode = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    setCountdown(60)

    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pt-20 bg-gradient-to-br from-orange-50 via-white to-yellow-50">
        <div className="max-w-md mx-auto px-6 py-12">
          {/* Back Button */}
          <div className="mb-8">
            <Link
              href="/job-listing"
              className="inline-flex items-center text-gray-600 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            {/* Step 1: Phone Number */}
            {currentStep === "phone" && (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-orange-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
                  <p className="text-gray-600">
                    Enter your phone number and we all send you a verification code to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSendCode} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="+254 700 123 456"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">We all send a 6-digit verification code to this number</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending Code...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Send Reset Code
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* Step 2: Verification Code */}
            {currentStep === "code" && (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-blue-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Enter Verification Code</h1>
                  <p className="text-gray-600">
                    We have sent a 6-digit code to <span className="font-semibold text-gray-900">{phoneNumber}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyCode} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-center text-2xl font-mono tracking-widest"
                      placeholder="000000"
                    />
                    <p className="text-xs text-gray-500 mt-2">Enter the 6-digit code sent to your phone</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || resetCode.length !== 6}
                    className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Verifying...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Verify Code
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </button>

                  {/* Resend Code */}
                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-sm text-gray-500">
                        Resend code in <span className="font-semibold text-orange-600">{countdown}s</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={isLoading}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50"
                      >
                        Didnt receive the code? Resend
                      </button>
                    )}
                  </div>

                  {/* Change Phone Number */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep("phone")}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Wrong phone number? Change it
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Step 3: Reset Password */}
            {currentStep === "reset" && (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-green-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Password</h1>
                  <p className="text-gray-600">Enter your new password to complete the reset process.</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="Enter new password"
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="Confirm new password"
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li className="flex items-center">
                        <CheckCircle
                          className={`w-3 h-3 mr-2 ${newPassword.length >= 8 ? "text-green-500" : "text-gray-300"}`}
                        />
                        At least 8 characters
                      </li>
                      <li className="flex items-center">
                        <CheckCircle
                          className={`w-3 h-3 mr-2 ${
                            newPassword === confirmPassword && newPassword.length > 0
                              ? "text-green-500"
                              : "text-gray-300"
                          }`}
                        />
                        Passwords match
                      </li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      isLoading ||
                      newPassword.length < 8 ||
                      newPassword !== confirmPassword ||
                      !newPassword ||
                      !confirmPassword
                    }
                    className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Resetting Password...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Reset Password
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* Step 4: Success */}
            {currentStep === "success" && (
              <>
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Successful!</h1>
                  <p className="text-gray-600 mb-8">
                    Your password has been successfully reset. You can now sign in with your new password.
                  </p>

                  <div className="space-y-4">
                    <Link
                      href="/job-listing"
                      className="block w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 text-center"
                    >
                      Sign In Now
                    </Link>
                    <Link
                      href="/listing"
                      className="block w-full px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-200 text-center"
                    >
                      Go to Job Listings
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Need help?{" "}
              <Link href="/contact" className="text-orange-600 hover:text-orange-700 font-medium">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
