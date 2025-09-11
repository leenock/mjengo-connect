"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Briefcase, User, LogOut, X, Building2, ThumbsUp, Calendar, Shield } from "lucide-react"
import FundiAuthService from "@/app/services/fundi_user"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

interface Job {
  id: string
  title: string
  category: string
  jobType: string
  location: string
  duration: string
  salary: string
  Jobdescription: string
  SkillsAndrequirements: string
  responsibilities: string
  benefits?: string
  companyName: string
  contactPerson: string
  phoneNumber: string
  email: string
  preferredContact: string
  isUrgent: boolean
  isPaid: boolean
  status: "PENDING" | "ACTIVE" | "CLOSED" | "EXPIRED"
  timePosted: string
  clickCount: number
  postedBy: {
    id: string
    email: string
    firstName: string
    lastName: string
    company: string
  }
}

interface JobStats {
  activeJobs: number
  thisMonth: number
  savedJobs: number
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [phone, setUserPhone] = useState<string | null>(null)
  const [firstName, setFirstName] = useState<string | null>(null)
  const [lastName, setLastName] = useState<string | null>(null)
  const [stats, setStats] = useState<JobStats>({
    activeJobs: 0,
    thisMonth: 0,
    savedJobs: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)

  const pathname = usePathname()

  // Fetch user data
  useEffect(() => {
    const userData = FundiAuthService.getUserData()
    if (userData) {
      if (userData.phone) setUserPhone(userData.phone)
      if (userData.firstName) setFirstName(userData.firstName)
      if (userData.lastName) setLastName(userData.lastName)
    }
  }, [])

  // Fetch stats data
  useEffect(() => {
    async function fetchStats() {
      try {
        setStatsLoading(true)

        // Get authentication token
        const token = FundiAuthService.getToken()

        if (!token) {
          console.log("No token found, skipping stats fetch")
          return
        }

        // Fetch active jobs count
        const jobsRes = await fetch("http://localhost:5000/api/client/jobs")
        let activeJobsCount = 0
        let thisMonthCount = 0

        if (jobsRes.ok) {
          const jobsData = await jobsRes.json()
          const jobs: Job[] = Array.isArray(jobsData.jobs) ? jobsData.jobs : []

          // Count active jobs
          activeJobsCount = jobs.filter((job: Job) => job.status === "ACTIVE" || job.status === "PENDING").length

          // Count jobs posted this month
          const thisMonth = new Date()
          thisMonth.setDate(1)
          thisMonth.setHours(0, 0, 0, 0)

          thisMonthCount = jobs.filter((job: Job) => {
            const jobDate = new Date(job.timePosted)
            return jobDate >= thisMonth
          }).length
        }

        // Fetch saved jobs count
        let savedJobsCount = 0
        try {
          const savedJobsRes = await fetch("http://localhost:5000/api/fundi/saved-jobs/count", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })

          if (savedJobsRes.ok) {
            const savedJobsData = await savedJobsRes.json()
            savedJobsCount = savedJobsData.data?.count || 0
          }
        } catch (error) {
          console.log("Saved jobs API not available yet:", error)
        }

        setStats({
          activeJobs: activeJobsCount,
          thisMonth: thisMonthCount,
          savedJobs: savedJobsCount,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const navigationItems = [
    {
      name: "Job Listings",
      href: "/clientspace/fundi/job-listings",
      icon: Briefcase,
      highlight: true,
      description: "View active opportunities",
    },
    {
      name: "Saved Jobs",
      href: "/clientspace/fundi/saved-jobs",
      icon: Calendar,
      badge: stats.savedJobs > 0 ? stats.savedJobs.toString() : undefined,
      description: "My bookmarked jobs",
    },
    {
      name: "Subscriptions",
      href: "/clientspace/fundi/subscription",
      icon: Shield,
      description: "Manage your plan",
    },
    {
      name: "User Profile",
      href: "/clientspace/fundi/userProfile",
      icon: User,
      description: "Account settings",
    },
  ]

  const handleLogout = async () => {
    await FundiAuthService.logout()
  }

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
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-white via-slate-50 to-indigo-50 border-r border-white/20 shadow-2xl z-50 transition-all duration-500 ease-out lg:sticky lg:top-0 lg:h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } w-80`}
      >
        <div className="flex flex-col h-full backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/30 bg-white/40 backdrop-blur-xl">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">MJENGO</h2>
                <p className="text-sm font-extrabold text-slate-600 uppercase tracking-wider">Connect</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/60 transition-all duration-200 shadow-sm"
            >
              <X className="w-6 h-6 text-slate-600" />
            </button>
          </div>

          {/* User Profile Section */}
          <div className="p-6 border-b border-white/30 bg-white/20 backdrop-blur-xl">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-lg font-black text-slate-900">{phone ?? "User"}</p>
                <p className="text-sm font-bold text-slate-600 mb-2">
                  {firstName || lastName ? `${firstName ?? ""} ${lastName ?? ""}`.trim() : "User"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
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
                        ? "bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white shadow-xl shadow-orange-500/25"
                        : item.highlight
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20"
                          : "text-slate-700 hover:bg-white/60 hover:shadow-lg backdrop-blur-sm"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                          active || item.highlight ? "bg-white/20" : "bg-slate-100 group-hover:bg-white/80"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            active || item.highlight ? "text-white" : "text-slate-600 group-hover:text-slate-700"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <span
                          className={`font-bold text-base block ${
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
                        className={`px-3 py-1 text-xs font-black rounded-full ${
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
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg"></div>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Quick Stats - Now Dynamic */}
            <div className="mx-6 mt-8 p-4 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg">
              <h4 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">Quick Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">Active Jobs</span>
                  <span className="text-sm font-black text-slate-900">
                    {statsLoading ? (
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                    ) : (
                      stats.activeJobs
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">This Month</span>
                  <span className="text-sm font-black text-emerald-600">
                    {statsLoading ? (
                      <div className="w-4 h-4 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin"></div>
                    ) : (
                      `+${stats.thisMonth}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">Saved Jobs</span>
                  <span className="text-sm font-black text-amber-600">
                    {statsLoading ? (
                      <div className="w-4 h-4 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin"></div>
                    ) : (
                      stats.savedJobs
                    )}
                  </span>
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
