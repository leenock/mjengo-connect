"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Crown } from "lucide-react"
import { useRouter } from "next/navigation" // Import useRouter

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false) // New loading state
  const router = useRouter() // Initialize useRouter

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true) // Set loading to true when login starts
    console.log("Login attempt with:", { email, password })

    // Simulate a 5-second loading time
    setTimeout(() => {
      setLoading(false) // Set loading to false after delay
      router.push("/administrator/dashboard") // Redirect to dashboard
    }, 5000) // 5000 milliseconds = 5 seconds
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1567954970774-58d6aa6c50dc?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?height=1080&width=1920')`,
      }}
    >
      {/* Overlay for glassy effect */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10 w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Crown className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Admin Login</h1>
          <p className="text-slate-200 text-center">Access your MJENGO Admin Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-white mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-slate-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-white mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-slate-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={loading} // Disable button when loading
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white mr-3"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/auth/forgot-password" className="text-indigo-300 hover:underline font-semibold">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  )
}
