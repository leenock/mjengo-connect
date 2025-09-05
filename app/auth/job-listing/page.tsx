"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Mail, Lock, Phone, ArrowRight, MapPin, Briefcase, Star, DollarSign, User } from "lucide-react"
import Header from "@/components/landingpage/Header"
import Footer from "@/components/landingpage/Footer"
import { useRouter } from "next/navigation"
import Toast from "@/components/ui/Toast"
import FundiAuthService from "@/app/services/fundi_user"
import { validateFundiForm, hasFormErrors, type FundiFormData } from "@/app/utils/fundi_validation"

export default function JobListingPage() {
  const [mounted, setMounted] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)

  const router = useRouter()

  const [loginData, setLoginData] = useState({
    emailOrPhone: "",
    password: "",
  })

  const [signupData, setSignupData] = useState<FundiFormData>({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    location: "",
    primary_skill: "",
    experience_level: "",
    biography: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  useEffect(() => {
    setMounted(true)
    // Redirect if already authenticated
    if (FundiAuthService.isAuthenticated()) {
      router.push("/clientspace/fundi/job-listings")
    }
  }, [router])

  if (!mounted) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    if (authMode === "signup") {
      if (type === "checkbox") {
        const checked = (e.target as HTMLInputElement).checked
        setSignupData((prev) => ({ ...prev, [name]: checked }))
      } else {
        setSignupData((prev) => ({ ...prev, [name]: value }))
      }
    } else if (authMode === "login") {
      setLoginData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setToast(null)

    try {
      const response = await fetch("http://localhost:5000/api/fundi/loginFundi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrPhone: loginData.emailOrPhone,
          password: loginData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      const { token, user } = data
      if (!token || !user) {
        throw new Error("Invalid server response. Missing token or user data.")
      }

      // Store token and user data
      FundiAuthService.setAuth(token, user)

      // Show success toast
      setToast({
        message: "Login successful! Redirecting ....",
        type: "success",
      })

      // Delay for user to see success feedback
      setTimeout(() => {
        router.push("/clientspace/fundi/job-listings")
      }, 1000)
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred during login."
      console.error("Login error:", error)
      setToast({
        message,
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setToast(null)

    // Client-side validation
    const validationErrors = validateFundiForm(signupData)
    if (hasFormErrors(validationErrors)) {
      const allErrors = Object.values(validationErrors).filter(Boolean).join(" | ")
      setError(allErrors)
      return
    }

    setIsLoading(true)

    try {
      // Prepare data for API (remove confirmPassword and agreeToTerms)
      const apiData = {
        email: signupData.email || undefined,
        phone: signupData.phone,
        firstName: signupData.firstName || undefined,
        lastName: signupData.lastName || undefined,
        location: signupData.location,
        primary_skill: signupData.primary_skill,
        experience_level: signupData.experience_level.toUpperCase(),
        biography: signupData.biography || undefined,
        password: signupData.password,
      }

      const response = await fetch("http://localhost:5000/api/fundi/registerFundi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Account creation failed")
      }

      // Show success toast
      setToast({
        message: "Account created successfully! Please login to continue.",
        type: "success",
      })

      // Clear form fields
      setSignupData({
        email: "",
        phone: "",
        firstName: "",
        lastName: "",
        location: "",
        primary_skill: "",
        experience_level: "",
        biography: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
      })

      // Switch to login mode
      setAuthMode("login")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again."
      console.error("Signup error:", error)
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="flex-grow pt-20 bg-gradient-to-br from-orange-50 via-white to-yellow-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Marketing Content for Fundis */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Find Your Next
                  <span className="text-orange-600"> Construction Job</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Join thousands of skilled fundis earning good money through verified construction projects across
                  Kenya.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Job Listings</h3>
                    <p className="text-gray-600">
                      Access hundreds of verified construction jobs posted by trusted employers across Kenya.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect & Get to Work</h3>
                    <p className="text-gray-600">
                      Contact employers and clients directly to discuss the job and get started on your next project.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Build Your Reputation</h3>
                    <p className="text-gray-600">
                      Complete jobs successfully and build a strong profile to attract more clients.
                    </p>
                  </div>
                </div>
              </div>           
            </div>

            {/* Right Side - Auth Forms */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
              {/* Auth Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
                <button
                  onClick={() => setAuthMode("login")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base ${
                    authMode === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthMode("signup")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base ${
                    authMode === "signup" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <span className="hidden sm:inline">Join as Fundi</span>
                  <span className="sm:hidden">Sign Up</span>
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg mb-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                  <button onClick={() => setError(null)} className="text-white ml-4 hover:text-gray-300">
                    &times;
                  </button>
                </div>
              )}

              {/* Login Form */}
              {authMode === "login" && (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email or Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="emailOrPhone"
                        required
                        value={loginData.emailOrPhone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="Email or Phone Number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        value={loginData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="Enter your password"
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

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <button type="button" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Signing In...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Sign In to Browse Jobs
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </button>
                </form>
              )}

              {/* Signup Form */}
              {authMode === "signup" && (
                <form onSubmit={handleSignup} className="space-y-6">
                  {/* Two-column layout for desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Email Address - Left column */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address (Optional)</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={signupData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    {/* Phone Number - Right column */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={signupData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          placeholder="0700 123 456"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Names - Two columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name (Optional)</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="firstName"
                          value={signupData.firstName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          placeholder="First name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name (Optional)</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="lastName"
                          value={signupData.lastName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          placeholder="Last name"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location field - Full width */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="location"
                        required
                        value={signupData.location}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="e.g., Nairobi, Westlands"
                      />
                    </div>
                  </div>

                  {/* Skills and Experience - Two columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary Skill</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="primary_skill"
                          required
                          value={signupData.primary_skill}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          placeholder="e.g., Plumbing, Electrical, Masonry"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                      <div className="relative">
                        <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="experience_level"
                          required
                          value={signupData.experience_level}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none"
                        >
                          <option value="">Select experience</option>
                          <option value="BEGINNER">Beginner (0-2 years)</option>
                          <option value="INTERMEDIATE">Intermediate (3-5 years)</option>
                          <option value="EXPERIENCED">Experienced (6-10 years)</option>
                          <option value="EXPERT">Expert (10+ years)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Biography - Full width */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Biography (Optional)</label>
                    <textarea
                      name="biography"
                      value={signupData.biography}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                      placeholder="Tell us about your skills and experience..."
                    />
                  </div>

                  {/* Password - Two columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          required
                          value={signupData.password}
                          onChange={handleChange}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          placeholder="Create a strong password"
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

                    {/* Confirm Password - Right column */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          required
                          value={signupData.confirmPassword}
                          onChange={handleChange}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          placeholder="Confirm your password"
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
                  </div>

                  {/* Terms checkbox - Full width */}
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      required
                      checked={signupData.agreeToTerms}
                      onChange={handleChange}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
                    />
                    <label className="ml-3 text-sm text-gray-600">
                      I agree to the{" "}
                      <button type="button" className="text-orange-600 hover:text-orange-700 font-medium">
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button type="button" className="text-orange-600 hover:text-orange-700 font-medium">
                        Privacy Policy
                      </button>
                    </label>
                  </div>

                  {/* Submit button - Full width */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating Account...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Join as Fundi
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
