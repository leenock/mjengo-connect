"use client"

import { useState } from "react"
import AdminSidebar from "@/components/admin/Sidebar"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  DollarSign,
  Download,
  Menu,
  CheckCircle,
} from "lucide-react"

export default function AdminReports() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dateRange, setDateRange] = useState("30")

  const stats = [
    {
      title: "Total Revenue",
      value: "KSh 2.4M",
      change: "+15.2%",
      trend: "up",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    },
    {
      title: "New Registrations",
      value: "1,247",
      change: "+8.3%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    },
    {
      title: "Jobs Completed",
      value: "892",
      change: "+12.1%",
      trend: "up",
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    },
    {
      title: "Active Jobs",
      value: "156",
      change: "-2.4%",
      trend: "down",
      icon: Building2,
      color: "text-amber-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
    },
  ]

  const topCategories = [
    { name: "Plumbing", jobs: 342, revenue: "KSh 680K", growth: "+18%" },
    { name: "Electrical", jobs: 298, revenue: "KSh 596K", growth: "+12%" },
    { name: "Painting", jobs: 256, revenue: "KSh 384K", growth: "+8%" },
    { name: "Roofing", jobs: 189, revenue: "KSh 378K", growth: "+15%" },
    { name: "Masonry", jobs: 167, revenue: "KSh 334K", growth: "+6%" },
  ]

  const recentActivity = [
    {
      type: "Job Completion",
      description: "House Painting completed by Peter Kamau",
      amount: "KSh 45,000",
      time: "2 hours ago",
      status: "success",
    },
    {
      type: "New Registration",
      description: "Mary Wanjiku joined as Electrician",
      amount: "-",
      time: "4 hours ago",
      status: "info",
    },
    {
      type: "Payment Processed",
      description: "Payment for Plumbing job processed",
      amount: "KSh 15,000",
      time: "6 hours ago",
      status: "success",
    },
    {
      type: "Job Posted",
      description: "New roofing job posted in Nakuru",
      amount: "KSh 35,000",
      time: "8 hours ago",
      status: "info",
    },
  ]

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
                  Analytics & Reports
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-medium">
                  Platform insights and performance metrics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
                <option value="365">Last year</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.title}
                    className={`${stat.bgColor} rounded-2xl shadow-lg border-2 border-white/50 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-bold text-slate-600 truncate uppercase tracking-wide">
                          {stat.title}
                        </p>
                        <p className="text-2xl sm:text-4xl font-black text-slate-900 mt-2 leading-none">{stat.value}</p>
                        <div className="flex items-center mt-2">
                          {stat.trend === "up" ? (
                            <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                          )}
                          <span
                            className={`text-xs sm:text-sm font-bold ${
                              stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                            }`}
                          >
                            {stat.change}
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/60 rounded-2xl flex items-center justify-center flex-shrink-0 ml-3 shadow-lg">
                        <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Chart */}
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-emerald-50 to-teal-50">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Revenue Trends</h2>
                  <p className="text-slate-600 font-medium">Monthly revenue performance</p>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="h-64 bg-gradient-to-t from-emerald-50 to-white rounded-2xl flex items-end justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                      <p className="text-slate-600 font-medium">Chart visualization would go here</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Growth Chart */}
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">User Growth</h2>
                  <p className="text-slate-600 font-medium">New registrations over time</p>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="h-64 bg-gradient-to-t from-blue-50 to-white rounded-2xl flex items-end justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      <p className="text-slate-600 font-medium">Chart visualization would go here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-purple-50 to-pink-50">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Top Job Categories</h2>
                <p className="text-slate-600 font-medium">Most popular service categories</p>
              </div>
              <div className="p-6 sm:p-8">
                <div className="space-y-4">
                  {topCategories.map((category, index) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-white/60 to-slate-50/60 rounded-2xl hover:from-white/80 hover:to-slate-50/80 transition-all duration-300 border border-white/40"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{category.name}</h3>
                          <p className="text-slate-600 font-medium">{category.jobs} jobs completed</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-slate-900">{category.revenue}</p>
                        <p className="text-sm font-bold text-emerald-600">{category.growth}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-amber-50 to-orange-50">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Recent Activity</h2>
                <p className="text-slate-600 font-medium">Latest platform transactions and events</p>
              </div>
              <div className="p-6 sm:p-8">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-white/60 to-slate-50/60 rounded-2xl hover:from-white/80 hover:to-slate-50/80 transition-all duration-300 border border-white/40"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            activity.status === "success" ? "bg-emerald-500" : "bg-blue-500"
                          }`}
                        ></div>
                        <div>
                          <h3 className="font-bold text-slate-900">{activity.type}</h3>
                          <p className="text-slate-600 font-medium">{activity.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{activity.amount}</p>
                        <p className="text-sm text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
