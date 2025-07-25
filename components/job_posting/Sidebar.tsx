"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Plus,
  Briefcase,
  Settings,
  BarChart3,
  User,
  LogOut,
  ThumbsUp,
  X,
  Building2,
  MessageSquare,
  DollarSign,
} from "lucide-react"
import ClientAuthService from "@/app/services/client_user"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [email, setUserEmail] = useState<string | null>(null)
  useEffect(() => {
    const userData = ClientAuthService.getUserData()
    if (userData?.phone) {
      setUserEmail(` ${userData.phone}`)
    }
  }, [])
  const pathname = usePathname()
  const navigationItems = [
    {
      name: "Dashboard",
      href: "/clientspace/post-job",
      icon: LayoutDashboard,
      description: "Overview & statistics",
    },
    {
      name: "Post New Job",
      href: "/clientspace/newJob",
      icon: Plus,
      highlight: true,
      description: "Create a new listing",
    },
    {
      name: "My Jobs",
      href: "/clientspace/myJobs",
      icon: Briefcase,
      badge: "12",
      description: "Manage your listings",
    },
    {
      name: "Payments",
      href: "/clientspace/payment",
      icon: BarChart3,
      description: "Performance insights",
    },
    {
      name: "Add Funds", // New navigation item
      href: "/clientspace/add-funds",
      icon: DollarSign, // Using DollarSign icon for Add Funds
      description: "Top up your account",
    },
    {
      name: "User Profile",
      href: "/clientspace/userProfile",
      icon: Settings,
      description: "Account settings",
    },
    {
      name: "Message Admin", // New navigation item
      href: "/clientspace/message-admin",
      icon: MessageSquare,
      description: "Send a message to support",
    },
  ]
  const handleLogout = async () => {
    await ClientAuthService.logout()
  }
  const isActive = (href: string) => pathname === href
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-80 border-r border-white/20 bg-gradient-to-b from-white via-slate-50 to-indigo-50 shadow-2xl transition-all duration-500 ease-out lg:sticky lg:top-0 lg:h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/30 bg-white/40 p-6 backdrop-blur-xl">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-pink-500 to-red-500 shadow-lg">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900">MJENGO</h2>
                <p className="text-sm font-bold uppercase tracking-wider text-slate-600">Client Portal</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm transition-all duration-200 hover:bg-white/60 lg:hidden"
            >
              <X className="h-6 w-6 text-slate-600" />
            </button>
          </div>
          {/* User Profile Section */}
          <div className="border-b border-white/30 bg-white/20 p-6 backdrop-blur-xl">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 shadow-xl">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-lg">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-lg font-black text-slate-900">{email ?? "User"}</p>
                <p className="mb-2 text-sm font-bold text-slate-600">Kamau Properties Ltd</p>
              </div>
            </div>
          </div>
          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300">
            <nav className="space-y-3 px-6">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group relative flex transform items-center justify-between rounded-2xl px-5 py-4 transition-all duration-300 hover:scale-[1.02] ${
                      active
                        ? "bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white shadow-xl shadow-orange-500/25"
                        : item.highlight
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-600"
                          : "text-slate-700 backdrop-blur-sm hover:bg-white/60 hover:shadow-lg"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                          active || item.highlight ? "bg-white/20" : "bg-slate-100 group-hover:bg-white/80"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            active || item.highlight ? "text-white" : "text-slate-600 group-hover:text-slate-700"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <span
                          className={`block text-base font-bold ${
                            active || item.highlight ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {item.name}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            active || item.highlight ? "text-white/80" : "text-slate-500 group-hover:text-slate-600"
                          }`}
                        >
                          {item.description}
                        </span>
                      </div>
                    </div>
                    {item.badge && (
                      <div
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          active
                            ? "bg-white/30 text-white"
                            : "bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 shadow-sm"
                        }`}
                      >
                        {item.badge}
                      </div>
                    )}
                    {/* Active indicator */}
                    {active && (
                      <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 transform rounded-r-full bg-white shadow-lg"></div>
                    )}
                  </Link>
                )
              })}
            </nav>
            {/* Quick Stats */}
            <div className="mx-6 mt-8 rounded-2xl border border-white/30 bg-white/40 p-4 shadow-lg backdrop-blur-xl">
              <h4 className="mb-3 text-sm font-black uppercase tracking-wider text-slate-900">Account Stats</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Active Jobs</span>
                  <span className="text-sm font-black text-slate-900">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Total Submitted Jobs</span>
                  <span className="text-sm font-black text-emerald-600">528</span>
                </div>
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="flex-shrink-0 border-t border-white/30 bg-white/20 p-6 backdrop-blur-xl">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center space-x-4 rounded-2xl px-5 py-4 text-slate-700 transition-all duration-200 hover:shadow-lg hover:bg-white/60"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-red-100">
                <LogOut className="absolute h-5 w-5 text-slate-600 transition-colors group-hover:hidden" />
                <ThumbsUp className="absolute hidden h-5 w-5 text-red-600 transition-colors group-hover:block" />
              </div>
              <div className="flex-1 text-left">
                <span className="block font-bold text-slate-900">Sign Out</span>
                <span className="text-xs font-medium text-slate-500">End your session</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
