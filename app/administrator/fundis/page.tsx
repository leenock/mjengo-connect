"use client"

import { useState } from "react"
import AdminSidebar from "@/components/admin/Sidebar"
import {
  Search,
  Filter,
  MoreHorizontal,
  Star,
  MapPin,
  Phone,
  Mail,
  Menu,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  AlertTriangle,
  Download,
} from "lucide-react"

export default function AdminManageFundis() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const fundis = [
    {
      id: 1,
      name: "Peter Kamau",
      email: "peter.kamau@email.com",
      phone: "+254 712 345 678",
      location: "Nairobi",
      skills: ["Plumbing", "Electrical"],
      rating: 4.9,
      jobsCompleted: 45,
      joinDate: "2023-01-15",
      status: "active",
      earnings: "KSh 180,000",
      avatar: "PK",
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      name: "Mary Wanjiku",
      email: "mary.wanjiku@email.com",
      phone: "+254 723 456 789",
      location: "Kiambu",
      skills: ["Painting", "Tiling"],
      rating: 4.8,
      jobsCompleted: 38,
      joinDate: "2023-02-20",
      status: "active",
      earnings: "KSh 152,000",
      avatar: "MW",
      lastActive: "1 day ago",
    },
    {
      id: 3,
      name: "David Ochieng",
      email: "david.ochieng@email.com",
      phone: "+254 734 567 890",
      location: "Kisumu",
      skills: ["Masonry", "Roofing"],
      rating: 4.7,
      jobsCompleted: 42,
      joinDate: "2023-03-10",
      status: "suspended",
      earnings: "KSh 168,000",
      avatar: "DO",
      lastActive: "3 days ago",
    },
    {
      id: 4,
      name: "Grace Mutua",
      email: "grace.mutua@email.com",
      phone: "+254 745 678 901",
      location: "Mombasa",
      skills: ["Carpentry", "Welding"],
      rating: 4.9,
      jobsCompleted: 35,
      joinDate: "2023-04-05",
      status: "pending",
      earnings: "KSh 140,000",
      avatar: "GM",
      lastActive: "5 hours ago",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700"
      case "suspended":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-700"
      case "pending":
        return "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700"
      default:
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "suspended":
        return <Ban className="w-4 h-4" />
      case "pending":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return null
    }
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
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  Manage Fundis
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-medium">1,247 registered skilled workers</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-3"></div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden mb-8">
            <div className="p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-indigo-50 to-blue-50">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Search & Filter</h2>
              <p className="text-slate-600 font-medium">Find and manage fundis efficiently</p>
            </div>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search fundis by name, email, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full sm:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                    <Filter className="w-5 h-5" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Fundis Table */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Fundis Directory</h2>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/70 text-slate-700 rounded-xl font-bold hover:bg-white/90 transition-all duration-200 shadow-lg">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
                <select className="px-4 py-2 bg-white/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm">
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                  <option value="100">100 per page</option>
                </select>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-white/30">
                    <tr>
                      <th className="text-left py-4 px-6 font-black text-slate-900">
                        <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      </th>
                      <th className="text-left py-4 px-6 font-black text-slate-900 cursor-pointer hover:text-blue-600">
                        Fundi ↕
                      </th>
                      <th className="text-left py-4 px-6 font-black text-slate-900 hidden md:table-cell cursor-pointer hover:text-blue-600">
                        Contact ↕
                      </th>
                      <th className="text-left py-4 px-6 font-black text-slate-900 hidden lg:table-cell">Skills</th>
                      <th className="text-left py-4 px-6 font-black text-slate-900 cursor-pointer hover:text-blue-600">
                        Performance ↕
                      </th>
                      <th className="text-left py-4 px-6 font-black text-slate-900 cursor-pointer hover:text-blue-600">
                        Status ↕
                      </th>
                      <th className="text-left py-4 px-6 font-black text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fundis.map((fundi) => (
                      <tr key={fundi.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-6">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg text-sm">
                              {fundi.avatar}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-slate-900 truncate">{fundi.name}</p>
                              <div className="flex items-center space-x-2 text-sm">
                                <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                <span className="font-medium text-slate-600 truncate">{fundi.location}</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">Last active: {fundi.lastActive}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden md:table-cell">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center space-x-2 text-sm">
                              <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              <span className="font-medium text-slate-600 truncate">{fundi.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              <span className="font-medium text-slate-600">{fundi.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {fundi.skills.slice(0, 2).map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-bold rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                            {fundi.skills.length > 2 && (
                              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                                +{fundi.skills.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-amber-400 fill-current" />
                              <span className="font-bold text-slate-900">{fundi.rating}</span>
                            </div>
                            <p className="text-sm font-medium text-slate-600">{fundi.jobsCompleted} jobs</p>
                            <p className="text-sm font-bold text-emerald-600">{fundi.earnings}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div
                            className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(fundi.status)}`}
                          >
                            {getStatusIcon(fundi.status)}
                            <span className="capitalize">{fundi.status}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
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
              <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <span className="text-sm font-medium text-slate-600">0 selected</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-200 transition-colors">
                      Activate
                    </button>
                    <button className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-bold hover:bg-amber-200 transition-colors">
                      Suspend
                    </button>
                    <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-bold hover:bg-red-200 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
                <div className="text-sm font-medium text-slate-600">Showing 1-4 of 1,247 fundis</div>
              </div>
            </div>

            {/* Enhanced Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <span className="text-sm font-medium text-slate-600">Go to page:</span>
                <input
                  type="number"
                  min="1"
                  max="312"
                  defaultValue="1"
                  className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-600">of 312</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
                <button
                  className="px-3 py-1.5 bg-white/70 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-white/90 transition-colors disabled:opacity-50 text-sm"
                  disabled
                >
                  First
                </button>
                <button
                  className="px-3 py-1.5 bg-white/70 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-white/90 transition-colors disabled:opacity-50 text-sm"
                  disabled
                >
                  Previous
                </button>
                <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-bold shadow-lg text-sm">
                  1
                </button>
                <button className="px-3 py-1.5 bg-white/70 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-white/90 transition-colors text-sm">
                  2
                </button>
                <button className="px-3 py-1.5 bg-white/70 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-white/90 transition-colors text-sm">
                  3
                </button>
                <span className="px-2 text-slate-400">...</span>
                <button className="px-3 py-1.5 bg-white/70 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-white/90 transition-colors text-sm">
                  312
                </button>
                <button className="px-3 py-1.5 bg-white/70 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-white/90 transition-colors text-sm">
                  Next
                </button>
                <button className="px-3 py-1.5 bg-white/70 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-white/90 transition-colors text-sm">
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
