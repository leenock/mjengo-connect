"use client";

import type React from "react";
import Link from "next/link";


import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  CheckCircle,
  MapPin,
  Briefcase,
  Star,
  Clock,
  DollarSign,
} from "lucide-react";
import Header from "@/components/landingpage/Header";
import Footer from "@/components/landingpage/Footer";

export default function JobListingPage() {
  const [currentView, setCurrentView] = useState<"auth" | "listings">("auth");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    phone: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    email: "",
    phone: "",
    location: "",
    skills: "",
    experience: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setCurrentView("listings");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setCurrentView("listings");
  };

  // Mock job listings data
  const jobListings = [
    {
      id: 1,
      title: "House Painting - 3 Bedroom",
      location: "Westlands, Nairobi",
      budget: "KSh 45,000 - 60,000",
      skills: ["Painting", "Interior Design"],
      postedTime: "2 hours ago",
      urgency: "Urgent",
      description:
        "Need experienced painter for 3-bedroom house interior and exterior painting.",
    },
    {
      id: 2,
      title: "Plumbing Repair - Kitchen & Bathroom",
      location: "Karen, Nairobi",
      budget: "KSh 15,000 - 25,000",
      skills: ["Plumbing", "Pipe Fitting"],
      postedTime: "5 hours ago",
      urgency: "Normal",
      description:
        "Fix leaking pipes in kitchen and bathroom. Replace some fittings.",
    },
    {
      id: 3,
      title: "Electrical Wiring - New Construction",
      location: "Kiambu, Kiambu County",
      budget: "KSh 80,000 - 120,000",
      skills: ["Electrical", "Wiring"],
      postedTime: "1 day ago",
      urgency: "Normal",
      description:
        "Complete electrical wiring for new 4-bedroom house construction.",
    },
    {
      id: 4,
      title: "Carpentry - Custom Kitchen Cabinets",
      location: "Kilimani, Nairobi",
      budget: "KSh 35,000 - 50,000",
      skills: ["Carpentry", "Cabinet Making"],
      postedTime: "2 days ago",
      urgency: "Normal",
      description:
        "Design and build custom kitchen cabinets for modern kitchen.",
    },
  ];

  if (currentView === "listings") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-20 bg-gray-50">
          {/* Welcome Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold mb-4">
                  Welcome Back, Fundi!
                </h1>
                <p className="text-white/90">
                  Find your next construction project and grow your business.
                </p>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Jobs
                </h2>
                <p className="text-gray-600">
                  {jobListings.length} jobs available in your area
                </p>
              </div>
              <div className="flex gap-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
                  <option>All Skills</option>
                  <option>Painting</option>
                  <option>Plumbing</option>
                  <option>Electrical</option>
                  <option>Carpentry</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
                  <option>All Locations</option>
                  <option>Nairobi</option>
                  <option>Kiambu</option>
                  <option>Mombasa</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobListings.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {job.title}
                        </h3>
                        {job.urgency === "Urgent" && (
                          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                            Urgent
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.postedTime}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-green-600 font-bold mb-1">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {job.budget}
                      </div>
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        <span className="text-gray-600 text-sm">4.8</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{job.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-orange-100 text-orange-600 text-sm font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                      Apply Now
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-200">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-semibold transition-all duration-300 hover:border-orange-300 hover:text-orange-600 hover:shadow-lg">
                Load More Jobs
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

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
                  Join thousands of skilled fundis earning good money through
                  verified construction projects across Kenya.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Browse Listings
                    </h3>
                    <p className="text-gray-600">
                      Posted Job gets listed on the platform for fundis to
                      browse and contact you.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Connect & get to Work
                    </h3>
                    <p className="text-gray-600">
                      Contact employers and clients directly to discuss the job
                      and get started.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold">500+</div>
                  <div>
                    <div className="font-semibold">Active Jobs</div>
                    <div className="text-white/80 text-sm">
                      Available this month
                    </div>
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
                    authMode === "login"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthMode("signup")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base ${
                    authMode === "signup"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <span className="hidden sm:inline">Join as Fundi</span>
                  <span className="sm:hidden">Sign Up</span>
                </button>
              </div>

              {/* Login Form */}
              {authMode === "login" && (
                <>
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="phone"
                          required
                          value={loginData.phone}
                          onChange={(e) =>
                            setLoginData({
                              ...loginData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          placeholder="Phone Number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={loginData.password}
                          onChange={(e) =>
                            setLoginData({
                              ...loginData,
                              password: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Remember me
                        </span>
                      </label>
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Forgot password?
                      </Link>
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
                          Sign In to View Jobs Contacts
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </button>
                  </form>
                </>
              )}

              {/* Signup Form */}
              {authMode === "signup" && (
                <form onSubmit={handleSignup} className="space-y-6">
                  {/* Two-column layout for desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Email Address - Left column */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address (Optional)
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={signupData.email}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              email: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    {/* Phone Number - Right column */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          required
                          value={signupData.phone}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          placeholder="+254 700 123 456"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location field - Full width */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={signupData.location}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            location: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="e.g., Nairobi, Westlands"
                      />
                    </div>
                  </div>

                  {/* Skills and Experience - Two columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Skill
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          required
                          value={signupData.skills}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              skills: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        >
                          <option value="">Select your skill</option>
                          <option value="masonry">Masonry</option>
                          <option value="painting">Painting</option>
                          <option value="plumbing">Plumbing</option>
                          <option value="electrical">Electrical</option>
                          <option value="carpentry">Carpentry</option>
                          <option value="welding">Welding</option>
                          <option value="roofing">Roofing</option>
                          <option value="tiling">Tiling</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience Level
                      </label>
                      <div className="relative">
                        <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          required
                          value={signupData.experience}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              experience: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        >
                          <option value="">Select experience</option>
                          <option value="beginner">Beginner (0-2 years)</option>
                          <option value="intermediate">
                            Intermediate (3-5 years)
                          </option>
                          <option value="experienced">
                            Experienced (6-10 years)
                          </option>
                          <option value="expert">Expert (10+ years)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Password - Two columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={signupData.password}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              password: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password - Right column */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={signupData.confirmPassword}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Terms checkbox - Full width */}
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      required
                      checked={signupData.agreeToTerms}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          agreeToTerms: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
                    />
                    <label className="ml-3 text-sm text-gray-600">
                      I agree to the{" "}
                      <button
                        type="button"
                        className="text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        className="text-orange-600 hover:text-orange-700 font-medium"
                      >
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
  );
}
