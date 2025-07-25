"use client"
import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Sidebar from "@/components/job_posting/Sidebar"
import ClientAuthService from "@/app/services/client_user"
import Toast from "@/components/ui/Toast"
import {
  Menu,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Briefcase,
  Eye,
  ArrowLeft,
  Building2,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Share2,
  Shield,
  Award,
  Users,
  Edit3,
  Trash2,
  XCircle,
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
  status: "PENDING" | "ACTIVE" | "CLOSED" | "EXPIRED"
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

export default function JobDetailsPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error" | "loading"
  } | null>(null)
  
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string

  const fetchJobDetails = useCallback(async () => {
    try {
      setIsLoading(true)
      const token = ClientAuthService.getToken()
      if (!token) {
        router.push("/auth/job-posting")
        return
      }
      const response = await fetch(`http://localhost:5000/api/client/jobs/${jobId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch job details")
      }
      const jobData = await response.json()
      setJob(jobData)
    } catch (error) {
      console.error("Error fetching job details:", error)
      setToast({
        message: "Failed to load job details. Please try again.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }, [jobId, router, setToast]) // Added setToast to dependencies

  useEffect(() => {
    if (jobId) {
      fetchJobDetails()
    }
  }, [jobId, fetchJobDetails])

  const handleDeleteJob = async () => {
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
      setToast({
        message: "Job deleted successfully!",
        type: "success",
      })
      // Navigate back to jobs list after a short delay
      setTimeout(() => {
        router.push("/clientspace/myJobs")
      }, 2000)
    } catch (error) {
      console.error("Error deleting job:", error)
      setToast({
        message: "Failed to delete job. Please try again.",
        type: "error",
      })
    } finally {
      setShowDeleteModal(false)
    }
  }

  const handleBack = () => {
    router.push("/clientspace/myJobs")
  }

  const handleEdit = () => {
    router.push(`/clientspace/job/${jobId}/edit`) // Updated path
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Check out this job opportunity: ${job?.title} at ${job?.companyName}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      setToast({
        message: "Job link copied to clipboard!",
        type: "success",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 text-sm font-bold rounded-full flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Pending Admin Review
          </span>
        )
      case "ACTIVE":
        return (
          <span className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-sm font-bold rounded-full flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Active & Visible
          </span>
        )
      case "CLOSED":
        return (
          <span className="px-4 py-2 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 text-sm font-bold rounded-full flex items-center gap-2">
            <XCircle className="w-4 h-4" /> Closed
          </span>
        )
      case "EXPIRED":
        return (
          <span className="px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 text-sm font-bold rounded-full flex items-center gap-2">
            <XCircle className="w-4 h-4" /> Expired
          </span>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Job Not Found</h2>
          <p className="text-slate-600 mb-6">The job you are looking for does not exist or has been removed.</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
          >
            Back to Jobs
          </button>
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
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Delete Job Posting</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{job.title}</span>? This action cannot be undone and all associated data will be permanently removed.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteJob}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
      
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
              <button
                onClick={handleBack}
                className="p-3 rounded-xl text-slate-700 hover:bg-white/60 transition-all duration-200 shadow-sm"
                aria-label="Go back"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  Job Details
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-medium">
                  Complete information about your job posting
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            {/* Job Header Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h2 className="text-3xl font-bold text-slate-900">{job.title}</h2>
                      {getStatusBadge(job.status)}
                      {job.isUrgent && (
                        <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold rounded-full">
                          Urgent
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <span className="text-xl font-bold text-slate-900">{job.companyName}</span>
                      </div>
                    </div>
                    
                    {/* Job Meta Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <div className="bg-white/60 rounded-2xl p-4 border border-white/40 shadow-sm flex items-center">
                        <MapPin className="w-5 h-5 mr-3 text-slate-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</p>
                          <p className="text-sm font-bold text-slate-900 truncate">{job.location}</p>
                        </div>
                      </div>
                      <div className="bg-white/60 rounded-2xl p-4 border border-white/40 shadow-sm flex items-center">
                        <DollarSign className="w-5 h-5 mr-3 text-emerald-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Budget</p>
                          <p className="text-sm font-bold text-emerald-600">{job.salary}</p>
                        </div>
                      </div>
                      <div className="bg-white/60 rounded-2xl p-4 border border-white/40 shadow-sm flex items-center">
                        <Clock className="w-5 h-5 mr-3 text-slate-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</p>
                          <p className="text-sm font-bold text-slate-900">{job.duration}</p>
                        </div>
                      </div>
                      <div className="bg-white/60 rounded-2xl p-4 border border-white/40 shadow-sm flex items-center">
                        <Calendar className="w-5 h-5 mr-3 text-slate-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Posted</p>
                          <p className="text-sm font-bold text-slate-900">{formatDate(job.timePosted)}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-sm font-bold text-slate-500">
                      <div className="flex items-center">
                        <Eye className="w-5 h-5 mr-2" />
                        <span>{job.clickCount} views</span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="w-5 h-5 mr-2" />
                        <span>{job.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-4 lg:w-56">
                    <button
                      onClick={handleEdit}
                      className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl font-bold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Edit3 className="w-5 h-5" />
                      Edit Job
                    </button>
                    <button
                      onClick={handleShare}
                      className="px-6 py-4 bg-white/60 text-slate-700 border-2 border-slate-200 rounded-2xl font-bold hover:border-slate-300 hover:bg-white/80 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Share2 className="w-5 h-5" />
                      Share
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-bold hover:from-red-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete Job
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Job Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Job Description */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Job Description</h3>
                    </div>
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                        {job.Jobdescription}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Requirements */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Skills & Requirements</h3>
                    </div>
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                        {job.SkillsAndrequirements}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Responsibilities */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Key Responsibilities</h3>
                    </div>
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                        {job.responsibilities}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Benefits */}
                {job.benefits && (
                  <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Benefits & Perks</h3>
                      </div>
                      <div className="prose prose-slate max-w-none">
                        <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-line">{job.benefits}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Column - Company Info & Contact */}
              <div className="space-y-8">
                {/* Job Status Info */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                        <AlertCircle className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Job Status</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white/60 rounded-2xl p-6 border border-white/40 shadow-sm">
                        <div className="mb-4">{getStatusBadge(job.status)}</div>
                        {job.status === "PENDING" && (
                          <p className="text-slate-600 text-sm">
                            Your job is currently under review by our admin team. Once approved, it will be visible to all
                            qualified fundis in your area.
                          </p>
                        )}
                        {job.status === "ACTIVE" && (
                          <p className="text-slate-600 text-sm">
                            Your job is live and visible to all qualified fundis. You should start receiving applications
                            soon.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Contact Information</h3>
                    </div>
                    <div className="bg-white/60 rounded-2xl p-6 border border-white/40 shadow-sm space-y-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                          <Users className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Person</p>
                          <p className="text-base font-bold text-slate-900">{job.contactPerson}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                          <Phone className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</p>
                          <p className="text-base font-bold text-slate-900">{job.phoneNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                          <Mail className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</p>
                          <p className="text-base font-bold text-slate-900">{job.email}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-slate-200">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Preferred Contact Method
                        </p>
                        <p className="text-sm font-medium text-slate-700">
                          {job.preferredContact === "phone"
                            ? "Phone Only"
                            : job.preferredContact === "email"
                              ? "Email Only"
                              : "Both Phone and Email"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}