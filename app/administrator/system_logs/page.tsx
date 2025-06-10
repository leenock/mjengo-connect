"use client"

import { useState } from "react"
import AdminSidebar from "@/components/admin/Sidebar"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Search,
  Download,
  Menu,
  Clock,
  User,
  Globe,
  Server,
  Database,
  Shield,
} from "lucide-react"

export default function AdminSystemLogs() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filterLevel, setFilterLevel] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")

  const logs = [
    {
      id: 1,
      timestamp: "2024-01-20 15:45:32",
      level: "error",
      category: "authentication",
      message: "Failed login attempt for user: admin@mjengo.com",
      details: "Invalid password provided. IP: 192.168.1.100",
      source: "Auth Service",
      userId: "admin",
      ipAddress: "192.168.1.100",
    },
    {
      id: 2,
      timestamp: "2024-01-20 15:44:18",
      level: "info",
      category: "user_activity",
      message: "New user registration completed",
      details: "User 'john.doe@email.com' successfully registered as Fundi",
      source: "Registration Service",
      userId: "john.doe@email.com",
      ipAddress: "41.90.64.15",
    },
    {
      id: 3,
      timestamp: "2024-01-20 15:43:05",
      level: "warning",
      category: "payment",
      message: "Payment processing delayed",
      details: "Payment gateway response time exceeded 30 seconds for transaction TX123456",
      source: "Payment Service",
      userId: "sarah.wilson@email.com",
      ipAddress: "197.248.12.45",
    },
    {
      id: 4,
      timestamp: "2024-01-20 15:42:12",
      level: "success",
      category: "job_management",
      message: "Job posting approved and published",
      details: "Job 'House Painting in Westlands' approved by admin and made live",
      source: "Job Service",
      userId: "admin",
      ipAddress: "192.168.1.100",
    },
    {
      id: 5,
      timestamp: "2024-01-20 15:41:33",
      level: "error",
      category: "database",
      message: "Database connection timeout",
      details: "Connection to primary database timed out after 30 seconds",
      source: "Database Service",
      userId: "system",
      ipAddress: "localhost",
    },
    {
      id: 6,
      timestamp: "2024-01-20 15:40:45",
      level: "info",
      category: "system",
      message: "Scheduled backup completed successfully",
      details: "Daily database backup completed. Size: 2.4GB, Duration: 15 minutes",
      source: "Backup Service",
      userId: "system",
      ipAddress: "localhost",
    },
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-700"
      case "warning":
        return "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700"
      case "info":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700"
      case "success":
        return "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700"
      default:
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700"
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <XCircle className="w-4 h-4" />
      case "warning":
        return <AlertTriangle className="w-4 h-4" />
      case "info":
        return <Info className="w-4 h-4" />
      case "success":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "authentication":
        return <Shield className="w-4 h-4" />
      case "user_activity":
        return <User className="w-4 h-4" />
      case "payment":
        return <Globe className="w-4 h-4" />
      case "job_management":
        return <Activity className="w-4 h-4" />
      case "database":
        return <Database className="w-4 h-4" />
      case "system":
        return <Server className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
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
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  System Logs
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-medium">
                  Monitor system activity and events
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-xl font-bold hover:from-slate-600 hover:to-slate-700 transition-all duration-200 shadow-lg">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export Logs</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden mb-8">
            <div className="p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-slate-50 to-slate-100">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Filter Logs</h2>
              <p className="text-slate-600 font-medium">Search and filter system logs</p>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search logs by message, user, or IP address..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent font-medium"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="w-full sm:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 font-medium"
                  >
                    <option value="all">All Levels</option>
                    <option value="error">Error</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                  </select>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full sm:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 font-medium"
                  >
                    <option value="all">All Categories</option>
                    <option value="authentication">Authentication</option>
                    <option value="user_activity">User Activity</option>
                    <option value="payment">Payment</option>
                    <option value="job_management">Job Management</option>
                    <option value="database">Database</option>
                    <option value="system">System</option>
                  </select>
                  <input
                    type="datetime-local"
                    className="w-full sm:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 font-medium"
                  />
                  <input
                    type="datetime-local"
                    className="w-full sm:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Logs List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Activity Logs</h2>
              <div className="text-sm font-medium text-slate-600">Showing {logs.length} entries</div>
            </div>

            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold ${getLevelColor(log.level)}`}
                            >
                              {getLevelIcon(log.level)}
                              <span>{log.level.toUpperCase()}</span>
                            </span>
                            <span className="px-3 py-1 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 text-xs font-bold rounded-full flex items-center space-x-1">
                              {getCategoryIcon(log.category)}
                              <span>{log.category.replace("_", " ").toUpperCase()}</span>
                            </span>
                          </div>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg mb-2">{log.message}</h3>
                        <p className="text-slate-600 font-medium mb-4">{log.details}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-600">{log.timestamp}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-600">
                              User: <span className="font-bold text-slate-900">{log.userId}</span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-600">
                              IP: <span className="font-bold text-slate-900">{log.ipAddress}</span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Server className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-600">
                              Source: <span className="font-bold text-slate-900">{log.source}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600">Show:</span>
                <select className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-500">
                  <option value="50">50 entries</option>
                  <option value="100">100 entries</option>
                  <option value="200">200 entries</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-white/70 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-white/90 transition-colors text-sm">
                  Previous
                </button>
                <span className="px-4 py-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-lg font-bold text-sm">
                  1
                </span>
                <button className="px-4 py-2 bg-white/70 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-white/90 transition-colors text-sm">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
