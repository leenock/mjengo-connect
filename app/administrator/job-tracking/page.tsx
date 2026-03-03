"use client"

import { useState, useEffect, useMemo } from "react"
import { API_URL } from "@/app/config"
import AdminSidebar from "@/components/admin/Sidebar"
import AdminAuthService from "@/app/services/admin_auth"
import {
  Menu,
  Loader2,
  AlertTriangle,
  FileText,
  Clock,
} from "lucide-react"

const JOB_PAID_DAYS = 7
const JOB_UNPAID_DAYS = 7

interface PostedBy {
  id: string
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  company?: string | null
}

interface JobTrackingItem {
  id: string
  title: string
  status: string
  isPaid?: boolean
  timePosted: string
  paidAt?: string | null
  companyName?: string
  contactPerson?: string
  email?: string
  postedBy?: PostedBy | null
  expiresAt?: string | Date
  daysRemaining?: number
}

function getExpiresAt(job: JobTrackingItem): Date {
  if (job.expiresAt) return new Date(job.expiresAt)
  const from =
    job.isPaid && job.paidAt ? new Date(job.paidAt) : new Date(job.timePosted)
  const d = new Date(from)
  d.setDate(d.getDate() + (job.isPaid && job.paidAt ? JOB_PAID_DAYS : JOB_UNPAID_DAYS))
  return d
}

function getDaysRemaining(job: JobTrackingItem): number {
  if (typeof job.daysRemaining === "number") return job.daysRemaining
  const expiresAt = getExpiresAt(job)
  const now = new Date()
  const diffMs = expiresAt.getTime() - now.getTime()
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return days > 0 ? days : 0
}

function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return "—"
  try {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return "—"
  }
}

function postedByName(job: JobTrackingItem): string {
  if (job.postedBy) {
    const n = [job.postedBy.firstName, job.postedBy.lastName].filter(Boolean).join(" ")
    if (n) return n
    if (job.postedBy.email) return job.postedBy.email
  }
  return job.contactPerson || job.companyName || "—"
}

export default function AdminJobTrackingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState<JobTrackingItem[]>([])
  const [filter, setFilter] = useState<"all" | "active" | "expiring">("all")
  const [sortBy, setSortBy] = useState<"days" | "title" | "status">("days")

  useEffect(() => {
    const fetchJobs = async () => {
      const headers = AdminAuthService.getAuthHeaders()
      try {
        setLoading(true)
        let res = await fetch(`${API_URL}/api/admin/management/jobs/tracking`, { headers })
        if (!res.ok) {
          const fallback = await fetch(`${API_URL}/api/admin/jobs/jobs`, { headers })
          if (!fallback.ok) throw new Error("Failed to fetch jobs")
          res = fallback
        }
        const data = await res.json()
        const list = Array.isArray(data) ? data : data?.jobs ?? data?.data ?? []
        setJobs(list)
      } catch (e) {
        console.error("Job tracking fetch error:", e)
        setJobs([])
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const filteredAndSorted = useMemo(() => {
    let list = jobs
    if (filter === "active") {
      list = list.filter((j) => (j.status || "").toUpperCase() === "ACTIVE")
    } else if (filter === "expiring") {
      list = list.filter((j) => {
        const d = getDaysRemaining(j)
        return d >= 0 && d <= 7
      })
    }
    list = [...list].sort((a, b) => {
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "")
      }
      if (sortBy === "status") {
        return (a.status || "").localeCompare(b.status || "")
      }
      const da = getDaysRemaining(a)
      const db = getDaysRemaining(b)
      return da - db
    })
    return list
  }, [jobs, filter, sortBy])

  const activeCount = jobs.filter((j) => (j.status || "").toUpperCase() === "ACTIVE").length
  const expiringSoonCount = jobs.filter((j) => {
    const d = getDaysRemaining(j)
    return d >= 0 && d <= 7
  }).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:flex font-inter">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 lg:ml-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 py-4 sm:py-6 rounded-xl sm:rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-white/60"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  Job tracking
                </h1>
                <p className="text-slate-600 text-sm sm:text-base font-medium mt-1">
                  Track when jobs were posted, when they expire, and days remaining
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur rounded-2xl border border-slate-200 p-5 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Total jobs</p>
                  <p className="text-2xl font-black text-slate-900">{jobs.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl border border-emerald-200 p-5 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Active</p>
                  <p className="text-2xl font-black text-slate-900">{activeCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl border border-amber-200 p-5 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Expiring in 7 days</p>
                  <p className="text-2xl font-black text-slate-900">{expiringSoonCount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-wrap items-center gap-3">
              <span className="text-sm font-bold text-slate-600">Show:</span>
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  filter === "all"
                    ? "bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  filter === "active"
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                Active only
              </button>
              <button
                onClick={() => setFilter("expiring")}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  filter === "expiring"
                    ? "bg-amber-500 text-white"
                    : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                }`}
              >
                Expiring in 7 days
              </button>
              <span className="ml-auto text-sm font-bold text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "days" | "title" | "status")}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
              >
                <option value="days">Days remaining</option>
                <option value="title">Title</option>
                <option value="status">Status</option>
              </select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
              </div>
            ) : filteredAndSorted.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-medium">
                No jobs match the current filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left py-4 px-4 text-xs font-bold text-slate-600 uppercase">Job</th>
                      <th className="text-left py-4 px-4 text-xs font-bold text-slate-600 uppercase">Posted by</th>
                      <th className="text-left py-4 px-4 text-xs font-bold text-slate-600 uppercase">Status</th>
                      <th className="text-left py-4 px-4 text-xs font-bold text-slate-600 uppercase">Posted date</th>
                      <th className="text-left py-4 px-4 text-xs font-bold text-slate-600 uppercase">Expires on</th>
                      <th className="text-left py-4 px-4 text-xs font-bold text-slate-600 uppercase">Days remaining</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSorted.map((job) => {
                      const days = getDaysRemaining(job)
                      const expiresAt = getExpiresAt(job)
                      const isActive = (job.status || "").toUpperCase() === "ACTIVE"
                      return (
                        <tr
                          key={job.id}
                          className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <span className="font-semibold text-slate-900">{job.title || "—"}</span>
                            {job.companyName && (
                              <p className="text-xs text-slate-500 mt-0.5">{job.companyName}</p>
                            )}
                          </td>
                          <td className="py-4 px-4 text-slate-600">{postedByName(job)}</td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-lg font-semibold text-sm ${
                                isActive
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {(job.status || "—").toLowerCase()}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-600">{formatDate(job.timePosted)}</td>
                          <td className="py-4 px-4 text-slate-600">{formatDate(expiresAt)}</td>
                          <td className="py-4 px-4">
                            {days <= 0 ? (
                              <span className="font-semibold text-red-600">Expired</span>
                            ) : days <= 7 ? (
                              <span className="font-semibold text-amber-600">
                                {days} day{days !== 1 ? "s" : ""}
                              </span>
                            ) : (
                              <span className="text-slate-700">
                                {days} day{days !== 1 ? "s" : ""}
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
