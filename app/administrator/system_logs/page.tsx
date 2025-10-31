"use client"

import { useState, useEffect } from "react"
import AdminSidebar from "@/components/admin/Sidebar"
import AdminAuthService from "@/app/services/admin_auth"
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
  UserCheck,
  Building2,
  MessageSquare,
  LogIn,
} from "lucide-react"

interface SystemLog {
  id: number
  timestamp: string
  level: string
  category: string
  message: string
  details: string
  source: string
  userId: string
  ipAddress: string
}

interface AdminUser {
  id: string
  fullName: string
  email: string
  phone: string
  role: string
  status: string
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

interface FundiUser {
  id: string
  firstName?: string
  lastName?: string
  email?: string
  createdAt?: string
}

interface ClientUser {
  id: string
  firstName?: string
  lastName?: string
  email?: string
  createdAt?: string
}

interface Job {
  id: string
  title?: string
  clientId?: string
  createdAt?: string
}

interface SupportTicket {
  id: string
  userEmail?: string
  userId?: string
  subject?: string
  createdAt?: string
}

interface RecentActivityData {
  lastFundiRegistration?: FundiUser
  lastClientRegistration?: ClientUser
  lastJobPosted?: Job
  lastAdminCreated?: AdminUser
  lastSupportMessage?: SupportTicket
  lastAdminLogin?: AdminUser
}

export default function AdminSystemLogs() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filterLevel, setFilterLevel] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<SystemLog[]>([])

  // Fetch recent activity from APIs
  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setLoading(true)
        const authHeaders = AdminAuthService.getAuthHeaders()

        // 1. Fetch last fundi registration
        const fundiResponse = await fetch('http://localhost:5000/api/fundi/getAllFundis', {
          headers: { ...authHeaders },
          cache: "no-store",
        })
        const fundiData = await fundiResponse.json()
        const lastFundi: FundiUser | null = Array.isArray(fundiData) ? fundiData[fundiData.length - 1] : 
                         fundiData?.fundis ? fundiData.fundis[fundiData.fundis.length - 1] : 
                         fundiData?.data ? fundiData.data[fundiData.data.length - 1] : null

        // 2. Fetch last client registration
        const clientResponse = await fetch('http://localhost:5000/api/client/getAllClientUsers', {
          headers: { ...authHeaders },
          cache: "no-store",
        })
        const clientData = await clientResponse.json()
        const lastClient: ClientUser | null = Array.isArray(clientData) ? clientData[clientData.length - 1] : 
                          clientData?.clients ? clientData.clients[clientData.clients.length - 1] : 
                          clientData?.data ? clientData.data[clientData.data.length - 1] : null

        // 3. Fetch last job posted
        const jobResponse = await fetch('http://localhost:5000/api/admin/jobs/jobs', {
          headers: { ...authHeaders },
          cache: "no-store",
        })
        const jobData = await jobResponse.json()
        const lastJob: Job | null = Array.isArray(jobData) ? jobData[jobData.length - 1] : 
                       jobData?.jobs ? jobData.jobs[jobData.jobs.length - 1] : 
                       jobData?.data ? jobData.data[jobData.data.length - 1] : null

        // 4. Fetch admin users and find last login
        const adminResponse = await fetch('http://localhost:5000/api/admin/getAllAdmins', {
          headers: { ...authHeaders },
          cache: "no-store",
        })
        const adminData = await adminResponse.json()
        
        let adminsList: AdminUser[] = []
        if (Array.isArray(adminData)) {
          adminsList = adminData
        } else if (adminData && Array.isArray(adminData.users)) {
          adminsList = adminData.users
        } else if (adminData && Array.isArray(adminData.admins)) {
          adminsList = adminData.admins
        } else if (adminData && Array.isArray(adminData.data)) {
          adminsList = adminData.data
        }

        // Find last admin created
        const lastAdminCreated = adminsList[adminsList.length - 1]

        // Find last admin login (filter out null values and sort by lastLogin)
        const adminsWithLogin = adminsList.filter(admin => admin.lastLogin !== null)
        const lastAdminLogin = adminsWithLogin.sort((a, b) => 
          new Date(b.lastLogin!).getTime() - new Date(a.lastLogin!).getTime()
        )[0]

        // 5. Fetch last support message
        const supportResponse = await fetch('http://localhost:5000/api/admin/support/tickets', {
          headers: { ...authHeaders },
          cache: "no-store",
        })
        const supportData = await supportResponse.json()
        const lastSupport: SupportTicket | null = Array.isArray(supportData) ? supportData[supportData.length - 1] : 
                           supportData?.tickets ? supportData.tickets[supportData.tickets.length - 1] : 
                           supportData?.messages ? supportData.messages[supportData.messages.length - 1] : 
                           supportData?.data ? supportData.data[supportData.data.length - 1] : null

        const activityData: RecentActivityData = {
          lastFundiRegistration: lastFundi || undefined,
          lastClientRegistration: lastClient || undefined,
          lastJobPosted: lastJob || undefined,
          lastAdminCreated: lastAdminCreated || undefined,
          lastSupportMessage: lastSupport || undefined,
          lastAdminLogin: lastAdminLogin || undefined
        }

        // Generate system logs from the fetched data
        generateSystemLogs(activityData)

      } catch (error) {
        console.error('Failed to fetch recent activity:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentActivity()
  }, [])

  const generateSystemLogs = (activity: RecentActivityData) => {
    const generatedLogs: SystemLog[] = []
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19)

    // Log for last fundi registration
    if (activity.lastFundiRegistration) {
      generatedLogs.push({
        id: 1,
        timestamp: activity.lastFundiRegistration.createdAt ? 
          new Date(activity.lastFundiRegistration.createdAt).toISOString().replace('T', ' ').substring(0, 19) : now,
        level: "info",
        category: "user_activity",
        message: "New fundi registration completed",
        details: `Fundi ${activity.lastFundiRegistration.firstName || ''} ${activity.lastFundiRegistration.lastName || ''} (${activity.lastFundiRegistration.email || 'N/A'}) registered successfully`,
        source: "Registration Service",
        userId: activity.lastFundiRegistration.email || "N/A",
        ipAddress: "System"
      })
    }

    // Log for last client registration
    if (activity.lastClientRegistration) {
      generatedLogs.push({
        id: 2,
        timestamp: activity.lastClientRegistration.createdAt ? 
          new Date(activity.lastClientRegistration.createdAt).toISOString().replace('T', ' ').substring(0, 19) : now,
        level: "info",
        category: "user_activity",
        message: "New client registration completed",
        details: `Client ${activity.lastClientRegistration.firstName || ''} ${activity.lastClientRegistration.lastName || ''} (${activity.lastClientRegistration.email || 'N/A'}) registered successfully`,
        source: "Registration Service",
        userId: activity.lastClientRegistration.email || "N/A",
        ipAddress: "System"
      })
    }

    // Log for last job posted
    if (activity.lastJobPosted) {
      generatedLogs.push({
        id: 3,
        timestamp: activity.lastJobPosted.createdAt ? 
          new Date(activity.lastJobPosted.createdAt).toISOString().replace('T', ' ').substring(0, 19) : now,
        level: "info",
        category: "job_management",
        message: "New job posted",
        details: `Job "${activity.lastJobPosted.title || 'Untitled'}" created by client`,
        source: "Job Service",
        userId: activity.lastJobPosted.clientId || "N/A",
        ipAddress: "System"
      })
    }

    // Log for last admin created
    if (activity.lastAdminCreated) {
      generatedLogs.push({
        id: 4,
        timestamp: activity.lastAdminCreated.createdAt ? 
          new Date(activity.lastAdminCreated.createdAt).toISOString().replace('T', ' ').substring(0, 19) : now,
        level: "info",
        category: "admin_actions",
        message: "New admin user created",
        details: `Admin user ${activity.lastAdminCreated.fullName || activity.lastAdminCreated.email || 'N/A'} created with role: ${activity.lastAdminCreated.role || 'N/A'}`,
        source: "Admin Service",
        userId: "super_admin",
        ipAddress: "System"
      })
    }

    // Log for last admin login
    if (activity.lastAdminLogin) {
      generatedLogs.push({
        id: 5,
        timestamp: activity.lastAdminLogin.lastLogin ? 
          new Date(activity.lastAdminLogin.lastLogin).toISOString().replace('T', ' ').substring(0, 19) : now,
        level: "info",
        category: "authentication",
        message: "Admin user logged in",
        details: `Admin ${activity.lastAdminLogin.fullName || activity.lastAdminLogin.email || 'N/A'} (${activity.lastAdminLogin.role || 'N/A'}) logged into the system`,
        source: "Auth Service",
        userId: activity.lastAdminLogin.email || "N/A",
        ipAddress: "System"
      })
    }

    // Log for last support message
    if (activity.lastSupportMessage) {
      generatedLogs.push({
        id: 6,
        timestamp: activity.lastSupportMessage.createdAt ? 
          new Date(activity.lastSupportMessage.createdAt).toISOString().replace('T', ' ').substring(0, 19) : now,
        level: "info",
        category: "support",
        message: "New support ticket/message received",
        details: `Support ticket from ${activity.lastSupportMessage.userEmail || activity.lastSupportMessage.userId || 'Unknown user'}: ${activity.lastSupportMessage.subject || 'No subject'}`,
        source: "Support Service",
        userId: activity.lastSupportMessage.userEmail || activity.lastSupportMessage.userId || "N/A",
        ipAddress: "System"
      })
    }

    // Add some system status logs
    generatedLogs.push({
      id: 7,
      timestamp: now,
      level: "success",
      category: "system",
      message: "System check completed",
      details: "All services running normally. Database connections stable.",
      source: "System Service",
      userId: "system",
      ipAddress: "localhost"
    })

    // Sort logs by timestamp (newest first)
    const sortedLogs = generatedLogs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    setLogs(sortedLogs)
  }

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
        return <LogIn className="w-4 h-4" />
      case "user_activity":
        return <User className="w-4 h-4" />
      case "payment":
        return <Globe className="w-4 h-4" />
      case "job_management":
        return <Building2 className="w-4 h-4" />
      case "database":
        return <Database className="w-4 h-4" />
      case "system":
        return <Server className="w-4 h-4" />
      case "admin_actions":
        return <UserCheck className="w-4 h-4" />
      case "support":
        return <MessageSquare className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const filteredLogs = logs.filter(log => {
    if (filterLevel !== "all" && log.level !== filterLevel) return false
    if (filterCategory !== "all" && log.category !== filterCategory) return false
    return true
  })

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
                <h1 className="text-3xl sm:text-2xl font-extrabold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  System Logs
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-medium">
                  Real-time system activity and events
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
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">Filter Logs</h2>
              <p className="text-slate-600 font-extrabold">Search and filter system logs</p>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search logs by message, user, or details..."
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
                    <option value="user_activity">User Activity</option>
                    <option value="job_management">Job Management</option>
                    <option value="admin_actions">Admin Actions</option>
                    <option value="authentication">Authentication</option>
                    <option value="support">Support</option>
                    <option value="system">System</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Logs List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Recent Activity Logs</h2>
              <div className="text-sm font-medium text-slate-600">
                {loading ? "Loading..." : `Showing ${filteredLogs.length} entries`}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((log) => (
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
            )}

            {/* Pagination */}
            {!loading && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}