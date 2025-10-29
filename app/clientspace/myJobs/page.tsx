"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/job_posting/Sidebar"
import ClientAuthService, { type ClientUserData } from "@/app/services/client_user"
import Toast from "@/components/ui/Toast"
import {
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Briefcase,
  Users,
  Menu,
  TrendingUp,
  BarChartIcon as ChartBarDecreasingIcon,
  Edit3,
  Eye,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  
} from "lucide-react"

interface Job {
  id: string
  title: string
  category: string
  jobType: string
  location: string
  duration: string
  salary: string
  Jobdescription: string
  SkillsAndrequirements: string
  responsibilities: string
  benefits?: string
  companyName: string
  contactPerson: string
  phoneNumber: string
  email: string
  preferredContact: string
  isUrgent: boolean
  isPaid: boolean
  status: "PENDING" | "ACTIVE" | "CLOSED" | "EXPIRED" | "REJECTED"
  timePosted: string
  clickCount: number
  postedBy: {
    id: string
    email: string
    firstName: string
    lastName: string
    company: string
  }
}

export default function MyJobsPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<ClientUserData | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error" | "loading"
  } | null>(null)
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 3 // Show 3 jobs per page
  
  const router = useRouter()

  // Load user data and jobs on component mount
  useEffect(() => {
    const userData = ClientAuthService.getUserData()
    if (userData) {
      setCurrentUser(userData)
      fetchMyJobs()
    } else {
      router.push("/auth/job-posting")
    }
  }, [router])

  const fetchMyJobs = async () => {
    try {
      setIsLoading(true)
      const token = ClientAuthService.getToken()
      if (!token) {
        throw new Error("Authentication required")
      }
      const response = await fetch("http://localhost:5000/api/client/my-jobs", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch jobs")
      }
      const data = await response.json()
      setJobs(data.jobs || [])
    } catch (error) {
      console.error("Error fetching jobs:", error)
      setToast({
        message: "Failed to load your jobs. Please try again.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    try {
      setToast({
        message: "Deleting job...",
        type: "loading",
      })
      const token = ClientAuthService.getToken()
      if (!token) {
        throw new Error("Authentication required")
      }
      const response = await fetch(`http://localhost:5000/api/client/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to delete job")
      }
      // Remove job from local state
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId))
      setToast({
        message: "Job deleted successfully!",
        type: "success",
      })
      // Reset pagination if needed
      if (currentJobs.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    } catch (error) {
      console.error("Error deleting job:", error)
      setToast({
        message: "Failed to delete job. Please try again.",
        type: "error",
      })
    } finally {
      setDeleteJobId(null)
    }
  }

  const viewJobDetails = (jobId: string) => {
    router.push(`/clientspace/job/${jobId}`) // Updated path
  }

  const editJobDetails = (jobId: string) => {
    router.push(`/clientspace/job/${jobId}/edit`) // Updated path
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 text-xs font-bold rounded-full flex items-center gap-1 border border-yellow-200">
            <AlertCircle className="w-3 h-3" /> Pending Review
          </span>
        )
      case "ACTIVE":
        return (
          <span className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1 border border-emerald-200">
            <CheckCircle className="w-3 h-3" /> Active
          </span>
        )
      case "CLOSED":
        return (
          <span className="px-3 py-1 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 text-xs font-bold rounded-full flex items-center gap-1 border border-gray-200">
            <XCircle className="w-3 h-3" /> Closed
          </span>
        )
      case "EXPIRED":
        return (
          <span className="px-3 py-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1 border border-red-200">
            <XCircle className="w-3 h-3" /> Expired
          </span>
        )
      case "REJECTED":
        return (
          <span className="px-3 py-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1 border border-red-200">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  // Calculate stats
  const totalJobs = jobs.length
  const activeJobs = jobs.filter((job) => job.status === "ACTIVE").length
  const pendingJobs = jobs.filter((job) => job.status === "PENDING").length
  const totalViews = jobs.reduce((sum, job) => sum + job.clickCount, 0)
  
  const stats = [
    {
      title: "Active Jobs",
      value: activeJobs.toString(),
      change: `${pendingJobs} pending review`,
      icon: Briefcase,
      color: "text-indigo-600",
      bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-200",
    },
    {
      title: "Total Jobs Posted",
      value: totalJobs.toString(),
      change: `${pendingJobs} awaiting approval`,
      icon: Users,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
    },
    {
      title: "Total Views",
      value: totalViews.toString(),
      change: "Across all jobs",
      icon: TrendingUp,
      color: "text-amber-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
    },
    {
      title: "Pending Review",
      value: pendingJobs.toString(),
      change: "Awaiting admin approval",
      icon: ChartBarDecreasingIcon,
      color: "text-violet-600",
      bgColor: "bg-gradient-to-br from-violet-50 to-violet-100",
      borderColor: "border-violet-200",
    },
  ]
  
  // Pagination calculations
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(jobs.length / jobsPerPage)

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your jobs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:flex font-inter">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Delete Confirmation Modal */}
      {deleteJobId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl p-6 bg-white/90 backdrop-blur-xl shadow-2xl border border-white/30">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Delete Job Posting</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this job posting? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteJobId(null)}
                className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl text-base font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 h-12 px-6 py-3 shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteJob(deleteJobId)}
                className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl text-base font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-red-600 to-pink-700 text-white hover:from-red-700 hover:to-pink-800 h-12 px-6 py-3 shadow-md hover:shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 lg:ml-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl mb-6 sm:mb-8 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 sm:p-3 rounded-xl text-slate-700 hover:bg-white/60 transition-all duration-200 shadow-sm"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  Welcome{" "}
                  {currentUser?.firstName && currentUser?.lastName
                    ? `${currentUser.firstName} ${currentUser.lastName}`
                    : "User"}
                </h1>
                <p className="text-slate-600 mt-1 text-sm sm:text-base font-extrabold">
                  Manage your job postings and track their performance
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.title}
                  className={`${stat.bgColor} ${stat.borderColor} rounded-2xl shadow-lg border p-4 sm:p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-600 truncate uppercase tracking-wide">
                        {stat.title}
                      </p>
                      <p className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mt-1 leading-none">{stat.value}</p>
                      <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1 truncate">{stat.change}</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/60 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 ml-2 sm:ml-3 shadow">
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Job Listings */}
          <div className="space-y-5">
            {jobs.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-6 sm:p-8 md:p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">No Jobs Posted Yet</h3>
                <p className="text-slate-600 mb-5 max-w-md mx-auto">Start by posting your first job to find qualified fundis.</p>
                <button
                  onClick={() => router.push("/clientspace/newJob")}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white hover:from-orange-600 hover:via-pink-600 hover:to-red-600 h-12 px-6 py-3 shadow-md hover:shadow-lg"
                >
                  Post Your First Job
                </button>
              </div>
            ) : (
              <>
                {/* Jobs List */}
                <div className="space-y-4 sm:space-y-5">
                  {currentJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-white/30 p-5 sm:p-6 hover:shadow-2xl transition-all duration-300 group"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900">{job.title}</h3>
                                {getStatusBadge(job.status)}
                                {job.isUrgent && (
                                  <span className="px-2.5 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full">
                                    Urgent
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-600 font-bold text-base mb-3">{job.companyName}</p>
                              <p className="text-slate-600 font-medium text-sm mb-4 leading-relaxed line-clamp-2">
                                {job.Jobdescription}
                              </p>
                            </div>
                          </div>
                          
                          {/* Job Details Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                            <div className="flex items-center text-xs sm:text-sm font-bold text-slate-600 p-2.5 bg-slate-50 rounded-lg">
                              <MapPin className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{job.location}</span>
                            </div>
                            <div className="flex items-center text-xs sm:text-sm font-bold p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                              <DollarSign className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0" />
                              <span className="text-emerald-600 font-black truncate">{job.salary}</span>
                            </div>
                            <div className="flex items-center text-xs sm:text-sm font-bold text-slate-600 p-2.5 bg-slate-50 rounded-lg">
                              <Clock className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{job.duration}</span>
                            </div>
                            <div className="flex items-center text-xs sm:text-sm font-bold text-slate-600 p-2.5 bg-slate-50 rounded-lg">
                              <Calendar className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{formatDate(job.timePosted)}</span>
                            </div>
                          </div>
                          
                          {/* Requirements */}
                          <div className="mb-5">
                            <div className="flex flex-wrap gap-2">
                              {job.SkillsAndrequirements.split(",")
                                .slice(0, 3)
                                .map((skill, skillIndex) => (
                                  <span
                                    key={skillIndex}
                                    className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 text-xs font-bold rounded-lg"
                                  >
                                    {skill.trim()}
                                  </span>
                                ))}
                            </div>
                          </div>
                          
                          {/* Stats and Actions */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
                            <div className="flex items-center space-x-5 text-xs sm:text-sm font-bold text-slate-500">
                              <div className="flex items-center">
                                <Eye className="w-4 h-4 mr-1.5" />
                                <span>{job.clickCount} views</span>
                              </div>
                              <div className="flex items-center">
                                <Briefcase className="w-4 h-4 mr-1.5" />
                                <span>{job.category}</span>
                              </div>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => editJobDetails(job.id)}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs sm:text-sm font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 h-8 sm:h-9 px-3 py-1.5 shadow-sm hover:shadow-md"
                              >
                                <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                                Edit
                              </button>
                              <button
                                onClick={() => viewJobDetails(job.id)}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs sm:text-sm font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 h-8 sm:h-9 px-3 py-1.5 shadow-sm hover:shadow-md"
                              >
                                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                                View
                              </button>
                              <button
                                onClick={() => setDeleteJobId(job.id)}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs sm:text-sm font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 h-8 sm:h-9 px-3 py-1.5 shadow-sm hover:shadow-md"
                              >
                                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm ${
                        currentPage === 1
                          ? "text-slate-400 cursor-not-allowed"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-600">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>
                    
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm ${
                        currentPage === totalPages
                          ? "text-slate-400 cursor-not-allowed"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}