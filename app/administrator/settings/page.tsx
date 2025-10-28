"use client"

import type React from "react"

import { useState, useEffect } from "react"
import AdminSidebar from "@/components/admin/Sidebar" // Added AdminSidebar import
import {
  Plus,
  Edit,
  Trash2,
  Menu,
  User,
  Shield,
  Crown,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react"
import AdminAuthService from "@/app/services/admin_auth"

interface AdminUser {
  id: string
  fullName: string
  email: string
  phone: string
  role: string
  status: string
  lastLogin: string
  createdAt: string
}

interface CurrentUser {
  id: string
  email: string
  fullName: string
  role: string
}

interface ValidationError {
  msg?: string
  message?: string
}

interface ApiErrorResponse {
  message?: string
  errors?: ValidationError[]
}

export default function AdminSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const [showEditUser, setShowEditUser] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  })

  const [editFormData, setEditFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  })

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/getAllAdmins", {
        headers: {
          "Content-Type": "application/json",
          ...AdminAuthService.getAuthHeaders(),
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || data)
      } else {
        const errorData = await response.json()
        setError(`Failed to fetch users: ${errorData.message || response.status}`)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      setError(`Network error while fetching users: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  useEffect(() => {
    if (!AdminAuthService.isAuthenticated()) {
      window.location.href = "/administrator/auth/login"
      return
    }

    if (!AdminAuthService.hasRole("SUPER_ADMIN")) {
      window.location.href = "/administrator/dashboard"
      return
    }

    const userData = AdminAuthService.getUserData()
    setCurrentUser(userData)

    fetchUsers()
  }, [])

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("http://localhost:5000/api/admin/createAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...AdminAuthService.getAuthHeaders(),
        },
        body: JSON.stringify(formData),
      })

      const data: ApiErrorResponse = await response.json()

      if (response.ok) {
        setTimeout(() => {
          setSuccess("Admin user created successfully!")
          setLoading(false)
          setFormData({
            fullName: "",
            email: "",
            phone: "",
            role: "",
            password: "",
          })
          setShowAddUser(false)
          fetchUsers()
          setTimeout(() => setSuccess(null), 5000)
        }, 4000)
      } else {
        setLoading(false)
        if (data.errors && Array.isArray(data.errors)) {
          setError(`Validation failed: ${data.errors.map((err: ValidationError) => err.msg || err.message).join(", ")}`)
        } else {
          setError(data.message || `Failed to create user (${response.status})`)
        }
      }
    } catch (error) {
      console.error("Create user error:", error)
      setError(`Network error while creating user: ${error instanceof Error ? error.message : "Unknown error"}`)
      setLoading(false)
    }
  }

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user)
    setEditFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      password: "", // Don't pre-fill password for security
    })
    setShowEditUser(true)
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    setEditLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const updateData: Partial<typeof editFormData> = { ...editFormData }
      if (!updateData.password) {
        delete (updateData as { password?: string }).password
      }

      const response = await fetch(`http://localhost:5000/api/admin/updateAdmin/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...AdminAuthService.getAuthHeaders(),
        },
        body: JSON.stringify(updateData),
      })

      const data: ApiErrorResponse = await response.json()

      if (response.ok) {
        setTimeout(() => {
          setSuccess("User updated successfully!")
          setEditLoading(false)
          setShowEditUser(false)
          setEditingUser(null)
          fetchUsers()
          setTimeout(() => setSuccess(null), 5000)
        }, 4000)
      } else {
        setEditLoading(false)
        if (data.errors && Array.isArray(data.errors)) {
          setError(`Update failed: ${data.errors.map((err: ValidationError) => err.msg || err.message).join(", ")}`)
        } else {
          setError(data.message || `Failed to update user (${response.status})`)
        }
      }
    } catch (error) {
      console.error("Update user error:", error)
      setError(`Network error while updating user: ${error instanceof Error ? error.message : "Unknown error"}`)
      setEditLoading(false)
    }
  }

  const handleDeleteUser = (user: AdminUser) => {
    setDeletingUser(user)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteUser = async () => {
    if (!deletingUser) return

    setDeleteLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`http://localhost:5000/api/admin/deleteAdmin/${deletingUser.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...AdminAuthService.getAuthHeaders(),
        },
      })

      const data = await response.json()

      if (response.ok) {
        setTimeout(() => {
          setSuccess("User deleted successfully!")
          setDeleteLoading(false)
          setShowDeleteConfirm(false)
          setDeletingUser(null)
          fetchUsers()
          setTimeout(() => setSuccess(null), 5000)
        }, 4000)
      } else {
        setDeleteLoading(false)
        setError(data.message || `Failed to delete user (${response.status})`)
      }
    } catch (error) {
      console.error("Delete user error:", error)
      setError(`Network error while deleting user: ${error instanceof Error ? error.message : "Unknown error"}`)
      setDeleteLoading(false)
    }
  }

  const canDeleteUser = (user: AdminUser) => {
    if (currentUser && user.email === currentUser.email) return false
    return user.role !== "SUPER_ADMIN"
  }

  const canEditUser = (user: AdminUser) => {
    if (user.role === "SUPER_ADMIN" && currentUser && user.email !== currentUser.email) return false
    return true
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    })
  }

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 8000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
      case "ADMIN":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "MODERATOR":
        return "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
      case "SUPPORT":
        return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
      default:
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return <Crown className="w-4 h-4" />
      case "ADMIN":
        return <Shield className="w-4 h-4" />
      case "MODERATOR":
        return <UserCheck className="w-4 h-4" />
      case "SUPPORT":
        return <User className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    return status === "ACTIVE"
      ? "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700"
      : "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:flex font-inter">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 lg:ml-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl mb-8 sm:mb-10 flex items-center justify-between px-6 sm:px-8 py-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-3 rounded-xl text-slate-700 hover:bg-white/60 transition-all duration-200 shadow-sm"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl sm:text-2xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  Admin Settings
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-bold">
                  Manage users and system configuration
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddUser(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add User</span>
            </button>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center text-green-800">
              <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="font-medium">{success}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-800">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Add User Modal */}
          {showAddUser && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl border border-white/30 w-full max-w-md">
                <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-3xl">
                  <h2 className="text-2xl font-black text-slate-900">Add New User</h2>
                  <p className="text-slate-600 font-medium">Create a new admin user account</p>
                </div>
                <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                      required
                    >
                      <option value="">Select role</option>
                      <option value="ADMIN">Admin</option>
                      <option value="MODERATOR">Moderator</option>
                      <option value="SUPPORT">Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium pr-12"
                        placeholder="Enter password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddUser(false)}
                      className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {loading ? "Creating..." : "Create User"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit User Modal */}
          {showEditUser && editingUser && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl border border-white/30 w-full max-w-md">
                <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-3xl">
                  <h2 className="text-2xl font-black text-slate-900">Edit User</h2>
                  <p className="text-slate-600 font-medium">Update user information</p>
                </div>
                <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={editFormData.fullName}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Role
                      {currentUser && editingUser.email === currentUser.email && editingUser.role === "SUPER_ADMIN" ? (
                        <span className="text-slate-500">(cannot change your own role)</span>
                      ) : (
                        <span className="text-slate-500">(leave empty to keep current)</span>
                      )}
                    </label>
                    <select
                      name="role"
                      value={editFormData.role}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                      disabled={
                        !!(currentUser && editingUser.email === currentUser.email && editingUser.role === "SUPER_ADMIN")
                      }
                    >
                      <option value="SUPER_ADMIN">Super Admin</option>
                      <option value="ADMIN">Admin</option>
                      <option value="MODERATOR">Moderator</option>
                      <option value="SUPPORT">Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Password <span className="text-slate-500">(leave empty to keep current)</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={editFormData.password}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium pr-12"
                        placeholder="Enter new password (optional)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditUser(false)
                        setEditingUser(null)
                      }}
                      className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={editLoading}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {editLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {editLoading ? "Updating..." : "Update User"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && deletingUser && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl border border-white/30 w-full max-w-md">
                <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-red-50 to-pink-50 rounded-t-3xl">
                  <h2 className="text-2xl font-black text-slate-900">Delete User</h2>
                  <p className="text-slate-600 font-medium">This action cannot be undone</p>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      {deletingUser.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{deletingUser.fullName}</h3>
                      <p className="text-sm font-medium text-slate-600">{deletingUser.email}</p>
                      <p className="text-xs font-medium text-slate-500">{deletingUser.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-700 mb-6">
                    Are you sure you want to delete this user? This will permanently remove their account and all
                    associated data.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteConfirm(false)
                        setDeletingUser(null)
                      }}
                      className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDeleteUser}
                      disabled={deleteLoading}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {deleteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {deleteLoading ? "Deleting..." : "Delete User"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Admin Users</h2>
              <div className="text-sm font-medium text-slate-600">{users.length} total users</div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full table-auto min-w-full">
                  <thead className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-white/30">
                    <tr>
                      <th className="text-left py-4 px-6 font-black text-slate-900">User Details</th>
                      <th className="text-left py-4 px-6 font-black text-slate-900 hidden md:table-cell">Contact</th>
                      <th className="text-left py-4 px-6 font-black text-slate-900">Role & Status</th>
                      <th className="text-left py-4 px-6 font-black text-slate-900 hidden lg:table-cell">Activity</th>
                      <th className="text-left py-4 px-6 font-black text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                              {user.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900">{user.fullName}</h3>
                              <p className="text-sm font-medium text-slate-600">{user.email}</p>
                              {currentUser && user.email === currentUser.email && (
                                <span className="text-xs font-bold text-purple-600">(You)</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden md:table-cell">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                              <Mail className="w-4 h-4 text-slate-400" />
                              <span className="font-medium text-slate-600">{user.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Phone className="w-4 h-4 text-slate-400" />
                              <span className="font-medium text-slate-600">{user.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-2">
                            <span
                              className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold ${getRoleColor(user.role)}`}
                            >
                              {getRoleIcon(user.role)}
                              <span>{user.role.replace("_", " ")}</span>
                            </span>
                            <div>
                              <span
                                className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(user.status)}`}
                              >
                                {user.status}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden lg:table-cell">
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <span className="font-medium text-slate-600">
                                Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-slate-400" />
                              <span className="font-medium text-slate-600">
                                Created: {new Date(user.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            {canEditUser(user) && (
                              <button
                                onClick={() => handleEditUser(user)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-md hover:shadow-lg"
                                title="Edit user"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            {canDeleteUser(user) && (
                              <button
                                onClick={() => handleDeleteUser(user)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
                                title="Delete user"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                            {!canEditUser(user) && !canDeleteUser(user) && (
                              <span className="text-xs text-slate-400 font-medium">No actions</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}