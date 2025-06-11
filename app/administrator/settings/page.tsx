"use client"

import { useState } from "react"
import AdminSidebar from "@/components/admin/Sidebar"
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
} from "lucide-react"

export default function AdminSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const users = [
    {
      id: 1,
      name: "John Admin",
      email: "john@mjengo.com",
      role: "super_admin",
      status: "active",
      lastLogin: "2024-01-20 14:30",
      createdAt: "2024-01-01",
      phone: "+254 712 345 678",
    },
    {
      id: 2,
      name: "Sarah Manager",
      email: "sarah@mjengo.com",
      role: "admin",
      status: "active",
      lastLogin: "2024-01-20 12:15",
      createdAt: "2024-01-05",
      phone: "+254 723 456 789",
    },
    {
      id: 3,
      name: "Mike Moderator",
      email: "mike@mjengo.com",
      role: "moderator",
      status: "active",
      lastLogin: "2024-01-19 16:45",
      createdAt: "2024-01-10",
      phone: "+254 734 567 890",
    },
    {
      id: 4,
      name: "Grace Support",
      email: "grace@mjengo.com",
      role: "support",
      status: "inactive",
      lastLogin: "2024-01-18 10:20",
      createdAt: "2024-01-15",
      phone: "+254 745 678 901",
    },
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
      case "admin":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "moderator":
        return "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
      case "support":
        return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
      default:
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "super_admin":
        return <Crown className="w-4 h-4" />
      case "admin":
        return <Shield className="w-4 h-4" />
      case "moderator":
        return <UserCheck className="w-4 h-4" />
      case "support":
        return <User className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active"
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

          {/* Add User Modal */}
          {showAddUser && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl border border-white/30 w-full max-w-md">
                <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-3xl">
                  <h2 className="text-2xl font-black text-slate-900">Add New User</h2>
                  <p className="text-slate-600 font-medium">Create a new admin user account</p>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Role</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium">
                      <option value="">Select role</option>
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                      <option value="support">Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium pr-12"
                        placeholder="Enter password"
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
                </div>
                <div className="p-6 border-t border-slate-200 flex gap-3">
                  <button
                    onClick={() => setShowAddUser(false)}
                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-lg">
                    Create User
                  </button>
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
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900">{user.name}</h3>
                              <p className="text-sm font-medium text-slate-600">{user.email}</p>
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
                              <span>{user.role.replace("_", " ").toUpperCase()}</span>
                            </span>
                            <div>
                              <span
                                className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(user.status)}`}
                              >
                                {user.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden lg:table-cell">
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <span className="font-medium text-slate-600">Last login: {user.lastLogin}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-slate-400" />
                              <span className="font-medium text-slate-600">Created: {user.createdAt}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100">
                              <Edit className="w-4 h-4 text-slate-600" />
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
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
