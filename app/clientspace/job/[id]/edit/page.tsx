"use client"
import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Sidebar from "@/components/job_posting/Sidebar"
import ClientAuthService from "@/app/services/client_user"
import Toast from "@/components/ui/Toast"
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  ListChecks,
  Mail,
  MapPin,
  Menu,
  Phone,
  Save,
  User,
  AlertCircle,
  Loader2,
  
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

export default function EditJobPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [jobDetails, setJobDetails] = useState({
    title: "",
    category: "",
    jobType: "",
    location: "",
    duration: "",
    salary: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    company: "",
    contactPerson: "",
    phone: "",
    email: "",
    preferredContact: "both",
    isUrgent: false,
    status: "PENDING" as Job["status"],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
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
      const jobData: Job = await response.json()
      setJobDetails({
        title: jobData.title,
        category: jobData.category,
        jobType: jobData.jobType,
        location: jobData.location,
        duration: jobData.duration,
        salary: jobData.salary,
        description: jobData.Jobdescription,
        requirements: jobData.SkillsAndrequirements,
        responsibilities: jobData.responsibilities,
        benefits: jobData.benefits || "",
        company: jobData.companyName,
        contactPerson: jobData.contactPerson,
        phone: jobData.phoneNumber,
        email: jobData.email,
        preferredContact: jobData.preferredContact,
        isUrgent: jobData.isUrgent,
        status: jobData.status,
      })
    } catch (error) {
      console.error("Error fetching job details:", error)
      setToast({
        message: "Failed to load job details for editing. Please try again.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }, [jobId, router, setToast])

  useEffect(() => {
    if (jobId) {
      fetchJobDetails()
    }
  }, [jobId, fetchJobDetails])

  const updateJobDetails = (field: keyof typeof jobDetails, value: string | boolean) => {
    setJobDetails((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateForm = () => {
    const errors: string[] = []
    // Step 1 validations
    if (currentStep === 1) {
      if (!jobDetails.title.trim()) {
        errors.push("Job title is required")
      } else if (jobDetails.title.trim().length < 5) {
        errors.push("Job title must be at least 5 characters long")
      }
      if (!jobDetails.category) {
        errors.push("Please select a job category")
      }
      if (!jobDetails.jobType) {
        errors.push("Please select a job type")
      }
      if (!jobDetails.location.trim()) {
        errors.push("Location is required")
      } else if (jobDetails.location.trim().length < 2) {
        errors.push("Location must be at least 2 characters long")
      }
      if (!jobDetails.duration.trim()) {
        errors.push("Duration is required")
      }
      if (!jobDetails.salary.trim()) {
        errors.push("Salary/Budget is required")
      }
    }
    // Step 2 validations
    if (currentStep === 2) {
      if (!jobDetails.description.trim()) {
        errors.push("Job description is required")
      } else if (jobDetails.description.trim().length < 20) {
        errors.push("Job description must be at least 20 characters long")
      }
      if (!jobDetails.requirements.trim()) {
        errors.push("Skills and requirements are required")
      } else if (jobDetails.requirements.trim().length < 10) {
        errors.push("Requirements must be at least 10 characters long")
      }
      if (!jobDetails.responsibilities.trim()) {
        errors.push("Responsibilities are required")
      } else if (jobDetails.responsibilities.trim().length < 10) {
        errors.push("Responsibilities must be at least 10 characters long")
      }
    }
    // Step 3 validations
    if (currentStep === 3) {
      if (!jobDetails.company.trim()) {
        errors.push("Company/Organization name is required")
      } else if (jobDetails.company.trim().length < 2) {
        errors.push("Company name must be at least 2 characters long")
      }
      if (!jobDetails.contactPerson.trim()) {
        errors.push("Contact person name is required")
      } else if (jobDetails.contactPerson.trim().length < 2) {
        errors.push("Contact person name must be at least 2 characters long")
      }
      if (!jobDetails.phone.trim()) {
        errors.push("Phone number is required")
      } else if (!/^\+?[\d\s\-()]{10,20}$/.test(jobDetails.phone.trim())) {
        errors.push("Please enter a valid phone number (10-20 digits)")
      }
      if (!jobDetails.email.trim()) {
        errors.push("Email address is required")
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(jobDetails.email.trim())) {
        errors.push("Please enter a valid email address")
      }
    }
    return errors
  }

  const handleNextStep = () => {
    const errors = validateForm()
    if (errors.length > 0) {
      setToast({
        message: `Please fix the following errors: ${errors.join(", ")}`,
        type: "error",
      })
      return
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setJobDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setJobDetails((prev) => ({ ...prev, [name]: checked }))
  }

  // Helper function to add minimum loading time
  const withMinimumLoadingTime = async (asyncOperation: () => Promise<unknown>, minimumTime = 3000) => {
    const startTime = Date.now()
    return new Promise((resolve, reject) => {
      asyncOperation()
        .then((result) => {
          const elapsedTime = Date.now() - startTime
          const remainingTime = minimumTime - elapsedTime
          if (remainingTime > 0) {
            setTimeout(() => resolve(result), remainingTime)
          } else {
            resolve(result)
          }
        })
        .catch((error) => {
          const elapsedTime = Date.now() - startTime
          const remainingTime = minimumTime - elapsedTime
          if (remainingTime > 0) {
            setTimeout(() => reject(error), remainingTime)
          } else {
            reject(error)
          }
        })
    })
  }

  const handleSubmit = async () => {
    const errors = validateForm()
    if (errors.length > 0) {
      setToast({
        message: `Please fix the following errors: ${errors.join(", ")}`,
        type: "error",
      })
      return
    }
    setIsSubmitting(true)
    setToast({ message: "Updating job...", type: "loading" })
    try {
      const token = ClientAuthService.getToken()
      if (!token) {
        throw new Error("Authentication required. Please log in again.")
      }
      await withMinimumLoadingTime(async () => {
        const response = await fetch(`http://localhost:5000/api/client/jobs/${jobId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: jobDetails.title,
            category: jobDetails.category,
            jobType: jobDetails.jobType,
            location: jobDetails.location,
            duration: jobDetails.duration,
            salary: jobDetails.salary,
            description: jobDetails.description,
            requirements: jobDetails.requirements,
            responsibilities: jobDetails.responsibilities,
            benefits: jobDetails.benefits,
            company: jobDetails.company,
            contactPerson: jobDetails.contactPerson,
            phone: jobDetails.phone,
            email: jobDetails.email,
            preferredContact: jobDetails.preferredContact,
            isUrgent: jobDetails.isUrgent,
            status: jobDetails.status,
          }),
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to update job")
        }
        return response.json()
      }, 3000) // 3 seconds minimum loading time
      setToast({ message: "Job updated successfully!", type: "success" })
      setTimeout(() => {
        router.push(`/clientspace/myJobs`) // Redirect to my jobs page after update
      }, 2000)
    } catch (error: unknown) {
      console.error("Error updating job:", error)
      let errorMessage = "Failed to update job. Please try again."
      if (error instanceof Error) {
        errorMessage = error.message
      }
      setToast({ message: errorMessage, type: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackToDetails = () => {
    router.push(`/clientspace/job/${jobId}`)
  }

  const steps = [
    { number: 1, title: "Job Details" },
    { number: 2, title: "Description & Requirements" },
    { number: 3, title: "Contact Information" },
    { number: 4, title: "Review & Update" },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading job details for editing...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:flex font-inter">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="flex-1 lg:ml-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl mb-8 sm:mb-10 flex items-center justify-between px-6 sm:px-8 py-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-3 rounded-xl text-slate-700 hover:bg-white/60 transition-all duration-200 shadow-sm inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button
                onClick={handleBackToDetails}
                className="p-3 rounded-xl text-slate-700 hover:bg-white/60 transition-all duration-200 shadow-sm inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10"
                aria-label="Go back"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  Edit Job Posting
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-medium">
                  Update the details of your job posting
                </p>
              </div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Progress Steps */}
            <div className="mb-10">
              <div className="flex items-center justify-between relative">
                {/* Progress line background */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200 -z-10 mx-6 sm:mx-12"></div>
                
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center relative flex-1">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                        currentStep >= step.number
                          ? "bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white shadow-xl"
                          : "bg-white/60 text-slate-500 border-2 border-slate-200"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="font-bold">{step.number}</span>
                      )}
                    </div>
                    <span
                      className={`text-sm mt-3 font-bold text-center transition-colors duration-300 ${
                        currentStep >= step.number ? "text-orange-600" : "text-slate-500"
                      }`}
                    >
                      {step.title}
                    </span>
                    
                    {/* Progress line segment */}
                    {index < steps.length - 1 && (
                      <div 
                        className={`absolute top-6 left-1/2 w-full h-1 -z-10 transition-all duration-500 ${
                          currentStep > step.number ? "bg-gradient-to-r from-orange-500 to-pink-500" : "bg-slate-200"
                        }`}
                        style={{
                          width: "100%",
                          left: "50%",
                          transformOrigin: "left",
                        }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Enhanced Form Container */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
              <form onSubmit={(e) => e.preventDefault()}>
                {/* Step 1: Basic Job Details */}
                {currentStep === 1 && (
                  <div className="p-6 sm:p-8 md:p-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-extrabold text-slate-900">Job Details</h2>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide"
                        >
                          Job Title
                        </label>
                        <input
                          id="title"
                          name="title"
                          type="text"
                          value={jobDetails.title}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateJobDetails("title", e.target.value)}
                          placeholder="e.g., Experienced Mason Needed"
                          className="flex h-auto w-full rounded-xl border-2 border-slate-200 bg-white/60 px-4 py-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-slate-900 font-medium hover:border-slate-300 shadow-sm"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="category"
                            className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide"
                          >
                            Category
                          </label>
                          <select
                            id="category"
                            name="category"
                            value={jobDetails.category}
                            onChange={handleSelectChange}
                            className="flex h-auto w-full items-center justify-between rounded-xl border-2 border-slate-200 bg-white/60 px-4 py-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-slate-900 font-medium hover:border-slate-300 shadow-sm"
                            required
                          >
                            <option value="">Select a category</option>
                            <option value="Mason">Mason</option>
                            <option value="Carpenter">Carpenter</option>
                            <option value="Plumber">Plumber</option>
                            <option value="Electrician">Electrician</option>
                            <option value="Painter">Painter</option>
                            <option value="Roofer">Roofer</option>
                            <option value="Tiler">Tiler</option>
                            <option value="Welder">Welder</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <label
                            htmlFor="jobType"
                            className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide"
                          >
                            Job Type
                          </label>
                          <select
                            id="jobType"
                            name="jobType"
                            value={jobDetails.jobType}
                            onChange={handleSelectChange}
                            className="flex h-auto w-full items-center justify-between rounded-xl border-2 border-slate-200 bg-white/60 px-4 py-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-slate-900 font-medium hover:border-slate-300 shadow-sm"
                            required
                          >
                            <option value="">Select job type</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="One-time">One-time project</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label
                          htmlFor="location"
                          className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide"
                        >
                          Location
                        </label>
                        <div className="relative group">
                          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-orange-500 transition-colors" />
                          <input
                            id="location"
                            name="location"
                            type="text"
                            value={jobDetails.location}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              updateJobDetails("location", e.target.value)
                            }
                            placeholder="e.g., Nairobi, Kenya"
                            className="flex h-auto w-full rounded-xl border-2 border-slate-200 bg-white/60 pl-12 pr-4 py-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-slate-900 font-medium hover:border-slate-300 shadow-sm"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="duration"
                            className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide"
                          >
                            Duration
                          </label>
                          <div className="relative group">
                            <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-orange-500 transition-colors" />
                            <input
                              id="duration"
                              name="duration"
                              type="text"
                              value={jobDetails.duration}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateJobDetails("duration", e.target.value)
                              }
                              placeholder="e.g., 3 months, 2 weeks"
                              className="flex h-auto w-full rounded-xl border-2 border-slate-200 bg-white/60 pl-12 pr-4 py-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-slate-900 font-medium hover:border-slate-300 shadow-sm"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label
                            htmlFor="salary"
                            className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide"
                          >
                            Salary/Budget
                          </label>
                          <div className="relative group">
                            <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-orange-500 transition-colors" />
                            <input
                              id="salary"
                              name="salary"
                              type="text"
                              value={jobDetails.salary}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateJobDetails("salary", e.target.value)
                              }
                              placeholder="e.g., KSh 2,500 - 3,500 per day"
                              className="flex h-auto w-full rounded-xl border-2 border-slate-200 bg-white/60 pl-12 pr-4 py-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-slate-900 font-medium hover:border-slate-300 shadow-sm"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Urgent Job Checkbox */}
                      <div className="flex items-center justify-between rounded-xl bg-white/60 p-4 shadow-sm border border-white/40 hover:bg-white/80 transition-colors duration-200">
                        <label htmlFor="isUrgent" className="text-base font-medium text-slate-700 flex items-center">
                          <span className="mr-3 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold rounded-full">
                            Urgent
                          </span>
                          Mark as Urgent Job
                        </label>
                        <div className="relative inline-block w-12 h-6">
                          <input
                            type="checkbox"
                            id="isUrgent"
                            name="isUrgent"
                            checked={jobDetails.isUrgent}
                            onChange={handleCheckboxChange}
                            className="opacity-0 w-0 h-0 peer"
                          />
                          <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-slate-300 rounded-full transition-all duration-300 peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-pink-500"></span>
                          <span className="absolute h-4 w-4 bg-white rounded-full left-1 top-1 transition-all duration-300 peer-checked:translate-x-6"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Description and Requirements */}
                {currentStep === 2 && (
                  <div className="p-6 sm:p-8 md:p-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">Description & Requirements</h2>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide"
                        >
                          Job Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={jobDetails.description}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            updateJobDetails("description", e.target.value)
                          }
                          placeholder="Describe the job in detail..."
                          className="flex min-h-[120px] w-full rounded-xl border-2 border-slate-200 bg-white/60 px-4 py-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium resize-none hover:border-slate-300 shadow-sm"
                          rows={5}
                          required
                        ></textarea>
                        <p className="text-xs text-slate-500 mt-2 font-medium">
                          Include details about the project, specific tasks, and any special requirements.
                        </p>
                      </div>
                      
                      <div>
                        <label
                          htmlFor="requirements"
                          className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide"
                        >
                          Skills and Requirements
                        </label>
                        <textarea
                          id="requirements"
                          name="requirements"
                          value={jobDetails.requirements}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            updateJobDetails("requirements", e.target.value)
                          }
                          placeholder="List the requirements for this job..."
                          className="flex min-h-[100px] w-full rounded-xl border-2 border-slate-200 bg-white/60 px-4 py-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium resize-none hover:border-slate-300 shadow-sm"
                          rows={3}
                          required
                        ></textarea>
                        <p className="text-xs text-slate-500 mt-2 font-medium">
                          Specify experience level, skills, certifications, tools needed, etc.
                        </p>
                      </div>
                      
                      <div>
                        <label
                          htmlFor="responsibilities"
                          className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide"
                        >
                          Responsibilities
                        </label>
                        <textarea
                          id="responsibilities"
                          name="responsibilities"
                          value={jobDetails.responsibilities}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            updateJobDetails("responsibilities", e.target.value)
                          }
                          placeholder="List the key responsibilities..."
                          className="flex min-h-[100px] w-full rounded-xl border-2 border-slate-200 bg-white/60 px-4 py-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium resize-none hover:border-slate-300 shadow-sm"
                          rows={3}
                          required
                        ></textarea>
                      </div>
                      
                      <div>
                        <label
                          htmlFor="benefits"
                          className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide"
                        >
                          Benefits (Optional)
                        </label>
                        <textarea
                          id="benefits"
                          name="benefits"
                          value={jobDetails.benefits}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            updateJobDetails("benefits", e.target.value)
                          }
                          placeholder="List any benefits or perks..."
                          className="flex min-h-[100px] w-full rounded-xl border-2 border-slate-200 bg-white/60 px-4 py-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium resize-none hover:border-slate-300 shadow-sm"
                          rows={3}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 3: Company and Contact Information */}
                {currentStep === 3 && (
                  <div className="p-6 sm:p-8 md:p-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">Contact Information</h2>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="company"
                          className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide"
                        >
                          Company/Organization
                        </label>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          value={jobDetails.company}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateJobDetails("company", e.target.value)
                          }
                          placeholder="e.g., ABC Construction Ltd"
                          className="flex h-auto w-full rounded-xl border-2 border-slate-200 bg-white/60 px-4 py-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-slate-900 font-medium hover:border-slate-300 shadow-sm"
                          required
                        />
                      </div>
                      
                      <div>
                        <label
                          htmlFor="contactPerson"
                          className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide"
                        >
                          Contact Person
                        </label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                          <input
                            id="contactPerson"
                            name="contactPerson"
                            type="text"
                            value={jobDetails.contactPerson}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              updateJobDetails("contactPerson", e.target.value)
                            }
                            placeholder="e.g., John Doe"
                            className="flex h-auto w-full rounded-xl border-2 border-slate-200 bg-white/60 pl-12 pr-4 py-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-slate-900 font-medium hover:border-slate-300 shadow-sm"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide"
                          >
                            Phone Number
                          </label>
                          <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={jobDetails.phone}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateJobDetails("phone", e.target.value)
                              }
                              placeholder="e.g., +254 XXX XXX XXX"
                              className="flex h-auto w-full rounded-xl border-2 border-slate-200 bg-white/60 pl-12 pr-4 py-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-slate-900 font-medium hover:border-slate-300 shadow-sm"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide"
                          >
                            Email
                          </label>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                              id="email"
                              name="email"
                              type="email"
                              value={jobDetails.email}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateJobDetails("email", e.target.value)
                              }
                              placeholder="e.g., contact@example.com"
                              className="flex h-auto w-full rounded-xl border-2 border-slate-200 bg-white/60 pl-12 pr-4 py-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-slate-900 font-medium hover:border-slate-300 shadow-sm"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label
                          htmlFor="preferredContact"
                          className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide"
                        >
                          Preferred Contact Method
                        </label>
                        <select
                          id="preferredContact"
                          name="preferredContact"
                          value={jobDetails.preferredContact}
                          onChange={handleSelectChange}
                          className="flex h-auto w-full items-center justify-between rounded-xl border-2 border-slate-200 bg-white/60 px-4 py-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-slate-900 font-medium hover:border-slate-300 shadow-sm"
                        >
                          <option value="phone">Phone Only</option>
                          <option value="email">Email Only</option>
                          <option value="both">Both Phone and Email</option>
                        </select>
                      </div>
                      
                      {/* Job Status Select */}
                      <div>
                        <label
                          htmlFor="status"
                          className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide"
                        >
                          Job Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={jobDetails.status}
                          onChange={handleSelectChange}
                          className="flex h-auto w-full items-center justify-between rounded-xl border-2 border-slate-200 bg-white/60 px-4 py-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 text-slate-900 font-medium hover:border-slate-300 shadow-sm"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="ACTIVE">Active</option>
                          <option value="CLOSED">Closed</option>
                          <option value="EXPIRED">Expired</option>
                        </select>
                      </div>
                      
                      {/* Validation Notice */}
                      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300 rounded-2xl p-6">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="text-blue-800 font-bold text-lg mb-1">Next Step</h3>
                            <p className="text-blue-800 font-medium">
                              Review all your information carefully before updating. Make sure all
                              fields are complete and accurate.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 4: Review and Submit */}
                {currentStep === 4 && (
                  <div className="p-6 sm:p-8 md:p-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <ListChecks className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">Review Your Job Posting</h2>
                    </div>
                    
                    <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl p-6 md:p-8 space-y-8 border border-white/40">
                      {/* Job Details Section */}
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">Job Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Job Title:</p>
                            <p className="text-slate-900 font-medium">{jobDetails.title || "Not specified"}</p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Category:</p>
                            <p className="text-slate-900 font-medium">{jobDetails.category || "Not specified"}</p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Job Type:</p>
                            <p className="text-slate-900 font-medium">{jobDetails.jobType || "Not specified"}</p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Location:</p>
                            <p className="text-slate-900 font-medium">{jobDetails.location || "Not specified"}</p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Duration:</p>
                            <p className="text-slate-900 font-medium">{jobDetails.duration || "Not specified"}</p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Salary/Budget:
                            </p>
                            <p className="text-slate-900 font-medium">{jobDetails.salary || "Not specified"}</p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40 md:col-span-2">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Urgent Job:
                            </p>
                            <p className="text-slate-900 font-medium">
                              {jobDetails.isUrgent ? (
                                <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold rounded-full">
                                  Urgent
                                </span>
                              ) : (
                                "No"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Description Section */}
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">Description & Requirements</h3>
                        <div className="space-y-4">
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                              Description:
                            </p>
                            <p className="text-slate-900 font-medium whitespace-pre-line">
                              {jobDetails.description || "Not specified"}
                            </p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                              Requirements:
                            </p>
                            <p className="text-slate-900 font-medium whitespace-pre-line">
                              {jobDetails.requirements || "Not specified"}
                            </p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                              Responsibilities:
                            </p>
                            <p className="text-slate-900 font-medium whitespace-pre-line">
                              {jobDetails.responsibilities || "Not specified"}
                            </p>
                          </div>
                          {jobDetails.benefits && (
                            <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Benefits:
                              </p>
                              <p className="text-slate-900 font-medium whitespace-pre-line">{jobDetails.benefits}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Contact Information */}
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Company/Organization:
                            </p>
                            <p className="text-slate-900 font-medium">{jobDetails.company || "Not specified"}</p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Contact Person:
                            </p>
                            <p className="text-slate-900 font-medium">{jobDetails.contactPerson || "Not specified"}</p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Phone Number:
                            </p>
                            <p className="text-slate-900 font-medium">{jobDetails.phone || "Not specified"}</p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Email:</p>
                            <p className="text-slate-900 font-medium">{jobDetails.email || "Not specified"}</p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40 md:col-span-2">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Preferred Contact Method:
                            </p>
                            <p className="text-slate-900 font-medium">
                              {jobDetails.preferredContact === "phone"
                                ? "Phone Only"
                                : jobDetails.preferredContact === "email"
                                  ? "Email Only"
                                  : "Both Phone and Email"}
                            </p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Job Status:
                            </p>
                            <p className="text-slate-900 font-medium">{jobDetails.status || "Not specified"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-amber-100 to-amber-200 border-2 border-amber-300 rounded-2xl p-6 mt-8">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-amber-800 font-bold text-lg mb-1">Important Note</h3>
                          <p className="text-amber-800 font-medium">
                            Please review all information carefully before submitting. Once
                            updated, your job will reflect the changes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Enhanced Navigation Buttons */}
                <div className="p-6 sm:p-8 md:p-10 pt-0">
                  <div className="mt-10 flex justify-between">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={handlePreviousStep}
                        className="flex items-center gap-3 px-6 py-4 bg-white/60 border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-white/80 hover:border-slate-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        Previous
                      </button>
                    ) : (
                      <div></div>
                    )}
                    {currentStep < 4 ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white rounded-2xl font-bold hover:from-orange-600 hover:via-pink-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                      >
                        Next
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        type="button" // Changed to type="button" as form submission is handled by explicit call
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl font-bold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Updating...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" /> Update Job
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}