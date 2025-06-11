"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/fundi/Sidebar"
import {
  Menu,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Briefcase,
  Search,
  Heart,
  Eye,
  CreditCard,
  Bookmark,
  Filter,
  ArrowRight,
} from "lucide-react"

export default function JobListingsPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const categories = ["All", "Plumbing", "Electrical", "Painting", "Construction", "Carpentry", "Roofing"]

  // Enhanced stats with gradients
  const stats = [
    {
      title: "Active Jobs",
      value: "8",
      change: "+2 this week",
      icon: Briefcase,
      color: "text-indigo-600",
      bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-200",
    },
    {
      title: "Saved Jobs",
      value: "24",
      change: "+5 this week",
      icon: Bookmark,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
    },
    {
      title: "Subscription Spent",
      value: "KSh 200",
      change: "This month",
      icon: CreditCard,
      color: "text-violet-600",
      bgColor: "bg-gradient-to-br from-violet-50 to-violet-100",
      borderColor: "border-violet-200",
    },
    {
      title: "Next Payment",
      value: "12 days",
      change: "Premium plan",
      icon: Calendar,
      color: "text-amber-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
    },
  ]

  // Recent job postings
  const recentJobs = [
    {
      id: 1,
      title: "House Painting - 3 Bedroom",
      company: "Kamau Properties Ltd",
      location: "Westlands, Nairobi",
      budget: "Ksh 800",
      postedTime: "2 hours ago",
      StartDate: "2025-01-15",
      urgency: "Urgent",
      views: 156,
      status: "Available",
    },
  ]

  // Saved jobs
  const recentApplications = [
    {
      id: 1,
      title: "House Painting - 3 Bedroom",
      company: "Kamau Properties Ltd",
      location: "Westlands, Nairobi",
      budget: "Ksh 800",
      postedTime: "2 hours ago",
      StartDate: "2025-01-15",
      urgency: "Urgent",
      views: 156,
      status: "Available",
    },
  ]

  // Job listings data
  const jobListings = [
    {
      id: 1,
      title: "House Painting - 3 Bedroom",
      company: "Kamau Properties Ltd",
      location: "Westlands, Nairobi",
      budget: "Ksh 800",
      duration: "5 days",
      postedTime: "2 hours ago",
      StartDate: "2025-01-15",
      urgency: "Urgent",
      category: "Painting",
      description:
        "Looking for experienced painters to paint a 3-bedroom house. Must have own equipment and materials will be provided.",
      requirements: ["Interior Painting", "Exterior Painting", "Color Consultation"],
      views: 156,
      verified: true,
      saved: false,
    },
  ]

  const filteredJobs = jobListings.filter((job) => {
    const matchesCategory = selectedCategory === "All" || job.category === selectedCategory
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleSaveJob = (jobId: number) => {
    console.log(`Toggle save for job ${jobId}`)
  }

  const viewJobDetails = (jobId: number) => {
    router.push(`./job/${jobId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:flex font-inter">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl mb-8 sm:mb-10 flex items-center justify-between px-6 sm:px-8 py-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-3 rounded-xl text-slate-700 hover:bg-white/60 transition-all duration-200 shadow-sm"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-2xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  Welcome Kamau
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-extrabold">
                  Discover amazing opportunities and connect
                </p>
              </div>
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
                        <p className="text-xl sm:text-4xl font-black text-slate-900 mt-2 leading-none">{stat.value}</p>
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

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
              {/* Recent Job Postings */}
              <div className="xl:col-span-2">
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">Recent Job Postings</h2>
                      <p className="text-slate-600 font-extrabold">Fresh opportunities just for you</p>
                    </div>
                    <button className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg">
                      View All
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4 p-6 sm:p-8">
                    {recentJobs.map((job) => (
                      <div
                        key={job.id}
                        className="group p-4 sm:p-6 bg-gradient-to-r from-white/60 to-slate-50/60 rounded-2xl hover:from-white/80 hover:to-slate-50/80 transition-all duration-300 border border-white/40 hover:shadow-lg hover:scale-[1.02]"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <h3 className="font-bold text-slate-900 text-base sm:text-lg">{job.title}</h3>
                              {job.urgency === "Urgent" && (
                                <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-sm">
                                  Urgent
                                </span>
                              )}
                              <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700">
                                {job.status}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-slate-600 mb-3">{job.company}</p>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm font-bold text-slate-600">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                                <span className="truncate">{job.location}</span>
                              </div>
                              <div className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-2 text-emerald-500" />
                                <span className="text-emerald-600 font-black">{job.budget}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-slate-400" />
                                {job.postedTime}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                {job.StartDate}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm font-bold text-slate-600 flex-shrink-0">
                            <div className="flex items-center text-indigo-600">
                              <Eye className="w-4 h-4 mr-1" />
                              {job.views}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Saved Jobs */}
              <div>
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                  <div className="p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-emerald-50 to-teal-50">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">Saved Jobs</h2>
                    <p className="text-slate-600 font-extrabold">Your bookmarked opportunities</p>
                  </div>
                  <div className="space-y-4 p-6 sm:p-8">
                    {recentApplications.map((application) => (
                      <div
                        key={application.id}
                        className="group p-4 sm:p-5 border-2 border-slate-200 rounded-2xl hover:border-orange-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate flex-1">
                            {application.title}
                          </h4>
                          <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 ml-2">
                            {application.status}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-600 mb-3 truncate">{application.company}</p>
                        <div className="flex items-center justify-between text-sm font-bold">
                          <div className="flex items-center text-emerald-600">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {application.budget}
                          </div>
                          <span className="text-slate-600">{application.StartDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Search and Filter Section */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-6 sm:p-8 mb-8 mt-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search Bar */}
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 group-hover:border-slate-300"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-600" />
                <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-3 rounded-xl font-bold whitespace-nowrap transition-all duration-200 ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                          : "bg-white/60 text-slate-700 hover:bg-white/80 border-2 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Job Listings */}
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-6 sm:p-8 hover:shadow-3xl transition-all duration-300 hover:scale-[1.01] group"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{job.title}</h3>
                          {job.verified && (
                            <span className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-xs font-bold rounded-full">
                              ✓ Verified
                            </span>
                          )}
                          {job.urgency === "Urgent" && (
                            <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 font-bold text-lg mb-3">{job.company}</p>
                        <p className="text-slate-600 font-medium text-base mb-4 leading-relaxed">{job.description}</p>
                      </div>

                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className="p-3 rounded-xl hover:bg-white/60 transition-all duration-200 group-hover:scale-110"
                      >
                        <Heart
                          className={`w-6 h-6 ${
                            job.saved ? "fill-red-500 text-red-500" : "text-slate-400 hover:text-red-400"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Job Details Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center text-sm font-bold text-slate-600">
                        <MapPin className="w-5 h-5 mr-3 text-slate-400" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center text-sm font-bold">
                        <DollarSign className="w-5 h-5 mr-3 text-emerald-500" />
                        <span className="text-emerald-600 font-black">{job.budget}</span>
                      </div>
                      <div className="flex items-center text-sm font-bold text-slate-600">
                        <Clock className="w-5 h-5 mr-3 text-slate-400" />
                        <span>Duration {job.duration}</span>
                      </div>
                      <div className="flex items-center text-sm font-bold text-slate-600">
                        <Calendar className="w-5 h-5 mr-3 text-slate-400" />
                        <span>{job.postedTime}</span>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-3">
                        {job.requirements.slice(0, 2).map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 text-sm font-bold rounded-xl"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.requirements.length > 2 && (
                          <span className="px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 text-sm font-bold rounded-xl">
                            +{job.requirements.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats and Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-6 text-sm font-bold text-slate-500">
                        <div className="flex items-center">
                          <Eye className="w-5 h-5 mr-2" />
                          <span>{job.views} views</span>
                        </div>
                        
                      </div>

                      <button
                        onClick={() => viewJobDetails(job.id)}
                        className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white font-bold rounded-2xl hover:from-orange-600 hover:via-pink-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
                      >
                        View Job Details
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced No Results */}
          {filteredJobs.length === 0 && (
            <div className="text-center py-16 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">No jobs found</h3>
              <p className="text-slate-600 font-medium text-lg max-w-md mx-auto">
                Try adjusting your search criteria or check back later for new opportunities.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
