"use client"

import { useState } from "react"
import AdminSidebar from "@/components/admin/Sidebar"
import {
  Search,
  Filter,
  MoreHorizontal,
  Building2,
  MapPin,
  Mail,
  Menu,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Download,
  Clock,
  Calendar,
  Users,
} from "lucide-react"

export default function AdminManageJobs() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const jobs = [
    {
      id: 1,
      title: "House Painting - 3 Bedroom",
      description: "Need professional painters for interior and exterior painting of a 3-bedroom house in Westlands.",
      client: {
        name: "John Kamau",
        company: "Kamau Properties Ltd",
        email: "john@kamauproperties.co.ke",
        phone: "+254 712 345 678",
        avatar: "JK",
      },
      location: "Westlands, Nairobi",
      budget: "KSh 45,000",
      category: "Painting",
      skills: ["Painting", "Interior Design"],
      postedDate: "2024-01-15",
      deadline: "2024-02-15",
      status: "active",
      applicants: 12,
      priority: "Normal",
      duration: "2 weeks",
    },
    {
      id: 2,
      title: "Plumbing Repair - Kitchen & Bathroom",
      description: "Urgent plumbing repairs needed for kitchen sink and bathroom fixtures in Karen residence.",
      client: {
        name: "Sarah Mwangi",
        company: "Individual",
        email: "sarah.mwangi@email.com",
        phone: "+254 723 456 789",
        avatar: "SM",
      },
      location: "Karen, Nairobi",
      budget: "KSh 15,000",
      category: "Plumbing",
      skills: ["Plumbing", "Pipe Fitting"],
      postedDate: "2024-01-18",
      deadline: "2024-01-25",
      status: "urgent",
      applicants: 8,
      priority: "Urgent",
      duration: "3 days",
    },
    {
      id: 3,
      title: "Electrical Installation - New Office",
      description:
        "Complete electrical installation for new office space including lighting, outlets, and security systems.",
      client: {
        name: "Michael Odhiambo",
        company: "Odhiambo Construction",
        email: "michael@odhiamboconstruction.com",
        phone: "+254 734 567 890",
        avatar: "MO",
      },
      location: "Kisumu, Kenya",
      budget: "KSh 120,000",
      category: "Electrical",
      skills: ["Electrical", "Security Systems"],
      postedDate: "2024-01-10",
      deadline: "2024-02-28",
      status: "pending",
      applicants: 15,
      priority: "High",
      duration: "1 month",
    },
    {
      id: 4,
      title: "Roofing Repair - Residential",
      description: "Roof repair and maintenance for residential property. Need experienced roofers with own tools.",
      client: {
        name: "Grace Wanjiru",
        company: "Individual",
        email: "grace.wanjiru@email.com",
        phone: "+254 745 678 901",
        avatar: "GW",
      },
      location: "Nakuru, Kenya",
      budget: "KSh 35,000",
      category: "Roofing",
      skills: ["Roofing", "Waterproofing"],
      postedDate: "2024-01-20",
      deadline: "2024-02-10",
      status: "completed",
      applicants: 6,
      priority: "Normal",
      duration: "1 week",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700"
      case "urgent":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-700"
      case "pending":
        return "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700"
      case "completed":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700"
      case "cancelled":
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700"
      default:
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "urgent":
        return <AlertTriangle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
        return <Ban className="w-4 h-4" />
      default:
        return null
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white"
      case "High":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white"
      case "Normal":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700"
      default:
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Painting: "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700",
      Plumbing: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700",
      Electrical: "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700",
      Roofing: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700",
      Masonry: "bg-gradient-to-r from-stone-100 to-slate-100 text-slate-700",
      Carpentry: "bg-gradient-to-r from-orange-100 to-red-100 text-orange-700",
    }
    return colors[category as keyof typeof colors] || "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700"
  }

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
                <h1 className="text-3xl sm:text-2xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  Manage Job Listings-
                </h1>
                <p className="text-slate-600 mt-2 text-bold sm:text-lg font-extrabold">2,156 total job postings</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-3"></div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden mb-8">
            <div className="p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-orange-50 to-amber-50">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">Search & Filter</h2>
              <p className="text-slate-600 font-extrabold">Find and manage job listings efficiently</p>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search jobs by title, description, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full sm:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="urgent">Urgent</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select className="w-full sm:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium">
                    <option value="all">All Categories</option>
                    <option value="painting">Painting</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="roofing">Roofing</option>
                    <option value="masonry">Masonry</option>
                    <option value="carpentry">Carpentry</option>
                  </select>
                  <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                    <Filter className="w-5 h-5" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs Table */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Job Listings Directory</h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white/70 text-slate-700 rounded-xl font-bold hover:bg-white/90 transition-all duration-200 shadow-lg">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <select className="px-4 py-2 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium text-sm">
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                  <option value="100">100 per page</option>
                </select>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full table-auto min-w-full">
                  <thead className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-white/30">
                    <tr>
                      <th className="text-left py-4 px-6 font-black text-slate-900">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                        />
                      </th>
                      <th className="text-left py-4 px-6 font-black text-slate-900 cursor-pointer hover:text-orange-600">
                        Job Details ↕
                      </th>
                      <th className="text-left py-4 px-6 font-black text-slate-900 hidden md:table-cell cursor-pointer hover:text-orange-600">
                        Client ↕
                      </th>
                      <th className="text-left py-4 px-6 font-black text-slate-900 hidden lg:table-cell cursor-pointer hover:text-orange-600">
                        Timeline ↕
                      </th>
                      <th className="text-left py-4 px-6 font-black text-slate-900 cursor-pointer hover:text-orange-600">
                        Budget ↕
                      </th>
                      <th className="text-left py-4 px-6 font-black text-slate-900 cursor-pointer hover:text-orange-600">
                        Status ↕
                      </th>
                      <th className="text-left py-4 px-6 font-black text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                          />
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-bold text-slate-900 truncate">{job.title}</h3>
                              {job.priority !== "Normal" && (
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-bold ${getPriorityColor(job.priority)}`}
                                >
                                  {job.priority}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-2 mb-2">{job.description}</p>
                            <div className="flex items-center space-x-3 text-sm">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span className="font-medium text-slate-600 truncate">{job.location}</span>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-bold ${getCategoryColor(job.category)}`}
                              >
                                {job.category}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3 text-slate-400" />
                                <span className="font-medium text-slate-600">{job.applicants} applicants</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {job.skills.slice(0, 2).map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 text-xs font-bold rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                              {job.skills.length > 2 && (
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                                  +{job.skills.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6 hidden md:table-cell">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg text-sm">
                              {job.client.avatar}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-slate-900 truncate">{job.client.name}</p>
                              <div className="flex items-center space-x-2 text-sm">
                                <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                <span className="font-medium text-slate-600 truncate">{job.client.company}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                <span className="font-medium text-slate-600 truncate">{job.client.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6 hidden lg:table-cell">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1 text-sm">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span className="font-medium text-slate-600">
                                Posted: {new Date(job.postedDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span className="font-medium text-slate-600">
                                Deadline: {new Date(job.deadline).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              <span className="font-bold text-slate-900">Duration: {job.duration}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                            <span className="font-bold text-slate-900">{job.budget}</span>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <div
                            className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(job.status)}`}
                          >
                            {getStatusIcon(job.status)}
                            <span className="capitalize">{job.status}</span>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <div className="flex items-center space-x-1">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100">
                              <Eye className="w-4 h-4 text-slate-600" />
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100">
                              <Edit className="w-4 h-4 text-slate-600" />
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="w-4 h-4 text-slate-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bulk Actions Bar */}
              <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <span className="text-sm font-medium text-slate-600">0 selected</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold hover:bg-emerald-200 transition-colors">
                      Approve
                    </button>
                    <button className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-bold hover:bg-amber-200 transition-colors">
                      Mark Urgent
                    </button>
                    <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-bold hover:bg-red-200 transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-sm font-medium text-slate-600">Showing 1-4 of 2,156 jobs</div>
              </div>
            </div>

            {/* Enhanced Pagination */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <span className="text-sm font-medium text-slate-600 whitespace-nowrap">Go to page:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="539"
                    defaultValue="1"
                    className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-slate-600 whitespace-nowrap">of 539</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                <button
                  className="px-2 sm:px-4 py-2 bg-white/70 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-white/90 transition-colors disabled:opacity-50 text-sm"
                  disabled
                >
                  First
                </button>
                <button
                  className="px-2 sm:px-4 py-2 bg-white/70 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-white/90 transition-colors disabled:opacity-50 text-sm"
                  disabled
                >
                  Prev
                </button>
                <button className="px-2 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-bold shadow-lg text-sm">
                  1
                </button>
                <button className="px-2 sm:px-4 py-2 bg-white/70 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-white/90 transition-colors text-sm">
                  2
                </button>
                <button className="px-2 sm:px-4 py-2 bg-white/70 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-white/90 transition-colors text-sm">
                  3
                </button>
                <span className="px-1 sm:px-2 text-slate-400 text-sm">...</span>
                <button className="px-2 sm:px-4 py-2 bg-white/70 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-white/90 transition-colors text-sm">
                  539
                </button>
                <button className="px-2 sm:px-4 py-2 bg-white/70 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-white/90 transition-colors text-sm">
                  Next
                </button>
                <button className="px-2 sm:px-4 py-2 bg-white/70 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-white/90 transition-colors text-sm">
                  Last
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
