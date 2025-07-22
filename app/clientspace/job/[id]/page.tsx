"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/job_posting/Sidebar";
import {
  Menu,
  MapPin,
  Clock,
  Star,
  DollarSign,
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
  Shield,
  Award,
  Users,
} from "lucide-react";

export default function JobDetailsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
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
    ],
    companyInfo: {
      name: "Kamau Properties Ltd",
      established: "2015",
      description:
        "Leading property development and management company in Nairobi with over 8 years of experience.",
    },
    contactInfo: {
      phone: "+254 712 345 678",
      email: "jobs@kamauproperties.co.ke",
      address: "Westlands, Nairobi",
    },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:flex font-inter">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl mb-8 sm:mb-10 flex items-center justify-between px-6 sm:px-8 py-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-3 rounded-xl text-slate-700 hover:bg-white/60 transition-all duration-200 shadow-sm"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              {/* Back Button */}
              <button
                onClick={handleBack}
                className="p-3 rounded-xl text-slate-700 hover:bg-white/60 transition-all duration-200 shadow-sm"
                aria-label="Go back"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  Job Details
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-medium">
                  Complete information about this opportunity
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Job Header Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h2 className="text-3xl font-bold text-slate-900">
                      {jobDetails.title}
                    </h2>
                    {jobDetails.verified && (
                      <span className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-sm font-bold rounded-full flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Verified
                      </span>
                    )}
                    {jobDetails.urgency === "Urgent" && (
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
                      <span className="text-xl font-bold text-slate-900">
                        {jobDetails.company}
                      </span>
                    </div>
                  </div>

                  {/* Job Meta Info */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/60 rounded-2xl p-4 border border-white/40 shadow-md flex items-center">
                      <MapPin className="w-5 h-5 mr-3 text-slate-500" />
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Location
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {jobDetails.location}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/60 rounded-2xl p-4 border border-white/40 shadow-md flex items-center">
                      <DollarSign className="w-5 h-5 mr-3 text-emerald-500" />
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Budget
                        </p>
                        <p className="text-sm font-bold text-emerald-600">
                          {jobDetails.budget}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/60 rounded-2xl p-4 border border-white/40 shadow-md flex items-center">
                      <Clock className="w-5 h-5 mr-3 text-slate-500" />
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Duration
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {jobDetails.duration}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/60 rounded-2xl p-4 border border-white/40 shadow-md flex items-center">
                      <Calendar className="w-5 h-5 mr-3 text-slate-500" />
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Posted
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {jobDetails.postedTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-6 text-sm font-bold text-slate-500">
                    <div className="flex items-center">
                      <Eye className="w-5 h-5 mr-2" />
                      <span>{jobDetails.views} views</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="w-5 h-5 mr-2" />
                      <span>{jobDetails.category}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:w-56">
                  <button
                    onClick={handleSave}
                    className={`px-6 py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                      isSaved
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                        : "bg-white/60 text-slate-700 border-2 border-slate-200 hover:border-slate-300 hover:bg-white/80"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`}
                    />
                    {isSaved ? "Saved" : "Save Job"}
                  </button>
                  <button
                    onClick={handleShare}
                    className="px-6 py-4 bg-white/60 text-slate-700 border-2 border-slate-200 rounded-2xl font-bold hover:border-slate-300 hover:bg-white/80 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Job Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Job Description */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Job Description
                    </h3>
                  </div>
                  <div className="prose prose-slate max-w-none">
                    {jobDetails.description
                      .split("\n\n")
                      .map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-slate-600 mb-4 leading-relaxed font-medium"
                        >
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Requirements
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    {jobDetails.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className="text-slate-600 font-medium">
                          {req}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Responsibilities */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Key Responsibilities
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    {jobDetails.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <AlertCircle className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="text-slate-600 font-medium">
                          {resp}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      What We Offer
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    {jobDetails.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <Star className="w-5 h-5 text-amber-600 fill-current" />
                        </div>
                        <span className="text-slate-600 font-medium">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column - Company Info & Contact */}
              <div className="space-y-8">
                {/* Company Information */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      About the Company
                    </h3>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg">
                      <h4 className="font-bold text-slate-900 text-lg mb-2">
                        {jobDetails.companyInfo.name}
                      </h4>
                      <p className="text-slate-600 font-medium">
                        {jobDetails.companyInfo.description}
                      </p>

                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-500">
                            Established
                          </span>
                          <span className="font-bold text-slate-900">
                            {jobDetails.companyInfo.established}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Contact Information
                    </h3>
                  </div>

                  {/* Free Trial Notice */}
                 

                  <div className="bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg space-y-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mr-4">
                        <Phone className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Phone
                        </p>
                        <p className="text-base font-bold text-slate-900">
                          {jobDetails.contactInfo.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mr-4">
                        <Mail className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Email
                        </p>
                        <p className="text-base font-bold text-slate-900">
                          {jobDetails.contactInfo.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mr-4">
                        <MapPin className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Address
                        </p>
                        <p className="text-base font-bold text-slate-900">
                          {jobDetails.contactInfo.address}
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
  );
}
