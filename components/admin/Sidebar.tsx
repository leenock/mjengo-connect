"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import AdminAuthService from "@/app/services/admin_auth"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  BarChart3,
  Plus,
  Settings,
  Shield,
  MessageSquare,
  AlertTriangle,
  FileText,
  LogOut,
  X,
  Crown,
} from "lucide-react"

interface AdminSidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

interface JobCounts {
  total: number
  active: number
  pending: number
  closed: number
  rejected: number
  expired: number
}

interface ClientCounts {
  total: number
  active: number
  verified: number
  unverified: number
}

interface FundiCounts {
  total: number
  active: number
  verified: number
  available: number
  busy: number
}

interface UserCounts {
  total: number
  active: number
  admins: number
  moderators: number
  support: number
}

interface MessageCounts {
  total: number
  unread: number
  pending: number
  resolved: number
}

// Reuse the JobStatus type from your main component
type JobStatus = "PENDING" | "ACTIVE" | "CLOSED" | "REJECTED" | "EXPIRED";

// Minimal interfaces for sidebar
interface SidebarJob {
  status: JobStatus;
}

interface SidebarClient {
  id: string;
  status: string;
  isVerified: boolean;
}

interface SidebarFundi {
  id: string;
  status: string;
  isVerified: boolean;
  availability: string;
}

interface SidebarUser {
  id: string;
  status: string;
  role: string;
}

