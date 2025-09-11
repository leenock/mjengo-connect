"use client";
import { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  EyeOff,
  Phone,
  Mail,
  User,
  ArrowLeft,
  Calendar,
  Shield,
  CheckCircle,
  Briefcase,
  AlertCircle,
  Star,
  Award,
  Users,
  Flag,
} from "lucide-react";
import Header from "@/components/landingpage/Header";
import Footer from "@/components/landingpage/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";

// Define Job interface (matching your backend)
interface Job {
  id: string;
  title: string;
  location: string;
  salary: string;
  duration: string;
  timePosted: string;
  Jobdescription: string;
  SkillsAndrequirements: string;
  // Add optional fields if your backend supports them
  responsibilities?: string;
  benefits?: string;
  isUrgent: boolean;
  clickCount: number;
  status: string;
  postedBy: {
    firstName: string;
    lastName: string;
    company: string;
    phone?: string;
    email?: string;
  };
}

// Transform backend job to UI-friendly format
const transformJobForUI = (job: Job) => {
  // For the "Skills Required" tag section (split by comma)
  const skills =
    typeof job.SkillsAndrequirements === "string"
      ? job.SkillsAndrequirements.split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  // For the "Requirements" bullet list (split by newline)
  const requirements =
    typeof job.SkillsAndrequirements === "string"
      ? job.SkillsAndrequirements.split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
      : [];

  // For "Key Responsibilities" (split by newline, fallback to empty array)
  const responsibilities =
    typeof job.responsibilities === "string"
      ? job.responsibilities
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
      : [
          "Complete assigned tasks within the agreed timeframe.",
          "Communicate proactively with the client regarding progress and any issues.",
          "Maintain a clean and safe work environment.",
        ];

  // For "Benefits & Perks" (split by newline, fallback to empty array)
  const benefits =
    typeof job.benefits === "string"
      ? job.benefits
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
      : [
          "Flexible working hours.",
          "Opportunity for long-term collaboration.",
          "Performance-based bonuses.",
        ];

  const postedTime = formatTimeAgo(new Date(job.timePosted));
  const startDate = new Date(job.timePosted).toISOString().split("T")[0];

  return {
    id: job.id,
    title: job.title,
    category: inferCategoryFromTitle(job.title),
    location: job.location,
    budget: job.salary,
    skills, // For tags
    requirements, // For bullet points
    responsibilities, // For bullet points
    benefits, // For bullet points
    postedTime,
    urgency: job.isUrgent ? "Urgent" : "Normal",
    StartDate: startDate,
    description: job.Jobdescription,
    projectDuration: job.duration,
    verified: true,
    detailedDescription: job.Jobdescription,
    contact: {
      name: `${job.postedBy.firstName} ${job.postedBy.lastName}`,
      phone: job.postedBy.phone || "Not provided",
      email: job.postedBy.email || "Not provided",
      company: job.postedBy.company,
    },
    clickCount: job.clickCount,
  };
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
};

const inferCategoryFromTitle = (title: string) => {
  const categories = [
    "masonry",
    "painting",
    "plumbing",
    "electrical",
    "carpentry",
    "roofing",
    "tiling",
    "welding",
  ];
  const lowerTitle = title.toLowerCase();
  return categories.find((cat) => lowerTitle.includes(cat)) || "general";
};

