"use client"
import { useState, useEffect } from "react"
import Sidebar from "@/components/job_posting/Sidebar"
import { Menu, User, Mail, Phone, MapPin, Lock, Save, Eye, EyeOff, Camera, Building2 } from "lucide-react"
import ClientAuthService, { type ClientUserData } from "@/app/services/client_user"
import Toast from "@/components/ui/Toast"

export default function EmployerProfileSettings() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<ClientUserData | null>(null)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error" | "loading"
  } | null>(null)

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    company: "",
    password: "",
    confirmPassword: "",
  })

  // Load user data on component mount
  useEffect(() => {
    const userData = ClientAuthService.getUserData()
    if (userData) {
      setCurrentUser(userData)
      setProfileData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        location: userData.location || "",
        company: userData.company || "",
        password: "",
        confirmPassword: "",
      })
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateProfileData = async (userId: string, data: Partial<ClientUserData>) => {
    const token = ClientAuthService.getToken()
    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`http://localhost:5000/api/client/updateClientUser/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update profile")
    }

    return response.json()
  }

  const updatePassword = async (passwordData: { identifier: string; newPassword: string }) => {
    const token = ClientAuthService.getToken()
    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch("http://localhost:5000/api/client/updatePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update password")
    }

    return response.json()
  }

  // Helper function to add minimum loading time
  const withMinimumLoadingTime = (asyncOperation: () => Promise<unknown>, minimumTime = 5000) => {
    const startTime = Date.now()

    return new Promise((resolve, reject) => {
      asyncOperation()
        .then((result) => {
          const elapsedTime = Date.now() - startTime
          const remainingTime = minimumTime - elapsedTime

          if (remainingTime > 0) {
            setTimeout(() => resolve(result), remainingTime)
          } else {
            resolve(result)
          }
        })
        .catch((error) => {
          const elapsedTime = Date.now() - startTime
          const remainingTime = minimumTime - elapsedTime

          if (remainingTime > 0) {
            setTimeout(() => reject(error), remainingTime)
          } else {
            reject(error)
          }
        })
    })
  }

  const handleSaveProfile = async () => {
    if (!currentUser?.id) {
      setToast({
        message: "User ID not found. Please log in again.",
        type: "error",
      })
      return
    }

    setIsLoading(true)

    // Show loading toast immediately
    setToast({
      message: "Saving your profile changes...",
      type: "loading",
    })

    try {
      // Validate passwords match if they're being updated
      if (profileData.password && profileData.password !== profileData.confirmPassword) {
        // Still wait minimum time even for validation errors
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setToast({
          message: "Passwords do not match!",
          type: "error",
        })
        setIsLoading(false)
        return
      }

      // Prepare profile data (excluding password fields)
      const profileUpdateData: Partial<ClientUserData> = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
        company: profileData.company,
      }

      // Update profile data with minimum loading time
      await withMinimumLoadingTime(() => updateProfileData(currentUser.id, profileUpdateData), 3000) // 3 seconds for profile update

      // Update password if provided
      if (profileData.password && profileData.password.trim() !== "") {
        const identifier = profileData.email || currentUser.email || currentUser.id

        if (!identifier) {
          throw new Error("No identifier found for password update")
        }

        // Update loading message for password change
        setToast({
          message: "Updating your password...",
          type: "loading",
        })

        await withMinimumLoadingTime(
          () =>
            updatePassword({
              identifier: identifier,
              newPassword: profileData.password,
            }),
          2000,
        ) // 2 seconds for password update
      }

      // Update local storage with new data
      const updatedUserData = { ...currentUser, ...profileUpdateData }
      ClientAuthService.saveUserData(updatedUserData)
      setCurrentUser(updatedUserData)

      // Show success toast
      setToast({
        message: "Profile updated successfully! All changes have been saved.",
        type: "success",
      })

      // Clear password fields after successful update
      setProfileData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }))
    } catch (error) {
      console.error("Error updating profile:", error)
      setToast({
        message: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state if user data hasn't loaded yet
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:flex font-inter">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Main Content */}
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
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-extrabold">
                  Update your account information
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
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
                        disabled={isLoading}
                        className="w-full px-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        disabled={isLoading}
                        className="w-full px-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        disabled={isLoading}
                        className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 group-hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          disabled={isLoading}
                          className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 group-hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          disabled={isLoading}
                          className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 group-hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          disabled={isLoading}
                          className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 group-hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          disabled={isLoading}
                          className="w-full pl-12 pr-14 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 group-hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                          disabled={isLoading}
                          className="w-full pl-12 pr-14 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 group-hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 mt-3">
                    Leave password fields empty if you do not want to change your password.
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
    </div>
  )
}