interface SidebarMessage {
  id: string;
  status: string;
  isRead: boolean;
}

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname()
  const [loggingOut, setLoggingOut] = useState(false)
  const [userFullName, setUserFullName] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  
  // Count states
  const [jobCounts, setJobCounts] = useState<JobCounts>({
    total: 0,
    active: 0,
    pending: 0,
    closed: 0,
    rejected: 0,
    expired: 0
  })
  const [clientCounts, setClientCounts] = useState<ClientCounts>({
    total: 0,
    active: 0,
    verified: 0,
    unverified: 0
  })
  const [fundiCounts, setFundiCounts] = useState<FundiCounts>({
    total: 0,
    active: 0,
    verified: 0,
    available: 0,
    busy: 0
  })
  const [userCounts, setUserCounts] = useState<UserCounts>({
    total: 0,
    active: 0,
    admins: 0,
    moderators: 0,
    support: 0
  })
  const [messageCounts, setMessageCounts] = useState<MessageCounts>({
    total: 0,
    unread: 0,
    pending: 0,
    resolved: 0
  })
  
  // Loading states
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [loadingClients, setLoadingClients] = useState(true)
  const [loadingFundis, setLoadingFundis] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(true)

  // Fetch user data
  useEffect(() => {
    const userData = AdminAuthService.getUserData()
    if (userData) {
      setUserFullName(userData.fullName)
      setUserEmail(userData.email)
      setUserRole(userData.role)
    }
  }, [])

  // Fetch job counts
  useEffect(() => {
    const fetchJobCounts = async () => {
      try {
        setLoadingJobs(true)
        const response = await fetch('http://localhost:5000/api/client/jobs/', {
          headers: { 
            "Content-Type": "application/json",
            ...AdminAuthService.getAuthHeaders() 
          },
          cache: "no-store",
        })

        if (response.ok) {
          const data = await response.json()
          
          let jobsList: SidebarJob[] = []
          if (Array.isArray(data)) {
            jobsList = data
          } else if (data && Array.isArray(data.jobs)) {
            jobsList = data.jobs
          } else if (data && Array.isArray(data.data)) {
            jobsList = data.data
          } else if (data && typeof data === 'object') {
            jobsList = [data]
          }

          const counts: JobCounts = {
            total: jobsList.length,
            active: jobsList.filter((job: SidebarJob) => job.status === 'ACTIVE').length,
            pending: jobsList.filter((job: SidebarJob) => job.status === 'PENDING').length,
            closed: jobsList.filter((job: SidebarJob) => job.status === 'CLOSED').length,
            rejected: jobsList.filter((job: SidebarJob) => job.status === 'REJECTED').length,
            expired: jobsList.filter((job: SidebarJob) => job.status === 'EXPIRED').length
          }

          setJobCounts(counts)
        }
      } catch (error) {
        console.error('Failed to fetch job counts:', error)
      } finally {
        setLoadingJobs(false)
      }
    }

    fetchJobCounts()
  }, [])

  // Fetch client counts
  useEffect(() => {
    const fetchClientCounts = async () => {
      try {
        setLoadingClients(true)
        const response = await fetch('http://localhost:5000/api/client/getAllClientUsers', {
          headers: { 
            "Content-Type": "application/json",
            ...AdminAuthService.getAuthHeaders() 
          },
          cache: "no-store",
        })

        if (response.ok) {
          const data = await response.json()
          
          let clientsList: SidebarClient[] = []
          if (Array.isArray(data)) {
            clientsList = data
          } else if (data && Array.isArray(data.clients)) {
            clientsList = data.clients
          } else if (data && Array.isArray(data.data)) {
            clientsList = data.data
          } else if (data && typeof data === 'object') {
            clientsList = [data]
          }

          const counts: ClientCounts = {
            total: clientsList.length,
            active: clientsList.filter((client: SidebarClient) => client.status === 'ACTIVE' || client.status === 'active').length,
            verified: clientsList.filter((client: SidebarClient) => client.isVerified === true).length,
            unverified: clientsList.filter((client: SidebarClient) => client.isVerified === false).length
          }

          setClientCounts(counts)
        }
      } catch (error) {
        console.error('Failed to fetch client counts:', error)
      } finally {
        setLoadingClients(false)
      }
    }

    fetchClientCounts()
  }, [])

  // Fetch fundi counts
  useEffect(() => {
    const fetchFundiCounts = async () => {
      try {
        setLoadingFundis(true)
        const response = await fetch('http://localhost:5000/api/fundi/getAllFundis', {
          headers: { 
            "Content-Type": "application/json",
            ...AdminAuthService.getAuthHeaders() 
          },
          cache: "no-store",
        })

        if (response.ok) {
          const data = await response.json()
          
          let fundisList: SidebarFundi[] = []
          if (Array.isArray(data)) {
            fundisList = data
          } else if (data && Array.isArray(data.fundis)) {
            fundisList = data.fundis
          } else if (data && Array.isArray(data.data)) {
            fundisList = data.data
          } else if (data && typeof data === 'object') {
            fundisList = [data]
          }

          const counts: FundiCounts = {
            total: fundisList.length,
            active: fundisList.filter((fundi: SidebarFundi) => fundi.status === 'ACTIVE' || fundi.status === 'ACTIVE').length,
            verified: fundisList.filter((fundi: SidebarFundi) => fundi.isVerified === true).length,
            available: fundisList.filter((fundi: SidebarFundi) => fundi.availability === 'available' || fundi.availability === 'AVAILABLE').length,
            busy: fundisList.filter((fundi: SidebarFundi) => fundi.availability === 'busy' || fundi.availability === 'BUSY').length
          }

          setFundiCounts(counts)
        }
      } catch (error) {
        console.error('Failed to fetch fundi counts:', error)
      } finally {
        setLoadingFundis(false)
      }
    }

    fetchFundiCounts()
  }, [])

  // Fetch user counts
  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        setLoadingUsers(true)
        const response = await fetch('http://localhost:5000/api/admin/getAllAdmins', {
          headers: { 
            "Content-Type": "application/json",
            ...AdminAuthService.getAuthHeaders() 
          },
          cache: "no-store",
        })

        if (response.ok) {
          const data = await response.json()
          
          let usersList: SidebarUser[] = []
          if (Array.isArray(data)) {
            usersList = data
          } else if (data && Array.isArray(data.users)) {
            usersList = data.users
          } else if (data && Array.isArray(data.data)) {
            usersList = data.data
          } else if (data && typeof data === 'object') {
            usersList = [data]
          }

          const counts: UserCounts = {
            total: usersList.length,
            active: usersList.filter((user: SidebarUser) => user.status === 'ACTIVE' || user.status === 'active').length,
            admins: usersList.filter((user: SidebarUser) => user.role === 'ADMIN' || user.role === 'SUPER_ADMIN').length,
            moderators: usersList.filter((user: SidebarUser) => user.role === 'MODERATOR').length,
            support: usersList.filter((user: SidebarUser) => user.role === 'SUPPORT').length
          }

          setUserCounts(counts)
        }
      } catch (error) {
        console.error('Failed to fetch user counts:', error)
      } finally {
        setLoadingUsers(false)
      }
    }

    fetchUserCounts()
  }, [])

  // Fetch message/ticket counts
  useEffect(() => {
    const fetchMessageCounts = async () => {
      try {
        setLoadingMessages(true)
        const response = await fetch('http://localhost:5000/api/admin/support/tickets', {
          headers: { 
            "Content-Type": "application/json",
            ...AdminAuthService.getAuthHeaders() 
          },
          cache: "no-store",
        })

        if (response.ok) {
          const data = await response.json()
          
          let messagesList: SidebarMessage[] = []
          if (Array.isArray(data)) {
            messagesList = data
          } else if (data && Array.isArray(data.tickets)) {
            messagesList = data.tickets
          } else if (data && Array.isArray(data.messages)) {
            messagesList = data.messages
          } else if (data && Array.isArray(data.data)) {
            messagesList = data.data
          } else if (data && typeof data === 'object') {
            messagesList = [data]
          }

          const counts: MessageCounts = {
            total: messagesList.length,
            unread: messagesList.filter((message: SidebarMessage) => message.isRead === false).length,
            pending: messagesList.filter((message: SidebarMessage) => message.status === 'PENDING' || message.status === 'OPEN').length,
            resolved: messagesList.filter((message: SidebarMessage) => message.status === 'RESOLVED' || message.status === 'CLOSED').length
          }

          setMessageCounts(counts)
        }
      } catch (error) {
        console.error('Failed to fetch message counts:', error)
      } finally {
        setLoadingMessages(false)
      }
    }

    fetchMessageCounts()
  }, [])

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/administrator/dashboard",
      icon: LayoutDashboard,
      description: "Overview & analytics",
    },
    {
      name: "Manage Users",
      href: "/administrator/settings",
      icon: Users,
      badge: loadingUsers ? "..." : userCounts.total.toString(),
      description: `Admins: ${userCounts.admins}, Mods: ${userCounts.moderators}`,
    },
    {
      name: "Manage Fundis",
      href: "/administrator/fundis",
      icon: UserCheck,
      badge: loadingFundis ? "..." : fundiCounts.total.toString(),
      description: `Verified: ${fundiCounts.verified}, Available: ${fundiCounts.available}`,
    },
    {
      name: "Manage Clients",
      href: "/administrator/clients",
      icon: Users,
      badge: loadingClients ? "..." : clientCounts.total.toString(),
      description: `Active: ${clientCounts.active}, Verified: ${clientCounts.verified}`,
    },
    {
      name: "Job Listings",
      href: "/administrator/jobListings",
      icon: Building2,
      badge: loadingJobs ? "..." : jobCounts.total.toString(),
      description: `Active: ${jobCounts.active}, Pending: ${jobCounts.pending}`,
    },
    {
      name: "Post New Job",
      href: "/administrator/postJob",
      icon: Plus,
      description: "Admin Add new Jobs",
    },
    {
      name: "Reports",
      href: "/administrator/reports",
      icon: BarChart3,
      description: "Analytics & insights",
    },
    {
      name: "Messages",
      href: "/administrator/tickets",
      icon: MessageSquare,
      badge: loadingMessages ? "..." : messageCounts.unread.toString(),
      description: `Pending: ${messageCounts.pending}, Total: ${messageCounts.total}`,
    },
    {
      name: "Moderation",
      href: "/administrator/moderation",
      icon: AlertTriangle,
      badge: "5",
      description: "Content review",
    },
    {
      name: "System Logs",
      href: "/administrator/system_logs",
      icon: FileText,
      description: "Activity tracking",
    },
    {
      name: "Settings",
      href: "/administrator/settings",
      icon: Settings,
      description: "Platform configuration",
    },
  ]

  const isActive = (href: string) => pathname === href

  const handleSignOut = async () => {
    setLoggingOut(true)
    setTimeout(async () => {
      await AdminAuthService.logout()
    }, 4000)
  }

  // Determine role classes
  const roleColorClasses = (role: string | null) => {
    if (!role) return "bg-slate-500/20 text-slate-300"
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-purple-500/20 text-purple-300"
      case "ADMIN":
        return "bg-blue-500/20 text-blue-300"
      case "MODERATOR":
        return "bg-orange-500/20 text-orange-300"
      case "SUPPORT":
        return "bg-green-500/20 text-green-300"
      default:
        return "bg-slate-500/20 text-slate-300"
    }
  }

  const formattedRole = userRole ? userRole.replace("_", " ") : "Loading..."

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 shadow-2xl z-50 transition-all duration-500 ease-out lg:sticky lg:top-0 lg:h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } w-80`}
      >
        <div className="flex flex-col h-full backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-800/40 backdrop-blur-xl">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">MJENGO</h2>
                <p className="text-sm font-bold text-slate-300 uppercase tracking-wider">Admin Portal</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-700/60 transition-all duration-200 shadow-sm"
            >
              <X className="w-6 h-6 text-slate-300" />
            </button>
          </div>

          {/* Admin Profile Section */}
          <div className="p-6 border-b border-slate-700/50 bg-slate-800/20 backdrop-blur-xl">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-black text-white text-lg">{userFullName ?? "Admin User"}</p>
                <p className="text-sm font-bold text-slate-300 mb-2">{userEmail ?? "Loading..."}</p>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 text-xs font-bold rounded-full ${roleColorClasses(userRole)}`}>
                    {formattedRole}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
            <nav className="px-6 space-y-3">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group relative flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                      active
                        ? "bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white shadow-xl shadow-purple-500/25"
                        : "text-slate-300 hover:bg-slate-700/60 hover:shadow-lg backdrop-blur-sm hover:text-white"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                          active ? "bg-white/20" : "bg-slate-700 group-hover:bg-slate-600"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${active ? "text-white" : "text-slate-300 group-hover:text-white"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <span
                          className={`font-bold text-base block ${
                            active ? "text-white" : "text-slate-200 group-hover:text-white"
                          }`}
                        >
                          {item.name}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            active ? "text-white/80" : "text-slate-400 group-hover:text-slate-300"
                          }`}
                        >
                          {item.description}
                        </span>
                      </div>
                    </div>
                    {item.badge && (
                      <div
                        className={`px-3 py-1 text-xs font-black rounded-full ${
                          active
                            ? "bg-white/30 text-white"
                            : "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 shadow-sm"
                        }`}
                      >
                        {item.badge}
                      </div>
                    )}
                    {/* Active indicator */}
                    {active && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg"></div>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* System Stats - Enhanced with All Statistics */}
            <div className="mx-6 mt-8 p-4 bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/30 shadow-lg">
              <h4 className="text-sm font-black text-white mb-3 uppercase tracking-wider">System Overview</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">Total Jobs</span>
                  <span className="text-sm font-black text-blue-400">
                    {loadingJobs ? "..." : jobCounts.total}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">Active Jobs</span>
                  <span className="text-sm font-black text-emerald-400">
                    {loadingJobs ? "..." : jobCounts.active}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">Total Clients</span>
                  <span className="text-sm font-black text-amber-400">
                    {loadingClients ? "..." : clientCounts.total}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">Total Fundis</span>
                  <span className="text-sm font-black text-purple-400">
                    {loadingFundis ? "..." : fundiCounts.total}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">Unread Messages</span>
                  <span className="text-sm font-black text-red-400">
                    {loadingMessages ? "..." : messageCounts.unread}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">Server Load</span>
                  <span className="text-sm font-black text-emerald-400">23%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-700/50 bg-slate-800/20 backdrop-blur-xl flex-shrink-0">
            <button
              onClick={handleSignOut}
              disabled={loggingOut}
              className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-200 group ${
                loggingOut
                  ? "bg-slate-700/60 cursor-not-allowed"
                  : "text-slate-300 hover:bg-slate-700/60 hover:shadow-lg hover:text-white"
              }`}
            >
              <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center transition-colors group-hover:bg-red-600">
                {loggingOut ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
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
                ) : (
                  <LogOut className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                )}
              </div>
              <div className="flex-1 text-left">
                <span className="font-bold text-slate-200 group-hover:text-white block">
                  {loggingOut ? "Signing Out..." : "Sign Out"}
                </span>
                <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300">
                  End admin session
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}