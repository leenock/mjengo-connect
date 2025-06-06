"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
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
  Send,
  User,
  FileImage,
  Calendar,
  AlertCircle,
  Copy,
  Trash2,
} from "lucide-react"
import Sidebar from "@/components/job_posting/Sidebar"

export default function PostJobPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Form state
  const [jobDetails, setJobDetails] = useState({
    // Step 1: Basic Job Details
    title: "",
    category: "",
    jobType: "",
    location: "",
    duration: "",
    salary: "",

    // Step 2: Description and Requirements
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",

    // Step 3: Company and Contact Information
    company: "",
    contactPerson: "",
    phone: "",
    email: "",
    preferredContact: "both", // phone, email, or both
  })

  const updateJobDetails = (field: string, value: string) => {
    setJobDetails((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNextStep = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // After successful submission, you would typically redirect to a success page or dashboard
    // For now, we'll just show a success message in the same page
  }

  const steps = [
    { number: 1, title: "Job Details" },
    { number: 2, title: "Description & Requirements" },
    { number: 3, title: "Contact Information" },
    { number: 4, title: "Review & Submit" },
  ]

  const quickActions = [
    { icon: FileImage, label: "Add Photos", color: "bg-blue-100 text-blue-600" },
    { icon: Calendar, label: "Schedule Post", color: "bg-purple-100 text-purple-600" },
    { icon: Copy, label: "Save Template", color: "bg-green-100 text-green-600" },
    { icon: AlertCircle, label: "Get Help", color: "bg-yellow-100 text-yellow-600" },
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 lg:flex">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        <div className="flex-1 lg:ml-0">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 mb-4 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Posted Successfully!</h1>
                <p className="text-gray-600 mb-8">
                  Your job has been posted and will be visible to qualified fundis in your area.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => router.push("/employer/dashboard")}
                    className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setIsSubmitted(false)
                      setCurrentStep(1)
                      setJobDetails({
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
                      })
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Post Another Job
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 lg:ml-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Mobile Menu Toggle */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="text-center flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Post a New Job</h1>
              <p className="text-gray-600 mt-2">Find the perfect fundi for your construction project</p>
            </div>

            <div className="lg:block hidden">
              {/* Placeholder for alignment */}
              <div className="w-6"></div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentStep >= step.number ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : <span>{step.number}</span>}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium ${
                        currentStep >= step.number ? "text-orange-600" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
              <div className="relative mt-2">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200"></div>
                <div
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-orange-500 transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <form>
                {/* Step 1: Basic Job Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-orange-500" />
                      Job Details
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                      <input
                        type="text"
                        value={jobDetails.title}
                        onChange={(e) => updateJobDetails("title", e.target.value)}
                        placeholder="e.g., Experienced Mason Needed"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={jobDetails.category}
                          onChange={(e) => updateJobDetails("category", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                        <select
                          value={jobDetails.jobType}
                          onChange={(e) => updateJobDetails("jobType", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={jobDetails.location}
                          onChange={(e) => updateJobDetails("location", e.target.value)}
                          placeholder="e.g., Nairobi, Kenya"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            value={jobDetails.duration}
                            onChange={(e) => updateJobDetails("duration", e.target.value)}
                            placeholder="e.g., 3 months, 2 weeks"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Salary/Budget</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            value={jobDetails.salary}
                            onChange={(e) => updateJobDetails("salary", e.target.value)}
                            placeholder="e.g., KSh 2,500 - 3,500 per day"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Description and Requirements */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-orange-500" />
                      Description & Requirements
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                      <textarea
                        value={jobDetails.description}
                        onChange={(e) => updateJobDetails("description", e.target.value)}
                        placeholder="Describe the job in detail..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        rows={5}
                        required
                      ></textarea>
                      <p className="text-xs text-gray-500 mt-1">
                        Include details about the project, specific tasks, and any special requirements.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                      <textarea
                        value={jobDetails.requirements}
                        onChange={(e) => updateJobDetails("requirements", e.target.value)}
                        placeholder="List the requirements for this job..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        rows={3}
                        required
                      ></textarea>
                      <p className="text-xs text-gray-500 mt-1">
                        Specify experience level, skills, certifications, tools needed, etc.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
                      <textarea
                        value={jobDetails.responsibilities}
                        onChange={(e) => updateJobDetails("responsibilities", e.target.value)}
                        placeholder="List the key responsibilities..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        rows={3}
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Benefits (Optional)</label>
                      <textarea
                        value={jobDetails.benefits}
                        onChange={(e) => updateJobDetails("benefits", e.target.value)}
                        placeholder="List any benefits or perks..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        rows={3}
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* Step 3: Company and Contact Information */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <Building2 className="w-5 h-5 mr-2 text-orange-500" />
                      Contact Information
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company/Organization</label>
                      <input
                        type="text"
                        value={jobDetails.company}
                        onChange={(e) => updateJobDetails("company", e.target.value)}
                        placeholder="e.g., ABC Construction Ltd"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={jobDetails.contactPerson}
                          onChange={(e) => updateJobDetails("contactPerson", e.target.value)}
                          placeholder="e.g., John Doe"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            value={jobDetails.phone}
                            onChange={(e) => updateJobDetails("phone", e.target.value)}
                            placeholder="e.g., +254 XXX XXX XXX"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            value={jobDetails.email}
                            onChange={(e) => updateJobDetails("email", e.target.value)}
                            placeholder="e.g., contact@example.com"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Contact Method</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="preferredContact"
                            value="phone"
                            checked={jobDetails.preferredContact === "phone"}
                            onChange={() => updateJobDetails("preferredContact", "phone")}
                            className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                          />
                          <span className="ml-2 text-gray-700">Phone Only</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="preferredContact"
                            value="email"
                            checked={jobDetails.preferredContact === "email"}
                            onChange={() => updateJobDetails("preferredContact", "email")}
                            className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                          />
                          <span className="ml-2 text-gray-700">Email Only</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="preferredContact"
                            value="both"
                            checked={jobDetails.preferredContact === "both"}
                            onChange={() => updateJobDetails("preferredContact", "both")}
                            className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                          />
                          <span className="ml-2 text-gray-700">Both Phone and Email</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Review and Submit */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <ListChecks className="w-5 h-5 mr-2 text-orange-500" />
                      Review Your Job Posting
                    </h2>

                    <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                      {/* Job Details Section */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Job Title:</p>
                            <p className="text-gray-900">{jobDetails.title || "Not specified"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Category:</p>
                            <p className="text-gray-900">{jobDetails.category || "Not specified"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Job Type:</p>
                            <p className="text-gray-900">{jobDetails.jobType || "Not specified"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Location:</p>
                            <p className="text-gray-900">{jobDetails.location || "Not specified"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Duration:</p>
                            <p className="text-gray-900">{jobDetails.duration || "Not specified"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Salary/Budget:</p>
                            <p className="text-gray-900">{jobDetails.salary || "Not specified"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Description Section */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Description & Requirements</h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Description:</p>
                            <p className="text-gray-900 whitespace-pre-line">
                              {jobDetails.description || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Requirements:</p>
                            <p className="text-gray-900 whitespace-pre-line">
                              {jobDetails.requirements || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Responsibilities:</p>
                            <p className="text-gray-900 whitespace-pre-line">
                              {jobDetails.responsibilities || "Not specified"}
                            </p>
                          </div>
                          {jobDetails.benefits && (
                            <div>
                              <p className="text-sm font-medium text-gray-500">Benefits:</p>
                              <p className="text-gray-900 whitespace-pre-line">{jobDetails.benefits}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Company/Organization:</p>
                            <p className="text-gray-900">{jobDetails.company || "Not specified"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Contact Person:</p>
                            <p className="text-gray-900">{jobDetails.contactPerson || "Not specified"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Phone Number:</p>
                            <p className="text-gray-900">{jobDetails.phone || "Not specified"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Email:</p>
                            <p className="text-gray-900">{jobDetails.email || "Not specified"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Preferred Contact Method:</p>
                            <p className="text-gray-900">
                              {jobDetails.preferredContact === "phone"
                                ? "Phone Only"
                                : jobDetails.preferredContact === "email"
                                  ? "Email Only"
                                  : "Both Phone and Email"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> Please review all information carefully before submitting. Once posted,
                        your job will be visible to all qualified fundis in your area.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex items-center px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex items-center px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Post Job
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Save Draft Button */}
                {currentStep < 4 && (
                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      className="text-gray-600 hover:text-orange-600 font-medium text-sm flex items-center justify-center mx-auto"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save as Draft
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-sm transition-all"
                  >
                    <div className={`w-10 h-10 ${action.color} rounded-full flex items-center justify-center mb-2`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center">
                  <button className="flex items-center text-gray-600 hover:text-red-600 font-medium text-sm">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete Draft
                  </button>

                  <button className="flex items-center text-gray-600 hover:text-orange-600 font-medium text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Need Help?
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
