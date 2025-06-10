"use client";
import { useState } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
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
  Plus,
  MessageSquare,
  BarChart3,
  Menu,
  Phone,
  Save,
  Send,
  User,
  AlertCircle,
} from "lucide-react";
import Sidebar from "@/components/job_posting/Sidebar";

export default function PostJobPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
  });

  const updateJobDetails = (field: string, value: string) => {
    setJobDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // After successful submission, you would typically redirect to a success page or dashboard
    // For now, we'll just show a success message in the same page
  };

  const steps = [
    { number: 1, title: "Job Details" },
    { number: 2, title: "Description & Requirements" },
    { number: 3, title: "Contact Information" },
    { number: 4, title: "Review & Submit" },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:flex font-inter">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        <div className="flex-1 lg:ml-0">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-3 mb-6 rounded-xl text-slate-700 hover:bg-white/60 transition-all duration-200 shadow-sm"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="max-w-3xl mx-auto">
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent mb-4">
                  Job Posted Successfully!
                </h1>
                <p className="text-slate-600 font-medium text-lg mb-8 leading-relaxed">
                  Your job has been posted and will be visible to qualified
                  fundis in your area.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => router.push("/clientspace/post-job")}
                    className="px-8 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white rounded-2xl font-bold hover:from-orange-600 hover:via-pink-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setCurrentStep(1);
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
                      });
                    }}
                    className="px-8 py-4 bg-white/60 border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-white/80 hover:border-slate-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Post Another Job
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:flex font-inter">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

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
                <h1 className="text-2xl sm:text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  Welcome Kamau
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-black">
                  Post a New Job
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Enhanced Progress Steps */}
            <div className="mb-10">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center relative"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                        currentStep >= step.number
                          ? "bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white"
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
                      className={`text-sm mt-3 font-bold text-center ${
                        currentStep >= step.number
                          ? "text-orange-600"
                          : "text-slate-500"
                      }`}
                    >
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div className="absolute top-6 left-12 w-full h-1 bg-slate-200 -z-10">
                        <div
                          className={`h-full transition-all duration-300 ${
                            currentStep > step.number
                              ? "bg-gradient-to-r from-orange-500 to-pink-500"
                              : "bg-slate-200"
                          }`}
                          style={{
                            width: currentStep > step.number ? "100%" : "0%",
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Form Container */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 sm:p-10">
              <form>
                {/* Step 1: Basic Job Details */}
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        Job Details
                      </h2>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={jobDetails.title}
                        onChange={(e) =>
                          updateJobDetails("title", e.target.value)
                        }
                        placeholder="e.g., Experienced Mason Needed"
                        className="w-full px-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 hover:border-slate-300"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                          Category
                        </label>
                        <select
                          value={jobDetails.category}
                          onChange={(e) =>
                            updateJobDetails("category", e.target.value)
                          }
                          className="w-full px-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-slate-900 font-medium hover:border-slate-300"
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
                        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                          Job Type
                        </label>
                        <select
                          value={jobDetails.jobType}
                          onChange={(e) =>
                            updateJobDetails("jobType", e.target.value)
                          }
                          className="w-full px-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-slate-900 font-medium hover:border-slate-300"
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
                      <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                        Location
                      </label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-orange-500 transition-colors" />
                        <input
                          type="text"
                          value={jobDetails.location}
                          onChange={(e) =>
                            updateJobDetails("location", e.target.value)
                          }
                          placeholder="e.g., Nairobi, Kenya"
                          className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 group-hover:border-slate-300"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                          Duration
                        </label>
                        <div className="relative group">
                          <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-orange-500 transition-colors" />
                          <input
                            type="text"
                            value={jobDetails.duration}
                            onChange={(e) =>
                              updateJobDetails("duration", e.target.value)
                            }
                            placeholder="e.g., 3 months, 2 weeks"
                            className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 group-hover:border-slate-300"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                          Salary/Budget
                        </label>
                        <div className="relative group">
                          <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-orange-500 transition-colors" />
                          <input
                            type="text"
                            value={jobDetails.salary}
                            onChange={(e) =>
                              updateJobDetails("salary", e.target.value)
                            }
                            placeholder="e.g., KSh 2,500 - 3,500 per day"
                            className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 group-hover:border-slate-300"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Description and Requirements */}
                {currentStep === 2 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        Description & Requirements
                      </h2>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                        Job Description
                      </label>
                      <textarea
                        value={jobDetails.description}
                        onChange={(e) =>
                          updateJobDetails("description", e.target.value)
                        }
                        placeholder="Describe the job in detail..."
                        className="w-full px-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 resize-none hover:border-slate-300"
                        rows={5}
                        required
                      ></textarea>
                      <p className="text-xs text-slate-500 mt-2 font-medium">
                        Include details about the project, specific tasks, and
                        any special requirements.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                        Requirements
                      </label>
                      <textarea
                        value={jobDetails.requirements}
                        onChange={(e) =>
                          updateJobDetails("requirements", e.target.value)
                        }
                        placeholder="List the requirements for this job..."
                        className="w-full px-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 resize-none hover:border-slate-300"
                        rows={3}
                        required
                      ></textarea>
                      <p className="text-xs text-slate-500 mt-2 font-medium">
                        Specify experience level, skills, certifications, tools
                        needed, etc.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                        Responsibilities
                      </label>
                      <textarea
                        value={jobDetails.responsibilities}
                        onChange={(e) =>
                          updateJobDetails("responsibilities", e.target.value)
                        }
                        placeholder="List the key responsibilities..."
                        className="w-full px-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 resize-none hover:border-slate-300"
                        rows={3}
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                        Benefits (Optional)
                      </label>
                      <textarea
                        value={jobDetails.benefits}
                        onChange={(e) =>
                          updateJobDetails("benefits", e.target.value)
                        }
                        placeholder="List any benefits or perks..."
                        className="w-full px-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 resize-none hover:border-slate-300"
                        rows={3}
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* Step 3: Company and Contact Information */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        Contact Information
                      </h2>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                        Company/Organization
                      </label>
                      <input
                        type="text"
                        value={jobDetails.company}
                        onChange={(e) =>
                          updateJobDetails("company", e.target.value)
                        }
                        placeholder="e.g., ABC Construction Ltd"
                        className="w-full px-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 hover:border-slate-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                        Contact Person
                      </label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                          type="text"
                          value={jobDetails.contactPerson}
                          onChange={(e) =>
                            updateJobDetails("contactPerson", e.target.value)
                          }
                          placeholder="e.g., John Doe"
                          className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 group-hover:border-slate-300"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                          Phone Number
                        </label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                          <input
                            type="tel"
                            value={jobDetails.phone}
                            onChange={(e) =>
                              updateJobDetails("phone", e.target.value)
                            }
                            placeholder="e.g., +254 XXX XXX XXX"
                            className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 group-hover:border-slate-300"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                          Email
                        </label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                          <input
                            type="email"
                            value={jobDetails.email}
                            onChange={(e) =>
                              updateJobDetails("email", e.target.value)
                            }
                            placeholder="e.g., contact@example.com"
                            className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 group-hover:border-slate-300"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">
                        Preferred Contact Method
                      </label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="preferredContact"
                            value="phone"
                            checked={jobDetails.preferredContact === "phone"}
                            onChange={() =>
                              updateJobDetails("preferredContact", "phone")
                            }
                            className="w-5 h-5 text-emerald-600 border-slate-300 focus:ring-emerald-500"
                          />
                          <span className="ml-3 text-slate-700 font-medium">
                            Phone Only
                          </span>
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="preferredContact"
                            value="email"
                            checked={jobDetails.preferredContact === "email"}
                            onChange={() =>
                              updateJobDetails("preferredContact", "email")
                            }
                            className="w-5 h-5 text-emerald-600 border-slate-300 focus:ring-emerald-500"
                          />
                          <span className="ml-3 text-slate-700 font-medium">
                            Email Only
                          </span>
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="preferredContact"
                            value="both"
                            checked={jobDetails.preferredContact === "both"}
                            onChange={() =>
                              updateJobDetails("preferredContact", "both")
                            }
                            className="w-5 h-5 text-emerald-600 border-slate-300 focus:ring-emerald-500"
                          />
                          <span className="ml-3 text-slate-700 font-medium">
                            Both Phone and Email
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Review and Submit */}
                {currentStep === 4 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <ListChecks className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        Review Your Job Posting
                      </h2>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl p-8 space-y-8 border border-white/40">
                      {/* Job Details Section */}
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-6">
                          Job Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Job Title:
                            </p>
                            <p className="text-slate-900 font-medium">
                              {jobDetails.title || "Not specified"}
                            </p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Category:
                            </p>
                            <p className="text-slate-900 font-medium">
                              {jobDetails.category || "Not specified"}
                            </p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Job Type:
                            </p>
                            <p className="text-slate-900 font-medium">
                              {jobDetails.jobType || "Not specified"}
                            </p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Location:
                            </p>
                            <p className="text-slate-900 font-medium">
                              {jobDetails.location || "Not specified"}
                            </p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Duration:
                            </p>
                            <p className="text-slate-900 font-medium">
                              {jobDetails.duration || "Not specified"}
                            </p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Salary/Budget:
                            </p>
                            <p className="text-slate-900 font-medium">
                              {jobDetails.salary || "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Description Section */}
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-6">
                          Description & Requirements
                        </h3>
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
                              <p className="text-slate-900 font-medium whitespace-pre-line">
                                {jobDetails.benefits}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-6">
                          Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Company/Organization:
                            </p>
                            <p className="text-slate-900 font-medium">
                              {jobDetails.company || "Not specified"}
                            </p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Contact Person:
                            </p>
                            <p className="text-slate-900 font-medium">
                              {jobDetails.contactPerson || "Not specified"}
                            </p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Phone Number:
                            </p>
                            <p className="text-slate-900 font-medium">
                              {jobDetails.phone || "Not specified"}
                            </p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Email:
                            </p>
                            <p className="text-slate-900 font-medium">
                              {jobDetails.email || "Not specified"}
                            </p>
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
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-amber-100 to-amber-200 border-2 border-amber-300 rounded-2xl p-6">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                        <p className="text-amber-800 font-bold">
                          <strong>Note:</strong> Please review all information
                          carefully before submitting. Once posted, your job
                          will be visible to all qualified fundis in your area.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Navigation Buttons */}
                <div className="mt-10 flex justify-between">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      className="flex items-center gap-3 px-6 py-4 bg-white/60 border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-white/80 hover:border-slate-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
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
                      className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white rounded-2xl font-bold hover:from-orange-600 hover:via-pink-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      Next
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white rounded-2xl font-bold hover:from-orange-600 hover:via-pink-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Post Job
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Save Draft Button */}
                {currentStep < 4 && (
                  <div className="mt-6 text-center">
                    <button
                      type="button"
                      className="text-slate-600 hover:text-orange-600 font-bold text-sm flex items-center justify-center mx-auto transition-colors duration-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save as Draft
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Enhanced Quick Actions */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden mt-8">
              <div className="p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-orange-50 to-pink-50">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                  Quick Actions
                </h2>
                <p className="text-slate-600 font-medium">
                  Manage your account efficiently
                </p>
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
  );
}
