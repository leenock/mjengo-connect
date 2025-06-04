"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/fundi/Sidebar";
import {
  Menu,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Calendar,
  Briefcase,
  Heart,
  Eye,
  ArrowLeft,
  Building2,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Share2,
  Flag,
} from "lucide-react";

export default function JobDetailsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const params = useParams();
  const router = useRouter();
  const jobId = params.id;

  // Mock job data - in real app, this would be fetched based on the ID
  const jobDetails = {
    id: jobId,
    title: "House Painting - 3 Bedroom",
    company: "Kamau Properties Ltd",
    location: "Westlands, Nairobi",
    budget: "Ksh 800",
    duration: "5 days",
    postedTime: "2 hours ago",
    urgency: "Urgent",
    category: "Painting",
    verified: true,
    views: 156,
    description: `We are looking for experienced painters to paint a 3-bedroom house in Westlands. The job involves interior and exterior painting with high-quality materials. The successful candidate must have their own painting equipment and demonstrate proven experience in residential painting projects.

The house is a modern 3-bedroom unit with approximately 1,200 square feet of interior space and 800 square feet of exterior walls. We expect the work to be completed within 3-5 days depending on weather conditions.

Materials will be provided by the client, but the painter must bring all necessary tools and equipment. This is an urgent project and we need someone who can start immediately.`,
    requirements: [
      "3+ years of professional painting experience",
      "Own painting equipment and tools",
      "References from previous clients",
      "Available to start immediately",
      "Knowledge of different paint types",
      "Attention to detail and quality workmanship",
    ],
    responsibilities: [
      "Prepare surfaces by cleaning, sanding, and priming",
      "Apply paint using brushes, rollers, and spray equipment",
      "Ensure even coverage and smooth finish",
      "Protect furniture and flooring during work",
      "Clean up work area after completion",
      "Provide progress updates to client",
    ],
    benefits: [
      "Competitive payment upon completion",
      "Materials provided by client",
      "Potential for future projects",
      "Positive review and rating opportunity",
    ],
    companyInfo: {
      name: "Kamau Properties Ltd",
      established: "2015",
      projects: "150+ completed",
      rating: 4.8,
      employees: "25-50",
      description:
        "Leading property development and management company in Nairobi with over 8 years of experience.",
    },
    contactInfo: {
      phone: "+254 712 345 678",
      email: "jobs@kamauproperties.co.ke",
      address: "Westlands, Nairobi",
    },
  };

  const handleApply = () => {
    setShowApplyModal(true);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: jobDetails.title,
        text: `Check out this job opportunity: ${jobDetails.title} at ${jobDetails.company}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Job link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="p-4 sm:p-6 lg:p-6">
          {/* Header */}
          <div className="sticky top-0 z-30 bg-gray-50 mb-6 sm:mb-8 flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              {/* Back Button */}
              <button
                onClick={handleBack}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Job Details
                </h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Complete information about this opportunity
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {/* Job Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-2xl sm:text-xl font-extrabold text-gray-900">
                      {jobDetails.title}
                    </h2>
                    {jobDetails.verified && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                    {jobDetails.urgency === "Urgent" && (
                      <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
                        Urgent
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-gray-500" />
                    <span className="text-lg font-medium text-gray-700">
                      {jobDetails.company}
                    </span>
                    <div className="flex items-center ml-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    </div>
                  </div>

                  {/* Job Meta Info */}
                  <div className="grid grid-cols-2 font-black lg:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{jobDetails.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-5 h-5 mr-2" />
                      <span>Amount {jobDetails.budget}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-2" />
                      <span> Duration {jobDetails.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>Posted {jobDetails.postedTime}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      <span>{jobDetails.views} views</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      <span>{jobDetails.category}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-48">
                  <button
                    onClick={handleApply}
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                  >
                    Apply Now
                  </button>
                  <button
                    onClick={handleSave}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      isSaved
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
                    />
                    {isSaved ? "Saved" : "Save Job"}
                  </button>
                  <button
                    onClick={handleShare}
                    className="px-6 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Job Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Job Description */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Job Description
                  </h3>
                  <div className="prose prose-gray max-w-none">
                    {jobDetails.description
                      .split("\n\n")
                      .map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-gray-600 mb-4 leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Requirements
                  </h3>
                  <ul className="space-y-3">
                    {jobDetails.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Responsibilities */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Key Responsibilities
                  </h3>
                  <ul className="space-y-3">
                    {jobDetails.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    What We Offer
                  </h3>
                  <ul className="space-y-3">
                    {jobDetails.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <Star className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0 fill-current" />
                        <span className="text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column - Company Info & Contact */}
              <div className="space-y-6">
                {/* Company Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    About the Company
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {jobDetails.companyInfo.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {jobDetails.companyInfo.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Established</span>
                        <p className="font-medium text-gray-900">
                          {jobDetails.companyInfo.established}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Projects</span>
                        <p className="font-medium text-gray-900">
                          {jobDetails.companyInfo.projects}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Rating</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                          <span className="font-medium text-gray-900">
                            {jobDetails.companyInfo.rating}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Team Size</span>
                        <p className="font-medium text-gray-900">
                          {jobDetails.companyInfo.employees}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-500 mr-3" />
                      <span className="text-gray-600">
                        {jobDetails.contactInfo.phone}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-500 mr-3" />
                      <span className="text-gray-600">
                        {jobDetails.contactInfo.email}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                      <span className="text-gray-600">
                        {jobDetails.contactInfo.address}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Report Job */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <button className="flex items-center text-red-600 hover:text-red-700 transition-colors">
                    <Flag className="w-4 h-4 mr-2" />
                    <span className="text-sm">Report this job</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Apply for this Job
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to apply for `{jobDetails.title}` at{" "}
              {jobDetails.company}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApplyModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowApplyModal(false);
                  alert("Application submitted successfully!");
                }}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Confirm Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
