"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  CreditCard,
  Bookmark,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import FundiAuthService from "@/app/services/fundi_user";

interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  salary: string;
  duration?: string;
  timePosted: string;
  Jobdescription?: string;
  SkillsAndrequirements?: string;
  isUrgent: boolean;
  clickCount: number;
  status: string;
  verified?: boolean;
  saved?: boolean;
  isPaid: boolean; // add this

}

export default function JobListingsPage() {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [jobListings, setJobListings] = useState<Job[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [recentApplications, setRecentApplications] = useState<Job[]>([]);

  // ✅ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5; // Configure as needed

  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    const userData = FundiAuthService.getUserData();
    if (userData) {
      if (userData.firstName) setFirstName(userData.firstName);
      if (userData.lastName) setLastName(userData.lastName);
    }
  }, []);

  // Fetch jobs data
 useEffect(() => {
  async function fetchJobs() {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/client/jobs");
      if (!res.ok) {
        throw new Error(`Failed to fetch jobs (status ${res.status})`);
      }

      const data = await res.json();
      const jobs: Job[] = Array.isArray(data.jobs) ? data.jobs : [];

      // Filter only paid jobs
    const paidJobs = jobs.filter((job: Job) => job.isPaid);

      setJobListings(paidJobs);
      setRecentJobs(paidJobs.slice(0, 2));
      const saved = paidJobs.filter((job) => job.saved);
      setRecentApplications(saved);
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

  fetchJobs();
}, []);


  // Event handlers
  const toggleSaveJob = (jobId: string) => {
    console.log(`Toggle save for job ${jobId}`);
  };

  const viewJobDetails = (jobId: string) => {
    router.push(`/clientspace/fundi/job-listings/${jobId}`);
  };

  // Pagination handlers
  const totalPages = Math.ceil(jobListings.length / jobsPerPage);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobListings.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    // Scroll to top of job listings
    document.getElementById("job-listings-top")?.scrollIntoView({ behavior: "smooth" });
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  // Stats (unchanged)
  const stats = [
    {
      title: "Active Jobs",
      value: jobListings.length.toString(),
      change: "+2 this week",
      icon: Briefcase,
      color: "text-indigo-600",
      bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-200",
    },
    {
      title: "Saved Jobs",
      value: recentApplications.length.toString(),
      change: "+5 this week",
      icon: Bookmark,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
    },
    {
      title: "Subscription Spent",
      value: "KSh 200",
      change: "This month",
      icon: CreditCard,
      color: "text-violet-600",
      bgColor: "bg-gradient-to-br from-violet-50 to-violet-100",
      borderColor: "border-violet-200",
    },
    {
      title: "Next Payment",
      value: "12 days",
      change: "Premium plan",
      icon: Calendar,
      color: "text-amber-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:flex font-inter">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 lg:ml-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
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
                <h1 className="text-2xl sm:text-2xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  Welcome Back,{" "}
                  {firstName || lastName
                    ? `${firstName ?? ""} ${lastName ?? ""}`.trim()
                    : "User"}
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-extrabold">
                  Discover amazing opportunities and connect
                </p>
              </div>
            </div>
          </div>

          {loading && (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              <p className="mt-4 text-slate-600">Loading jobs...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
              <p>⚠ {error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.title}
                      className={`${stat.bgColor} ${stat.borderColor} rounded-2xl shadow-lg border-2 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-bold text-slate-600 truncate uppercase tracking-wide">
                            {stat.title}
                          </p>
                          <p className="text-xl sm:text-4xl font-black text-slate-900 mt-2 leading-none">
                            {stat.value}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-2 truncate">
                            {stat.change}
                          </p>
                        </div>
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/60 rounded-2xl flex items-center justify-center flex-shrink-0 ml-3 shadow-lg">
                          <Icon
                            className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
                <div className="xl:col-span-2">
                  <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-indigo-50 to-purple-50">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
                          Recent Job Postings
                        </h2>
                        <p className="text-slate-600 font-extrabold">
                          Fresh opportunities just for you
                        </p>
                      </div>
                      <button className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg">
                        View All
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-4 p-6 sm:p-8">
                      {recentJobs.length > 0 ? (
                        recentJobs.map((job) => (
                          <div
                            key={job.id}
                            className="group p-4 sm:p-6 bg-gradient-to-r from-white/60 to-slate-50/60 rounded-2xl hover:from-white/80 hover:to-slate-50/80 transition-all duration-300 border border-white/40 hover:shadow-lg hover:scale-[1.02]"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                                    {job.title}
                                  </h3>
                                  {job.isUrgent && (
                                    <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-sm">
                                      Urgent
                                    </span>
                                  )}
                                  {job.status && (
                                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700">
                                      {job.status}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm font-semibold text-slate-600 mb-3">
                                  {job.companyName}
                                </p>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm font-bold text-slate-600">
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                                    <span className="truncate">
                                      {job.location}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <DollarSign className="w-4 h-4 mr-2 text-emerald-500" />
                                    <span className="text-emerald-600 font-black">
                                      {job.salary}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2 text-slate-400" />
                                    <span>Duration {job.duration}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                    <span> {new Date(job.timePosted).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4 text-sm font-bold text-slate-600 flex-shrink-0">
                                <div className="flex items-center text-indigo-600">
                                  <Eye className="w-4 h-4 mr-1" />
                                  <span>{job.clickCount} views</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500 text-center py-4">
                          No recent jobs available.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                    <div className="p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-emerald-50 to-teal-50">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
                        Saved Jobs
                      </h2>
                      <p className="text-slate-600 font-extrabold">
                        Your bookmarked opportunities
                      </p>
                    </div>
                    <div className="space-y-4 p-6 sm:p-8">
                      {recentApplications.length > 0 ? (
                        recentApplications.map((application) => (
                          <div
                            key={application.id}
                            className="group p-4 sm:p-5 border-2 border-slate-200 rounded-2xl hover:border-orange-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 transition-all duration-300 hover:shadow-lg"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate flex-1">
                                {application.title}
                              </h4>
                              {application.status && (
                                <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 ml-2">
                                  {application.status}
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-slate-600 mb-3 truncate">
                              {application.companyName}
                            </p>
                            <div className="flex items-center justify-between text-sm font-bold">
                              <div className="flex items-center text-emerald-600">
                                <DollarSign className="w-4 h-4 mr-1" />
                                {application.salary}
                              </div>
                              <span className="text-slate-600">
                                {application.timePosted}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500 text-center py-4">
                          No saved jobs yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ✅ JOB LISTINGS WITH PAGINATION */}
              <div id="job-listings-top" className="space-y-6">
                {jobListings.length === 0 && !loading && (
                  <div className="text-center py-16 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                      No jobs found
                    </h3>
                    <p className="text-slate-600 font-medium text-lg max-w-md mx-auto">
                      Check back later for new opportunities.
                    </p>
                  </div>
                )}

                {currentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-6 sm:p-8 hover:shadow-3xl transition-all duration-300 hover:scale-[1.01] group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                                {job.title}
                              </h3>
                              {job.verified && (
                                <span className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-xs font-bold rounded-full">
                                  ✓ Verified
                                </span>
                              )}
                              {job.isUrgent && (
                                <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full">
                                  Urgent
                                </span>
                              )}
                            </div>
                            <p className="text-slate-600 font-bold text-lg mb-3">
                              {job.companyName}
                            </p>
                            <p className="text-slate-600 font-medium text-base mb-4 leading-relaxed">
                              {job.Jobdescription}
                            </p>
                          </div>

                          <button
                            onClick={() => toggleSaveJob(job.id)}
                            className="p-3 rounded-xl hover:bg-white/60 transition-all duration-200 group-hover:scale-110"
                          >
                            <Heart
                              className={`w-6 h-6 ${
                                job.saved
                                  ? "fill-red-500 text-red-500"
                                  : "text-slate-400 hover:text-red-400"
                              }`}
                            />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          <div className="flex items-center text-sm font-bold text-slate-600">
                            <MapPin className="w-5 h-5 mr-3 text-slate-400" />
                            <span className="truncate">{job.location}</span>
                          </div>
                          <div className="flex items-center text-sm font-bold">
                            <DollarSign className="w-5 h-5 mr-3 text-emerald-500" />
                            <span className="text-emerald-600 font-black">
                              {job.salary}
                            </span>
                          </div>
                          <div className="flex items-center text-sm font-bold text-slate-600">
                            <Clock className="w-5 h-5 mr-3 text-slate-400" />
                            <span>Duration {job.duration}</span>
                          </div>
                          <div className="flex items-center text-sm font-bold text-slate-600">
                            <Calendar className="w-5 h-5 mr-3 text-slate-400" />
                            <span> {new Date(job.timePosted).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {job.SkillsAndrequirements && (
                          <div className="mb-6">
                            <div className="flex flex-wrap gap-3">
                              <span
                                key={job.SkillsAndrequirements}
                                className="px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 text-sm font-bold rounded-xl"
                              >
                                {job.SkillsAndrequirements}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center space-x-6 text-sm font-bold text-slate-500">
                            <div className="flex items-center">
                              <Eye className="w-5 h-5 mr-2" />
                              <span>{job.clickCount} views</span>
                            </div>
                          </div>

                          <button
                            onClick={() => viewJobDetails(job.id)}
                            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white font-bold rounded-2xl hover:from-orange-600 hover:via-pink-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
                          >
                            View Job Details
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* ✅ PAGINATION CONTROLS */}
                {jobListings.length > jobsPerPage && (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pt-6 border-t border-slate-200">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 ${
                        currentPage === 1
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-white/60 text-slate-700 hover:bg-white/80 border border-slate-200 hover:border-slate-300 shadow-md hover:shadow-lg"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <div className="flex items-center gap-2">
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        // Show only first 2, last 2, and current page ±1
                        if (
                          page <= 2 ||
                          page > totalPages - 2 ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => paginate(page)}
                              className={`w-10 h-10 rounded-xl font-bold transition-all duration-200 flex items-center justify-center ${
                                currentPage === page
                                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                                  : "bg-white/60 text-slate-700 hover:bg-white/80 border border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }
                        // Add ellipsis for skipped pages
                        if (page === 3 && currentPage > 4) {
                          return <span key="start-ellipsis" className="text-slate-400">...</span>;
                        }
                        if (page === totalPages - 2 && currentPage < totalPages - 3) {
                          return <span key="end-ellipsis" className="text-slate-400">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 ${
                        currentPage === totalPages
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-white/60 text-slate-700 hover:bg-white/80 border border-slate-200 hover:border-slate-300 shadow-md hover:shadow-lg"
                      }`}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}