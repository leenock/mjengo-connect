"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Briefcase,
  Search,
  Shield,
  Calendar,
  ChevronDown,
} from "lucide-react";
import Header from "@/components/landingpage/Header";
import Footer from "@/components/landingpage/Footer";
import { useRouter } from "next/navigation"; // ✅ Add this

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

export default function JobsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  const router = useRouter(); // ✅ Initialize router

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "masonry", label: "Masonry" },
    { id: "painting", label: "Painting" },
    { id: "plumbing", label: "Plumbing" },
    { id: "electrical", label: "Electrical" },
    { id: "carpentry", label: "Carpentry" },
    { id: "roofing", label: "Roofing" },
    { id: "tiling", label: "Tiling" },
    { id: "welding", label: "Welding" },
  ];

  const locations = [
    { id: "all", label: "All Locations" },
    { id: "nairobi", label: "Nairobi" },
    { id: "mombasa", label: "Mombasa" },
    { id: "kisumu", label: "Kisumu" },
    { id: "nakuru", label: "Nakuru" },
    { id: "eldoret", label: "Eldoret" },
    { id: "thika", label: "Thika" },
    { id: "machakos", label: "Machakos" },
    { id: "meru", label: "Meru" },
  ];

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/client/jobs");
        const data = await res.json();

        // Filter only paid and active jobs
        const filteredJobs = (data.jobs || []).filter(
          (job: Job & { isPaid?: boolean }) =>
            job.isPaid && job.status === "ACTIVE"
        );

        setJobs(filteredJobs);
      } catch (error) {
        console.error("Failed to load jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Transform job for UI
  const transformJob = (job: Job) => {
    let skills: string[] = [];
    if (job.SkillsAndrequirements) {
      skills =
        typeof job.SkillsAndrequirements === "string"
          ? job.SkillsAndrequirements.split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
    }

    const category =
      categories.find((cat) =>
        job.title.toLowerCase().includes(cat.id.toLowerCase())
      )?.id || "all";

    return {
      ...job,
      id: job.id,
      title: job.title,
      category,
      location: job.location,
      StartDate: new Date(job.timePosted).toISOString().split("T")[0],
      budget: job.salary,
      skills,
      postedTime: formatTimeAgo(new Date(job.timePosted)),
      urgency: job.isUrgent ? "Urgent" : "Normal",
      description: job.Jobdescription,
      projectDuration: job.duration,
      verified: true,
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

  const transformedJobs = jobs.map(transformJob);

  // Filter jobs
  const filteredJobs = transformedJobs.filter((job) => {
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || job.category === selectedCategory;
    const matchesLocation =
      selectedLocation === "all" ||
      job.location.toLowerCase().includes(selectedLocation);

    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 800, behavior: "smooth" });
    }
  };

  // ✅ Add viewJobDetails function (like in your reference)
  const viewJobDetails = (jobId: string) => {
    router.push(`/job-details/${jobId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-yellow-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Find Your Next{" "}
                <span className="text-orange-600">Construction Project</span>
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mx-auto mb-6" />
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Browse verified construction jobs across Kenya. Connect with
                clients and grow your fundi business with quality projects.
              </p>
            </div>
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for construction jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none bg-white"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none bg-white"
                  >
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Job Listings */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Available Jobs Listings
                </h2>
                <p className="text-gray-600">
                  {loading
                    ? "Loading jobs..."
                    : `${filteredJobs.length} jobs found`}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-2">
                  <p className="text-orange-800 text-sm font-medium">
                    <Shield className="w-4 h-4 inline mr-2" />
                    jobs verified
                  </p>
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm">
                  <option>Sort by: Latest</option>
                  <option>Sort by: Pay (High to Low)</option>
                  <option>Sort by: Pay (Low to High)</option>
                </select>
              </div>
            </div>

            {/* Loading & Empty States */}
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <p className="mt-4 text-gray-600 font-medium">
                  Loading jobs...
                </p>
              </div>
            ) : currentJobs.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-600 font-medium">
                  No jobs found matching your filters.
                </p>
              </div>
            ) : (
              <>
                {/* Job Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
                    >
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                            {job.title}
                          </h3>
                          {job.verified && (
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                              <Shield className="w-3 h-3 text-green-600" />
                            </div>
                          )}
                        </div>
                        {job.urgency === "Urgent" && (
                          <span className="inline-block px-3 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full mb-3">
                            🔥 Urgent
                          </span>
                        )}
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            Start Date: {job.StartDate}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            Posted {job.postedTime}
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                            {job.category.charAt(0).toUpperCase() +
                              job.category.slice(1)}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 leading-relaxed text-sm line-clamp-2">
                        {job.description}
                      </p>

                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 2).map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-l-2xl"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 2 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                              +{job.skills.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ✅ REPLACED LINK WITH BUTTON + onClick */}
                      <button
                        onClick={() => viewJobDetails(job.id)}
                        className="inline-block px-3 py-1 bg-black text-white text-xs font-medium rounded-full hover:bg-white hover:text-black border border-black transition hover:scale-105 active:scale-95"
                      >
                        View More Details
                      </button>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 border border-gray-300"
                      }`}
                    >
                      Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => paginate(page)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            currentPage === page
                              ? "bg-orange-500 text-white"
                              : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 border border-gray-300"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === totalPages
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 border border-gray-300"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
