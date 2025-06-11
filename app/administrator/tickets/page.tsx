"use client"

import { useState } from "react"
import AdminSidebar from "@/components/admin/Sidebar"
import { MessageSquare, Search, Menu, Clock, User, Mail, AlertTriangle, Eye, Reply, Archive } from "lucide-react"

export default function AdminSupportTickets() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")

  const tickets = [
    {
      id: 1,
      subject: "Unable to post job - Payment gateway error",
      description: "I'm getting an error when trying to post a job. The payment gateway keeps failing.",
      user: {
        name: "John Kamau",
        email: "john.kamau@email.com",
        phone: "+254 712 345 678",
        type: "Client",
      },
      status: "open",
      priority: "high",
      category: "Payment Issues",
      createdAt: "2024-01-20 14:30",
      lastReply: "2024-01-20 15:45",
      replies: 3,
      assignedTo: "Sarah Manager",
    },
    {
      id: 2,
      subject: "Profile verification taking too long",
      description: "I submitted my documents for verification 5 days ago but haven't heard back.",
      user: {
        name: "Mary Wanjiku",
        email: "mary.wanjiku@email.com",
        phone: "+254 723 456 789",
        type: "Fundi",
      },
      status: "in_progress",
      priority: "medium",
      category: "Account Verification",
      createdAt: "2024-01-19 10:15",
      lastReply: "2024-01-20 09:30",
      replies: 5,
      assignedTo: "Mike Moderator",
    },
    {
      id: 3,
      subject: "Inappropriate messages from client",
      description: "A client is sending me inappropriate messages. I need help blocking them.",
      user: {
        name: "Peter Ochieng",
        email: "peter.ochieng@email.com",
        phone: "+254 734 567 890",
        type: "Fundi",
      },
      status: "urgent",
      priority: "urgent",
      category: "Harassment Report",
      createdAt: "2024-01-20 16:20",
      lastReply: "2024-01-20 16:20",
      replies: 1,
      assignedTo: "Grace Support",
    },
    {
      id: 4,
      subject: "How to update my skills and portfolio",
      description: "I want to add more skills to my profile and upload new portfolio images.",
      user: {
        name: "Grace Mutua",
        email: "grace.mutua@email.com",
        phone: "+254 745 678 901",
        type: "Fundi",
      },
      status: "resolved",
      priority: "low",
      category: "General Inquiry",
      createdAt: "2024-01-18 11:45",
      lastReply: "2024-01-19 14:20",
      replies: 4,
      assignedTo: "Grace Support",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700"
      case "in_progress":
        return "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700"
      case "urgent":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-700"
      case "resolved":
        return "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700"
      case "closed":
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

  const getCategoryColor = (category: string) => {
    const colors = {
      "Payment Issues": "bg-gradient-to-r from-red-100 to-pink-100 text-red-700",
      "Account Verification": "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700",
      "Harassment Report": "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700",
      "General Inquiry": "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700",
      "Technical Support": "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700",
    }
    return colors[category as keyof typeof colors] || "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700"
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
                <h1 className="text-3xl sm:text-2xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  Support Tickets
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-bold">Manage customer support requests</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>3 Urgent</span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden mb-8">
            <div className="p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-green-50 to-emerald-50">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">Filter Tickets</h2>
              <p className="text-slate-600 font-bold">Search and manage support tickets</p>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tickets by subject, user, or description..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full sm:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="urgent">Urgent</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="w-full sm:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="all">All Priority</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <select className="w-full sm:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium">
                    <option value="all">All Categories</option>
                    <option value="payment">Payment Issues</option>
                    <option value="verification">Account Verification</option>
                    <option value="harassment">Harassment Report</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tickets List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Support Tickets</h2>
              <div className="text-sm font-bold text-slate-600">{tickets.length} total tickets</div>
            </div>

            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <MessageSquare className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg">{ticket.subject}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(ticket.status)}`}
                              >
                                {ticket.status.replace("_", " ").toUpperCase()}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(ticket.priority)}`}
                              >
                                {ticket.priority.toUpperCase()}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(ticket.category)}`}
                              >
                                {ticket.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-600 font-medium mb-4">{ticket.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-600">
                              {ticket.user.name} ({ticket.user.type})
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-600">{ticket.user.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-600">Created: {ticket.createdAt}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-600">
                              {ticket.replies} replies • Assigned to {ticket.assignedTo}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row lg:flex-col gap-2">
                        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg">
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg">
                          <Reply className="w-4 h-4" />
                          <span>Reply</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-xl font-bold hover:from-slate-600 hover:to-slate-700 transition-all duration-200 shadow-lg">
                          <Archive className="w-4 h-4" />
                          <span>Close</span>
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
