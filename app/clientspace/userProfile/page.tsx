"use client"
import { useState } from "react"
import Sidebar from "@/components/job_posting/Sidebar";
import { Menu, User, Mail, Phone, MapPin, Lock, Save, Eye, EyeOff, Camera, Building2 } from "lucide-react"

export default function EmployerProfileSettings() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Kamau",
    email: "kamau@gmail.com",
    phone: "+254 712 345 678",
    location: "Nairobi, Kenya",
    company: "Kamau Properties Ltd",
    password: "",
    confirmPassword: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)

    // Validate passwords match if they're being updated
    if (profileData.password && profileData.password !== profileData.confirmPassword) {
      alert("Passwords do not match!")
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      console.log("Profile updated:", profileData)
      alert("Profile updated successfully!")
      setIsLoading(false)
      // Clear password fields after successful update
      setProfileData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }))
    }, 1500)
  }

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
                <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  Profile Settings
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-extrabold">Update your account information</p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-6 sm:p-8">
            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-8 pb-6 border-b border-slate-200">
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center text-white hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-lg group-hover:scale-110">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <p className="text-slate-600 text-lg font-medium mt-1">{profileData.company}</p>
                <p className="text-slate-500 text-sm mt-1">{profileData.email}</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="w-full px-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 hover:border-slate-300"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="w-full px-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 hover:border-slate-300"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                    Company/Organization
                  </label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 group-hover:border-slate-300"
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Contact Information</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 group-hover:border-slate-300"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 group-hover:border-slate-300"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                      Location
                    </label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 group-hover:border-slate-300"
                        placeholder="Enter your location"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Change Password</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                      New Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={profileData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="w-full pl-12 pr-14 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 group-hover:border-slate-300"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={profileData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="w-full pl-12 pr-14 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 group-hover:border-slate-300"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-500 mt-3">
                  Leave password fields empty if you don not want to change your password.
                </p>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-10 flex justify-center">
              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white font-bold text-lg rounded-2xl hover:from-orange-600 hover:via-pink-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-105 transform"
              >
                <Save className="w-6 h-6" />
                {isLoading ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
