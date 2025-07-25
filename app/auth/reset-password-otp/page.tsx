"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Lock, Phone, ArrowRight } from "lucide-react"
import Header from "@/components/landingpage/Header"
import Footer from "@/components/landingpage/Footer"
import Toast from "@/components/ui/Toast"

export default function ResetPasswordOtpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)

  useEffect(() => {
    const phoneFromParams = searchParams.get("phone")
    if (phoneFromParams) {
      setPhoneNumber(decodeURIComponent(phoneFromParams))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setToast(null)

    if (!phoneNumber.trim() || !otp.trim() || !newPassword.trim() || !confirmNewPassword.trim()) {
      setError("All fields are required.")
      return
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.")
      return
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call to verify OTP and reset password
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Resetting password with:", { phoneNumber, otp, newPassword })

      // In a real application, you would send this data to your backend:
      // const response = await fetch("http://localhost:5000/api/client/auth/reset-password-otp", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ phoneNumber, otp, newPassword }),
      // });
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || "Password reset failed.");
      // }

      setToast({
        message: "Password reset successfully! You can now log in with your new password.",
        type: "success",
      })
      setTimeout(() => {
        router.push("/auth/job-posting") // Redirect to login page
      }, 2000)
    } catch (err) {
      console.error("Error resetting password:", err)
      const message = err instanceof Error ? err.message : "An unexpected error occurred during password reset."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <main className="flex-grow pt-20 bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Reset Password</h2>
          <p className="text-gray-600 text-center mb-8">Enter the OTP sent to your phone and your new password.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="phoneNumber"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-gray-50"
                  placeholder="0700 123 456"
                  readOnly // Phone number is pre-filled, make it read-only
                />
              </div>
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
                OTP Code
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                />
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmNewPassword"
                  type={showConfirmNewPassword ? "text" : "password"}
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12" />
                  </svg>
                  <span>{error}</span>
                </div>
                <button onClick={() => setError(null)} className="text-white ml-4 hover:text-gray-300">
                  &times;
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
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

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => router.push("/auth/job-posting")}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
