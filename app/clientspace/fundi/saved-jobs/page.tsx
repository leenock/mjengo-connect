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
  ArrowRight,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  salary: string;
  duration: string;
  timePosted: string;
  Jobdescription: string;
  SkillsAndrequirements: string;
  isUrgent: boolean;
  clickCount: number;
  status: string;
  postedBy: {
    firstName: string;
    lastName: string;
    company: string;
  };
}

export default function JobListingsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3;
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/client/jobs");
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (error) {
        console.error("Failed to load jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const toggleSaveJob = (jobId: string) => {
    console.log(`Toggle save for job ${jobId}`);
  };

  const viewJobDetails = (jobId: string) => {
  router.push(`/clientspace/fundi/job-listings/${jobId}`);
};

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

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
                <h1 className="text-2xl sm:text-2xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  Welcome Kamau
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-extrabold">
                  Discover amazing opportunities and connect
                </p>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          {loading ? (
            <p className="text-center text-slate-600 font-semibold">
              Loading jobs...
            </p>
          ) : currentJobs.length === 0 ? (
            <p className="text-center text-slate-600 font-semibold">
              No jobs available.
            </p>
          ) : (
            <div className="space-y-6">
              {currentJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-6 sm:p-8 hover:shadow-3xl transition-all duration-300 hover:scale-[1.01] group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                              {job.title}
                            </h3>
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
                          <Heart className="w-6 h-6 text-slate-400 hover:text-red-400" />
                        </button>
                      </div>

                      {/* Job Details Grid */}
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
                          <span>
                            {new Date(job.timePosted).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Skills */}
                      {job.SkillsAndrequirements && (
                        <div className="mb-6">
                          <span className="px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 text-sm font-bold rounded-xl">
                            {job.SkillsAndrequirements}
                          </span>
                        </div>
                      )}

                      {/* Views + Action */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-6 text-sm font-bold text-slate-500">
                          <div className="flex items-center">
                            <Briefcase className="w-5 h-5 mr-2" />
                            <span>{job.clickCount} views</span>
                          </div>
                        </div>

                        <button
                          onClick={() => viewJobDetails(job.id)}
                          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white font-bold rounded-2xl hover:from-orange-600 hover:via-pink-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
                        >
                          View Details
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-xl font-bold ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-500 text-white hover:bg-indigo-600"
                }`}
              >
                Previous
              </button>
              <span className="font-bold text-slate-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-xl font-bold ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-500 text-white hover:bg-indigo-600"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
