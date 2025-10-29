"use client";

import { useState } from "react";
import type React from "react";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminAuthService from "@/app/services/admin_auth";

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
  Menu,
  Phone,
  Send,
  User,
  AlertCircle,
  Shield,
  UserCog,
  Loader2,
  X,
} from "lucide-react";

export default function AdminPostJob() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "loading";
  } | null>(null);

  // Enhanced success notification states (like reference code)
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state - simplified
  const [jobDetails, setJobDetails] = useState({
    // Step 1: Basic Job Details
    title: "",
    category: "",
    jobType: "",
    location: "",
    duration: "",
    salary: "",
    isUrgent: false,
    isPaid: false,

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
    preferredContact: "both",

    // Client Ownership
    clientId: "", // Simplified field name to match client code
  });

  const updateJobDetails = (field: string, value: string | boolean) => {
    setJobDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Enhanced success notification function (like reference code)
  const showSuccessNotification = (message: string) => {
    // The processing notification will continue showing during this 5-second delay
    setTimeout(() => {
      setSuccessMessage(message);
      setShowSuccess(true);
      setIsProcessing(false);
      setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage(null);
        // Reset form after success notification disappears
        resetForm();
      }, 5000); // ⬅ Success shows for 5 seconds
    }, 5000); // ⬅ Wait 5 seconds before showing success
  };

  // Enhanced form validation with detailed error messages
  const validateForm = () => {
    const errors: string[] = [];

    if (!jobDetails.title.trim()) {
      errors.push("• Job title is required");
    } else if (jobDetails.title.trim().length < 3) {
      errors.push("• Job title must be at least 3 characters long");
    }

    if (!jobDetails.category) {
      errors.push("• Please select a job category");
    }

    if (!jobDetails.jobType) {
      errors.push("• Please select a job type");
    }

    if (!jobDetails.location.trim()) {
      errors.push("• Location is required");
    } else if (jobDetails.location.trim().length < 2) {
      errors.push("• Location must be at least 2 characters long");
    }

    if (!jobDetails.duration.trim()) {
      errors.push("• Duration is required");
    }

    if (!jobDetails.salary.trim()) {
      errors.push("• Salary/Budget is required");
    }

    if (!jobDetails.description.trim()) {
      errors.push("• Job description is required");
    } else if (jobDetails.description.trim().length < 10) {
      errors.push("• Job description must be at least 10 characters long");
    }

    if (!jobDetails.requirements.trim()) {
      errors.push("• Skills and requirements are required");
    } else if (jobDetails.requirements.trim().length < 5) {
      errors.push("• Requirements must be at least 5 characters long");
    }

    if (!jobDetails.responsibilities.trim()) {
      errors.push("• Responsibilities are required");
    } else if (jobDetails.responsibilities.trim().length < 5) {
      errors.push("• Responsibilities must be at least 5 characters long");
    }

    if (!jobDetails.company.trim()) {
      errors.push("• Company/Organization name is required");
    } else if (jobDetails.company.trim().length < 2) {
      errors.push("• Company name must be at least 2 characters long");
    }

    if (!jobDetails.contactPerson.trim()) {
      errors.push("• Contact person name is required");
    } else if (jobDetails.contactPerson.trim().length < 2) {
      errors.push("• Contact person name must be at least 2 characters long");
    }

    if (!jobDetails.phone.trim()) {
      errors.push("• Phone number is required");
    } else if (!/^\+?[\d\s\-()]{10,20}$/.test(jobDetails.phone.trim())) {
      errors.push("• Please enter a valid phone number (10-20 digits)");
    }

    if (!jobDetails.email.trim()) {
      errors.push("• Email address is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(jobDetails.email.trim())) {
      errors.push("• Please enter a valid email address");
    }

    return errors;
  };

  const handleNextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 3) {
      const errors = validateForm();
      if (errors.length > 0) {
        setToast({
          message: `Please fix the following errors before proceeding:\n${errors.join(
            "\n"
          )}`,
          type: "error",
        });
        window.scrollTo(0, 0);
        return;
      }
    }

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

  const resetForm = () => {
    setJobDetails({
      title: "",
      category: "",
      jobType: "",
      location: "",
      duration: "",
      salary: "",
      isUrgent: false,
      isPaid: false,
      description: "",
      requirements: "",
      responsibilities: "",
      benefits: "",
      company: "",
      contactPerson: "",
      phone: "",
      email: "",
      preferredContact: "both",
      clientId: "",
    });
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate entire form before submission
    const errors = validateForm();
    if (errors.length > 0) {
      setToast({
        message: `Please fix the following errors:\n${errors.join("\n")}`,
        type: "error",
      });
      window.scrollTo(0, 0);
      return;
    }

    setIsSubmitting(true);
    setIsProcessing(true); // Start processing state
    setToast({ message: "Submitting job... Please wait", type: "loading" });

    try {
      // Prepare submission data with exact field names that match the backend
      const submissionData = {
        title: jobDetails.title.trim(),
        category: jobDetails.category,
        jobType: jobDetails.jobType,
        location: jobDetails.location.trim(),
        duration: jobDetails.duration.trim(),
        salary: jobDetails.salary.trim(),
        Jobdescription: jobDetails.description.trim(),
        SkillsAndrequirements: jobDetails.requirements.trim(),
        responsibilities: jobDetails.responsibilities.trim(),
        benefits: jobDetails.benefits.trim(),
        companyName: jobDetails.company.trim(),
        contactPerson: jobDetails.contactPerson.trim(),
        phoneNumber: jobDetails.phone.trim(),
        email: jobDetails.email.trim(),
        preferredContact: jobDetails.preferredContact,
        isUrgent: jobDetails.isUrgent,
        isPaid: jobDetails.isPaid,
        clientUserId: jobDetails.clientId.trim() || null, // Use clientUserId to match Postman
        // Remove status field as it might be auto-set by the backend
      };

      console.log("📤 Submitting job data to server:", submissionData);

      const response = await fetch(
        "http://localhost:5000/api/admin/jobs/jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...AdminAuthService.getAuthHeaders(),
          },
          body: JSON.stringify(submissionData),
        }
      );

      console.log("📥 Server response status:", response.status);

      if (!response.ok) {
        let errorData: {
          message?: string;
          details?: unknown;
          errors?: Record<string, string> | Array<unknown>;
          validationErrors?: Array<{ field: string; message: string }>;
        };

        try {
          errorData = await response.json();
          console.error("🚨 Server error response:", errorData);
        } catch (parseError) {
          console.error("🚨 Failed to parse error response:", parseError);
          throw new Error(
            `Server returned ${response.status}: ${response.statusText}`
          );
        }

        // Handle different types of validation errors
        let errorMessage = "Failed to create job";

        if (errorData.message) {
          errorMessage = errorData.message;
        }

        // Check for detailed validation errors - handle array of objects
        if (errorData.details) {
          console.error("🔍 Validation details:", errorData.details);

          if (Array.isArray(errorData.details)) {
            errorMessage += `\nValidation issues:\n${errorData.details
              .map((detail: unknown) => {
                if (typeof detail === "object" && detail !== null) {
                  const detailObj = detail as {
                    field?: string;
                    message?: string;
                    path?: string;
                  };
                  return `• ${
                    detailObj.field || detailObj.path || "Unknown field"
                  }: ${detailObj.message || "Invalid value"}`;
                }
                return `• ${String(detail)}`;
              })
              .join("\n")}`;
          }
        }

        // Check for field-specific errors - handle both object and array formats
        if (errorData.errors) {
          console.error("🔍 Field errors:", errorData.errors);

          if (Array.isArray(errorData.errors)) {
            // Handle array of error objects
            const fieldErrors = errorData.errors
              .map((error: unknown, index: number) => {
                if (typeof error === "object" && error !== null) {
                  const errorObj = error as {
                    field?: string;
                    message?: string;
                  };
                  return `• ${errorObj.field || `Field ${index}`}: ${
                    errorObj.message || "Invalid value"
                  }`;
                }
                return `• Error ${index}: ${String(error)}`;
              })
              .join("\n");
            errorMessage += `\nField errors:\n${fieldErrors}`;
          } else if (typeof errorData.errors === "object") {
            // Handle object with field names as keys
            const fieldErrors = Object.entries(
              errorData.errors as Record<string, string>
            )
              .map(([field, error]) => `• ${field}: ${error}`)
              .join("\n");
            errorMessage += `\nField errors:\n${fieldErrors}`;
          }
        }

        // Check for validationErrors array (common pattern)
        if (
          errorData.validationErrors &&
          Array.isArray(errorData.validationErrors)
        ) {
          const validationErrors = errorData.validationErrors
            .map(
              (error: { field: string; message: string }) =>
                `• ${error.field}: ${error.message}`
            )
            .join("\n");
          errorMessage += `\nValidation errors:\n${validationErrors}`;
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("✅ Job created successfully:", result);

      // Show success notification (like reference code)
      showSuccessNotification("Job posted successfully!");
      setToast(null); // Clear any existing toast
    } catch (error: unknown) {
      console.error("💥 Error creating job:", error);
      let errorMessage = "Failed to create job. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      setToast({
        message: errorMessage,
        type: "error",
      });
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: "Job Details" },
    { number: 2, title: "Description & Requirements" },
    { number: 3, title: "Contact Information" },
    { number: 4, title: "Review & Submit" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:flex font-inter">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Enhanced Success Notifications (like reference code) */}
      {isProcessing && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl flex items-center space-x-3">
            <Loader2 className="w-6 h-6 flex-shrink-0 animate-spin" />
            <div>
              <p className="font-bold text-sm">Processing...</p>
              <p className="text-sm opacity-90">
                Please wait while we complete your request
              </p>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">Success!</p>
              <p className="text-sm opacity-90">{successMessage}</p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-2xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                    Admin Job Posting
                  </h1>
                  <p className="text-slate-600 mt-1 text-base sm:text-lg font-bold">
                    Create and manage job listings
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
              <Plus className="w-4 h-4" />
              <span>New Job</span>
            </div>
          </div>

          {/* Toast Notification */}
          {toast && (
            <div
              className={`mb-6 p-4 rounded-2xl font-bold whitespace-pre-line ${
                toast.type === "success"
                  ? "bg-emerald-500 text-white"
                  : toast.type === "error"
                  ? "bg-red-500 text-white"
                  : "bg-blue-500 text-white"
              }`}
            >
              {toast.message}
            </div>
          )}

          <div className="max-w-7xl mx-auto">
            {/* Progress Steps */}
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
                          ? "bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white"
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
                          ? "text-purple-600"
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
                              ? "bg-gradient-to-r from-purple-500 to-indigo-500"
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

            {/* Form Container */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 sm:p-10">
              <form>
                {/* Step 1: Basic Job Details */}
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        Job Details
                      </h2>
                    </div>

                    {/* Client ID Field */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <UserCog className="w-5 h-5 text-blue-600" />
                        Client Assignment (Optional)
                      </h3>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                          Client ID
                        </label>
                        <input
                          type="text"
                          value={jobDetails.clientId}
                          onChange={(e) =>
                            updateJobDetails("clientId", e.target.value)
                          }
                          placeholder="e.g., cmcnwc8pf00009py8inr3ski4"
                          className="w-full px-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 hover:border-slate-300"
                        />
                        <p className="text-xs text-slate-500 mt-2 font-medium">
                          Leave empty to assign to system client. Enter Client
                          ID to assign this job to a specific client.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        value={jobDetails.title}
                        onChange={(e) =>
                          updateJobDetails("title", e.target.value)
                        }
                        placeholder="e.g., Senior Mason for Commercial Building"
                        className="w-full px-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 hover:border-slate-300"
                        required
                      />
                      <p className="text-xs text-slate-500 mt-2 font-medium">
                        Minimum 3 characters required
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                          Category *
                        </label>
                        <select
                          value={jobDetails.category}
                          onChange={(e) =>
                            updateJobDetails("category", e.target.value)
                          }
                          className="w-full px-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-slate-900 font-medium hover:border-slate-300"
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
                          <option value="General Labor">General Labor</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                          Job Type *
                        </label>
                        <select
                          value={jobDetails.jobType}
                          onChange={(e) =>
                            updateJobDetails("jobType", e.target.value)
                          }
                          className="w-full px-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-slate-900 font-medium hover:border-slate-300"
                          required
                        >
                          <option value="">Select job type</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="One-time">One-time project</option>
                          <option value="Temporary">Temporary</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                        Location *
                      </label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                        <input
                          type="text"
                          value={jobDetails.location}
                          onChange={(e) =>
                            updateJobDetails("location", e.target.value)
                          }
                          placeholder="e.g., Nairobi, Kenya"
                          className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 group-hover:border-slate-300"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                          Duration *
                        </label>
                        <div className="relative group">
                          <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                          <input
                            type="text"
                            value={jobDetails.duration}
                            onChange={(e) =>
                              updateJobDetails("duration", e.target.value)
                            }
                            placeholder="e.g., 3 months, 2 weeks"
                            className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 group-hover:border-slate-300"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                          Salary/Budget *
                        </label>
                        <div className="relative group">
                          <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                          <input
                            type="text"
                            value={jobDetails.salary}
                            onChange={(e) =>
                              updateJobDetails("salary", e.target.value)
                            }
                            placeholder="e.g., KSh 2,500 - 3,500 per day"
                            className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 group-hover:border-slate-300"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Simple Admin Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between rounded-xl bg-white/60 p-4 shadow-sm border border-white/40 hover:bg-white/80 transition-colors duration-200">
                        <label
                          htmlFor="isUrgent"
                          className="text-base font-medium text-slate-700 flex items-center"
                        >
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
                            onChange={(e) =>
                              updateJobDetails("isUrgent", e.target.checked)
                            }
                            className="opacity-0 w-0 h-0 peer"
                          />
                          <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-slate-300 rounded-full transition-all duration-300 peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-indigo-500"></span>
                          <span className="absolute h-4 w-4 bg-white rounded-full left-1 top-1 transition-all duration-300 peer-checked:translate-x-6"></span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-white/60 p-4 shadow-sm border border-white/40 hover:bg-white/80 transition-colors duration-200">
                        <label
                          htmlFor="isPaid"
                          className="text-base font-medium text-slate-700 flex items-center"
                        >
                          <span className="mr-3 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-full">
                            Featured
                          </span>
                          Mark as Paid/Featured
                        </label>
                        <div className="relative inline-block w-12 h-6">
                          <input
                            type="checkbox"
                            id="isPaid"
                            name="isPaid"
                            checked={jobDetails.isPaid}
                            onChange={(e) =>
                              updateJobDetails("isPaid", e.target.checked)
                            }
                            className="opacity-0 w-0 h-0 peer"
                          />
                          <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-slate-300 rounded-full transition-all duration-300 peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-indigo-500"></span>
                          <span className="absolute h-4 w-4 bg-white rounded-full left-1 top-1 transition-all duration-300 peer-checked:translate-x-6"></span>
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
                        Job Description *
                      </label>
                      <textarea
                        value={jobDetails.description}
                        onChange={(e) =>
                          updateJobDetails("description", e.target.value)
                        }
                        placeholder="Provide a detailed description of the job, including project scope, objectives, and specific tasks..."
                        className="w-full px-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 resize-none hover:border-slate-300"
                        rows={5}
                        required
                      ></textarea>
                      <p className="text-xs text-slate-500 mt-2 font-medium">
                        Minimum 10 characters required
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                        Requirements *
                      </label>
                      <textarea
                        value={jobDetails.requirements}
                        onChange={(e) =>
                          updateJobDetails("requirements", e.target.value)
                        }
                        placeholder="List the minimum requirements for this position..."
                        className="w-full px-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 resize-none hover:border-slate-300"
                        rows={4}
                        required
                      ></textarea>
                      <p className="text-xs text-slate-500 mt-2 font-medium">
                        Minimum 5 characters required
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                        Key Responsibilities *
                      </label>
                      <textarea
                        value={jobDetails.responsibilities}
                        onChange={(e) =>
                          updateJobDetails("responsibilities", e.target.value)
                        }
                        placeholder="Outline the main responsibilities and duties..."
                        className="w-full px-4 py-4 bg-white/60 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 resize-none hover:border-slate-300"
                        rows={4}
                        required
                      ></textarea>
                      <p className="text-xs text-slate-500 mt-2 font-medium">
                        Minimum 5 characters required
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                        Benefits & Perks (Optional)
                      </label>
                      <textarea
                        value={jobDetails.benefits}
                        onChange={(e) =>
                          updateJobDetails("benefits", e.target.value)
                        }
                        placeholder="List benefits, perks, and incentives..."
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

                    {/* Client Assignment Info */}
                    {jobDetails.clientId && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                          <UserCog className="w-5 h-5 text-green-600" />
                          Client Assignment
                        </h3>
                        <p className="text-slate-700 font-medium">
                          This job will be assigned to client ID:{" "}
                          <code className="bg-green-100 px-2 py-1 rounded text-sm font-mono">
                            {jobDetails.clientId}
                          </code>
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                        Company/Organization *
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
                        Contact Person *
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
                          Phone Number *
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
                          Email *
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
                      {/* Client Assignment Section */}
                      {jobDetails.clientId && (
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <UserCog className="w-5 h-5 text-blue-600" />
                            Client Assignment
                          </h3>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Client ID:
                            </p>
                            <p className="text-slate-900 font-medium font-mono">
                              {jobDetails.clientId}
                            </p>
                            <p className="text-xs text-slate-500 mt-2">
                              This job will be assigned to the specified client
                              account.
                            </p>
                          </div>
                        </div>
                      )}

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
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Urgent:
                            </p>
                            <p className="text-slate-900 font-medium">
                              {jobDetails.isUrgent ? "Yes" : "No"}
                            </p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Featured:
                            </p>
                            <p className="text-slate-900 font-medium">
                              {jobDetails.isPaid ? "Yes" : "No"}
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
                          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Preferred Contact:
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

                    <div className="bg-gradient-to-r from-purple-100 to-indigo-200 border-2 border-purple-300 rounded-2xl p-6">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-6 h-6 text-purple-600" />
                        <p className="text-purple-800 font-bold">
                          <strong>Admin Note:</strong> This job will be posted
                          with admin privileges.
                          {jobDetails.clientId &&
                            " The job will be assigned to the specified client."}
                          {!jobDetails.clientId &&
                            " The job will be assigned to the system client."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
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
                      className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white rounded-2xl font-bold hover:from-purple-600 hover:via-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      Next
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting || isProcessing}
                      className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white rounded-2xl font-bold hover:from-purple-600 hover:via-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting || isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Publish Job
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
