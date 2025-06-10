"use client"

import { useState } from "react"
import AdminSidebar from "@/components/admin/Sidebar"
import {
  Users,
  UserCheck,
  Building2,
  Activity,
  AlertTriangle,
  DollarSign,
  Menu,
  Star,
  MessageSquare,
  BarChart3,
  Clock,
  MapPin,
  ArrowRight,
  Shield,
} from "lucide-react"

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const stats = [
    {
      title: "Total Fundis",
      value: "1,247",
      change: "+12 this week",
      icon: UserCheck,
      color: "text-indigo-600",
      bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-200",
    },
    {
      title: "Total Clients",
      value: "892",
      change: "+8 this week",
      icon: Users,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
    },
    {
      title: "Active Jobs",
      value: "156",
      change: "+23 this month",
      icon: Building2,
      color: "text-amber-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
    },
    {
      title: "Total Revenue",
      value: "KSh 2.4M",
      change: "+15% this month",
      icon: DollarSign,
      color: "text-violet-600",
      bgColor: "bg-gradient-to-br from-violet-50 to-violet-100",
      borderColor: "border-violet-200",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      title: "New Fundi Registration - John Mwangi",
      location: "Nairobi, Kenya",
      type: "User Registration",
      status: "Pending Verification",
      time: "2 minutes ago",
      priority: "Normal",
      category: "Registration",
    },
    {
      id: 2,
      title: "Job Posted - House Painting in Westlands",
      location: "Westlands, Nairobi",
      type: "Job Posting",
      status: "Active",
      time: "5 minutes ago",
      priority: "Normal",
      category: "Job Management",
    },
    {
      id: 3,
      title: "Payment Dispute - Plumbing Job",
      location: "Karen, Nairobi",
      type: "Payment Issue",
      status: "Under Review",
      time: "12 minutes ago",
      priority: "Urgent",
      category: "Dispute",
    },
    {
      id: 4,
      title: "Content Report - Inappropriate Profile",
      location: "Kisumu, Kenya",
      type: "Content Moderation",
      status: "Needs Review",
      time: "18 minutes ago",
      priority: "High",
      category: "Moderation",
    },
  ]

  const topFundis = [
    { name: "Peter Kamau", rating: 4.9, jobs: 45, earnings: "KSh 180K", location: "Nairobi" },
    { name: "Mary Wanjiku", rating: 4.8, jobs: 38, earnings: "KSh 152K", location: "Mombasa" },
    { name: "David Ochieng", rating: 4.7, jobs: 42, earnings: "KSh 168K", location: "Kisumu" },
    { name: "Grace Mutua", rating: 4.9, jobs: 35, earnings: "KSh 140K", location: "Nakuru" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:flex font-inter">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl mb-8 sm:mb-10 flex items-center justify-between px-6 sm:px-8 py-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-3 rounded-xl text-slate-700 hover:bg-white/60 transition-all duration-200 shadow-sm"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  Admin Dashboard
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-medium">
                  Welcome back! Here is your platform overview.
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
              <Shield className="w-4 h-4" />
              <span>System Healthy</span>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.title}
                    className={`${stat.bgColor} ${stat.borderColor} rounded-2xl shadow-lg border-2 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-bold text-slate-600 truncate uppercase tracking-wide">
                          {stat.title}
                        </p>
                        <p className="text-2xl sm:text-4xl font-black text-slate-900 mt-2 leading-none">{stat.value}</p>
                        <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-2 truncate">{stat.change}</p>
                      </div>
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/60 rounded-2xl flex items-center justify-center flex-shrink-0 ml-3 shadow-lg">
                        <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Recent Activity */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Recent Platform Activity</h2>
                  <p className="text-slate-600 font-medium">Monitor system events and user actions</p>
                </div>
                <button className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4 p-6 sm:p-8">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="group p-4 sm:p-6 bg-gradient-to-r from-white/60 to-slate-50/60 rounded-2xl hover:from-white/80 hover:to-slate-50/80 transition-all duration-300 border border-white/40 hover:shadow-lg hover:scale-[1.02]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <h3 className="font-bold text-slate-900 text-base sm:text-lg">{activity.title}</h3>
                          {activity.priority === "Urgent" && (
                            <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-sm">
                              Urgent
                            </span>
                          )}
                          {activity.priority === "High" && (
                            <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-sm">
                              High Priority
                            </span>
                          )}
                          <span
                            className={`px-3 py-1 text-xs font-bold rounded-full ${
                              activity.status === "Active"
                                ? "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700"
                                : activity.status === "Under Review"
                                  ? "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700"
                                  : activity.status === "Pending Verification"
                                    ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700"
                                    : "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700"
                            }`}
                          >
                            {activity.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm font-bold text-slate-600">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                            <span className="truncate">{activity.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Activity className="w-4 h-4 mr-2 text-indigo-500" />
                            <span className="text-indigo-600 font-black truncate">{activity.category}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-slate-400" />
                            {activity.time}
                          </div>
                          <div className="flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
                            <span className="text-amber-600 font-black">{activity.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Fundis */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-emerald-50 to-teal-50">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Top Performing Fundis</h2>
                  <p className="text-slate-600 font-medium">Highest rated and most active professionals</p>
                </div>
                <button className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4 p-6 sm:p-8">
                {topFundis.map((fundi, index) => (
                  <div
                    key={index}
                    className="group p-4 sm:p-6 bg-gradient-to-r from-white/60 to-slate-50/60 rounded-2xl hover:from-white/80 hover:to-slate-50/80 transition-all duration-300 border border-white/40 hover:shadow-lg hover:scale-[1.02]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                          {fundi.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 text-base sm:text-lg">{fundi.name}</h3>
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm font-bold text-slate-600 mt-2">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 mr-2 text-amber-400 fill-current" />
                              <span className="text-amber-600 font-black">{fundi.rating}</span>
                            </div>
                            <div className="flex items-center">
                              <Building2 className="w-4 h-4 mr-2 text-indigo-500" />
                              <span className="text-indigo-600 font-black">{fundi.jobs} jobs</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                              <span className="truncate">{fundi.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl sm:text-2xl font-black text-slate-900">{fundi.earnings}</p>
                        <p className="text-xs font-medium text-slate-500">Total Earnings</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Quick Actions */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-orange-50 to-pink-50">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Admin Quick Actions</h2>
                <p className="text-slate-600 font-medium">Manage your platform efficiently</p>
              </div>
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <button className="group h-20 sm:h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:via-pink-600 hover:to-red-700 text-white rounded-2xl font-bold transition-all duration-300 hover:shadow-xl transform hover:scale-105 shadow-lg">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-xs sm:text-sm">Review Reports</span>
                  </button>
                  <button className="group h-20 sm:h-24 flex flex-col items-center justify-center space-y-2 bg-white/60 border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-white/80 hover:border-slate-300 transition-all duration-300 hover:shadow-lg transform hover:scale-105">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 group-hover:text-slate-700 group-hover:scale-110 transition-all" />
                    <span className="text-xs sm:text-sm">View Messages</span>
                  </button>
                  <button className="group h-20 sm:h-24 flex flex-col items-center justify-center space-y-2 bg-white/60 border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-white/80 hover:border-slate-300 transition-all duration-300 hover:shadow-lg transform hover:scale-105">
                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 group-hover:text-slate-700 group-hover:scale-110 transition-all" />
                    <span className="text-xs sm:text-sm">Analytics</span>
                  </button>
                  <button className="group h-20 sm:h-24 flex flex-col items-center justify-center space-y-2 bg-white/60 border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-white/80 hover:border-slate-300 transition-all duration-300 hover:shadow-lg transform hover:scale-105">
                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 group-hover:text-slate-700 group-hover:scale-110 transition-all" />
                    <span className="text-xs sm:text-sm">System Health</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
