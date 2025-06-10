"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  BarChart3,
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

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname()

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/administrator/dashboard",
      icon: LayoutDashboard,
      description: "Overview & analytics",
    },
    {
      name: "Manage Fundis",
      href: "/administrator/fundis",
      icon: UserCheck,
      badge: "1,247",
      description: "Skilled workers",
    },
    {
      name: "Manage Clients",
      href: "/administrator/clients",
      icon: Users,
      badge: "892",
      description: "Job posters",
    },
    {
      name: "Job Listings",
      href: "/administrator/jobListings",
      icon: Building2,
      badge: "156",
      description: "Active & pending jobs",
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
      badge: "12",
      description: "Support tickets",
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
                <p className="font-black text-white text-lg">Admin User</p>
                <p className="text-sm font-bold text-slate-300 mb-2">System Administrator</p>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full">
                    SUPER ADMIN
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

            {/* System Stats */}
            <div className="mx-6 mt-8 p-4 bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/30 shadow-lg">
              <h4 className="text-sm font-black text-white mb-3 uppercase tracking-wider">System Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">Server Load</span>
                  <span className="text-sm font-black text-emerald-400">23%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">Active Users</span>
                  <span className="text-sm font-black text-blue-400">2,139</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">Uptime</span>
                  <span className="text-sm font-black text-purple-400">99.9%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-700/50 bg-slate-800/20 backdrop-blur-xl flex-shrink-0">
            <button className="w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-slate-300 hover:bg-slate-700/60 transition-all duration-200 group hover:shadow-lg hover:text-white">
              <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center group-hover:bg-red-600 transition-colors">
                <LogOut className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 text-left">
                <span className="font-bold text-slate-200 group-hover:text-white block">Sign Out</span>
                <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300">End admin session</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
