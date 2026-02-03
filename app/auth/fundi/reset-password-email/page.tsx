"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Lock, ArrowRight } from "lucide-react"
import Header from "@/components/landingpage/Header"
import Footer from "@/components/landingpage/Footer"
import Toast from "@/components/ui/Toast"
import Link from "next/link"

export default function FundiResetPasswordEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState("")
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
  const [tokenChecked, setTokenChecked] = useState(false)

  useEffect(() => {
    const t = searchParams.get("token")
    setToken(t ? decodeURIComponent(t) : "")
    setTokenChecked(true)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setToast(null)

    if (!token.trim()) {
      setError("Invalid or missing reset link. Please request a new one from the login page.")
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
      const response = await fetch("http://localhost:5000/api/fundi/reset-password-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim(), newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed.")
      }

      setToast({
        message: data.message || "Password has been reset. You can now log in.",
        type: "success",
      })
      setTimeout(() => {
        router.push("/auth/job-listing")
      }, 2000)
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!tokenChecked) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-20 bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-500 border-t-transparent mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-20 bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid reset link</h2>
            <p className="text-gray-600 mb-6">
              This link is missing or invalid. Please request a new password reset from the login page.
            </p>
            <Link
              href="/auth/job-listing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
            >
              Back to login
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <main className="flex-grow pt-20 bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Set new password</h2>
          <p className="text-gray-600 text-center mb-8">
            Enter your new password below. This link can only be used once.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                New password
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
                  placeholder="At least 6 characters"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm new password
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
                  placeholder="Confirm password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirmNewPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  Reset password
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            <Link href="/auth/job-listing" className="text-orange-600 hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
