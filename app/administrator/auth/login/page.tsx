"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Crown, Lock, Mail, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import AdminAuthService from "@/app/services/admin_auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (AdminAuthService.isAuthenticated()) {
      router.push("/administrator/dashboard")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Please enter both email and password.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://localhost:5000/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrPhone: email, password }),
      })

      const data = await response.json()
      console.log("Admin login response status:", response.status)
      console.log("Admin login response data:", data)

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      const token = data.token || data.accessToken
      const admin = data.admin || data.user || data.data

      if (!token || !admin) {
        throw new Error("Authentication failed. Invalid response from server.")
      }

      AdminAuthService.setAuth(token, admin)

      // Add a 6-second delay before redirecting
      setTimeout(() => {
        router.push("/administrator/dashboard")
      }, 6000) // 6000 milliseconds = 6 seconds
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred during login."
      console.error("Admin login error:", error)
      setError(message)
      setLoading(false) // Stop loading on error
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1567954970774-58d6aa6c50dc?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent"></div>

      <div className="absolute top-10 left-10 w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
      <div className="absolute top-1/4 right-10 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-700"></div>
      <div className="absolute bottom-10 right-1/3 w-1 h-1 bg-indigo-300 rounded-full animate-pulse delay-1500"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 transform transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl mb-4 border border-white/20">
              <Crown className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent mb-2">
              Admin Portal
            </h1>
            <p className="text-slate-200 text-sm font-medium">Secure access to your dashboard</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center text-red-100">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-xs font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-semibold text-white flex items-center">
                <Mail className="w-3 h-3 mr-2 text-indigo-300" />
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-white/30 bg-white/10 text-white placeholder-slate-300 focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 transition-all duration-300 outline-none text-sm"
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-semibold text-white flex items-center">
                <Lock className="w-3 h-3 mr-2 text-indigo-300" />
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-white/30 bg-white/10 text-white placeholder-slate-300 focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 transition-all duration-300 outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white font-bold text-sm shadow-xl hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-md flex items-center justify-center group"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
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
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <svg
                    className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

      

          <div className="mt-4 text-center text-xs text-slate-400">
            <p>© {new Date().getFullYear()} MJENGO Admin Portal</p>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <Lock className="w-3 h-3 text-green-400" />
            <span>Secure Connection</span>
          </div>
        </div>
      </div>
    </div>
  )
}