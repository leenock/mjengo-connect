"use client"

import { useState, useEffect, useMemo } from "react"
import { API_URL } from "@/app/config"
import AdminSidebar from "@/components/admin/Sidebar"
import AdminAuthService from "@/app/services/admin_auth"
import {
  Menu,
  CreditCard,
  Calendar,
  User,
  Mail,
  ShieldCheck,
  XCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react"

interface FundiSubscription {
  id: string
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  phone?: string | null
  subscriptionPlan?: string | null
  subscriptionStatus?: string | null
  planStartDate?: string | null
  planEndDate?: string | null
}

function getDaysRemaining(planEndDate: string | null | undefined, plan: string | null | undefined): number | null {
  if (!planEndDate || (plan || "").toUpperCase() !== "PREMIUM") return null
  const end = new Date(planEndDate)
  const now = new Date()
  const diffMs = end.getTime() - now.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

function formatDate(dateString: string | null | undefined): string {
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

export default function AdminSubscriptionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [fundis, setFundis] = useState<FundiSubscription[]>([])
  const [filter, setFilter] = useState<"all" | "premium" | "free">("all")
  const [sortBy, setSortBy] = useState<"days" | "name" | "plan">("days")

  useEffect(() => {
    const fetchFundis = async () => {
      const headers = AdminAuthService.getAuthHeaders()
      try {
        setLoading(true)
        let res = await fetch(`${API_URL}/api/admin/management/subscriptions/fundis`, { headers })
        if (!res.ok) {
          const fallback = await fetch(`${API_URL}/api/fundi/getAllFundis`, { headers })
          if (!fallback.ok) throw new Error("Failed to fetch fundis")
          res = fallback
        }
        const data = await res.json()
        const list = Array.isArray(data) ? data : data?.fundis ?? data?.data ?? []
        setFundis(list)
      } catch (e) {
        console.error("Subscription tracking fetch error:", e)
        setFundis([])
      } finally {
        setLoading(false)
      }
    }
    fetchFundis()
  }, [])

  const filteredAndSorted = useMemo(() => {
    let list = fundis
    if (filter === "premium") {
      list = list.filter((f) => (f.subscriptionPlan || "").toUpperCase() === "PREMIUM")
    } else if (filter === "free") {
      list = list.filter((f) => (f.subscriptionPlan || "").toUpperCase() !== "PREMIUM")
    }
    list = [...list].sort((a, b) => {
      if (sortBy === "name") {
        const na = `${a.firstName || ""} ${a.lastName || ""}`.trim() || a.email || ""
        const nb = `${b.firstName || ""} ${b.lastName || ""}`.trim() || b.email || ""
        return na.localeCompare(nb)
      }
      if (sortBy === "plan") {
        const pa = (a.subscriptionPlan || "").toUpperCase()
        const pb = (b.subscriptionPlan || "").toUpperCase()
        if (pa !== pb) return pa === "PREMIUM" ? -1 : 1
        return 0
      }
      // sortBy === "days": soonest to expire first (smallest days remaining, then expired)
      const da = getDaysRemaining(a.planEndDate, a.subscriptionPlan)
      const db = getDaysRemaining(b.planEndDate, b.subscriptionPlan)
      if (da == null && db == null) return 0
      if (da == null) return 1
      if (db == null) return -1
      return da - db
    })
    return list
  }, [fundis, filter, sortBy])

  const premiumCount = fundis.filter((f) => (f.subscriptionPlan || "").toUpperCase() === "PREMIUM").length
  const expiringSoonCount = fundis.filter((f) => {
    const d = getDaysRemaining(f.planEndDate, f.subscriptionPlan)
    return d !== null && d >= 0 && d <= 7
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
                  Fundi subscription tracking
                </h1>
                <p className="text-slate-600 text-sm sm:text-base font-medium mt-1">
                  Track premium subscriptions and days until expiry
                </p>
              </div>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur rounded-2xl border border-slate-200 p-5 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Total fundis</p>
                  <p className="text-2xl font-black text-slate-900">{fundis.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl border border-orange-200 p-5 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Premium</p>
                  <p className="text-2xl font-black text-slate-900">{premiumCount}</p>
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

          {/* Filters and table */}
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
                onClick={() => setFilter("premium")}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  filter === "premium"
                    ? "bg-orange-500 text-white"
                    : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                }`}
              >
                Premium only
              </button>
              <button
                onClick={() => setFilter("free")}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  filter === "free"
                    ? "bg-slate-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Free only
              </button>
              <span className="ml-auto text-sm font-bold text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "days" | "name" | "plan")}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
              >
                <option value="days">Days remaining</option>
                <option value="name">Name</option>
                <option value="plan">Plan</option>
              </select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
              </div>
            ) : filteredAndSorted.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-medium">
                No fundis match the current filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left py-4 px-4 text-xs font-bold text-slate-600 uppercase">Fundi</th>
                      <th className="text-left py-4 px-4 text-xs font-bold text-slate-600 uppercase">Email</th>
                      <th className="text-left py-4 px-4 text-xs font-bold text-slate-600 uppercase">Plan</th>
                      <th className="text-left py-4 px-4 text-xs font-bold text-slate-600 uppercase">Status</th>
                      <th className="text-left py-4 px-4 text-xs font-bold text-slate-600 uppercase">Plan start</th>
                      <th className="text-left py-4 px-4 text-xs font-bold text-slate-600 uppercase">Plan end</th>
                      <th className="text-left py-4 px-4 text-xs font-bold text-slate-600 uppercase">Days remaining</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSorted.map((f) => {
                      const days = getDaysRemaining(f.planEndDate, f.subscriptionPlan)
                      const isPremium = (f.subscriptionPlan || "").toUpperCase() === "PREMIUM"
                      return (
                        <tr
                          key={f.id}
                          className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <span className="font-semibold text-slate-900">
                              {[f.firstName, f.lastName].filter(Boolean).join(" ") || "—"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-600">{f.email || "—"}</td>
                          <td className="py-4 px-4">
                            {isPremium ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-100 text-orange-800 font-semibold text-sm">
                                <ShieldCheck className="w-4 h-4" /> Premium
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-semibold text-sm">
                                <XCircle className="w-4 h-4" /> Free
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-slate-600 capitalize">
                            {(f.subscriptionStatus || "—").toLowerCase()}
                          </td>
                          <td className="py-4 px-4 text-slate-600">{formatDate(f.planStartDate)}</td>
                          <td className="py-4 px-4 text-slate-600">{formatDate(f.planEndDate)}</td>
                          <td className="py-4 px-4">
                            {days === null ? (
                              <span className="text-slate-400">—</span>
                            ) : days < 0 ? (
                              <span className="font-semibold text-red-600">Expired</span>
                            ) : days <= 7 ? (
                              <span className="font-semibold text-amber-600">{days} day{days !== 1 ? "s" : ""}</span>
                            ) : (
                              <span className="text-slate-700">{days} day{days !== 1 ? "s" : ""}</span>
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
