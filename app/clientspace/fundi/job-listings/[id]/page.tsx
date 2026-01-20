"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/fundi/Sidebar";
import {
  Menu,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Briefcase,
  Heart,
  Eye,
  ArrowLeft,
  Building2,
  CheckCircle,
  Star,
  AlertCircle,
  Phone,
  Mail,
  Share2,
  Flag,
  Shield,
  Award,
  Users,
} from "lucide-react";
import FundiAuthService from "@/app/services/fundi_user";

interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  salary: string;
  duration: string;
  timePosted: string;
  Jobdescription: string;
  benefits: string;
  SkillsAndrequirements: string;
  responsibilities: string;
  phoneNumber: string;
  email: string;
  clickCount: number;
  status: string;
}

export default function JobDetailsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // New state for saving/unsaving
  const [jobDetails, setJobDetails] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams<{ id: string }>();
  const router = useRouter();
  const jobId = params.id;

  useEffect(() => {
    async function fetchJob() {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/client/jobs/${jobId}`
        );
        if (!res.ok)
          throw new Error(`Failed to fetch job (status ${res.status})`);
        const data: Job = await res.json();
        setJobDetails(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    async function checkSavedStatus() {
        const token = FundiAuthService.getToken();
        if (!token) {
            // User is not logged in, so the job can't be saved
            setIsSaved(false);
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/fundi/saved-jobs/check/${jobId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setIsSaved(data.data.isSaved);
            } else {
                console.error("Failed to check saved status:", data.message);
                setIsSaved(false);
            }
        } catch (err) {
            console.error("Error checking saved status:", err);
            setIsSaved(false);
        }
    }

    if (jobId) {
      fetchJob();
      checkSavedStatus();
    }
  }, [jobId]);

  const handleSave = async () => {
    const token = FundiAuthService.getToken();
    if (!token) {
      alert("You must be logged in to save jobs.");
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        // Remove saved job
        const res = await fetch(`http://localhost:5000/api/fundi/saved-jobs/remove/${jobId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (res.ok) {
          setIsSaved(false);
        } else {
          const errorData = await res.json();
          alert(`Failed to unsave job: ${errorData.message}`);
        }
      } else {
        // Save job
        const res = await fetch("http://localhost:5000/api/fundi/saved-jobs/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ jobId }),
        });
        if (res.ok) {
          setIsSaved(true);
        } else {
          const errorData = await res.json();
          alert(`Failed to save job: ${errorData.message}`);
        }
      }
    } catch (error) {
      console.error("Error saving/unsaving job:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => router.back();

  const handleShare = () => {
    if (navigator.share && jobDetails) {
      navigator.share({
        title: jobDetails.title,
        text: `Check out this job opportunity: ${jobDetails.title} at ${jobDetails.companyName}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Job link copied to clipboard!");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30">
          <div className="animate-pulse text-slate-600">
            Loading job details...
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30">
          <div className="text-red-600 font-bold">⚠ {error}</div>
        </div>
      </div>
    );

  if (!jobDetails)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30">
          <div className="text-slate-600 font-medium">Job not found.</div>
        </div>
      </div>
    );

  // Format posted date
  const postedDate = new Date(jobDetails.timePosted).toLocaleDateString();

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

            {/* Action Buttons (Desktop) */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center gap-2 shadow-md ${
                  isSaved
                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                    : "bg-white/60 text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-white/80"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                {isSaving ? "Updating..." : (isSaved ? "Saved" : "Save Job")}
              </button>
              <button
                onClick={handleShare}
                className="px-6 py-3 bg-white/60 text-slate-700 border border-slate-200 rounded-2xl font-bold hover:border-slate-300 hover:bg-white/80 transition-all duration-300 flex items-center gap-2 shadow-md"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
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
                    {jobDetails.status?.trim().toLowerCase() === "verified" && (
                      <span className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-sm font-bold rounded-full flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Verified
                      </span>
                    )}
                    {jobDetails.status?.trim().toLowerCase() === "urgent" && (
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
                        {jobDetails.companyName}
                      </span>
                    </div>
                  </div>

                  {/* Job Meta Info - Fully Responsive */}
                  <div className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="bg-white/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/40 shadow-sm sm:shadow-md flex items-start sm:items-center">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-slate-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <div>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Location
                        </p>
                        <p className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1 sm:line-clamp-none">
                          {jobDetails.location}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/40 shadow-sm sm:shadow-md flex items-start sm:items-center">
                      <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-emerald-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <div>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Budget
                        </p>
                        <p className="text-sm sm:text-base font-bold text-emerald-600">
                          {jobDetails.salary}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/40 shadow-sm sm:shadow-md flex items-start sm:items-center">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-slate-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <div>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Duration
                        </p>
                        <p className="text-sm sm:text-base font-bold text-slate-900">
                          {jobDetails.duration}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/40 shadow-sm sm:shadow-md flex items-start sm:items-center">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-slate-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <div>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Posted
                        </p>
                        <p className="text-sm sm:text-base font-bold text-slate-900">
                          {postedDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-6 text-sm font-bold text-slate-500">
                    <div className="flex items-center">
                      <Eye className="w-5 h-5 mr-2" />
                      <span>{jobDetails.clickCount} views</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="w-5 h-5 mr-2" />
                      <span>General</span>{" "}
                      {/* You can map category if available */}
                    </div>
                  </div>
                </div>

                {/* Action Buttons (Mobile) */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:w-56">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`px-6 py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                      isSaved
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                        : "bg-white/60 text-slate-700 border-2 border-slate-200 hover:border-slate-300 hover:bg-white/80"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`}
                    />
                    {isSaving ? "Updating..." : (isSaved ? "Saved" : "Save Job")}
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
                    <p className="text-slate-600 leading-relaxed font-medium">
                      {jobDetails.Jobdescription}
                    </p>
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
                    {jobDetails.SkillsAndrequirements.split("\n")
                      .filter((line) => line.trim())
                      .map((req, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                          </div>
                          <span className="text-slate-600 font-medium">
                            {req.trim()}
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
                    {jobDetails.responsibilities
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((resp, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-indigo-600" />
                          </div>
                          <span className="text-slate-600 font-medium">
                            {resp.trim()}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>

                {/* Benefits (Placeholder — adapt as needed) */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Benefits & Perks
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    {jobDetails.benefits
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((resp, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                            <Star className="w-5 h-5 text-indigo-600" />
                          </div>
                          <span className="text-slate-600 font-medium">
                            {resp.trim()}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              {/* Right Column - Company Info & Contact */}
              <div className="space-y-8">
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
                          {jobDetails.phoneNumber}
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
                          {jobDetails.email}
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
                          {jobDetails.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Report Job */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
                  <button className="flex items-center text-red-600 hover:text-red-700 transition-colors gap-2 font-bold">
                    <Flag className="w-5 h-5" />
                    <span>Report this job</span>
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