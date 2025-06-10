"use client"

import { useState } from "react"
import AdminSidebar from "@/components/admin/Sidebar"
import {
  AlertTriangle,
  Flag,
  Eye,
  Check,
  Menu,
  Search,
  Clock,
  User,
  MessageSquare,
  FileText,
  Ban,
  Shield,
} from "lucide-react"

export default function AdminModeration() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("pending")

  const reports = [
    {
      id: 1,
      type: "inappropriate_content",
      title: "Inappropriate Profile Description",
      description: "User profile contains offensive language and inappropriate content",
      reportedBy: "John Doe",
      reportedUser: "Mike Johnson",
      reportedContent: "Profile Description",
      timestamp: "2024-01-20 14:30",
      status: "pending",
      priority: "high",
      category: "Profile Content",
    },
    {
      id: 2,
      type: "fake_job",
      title: "Suspicious Job Posting",
      description: "Job posting appears to be fake with unrealistic requirements and pay",
      reportedBy: "Sarah Wilson",
      reportedUser: "ABC Construction",
      reportedContent: "Job Listing",
      timestamp: "2024-01-20 12:15",
      status: "pending",
      priority: "urgent",
      category: "Job Posting",
    },
    {
      id: 3,
      type: "harassment",
      title: "User Harassment in Messages",
      description: "User reported receiving threatening and harassing messages",
      reportedBy: "Grace Mwangi",
      reportedUser: "Tom Smith",
      reportedContent: "Private Messages",
      timestamp: "2024-01-20 10:45",
      status: "under_review",
      priority: "urgent",
      category: "Communication",
    },
    {
      id: 4,
      type: "spam",
      title: "Spam Job Applications",
      description: "User is sending identical spam applications to multiple jobs",
      reportedBy: "Peter Kamau",
      reportedUser: "Jane Doe",
      reportedContent: "Job Applications",
      timestamp: "2024-01-19 16:20",
      status: "resolved",
      priority: "medium",
      category: "Applications",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700"
      case "under_review":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700"
      case "resolved":
        return "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700"
      case "dismissed":
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700"
      default:
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white"
      case "high":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white"
      case "medium":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700"
      case "low":
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700"
      default:
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "inappropriate_content":
        return <Flag className="w-5 h-5" />
      case "fake_job":
        return <FileText className="w-5 h-5" />
      case "harassment":
        return <MessageSquare className="w-5 h-5" />
      case "spam":
        return <AlertTriangle className="w-5 h-5" />
      default:
        return <Flag className="w-5 h-5" />
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
                  Content Moderation
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-medium">
                  Review and manage reported content
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>5 Urgent</span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden mb-8">
            <div className="p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-red-50 to-pink-50">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Filter Reports</h2>
              <p className="text-slate-600 font-medium">Find and manage content reports efficiently</p>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search reports by title, user, or content..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-medium"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full sm:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full sm:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  >
                    <option value="all">All Types</option>
                    <option value="inappropriate_content">Inappropriate Content</option>
                    <option value="fake_job">Fake Job</option>
                    <option value="harassment">Harassment</option>
                    <option value="spam">Spam</option>
                  </select>
                  <select className="w-full sm:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-medium">
                    <option value="all">All Priority</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Content Reports</h2>
              <div className="text-sm font-medium text-slate-600">Showing {reports.length} reports</div>
            </div>

            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                            {getTypeIcon(report.type)}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg">{report.title}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(report.status)}`}
                              >
                                {report.status.replace("_", " ").toUpperCase()}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(report.priority)}`}
                              >
                                {report.priority.toUpperCase()}
                              </span>
                              <span className="px-3 py-1 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 text-xs font-bold rounded-full">
                                {report.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-600 font-medium mb-4">{report.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="font-medium text-slate-600 truncate">
                              Reported by: <span className="font-bold text-slate-900">{report.reportedBy}</span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="font-medium text-slate-600 truncate">
                              Target: <span className="font-bold text-slate-900">{report.reportedUser}</span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="font-medium text-slate-600 truncate">
                              Content: <span className="font-bold text-slate-900">{report.reportedContent}</span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="font-medium text-slate-600 text-xs sm:text-sm">{report.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full sm:w-auto lg:w-auto">
                        <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg text-sm min-h-[40px]">
                          <Eye className="w-4 h-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">Review</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg text-sm min-h-[40px]">
                          <Check className="w-4 h-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">Approve</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg text-sm min-h-[40px]">
                          <Ban className="w-4 h-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">Action</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
