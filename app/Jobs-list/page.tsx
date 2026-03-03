"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  MapPin,
  Briefcase,
  Search,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
  Building2,
  Clock,
} from "lucide-react";
import Header from "@/components/landingpage/Header";
import Footer from "@/components/landingpage/Footer";
import { useRouter } from "next/navigation";
import { API_URL } from "@/app/config";

interface Job {
  id: string;
  title: string;
  category?: string;
  jobType?: string;
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
  isPaid?: boolean;
  paidAt?: string | null;
  postedBy?: {
    firstName?: string;
    lastName?: string;
    company?: string;
  };
}

const PAID_PERIOD_DAYS = 7;
const SEARCH_DEBOUNCE_MS = 300;
const JOBS_PER_PAGE = 5;

function isWithinPaidPeriod(paidAt: string | null | undefined): boolean {
  if (!paidAt) return false;
  const paid = new Date(paidAt).getTime();
  const cutoff = Date.now() - PAID_PERIOD_DAYS * 24 * 60 * 60 * 1000;
  return paid > cutoff;
}

function parseSalaryNumber(salary: string): number {
  const match = (salary || "").replace(/,/g, "").match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week(s) ago`;
  return `${Math.floor(diffDays / 30)} month(s) ago`;
}

type SortOption = "latest" | "pay_high" | "pay_low";

export default function JobsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setCurrentPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const categories = [
    { id: "all", label: "Any Category" },
    { id: "Mason", label: "Mason" },
    { id: "Carpenter", label: "Carpenter" },
    { id: "Plumber", label: "Plumber" },
    { id: "Electrician", label: "Electrician" },
    { id: "Painter", label: "Painter" },
    { id: "Roofer", label: "Roofer" },
    { id: "Tiler", label: "Tiler" },
    { id: "Welder", label: "Welder" },
    { id: "Other", label: "Other" },
  ];

  const locations = [
    { id: "all", label: "Any Location" },
    { id: "nairobi", label: "Nairobi" },
    { id: "mombasa", label: "Mombasa" },
    { id: "kisumu", label: "Kisumu" },
    { id: "nakuru", label: "Nakuru" },
    { id: "eldoret", label: "Eldoret" },
    { id: "thika", label: "Thika" },
    { id: "machakos", label: "Machakos" },
    { id: "meru", label: "Meru" },
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/client/jobs`);
        const data = await res.json();
        const filteredJobs = (data.jobs || []).filter(
          (job: Job) =>
            job.isPaid &&
            job.status === "ACTIVE" &&
            isWithinPaidPeriod(job.paidAt)
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

  const transformJob = useCallback((job: Job) => {
    const category =
      job.category ||
      categories.find((c) =>
        (job.title || "").toLowerCase().includes(c.id.toLowerCase())
      )?.id ||
      "Other";
    return {
      ...job,
      category,
      postedTime: formatTimeAgo(new Date(job.timePosted)),
      description: job.Jobdescription || "",
    };
  }, []);

  const transformedJobs = useMemo(() => jobs.map(transformJob), [jobs, transformJob]);

  const filteredJobs = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return transformedJobs.filter((job) => {
      const matchesSearch =
        !q ||
        (job.title || "").toLowerCase().includes(q) ||
        (job.description || "").toLowerCase().includes(q) ||
        (job.companyName || "").toLowerCase().includes(q) ||
        (job.SkillsAndrequirements || "").toLowerCase().includes(q);
      const matchesCategory =
        selectedCategory === "all" || (job.category || "").toLowerCase() === selectedCategory.toLowerCase();
      const matchesLocation =
        selectedLocation === "all" ||
        (job.location || "").toLowerCase().includes(selectedLocation.toLowerCase());
      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [transformedJobs, debouncedSearch, selectedCategory, selectedLocation]);

  const sortedJobs = useMemo(() => {
    const list = [...filteredJobs];
    if (sortBy === "latest") {
      list.sort((a, b) => new Date(b.timePosted || 0).getTime() - new Date(a.timePosted || 0).getTime());
    } else if (sortBy === "pay_high") {
      list.sort((a, b) => parseSalaryNumber(b.salary) - parseSalaryNumber(a.salary));
    } else if (sortBy === "pay_low") {
      list.sort((a, b) => parseSalaryNumber(a.salary) - parseSalaryNumber(b.salary));
    }
    return list;
  }, [filteredJobs, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedJobs.length / JOBS_PER_PAGE));
  const indexOfFirst = (currentPage - 1) * JOBS_PER_PAGE;
  const currentJobs = sortedJobs.slice(indexOfFirst, indexOfFirst + JOBS_PER_PAGE);

  const hasActiveFilters =
    debouncedSearch !== "" || selectedCategory !== "all" || selectedLocation !== "all";

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedCategory("all");
    setSelectedLocation("all");
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedLocation, sortBy]);

  const paginate = (page: number) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const viewJobDetails = (jobId: string) => {
    router.push(`/job-details/${jobId}`);
  };

  const snippet = (text: string, maxLen: number) => {
    if (!text) return "";
    const t = text.replace(/\s+/g, " ").trim();
    return t.length <= maxLen ? t : t.slice(0, maxLen) + "...";
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow pt-20">
        {/* Hero - BrighterMonday style */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Find a job you love
            </h1>
            <p className="text-slate-600 mb-6">
              Construction & trades jobs across Kenya. Apply with one click.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search jobs by title, company, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900 placeholder-slate-500"
                />
              </div>
              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                className="sm:w-auto px-5 py-3 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 flex items-center gap-2"
              >
                Search Filter
                <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Expandable filters */}
            {filterOpen && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                  >
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>{l.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Order by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                  >
                    <option value="latest">Latest</option>
                    <option value="pay_high">Salary (High to Low)</option>
                    <option value="pay_low">Salary (Low to High)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Results */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {loading ? "Loading..." : `Construction Jobs in Kenya`}
              </h2>
              <p className="text-slate-600 text-sm mt-0.5">
                {loading ? "—" : `${sortedJobs.length} Job${sortedJobs.length !== 1 ? "s" : ""} Found`}
              </p>
            </div>
            {!loading && (
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="md:block hidden px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 text-sm"
              >
                <option value="latest">Order by: Latest</option>
                <option value="pay_high">Order by: Salary (High)</option>
                <option value="pay_low">Order by: Salary (Low)</option>
              </select>
            )}
          </div>

          {/* Filters applied */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-sm text-slate-500">Filters applied:</span>
              {debouncedSearch && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 text-sm rounded-md border border-blue-200">
                  &quot;{debouncedSearch}&quot;
                  <button type="button" onClick={() => { setSearchQuery(""); setDebouncedSearch(""); }} className="hover:bg-blue-200/50 rounded p-0.5" aria-label="Remove"><X className="w-3.5 h-3.5" /></button>
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 text-sm rounded-md border border-blue-200">
                  {categories.find((c) => c.id === selectedCategory)?.label}
                  <button type="button" onClick={() => setSelectedCategory("all")} className="hover:bg-blue-200/50 rounded p-0.5" aria-label="Remove"><X className="w-3.5 h-3.5" /></button>
                </span>
              )}
              {selectedLocation !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 text-sm rounded-md border border-blue-200">
                  {locations.find((l) => l.id === selectedLocation)?.label}
                  <button type="button" onClick={() => setSelectedLocation("all")} className="hover:bg-blue-200/50 rounded p-0.5" aria-label="Remove"><X className="w-3.5 h-3.5" /></button>
                </span>
              )}
              <button type="button" onClick={clearAllFilters} className="text-sm font-medium text-blue-600 hover:underline">
                Reset filter
              </button>
            </div>
          )}

          {/* Job list - BrighterMonday style cards */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent" />
            </div>
          ) : currentJobs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-600 font-medium">No jobs found matching your filters.</p>
              <button type="button" onClick={clearAllFilters} className="mt-3 text-blue-600 hover:underline text-sm font-medium">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-0">
              {currentJobs.map((job) => (
                <article
                  key={job.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 mb-4 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {job.isUrgent && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded">
                            Urgent
                          </span>
                        )}
                        <span className="text-slate-500 text-xs">{job.postedTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1 hover:text-blue-600 transition-colors">
                        <button type="button" onClick={() => viewJobDetails(job.id)} className="text-left">
                          {job.title}
                        </button>
                      </h3>
                      <p className="text-slate-600 text-sm font-medium mb-2 flex items-center gap-1">
                        <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        {job.companyName}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm mb-2">
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-700 font-medium rounded-md">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          {job.location}
                        </span>
                        <span className="px-2.5 py-1 bg-orange-50 text-orange-700 font-medium rounded-md">
                          {job.duration || "Full Time"}
                        </span>
                        <span className="px-2.5 py-1 bg-orange-50 text-orange-700 font-medium rounded-md">
                          {job.salary || "Confidential"}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                        {snippet(job.description, 180)}
                      </p>
                      <div className="mt-2">
                        <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded">
                          {job.category === "all" ? "General" : job.category}
                        </span>
                      </div>
                    </div>
                    <div className="md:flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => viewJobDetails(job.id)}
                        className="w-full md:w-auto px-6 py-3 bg-orange-500 text-white text-sm font-semibold rounded-xl shadow-md hover:bg-orange-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 border border-orange-600/30"
                      >
                        View details
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {/* Pagination - orange style */}
              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-10 pt-8 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 9) }, (_, i) => {
                    let page: number;
                    if (totalPages <= 9) page = i + 1;
                    else if (currentPage <= 5) page = i + 1;
                    else if (currentPage >= totalPages - 4) page = Math.max(1, totalPages - 8 + i);
                    else page = currentPage - 4 + i;
                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => paginate(page)}
                        className={`min-w-[2.5rem] py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                          currentPage === page
                            ? "bg-orange-500 text-white border border-orange-500 shadow-md"
                            : "border border-slate-300 text-slate-700 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