export default function JobDetailsPage() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id;
  const [job, setJob] = useState<ReturnType<typeof transformJobForUI> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 👉 REPLACE WITH YOUR AUTH SERVICE
  useEffect(() => {
    const userData = localStorage.getItem("fundiUser");
    setIsLoggedIn(!!userData);
  }, []);

  // Fetch job details
  useEffect(() => {
    if (!jobId) {
      setError("No job ID provided");
      setLoading(false);
      return;
    }
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/client/jobs/${jobId}`
        );
        if (!res.ok) {
          throw new Error("Job not found");
        }
        const data: Job = await res.json();
        setJob(transformJobForUI(data));
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load job details");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-600">Loading job details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow pt-20 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {error === "Job not found"
                ? "Job Not Found"
                : "Error Loading Job"}
            </h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {error === "Job not found"
                ? "The job you are looking for doesn't exist or has been removed."
                : "Something went wrong while loading the job details. Please try again later."}
            </p>
            <div className="space-y-3">
              <Link href="/jobs">
                <button className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                  Browse All Jobs
                </button>
              </Link>
              <Link href="/">
                <button className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300">
                  Go to Homepage
                </button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow pt-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link
                href="/Jobs-list"
                className="hover:text-orange-600 transition-colors"
              >
                Construction Jobs
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{job.title}</span>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Back Button */}
              <Link href="/Jobs-list">
                <button className="flex items-center text-gray-600 hover:text-orange-600 transition-colors mb-6 py-2">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span>Back to Job Listings</span>
                </button>
              </Link>

              {/* Job Header */}
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mr-2">
                        {job.title}
                      </h1>
                      {job.verified && (
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <Shield className="w-4 h-4 text-green-600" />
                        </div>
                      )}
                      {job.urgency === "Urgent" && (
                        <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                          🔥 Urgent
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-600 text-sm">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
                        <span>Posted {job.postedTime}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
                        <span>Duration: {job.projectDuration}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
                        <span>Date Posted: {job.StartDate}</span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
                        <span>
                          {job.category.charAt(0).toUpperCase() +
                            job.category.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left md:text-right bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none">
                    <div className="flex items-center md:justify-end text-orange-950 font-bold text-xl mb-2">
                      <span>{job.budget}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Project Description
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {job.description}
                  </p>
                  <div className="whitespace-pre-line text-gray-600 leading-relaxed">
                    {job.detailedDescription}
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Requirements
                  </h3>
                </div>
                <ul className="space-y-4">
                  {(job.requirements || []).map((req, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="text-gray-600 font-medium">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Responsibilities */}
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Key Responsibilities
                  </h3>
                </div>
                <ul className="space-y-4">
                  {(job.responsibilities || []).map((resp, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="text-gray-600 font-medium">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits & Perks */}
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Benefits & Perks
                  </h3>
                </div>
                <ul className="space-y-4">
                  {(job.benefits || []).map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                        <Star className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="text-gray-600 font-medium">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-6 space-y-8">
              {/* Contact Information */}
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Contact Information
                  </h3>
                </div>

                {/* Free Trial Notice */}
                <div className="bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 font-bold px-6 py-4 rounded-2xl mb-6 border border-amber-300 flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-amber-600 fill-current" />
                  </div>
                  <div>
                    <span className="font-black">Free trial access</span> –{" "}
                    <span className="font-black">5 days left</span>
                  </div>
                </div>

                {isLoggedIn ? (
                  <div className="bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg space-y-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mr-4">
                        <User className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Name
                        </p>
                        <p className="text-base font-bold text-slate-900">
                          {job.contact.name}
                        </p>
                        <p className="text-sm text-slate-600">
                          {job.contact.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mr-4">
                        <Phone className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Phone
                        </p>
                        <a
                          href={`tel:${job.contact.phone}`}
                          className="text-base font-bold text-slate-900 hover:underline"
                        >
                          {job.contact.phone}
                        </a>
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
                        <a
                          href={`mailto:${job.contact.email}`}
                          className="text-base font-bold text-slate-900 hover:underline"
                        >
                          {job.contact.email}
                        </a>
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
                          {job.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="bg-orange-50 rounded-lg p-6 mb-4 border border-orange-100">
                      <EyeOff className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                      <h4 className="font-medium text-gray-900 mb-2">
                        Sign In to View Contact Details
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Create an account or sign in to view client contact
                        information and contact employer for this job.
                      </p>
                    </div>
                    <Link
                      href="/auth/job-listing"
                      className="block text-center w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                    >
                      Sign In to View Contact
                    </Link>
                  </div>
                )}
              </div>

              {/* Report Job */}
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
                <button className="flex items-center text-red-600 hover:text-red-700 transition-colors gap-2 font-bold">
                  <Flag className="w-5 h-5" />
                  <span>Report this job</span>
                </button>
              </div>

              {/* Job Statistics */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Job Statistics
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-orange-500 mr-2" />
                      <span className="text-gray-600">Posted</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {job.postedTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-gray-600">Status</span>
                    </div>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <EyeOff className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-gray-600">Views</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {job.clickCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
