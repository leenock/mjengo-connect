"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/job_posting/Sidebar";
import {
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Briefcase,
  Heart,
  Users,
  Menu,
  TrendingUp,
  ChartBarDecreasingIcon,
  ArrowRight,
} from "lucide-react";

export default function JobListingsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const stats = [
    {
      title: "Active Jobs",
      value: "12",
      change: "+2 this week",
      icon: Briefcase,
      color: "text-indigo-600",
      bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-200",
    },
    {
      title: "Total Jobs Posted",
      value: "156",
      change: "+23 this week",
      icon: Users,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
    },
    {
      title: "Total Clicks",
      value: "34",
      change: "+5 this month",
      icon: TrendingUp,
      color: "text-amber-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
    },
    {
      title: "Total Spent",
      value: "KSh 10,000",
      change: "+12% this month",
      icon: ChartBarDecreasingIcon,
      color: "text-violet-600",
      bgColor: "bg-gradient-to-br from-violet-50 to-violet-100",
      borderColor: "border-violet-200",
    },
  ];

  const jobListings = [
    {
      id: 1,
      title: "House Painting - 3 Bedroom",
      company: "Kamau Properties Ltd",
      location: "Westlands, Nairobi",
      budget: "Ksh 800",
      duration: "5 days",
      postedTime: "2 hours ago",
      StartDate: "2025-01-15",
      urgency: "Urgent",
      category: "Painting",
      description:
        "Looking for experienced painters to paint a 3-bedroom house. Must have own equipment and materials will be provided.",
      requirements: [
        "Interior Painting",
        "Exterior Painting",
        "Color Consultation",
      ],
      views: 156,
      verified: true,
      saved: false,
    },
    // Add more jobs as needed
     {
      id: 2,
      title: "Office Renovation",
      company: "Tech Innovations Ltd",
      location: "CBD, Nairobi",
      budget: "Ksh 1000",
      duration: "2 weeks",  
      postedTime: "1 day ago",
      StartDate: "2025-01-20",

      urgency: "Normal",
      category: "Renovation",
      description:
        "Renovation of office space including painting, flooring, and electrical work. Must have experience with commercial projects.", 
      requirements: [
        "Commercial Renovation",
        "Electrical Work",
        "Flooring Installation",
      ],

      views: 89,
      verified: false,
      saved: true,
    },
  ];

  const toggleSaveJob = (jobId: number) => {
    console.log(`Toggle save for job ${jobId}`);
  };

  const viewJobDetails = (jobId: number) => {
    router.push(`./job/${jobId}`);
  };

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
                <h1 className="text-3xl sm:text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  Welcome Kamau
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-medium">
                  Welcome back! Here is what is happening with your job listings.
                </p>
              </div>
            </div>
          </div>
          {/* Stats */}
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
                      <p className="text-2xl sm:text-4xl font-black text-slate-900 mt-2 leading-none">
                        {stat.value}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-2 truncate">
                        {stat.change}
                      </p>
                    </div>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/60 rounded-2xl flex items-center justify-center flex-shrink-0 ml-3 shadow-lg">
                      <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-10" />
          {/* Job Listings */}
          <div className="space-y-6">
            {jobListings.map((job) => (
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
                          {job.verified && (
                            <span className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-xs font-bold rounded-full">
                              ✓ Verified
                            </span>
                          )}
                          {job.urgency === "Urgent" && (
                            <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 font-bold text-lg mb-3">
                          {job.company}
                        </p>
                        <p className="text-slate-600 font-medium text-base mb-4 leading-relaxed">
                          {job.description}
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

                    {/* Job Details Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center text-sm font-bold text-slate-600">
                        <MapPin className="w-5 h-5 mr-3 text-slate-400" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center text-sm font-bold">
                        <DollarSign className="w-5 h-5 mr-3 text-emerald-500" />
                        <span className="text-emerald-600 font-black">
                          {job.budget}
                        </span>
                      </div>
                      <div className="flex items-center text-sm font-bold text-slate-600">
                        <Clock className="w-5 h-5 mr-3 text-slate-400" />
                        <span>Duration {job.duration}</span>
                      </div>
                      <div className="flex items-center text-sm font-bold text-slate-600">
                        <Calendar className="w-5 h-5 mr-3 text-slate-400" />
                        <span>{job.postedTime}</span>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-3">
                        {job.requirements.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 text-sm font-bold rounded-xl"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats and Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-6 text-sm font-bold text-slate-500">
                        <div className="flex items-center">
                          <Briefcase className="w-5 h-5 mr-2" />
                          <span>{job.views} views</span>
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
        </div>
      </div>
    </div>
  );
}
