"use client"
import { useState, useEffect } from "react"
import Sidebar from "@/components/job_posting/Sidebar"
import { useRouter } from "next/navigation"
import ClientAuthService, { type ClientUserData } from "@/app/services/client_user"
import {
  BarChart3,
  Users,
  Briefcase,
  TrendingUp,
  Plus,
  Calendar,
  MessageSquare,
  User,
  DollarSign,
  Clock,
  MapPin,
  Menu,
  BarChartIcon as ChartBarDecreasingIcon,
  ArrowRight,
} from "lucide-react"

export default function PostJobPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<ClientUserData | null>(null)
  const router = useRouter()

  // Load user data on component mount
  useEffect(() => {
    const userData = ClientAuthService.getUserData()
    if (userData) {
      setCurrentUser(userData)
    }
  }, [])

  const stats = [
    {
      title: "Active Jobs",
      value: "12",
      change: "+2 this week",
      icon: Briefcase,
      color: "text-indigo-600",
      bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-200",
    },
    {
      title: "Total Jobs Posted",
      value: "156",
      change: "+23 this week",
      icon: Users,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
    },
    {
      title: "Total Clicks",
      value: "34",
      change: "+5 this month",
      icon: TrendingUp,
      color: "text-amber-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
    },
    {
      title: "Total Spent",
      value: "KSh 10,000",
      change: "+12% this month",
      icon: ChartBarDecreasingIcon,
      color: "text-violet-600",
      bgColor: "bg-gradient-to-br from-violet-50 to-violet-100",
      borderColor: "border-violet-200",
    },
  ]

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
    // Add more jobs as needed
    {
      id: 2,
      title: "Office Renovation",
      company: "Tech Innovations Ltd",
      location: "CBD, Nairobi",
      budget: "Ksh 1000",
      duration: "2 weeks",
      postedTime: "1 day ago",
      StartDate: "2025-01-20",
      urgency: "Normal",
      category: "Renovation",
      description:
        "Renovation of office space including painting, flooring, and electrical work. Must have experience with commercial projects.",
      requirements: ["Commercial Renovation", "Electrical Work", "Flooring Installation"],
      views: 89,
      verified: false,
      saved: true,
    },
  ]

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
                  Welcome Back {" "}
                  {currentUser?.firstName && currentUser?.lastName
                    ? `${currentUser.firstName} ${currentUser.lastName}`
                    : "User"}
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-extrabold">
                  Here is what is happening with your job listings.
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
            {/* Recent Jobs */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">Your Recent Job Postings</h2>
                  <p className="text-slate-600 font-extrabold">Click to View more details about each job posting.</p>
                </div>
                <button
                  onClick={() => router.push("/clientspace/myJobs")}
                  className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {jobListings.map((job) => (
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
                          {job.requirements.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 text-sm font-bold rounded-xl"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      {/* Stats and Action */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-6 text-sm font-bold text-slate-500">
                          <div className="flex items-center">
                            <Briefcase className="w-5 h-5 mr-2" />
                            <span>{job.views} views</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Enhanced Quick Actions */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-orange-50 to-pink-50">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Quick Actions</h2>
                <p className="text-slate-600 font-medium">Manage your account efficiently</p>
              </div>
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <button
                    onClick={() => router.push("/clientspace/newJob")}
                    className="group h-20 sm:h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 hover:from-orange-600 hover:via-pink-600 hover:to-red-600 text-white rounded-2xl font-bold transition-all duration-300 hover:shadow-xl transform hover:scale-105 shadow-lg"
                  >
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-xs sm:text-sm">Post New Job</span>
                  </button>
                  <button
                    onClick={() => router.push("/clientspace/myJobs")}
                    className="group h-20 sm:h-24 flex flex-col items-center justify-center space-y-2 bg-white/60 border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-white/80 hover:border-slate-300 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                  >
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 group-hover:text-slate-700 group-hover:scale-110 transition-all" />
                    <span className="text-xs sm:text-sm">My Jobs</span>
                  </button>
                  <button
                    onClick={() => router.push("/clientspace/post-job")}
                    className="group h-20 sm:h-24 flex flex-col items-center justify-center space-y-2 bg-white/60 border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-white/80 hover:border-slate-300 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                  >
                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 group-hover:text-slate-700 group-hover:scale-110 transition-all" />
                    <span className="text-xs sm:text-sm">View Analytics</span>
                  </button>
                  <button
                    onClick={() => router.push("/clientspace/userProfile")}
                    className="group h-20 sm:h-24 flex flex-col items-center justify-center space-y-2 bg-white/60 border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-white/80 hover:border-slate-300 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                  >
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 group-hover:text-slate-700 group-hover:scale-110 transition-all" />
                    <span className="text-xs sm:text-sm">User Profile</span>
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
