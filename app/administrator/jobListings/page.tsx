"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import AdminSidebar from "@/components/admin/Sidebar";
import {
  Search,
  Filter,
  MapPin,
  Mail,
  Phone,
  Menu,
  Eye,
  Edit,
  Trash2,
  X,
  Calendar,
  Clock,
  Users,
  Building2,
  DollarSign,
  Download,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Ban,
  RefreshCw,
} from "lucide-react";
import AdminAuthService from "@/app/services/admin_auth";

// ===== INTERFACES & TYPES =====
type JobStatus = "PENDING" | "ACTIVE" | "CLOSED" | "REJECTED" | "EXPIRED";

interface Job {
  id: string;
  title: string;
  category: string;
  jobType: string;
  location: string;
  duration: string;
  salary: string;
  Jobdescription: string;
  SkillsAndrequirements: string;
  responsibilities: string;
  benefits?: string;
  companyName: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  preferredContact: string;
  timePosted: string;
  isUrgent: boolean;
  isPaid: boolean;
  clickCount: number;
  status: JobStatus;
  postedBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string | null;
  };
}

interface EditFormData {
  title: string;
  category: string;
  jobType: string;
  location: string;
  duration: string;
  salary: string;
  Jobdescription: string;
  SkillsAndrequirements: string;
  responsibilities: string;
  benefits: string;
  companyName: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  preferredContact: string;
  isUrgent: boolean;
  isPaid: boolean;
  status: JobStatus;
}

type FilterStatus = "all" | JobStatus;
// =====================

export default function AdminManageJobs() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    title: "",
    category: "",
    jobType: "",
    location: "",
    duration: "",
    salary: "",
    Jobdescription: "",
    SkillsAndrequirements: "",
    responsibilities: "",
    benefits: "",
    companyName: "",
    contactPerson: "",
    phoneNumber: "",
    email: "",
    preferredContact: "",
    isUrgent: false,
    isPaid: false,
    status: "PENDING",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Refresh trigger for Apply button
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load jobs with better error handling
  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set("search", searchTerm.trim());
      if (filterStatus !== "all") params.set("status", filterStatus);

      console.log("🔄 Fetching jobs from API...");
      
      const response = await fetch(
        `http://localhost:5000/api/admin/jobs/jobs/?${params.toString()}`,
        {
          headers: { 
            "Content-Type": "application/json",
            ...AdminAuthService.getAuthHeaders() 
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("📊 API Response:", data);
      
      // Handle different response structures
      let jobsList: Job[] = [];
      
      if (Array.isArray(data)) {
        jobsList = data;
      } else if (data && Array.isArray(data.jobs)) {
        jobsList = data.jobs;
      } else if (data && Array.isArray(data.data)) {
        jobsList = data.data;
      } else if (data && typeof data === 'object') {
        jobsList = [data];
      }
      
      console.log(`📋 Found ${jobsList.length} jobs`);
      
      setAllJobs(jobsList);
      setCurrentPage(1);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load jobs";
      console.error("❌ Load jobs error:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterStatus]);

  const handleManualRefresh = useCallback(() => {
    console.log("🔄 Manual refresh triggered");
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const currentJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allJobs.slice(startIndex, startIndex + itemsPerPage);
  }, [allJobs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(allJobs.length / itemsPerPage);

  const showSuccessNotification = (message: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setSuccessMessage(message);
      setShowSuccess(true);
      setIsProcessing(false);
      setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage(null);
      }, 4000);
    }, 5000);
  };

  const deleteJob = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(
        ` http://localhost:5000/api/admin/jobs/jobs/${id}`,
        {
          method: "DELETE",
          headers: { ...AdminAuthService.getAuthHeaders() },
        }
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete job");
      }
      await loadJobs();
      setViewJob(null);
      setEditJob(null);
      setDeleteConfirmation(null);
      showSuccessNotification("Job deleted successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete job");
      setIsProcessing(false);
    } finally {
      setDeletingId(null);
    }
  };

  const openViewModal = (job: Job) => setViewJob(job);

  const openEditModal = (job: Job) => {
    setEditJob(job);
    setEditFormData({
      title: job.title || "",
      category: job.category || "",
      jobType: job.jobType || "",
      location: job.location || "",
      duration: job.duration || "",
      salary: job.salary || "",
      Jobdescription: job.Jobdescription || "",
      SkillsAndrequirements: job.SkillsAndrequirements || "",
      responsibilities: job.responsibilities || "",
      benefits: job.benefits || "",
      companyName: job.companyName || "",
      contactPerson: job.contactPerson || "",
      phoneNumber: job.phoneNumber || "",
      email: job.email || "",
      preferredContact: job.preferredContact || "",
      isUrgent: job.isUrgent || false,
      isPaid: job.isPaid || false,
      status: job.status || "PENDING",
    });
  };

  const saveJob = async () => {
    if (!editJob) return;
    setIsSaving(true);
    try {
      const res = await fetch(
        ` http://localhost:5000/api/admin/jobs/jobs/${editJob.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...AdminAuthService.getAuthHeaders(),
          },
          body: JSON.stringify(editFormData),
        }
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update job");
      }
      await loadJobs();
      setEditJob(null);
      showSuccessNotification("Job updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update job");
      setIsProcessing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const exportToCSV = () => {
    if (allJobs.length === 0) return;
    const headers = [
      "ID",
      "Title",
      "Category",
      "Job Type",
      "Location",
      "Duration",
      "Salary",
      "Company Name",
      "Contact Person",
      "Phone Number",
      "Email",
      "Status",
      "Posted Date",
      "Is Urgent",
      "Is Paid",
      "Click Count",
    ];
    const rows = allJobs.map((job) => [
      `"${job.id}"`,
      `"${job.title}"`,
      `"${job.category}"`,
      `"${job.jobType}"`,
      `"${job.location}"`,
      `"${job.duration}"`,
      `"${job.salary}"`,
      `"${job.companyName}"`,
      `"${job.contactPerson}"`,
      `"${job.phoneNumber}"`,
      `"${job.email}"`,
      job.status,
      `"${new Date(job.timePosted).toLocaleString()}"`,
      job.isUrgent ? "Yes" : "No",
      job.isPaid ? "Yes" : "No",
      job.clickCount.toString(),
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `jobs_export_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Auto-search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadJobs();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus, loadJobs]);

  // Initial + manual refresh
  useEffect(() => {
    loadJobs();
  }, [loadJobs, refreshTrigger]);

  // ===== UI HELPERS =====
  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case "ACTIVE":
        return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg";
      case "PENDING":
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg";
      case "CLOSED":
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg";
      case "REJECTED":
        return "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg";
      case "EXPIRED":
        return "bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg";
      default:
        return "bg-gradient-to-r from-slate-500 to-slate-600 text-white";
    }
  };

  const getStatusIcon = (status: JobStatus) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="w-4 h-4" />;
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "CLOSED":
        return <Ban className="w-4 h-4" />;
      case "REJECTED":
        return <AlertTriangle className="w-4 h-4" />;
      case "EXPIRED":
        return <Ban className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = [
      "bg-gradient-to-r from-blue-500 to-cyan-500",
      "bg-gradient-to-r from-violet-500 to-purple-500",
      "bg-gradient-to-r from-emerald-500 to-teal-500",
      "bg-gradient-to-r from-amber-500 to-orange-500",
      "bg-gradient-to-r from-fuchsia-500 to-pink-500",
      "bg-gradient-to-r from-indigo-500 to-blue-500",
    ];
    const index =
      category.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return `${colors[index]} text-white shadow-md`;
  };

  const getAvatarInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setViewJob(null);
      setEditJob(null);
      setDeleteConfirmation(null);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push(-1);
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:flex font-inter">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Notifications */}
      {isProcessing && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl flex items-center space-x-3">
            <Loader2 className="w-6 h-6 flex-shrink-0 animate-spin" />
            <div>
              <p className="font-bold text-sm">Processing...</p>
              <p className="text-sm opacity-90">Please wait while we complete your request</p>
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
              <div>
                <h1 className="text-3xl sm:text-2xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  Manage Job Listings
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-extrabold">
                  {allJobs.length} total job postings
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleManualRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg disabled:opacity-50"
                title="Refresh jobs"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden mb-8">
            <div className="p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-orange-50 to-amber-50">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
                Search & Filter
              </h2>
              <p className="text-slate-600 font-extrabold">
                Find and manage job listings efficiently
              </p>
            </div>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search jobs by title, description, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                    className="w-full sm:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  >
                    <option value="all">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="ACTIVE">Active</option>
                    <option value="CLOSED">Closed</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                  <button
                    onClick={handleManualRefresh}
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Filter className="w-5 h-5" />
                        <span>Apply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs Table */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Job Listings Directory
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={exportToCSV}
                  disabled={allJobs.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                <span className="ml-3 text-slate-600 font-medium">Loading jobs...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-red-800 mb-2">Failed to Load Jobs</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={handleManualRefresh}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : allJobs.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-12 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Jobs Found</h3>
                <p className="text-slate-600 mb-6">
                  {searchTerm || filterStatus !== "all" 
                    ? "Try adjusting your search criteria or filters."
                    : "There are no job listings in the system yet."
                  }
                </p>
                <div className="flex justify-center gap-3">
                  {(searchTerm || filterStatus !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setFilterStatus("all");
                      }}
                      className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                  <button
                    onClick={handleManualRefresh}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-amber-600 transition-all duration-300"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full table-auto min-w-full">
                    <thead className="bg-gradient-to-r from-orange-500 to-amber-500">
                      <tr>
                        <th className="text-left py-5 px-6 font-black text-white text-sm uppercase tracking-wider w-2/5">
                          Job Details
                        </th>
                        <th className="text-left py-5 px-6 font-black text-white text-sm uppercase tracking-wider w-2/5">
                          Client & Job Info
                        </th>
                        <th className="text-left py-5 px-6 font-black text-white text-sm uppercase tracking-wider w-1/5">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentJobs.map((job) => (
                        <tr
                          key={job.id}
                          className="hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-amber-50/50 transition-all duration-300 group border-l-4 border-l-transparent hover:border-l-orange-500"
                        >
                          {/* Job Details Column */}
                          <td className="py-5 px-6">
                            <div className="space-y-3">
                              {/* Title and Status */}
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-orange-600 transition-colors line-clamp-2">
                                    {job.title}
                                  </h3>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span
                                      className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(job.status)}`}
                                    >
                                      {getStatusIcon(job.status)}
                                      <span className="capitalize">{job.status.toLowerCase()}</span>
                                    </span>
                                    {job.isUrgent && (
                                      <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full">
                                        Urgent
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Description */}
                              <p className="text-sm text-slate-600 line-clamp-2">
                                {job.Jobdescription}
                              </p>

                              {/* Job Metadata */}
                              <div className="flex flex-wrap gap-2">
                                <div className="flex items-center space-x-1 text-sm">
                                  <MapPin className="w-4 h-4 text-slate-400" />
                                  <span className="font-medium text-slate-600">{job.location}</span>
                                </div>
                                <span
                                  className={`px-2 py-1 text-xs font-bold rounded-full ${getCategoryColor(job.category)}`}
                                >
                                  {job.category}
                                </span>
                                <div className="flex items-center space-x-1 text-sm">
                                  <Clock className="w-4 h-4 text-slate-400" />
                                  <span className="font-medium text-slate-600">{job.duration}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-sm">
                                  <DollarSign className="w-4 h-4 text-emerald-500" />
                                  <span className="font-bold text-slate-900">{job.salary}</span>
                                </div>
                              </div>

                              {/* Additional Info */}
                              <div className="flex items-center space-x-4 text-xs text-slate-500">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{new Date(job.timePosted).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="w-3 h-3" />
                                  <span>{job.clickCount} views</span>
                                </div>
                                {job.isPaid && (
                                  <span className="text-emerald-600 font-bold">Paid Ad</span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Client & Job Info Column */}
                          <td className="py-5 px-6">
                            <div className="space-y-4">
                              {/* Client Information */}
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg text-sm flex-shrink-0">
                                  {getAvatarInitials(job.contactPerson)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-slate-900 truncate">{job.contactPerson}</p>
                                  <div className="flex items-center space-x-2 text-sm mt-1">
                                    <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                    <span className="font-medium text-slate-600 truncate">{job.companyName}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Contact Details */}
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2 text-sm">
                                  <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                  <span className="font-medium text-slate-600 truncate">{job.email}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                  <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                  <span className="font-medium text-slate-600">{job.phoneNumber}</span>
                                </div>
                              </div>

                              {/* Job Type & Preferences */}
                              <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                                  {job.jobType}
                                </span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                  Prefers: {job.preferredContact}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Actions Column */}
                          <td className="py-5 px-6">
                            <div className="flex items-center space-x-2 justify-center">
                              <button
                                onClick={() => openViewModal(job)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-110"
                                title="View details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openEditModal(job)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-110"
                                title="Edit job"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmation({ id: job.id, title: job.title })}
                                disabled={deletingId === job.id || isProcessing}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-110 disabled:opacity-50"
                                title="Delete job"
                              >
                                {deletingId === job.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-4 sm:px-6 py-6 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm font-medium text-slate-600">
                      Showing {(currentPage - 1) * itemsPerPage + 1}–
                      {Math.min(currentPage * itemsPerPage, allJobs.length)} of {allJobs.length} jobs
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-xl font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                      >
                        <span>←</span> Previous
                      </button>
                      {getPageNumbers().map((pageNum, index) =>
                        pageNum === -1 ? (
                          <span
                            key={`ellipsis-${index}`}
                            className="px-3 py-2 text-slate-400 font-bold"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                              currentPage === pageNum
                                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg scale-105"
                                : "text-slate-600 hover:bg-slate-200 hover:scale-105"
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      )}
                      <button
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-xl font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                      >
                        Next <span>→</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>


      {/* ===== VIEW MODAL ===== */}
      {viewJob && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-white/30 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">Job Details</h2>
              <button
                onClick={() => setViewJob(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Job Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{viewJob.title}</h3>
                  <div className="flex items-center space-x-3 mt-2">
                    <div
                      className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(viewJob.status)}`}
                    >
                      {getStatusIcon(viewJob.status)}
                      <span className="capitalize">{viewJob.status.toLowerCase()}</span>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${getCategoryColor(viewJob.category)}`}>
                      {viewJob.category}
                    </span>
                    {viewJob.isUrgent && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                        Urgent
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{viewJob.salary}</p>
                  <p className="text-sm text-slate-600">{viewJob.duration}</p>
                </div>
              </div>

              {/* Job Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Job Description</h4>
                    <p className="text-slate-700 whitespace-pre-line">{viewJob.Jobdescription}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Skills & Requirements</h4>
                    <p className="text-slate-700 whitespace-pre-line">{viewJob.SkillsAndrequirements}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Responsibilities</h4>
                    <p className="text-slate-700 whitespace-pre-line">{viewJob.responsibilities}</p>
                  </div>

                  {viewJob.benefits && (
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Benefits</h4>
                      <p className="text-slate-700 whitespace-pre-line">{viewJob.benefits}</p>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Company Details */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-bold text-slate-900 mb-3">Company Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Building2 className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Company</p>
                          <p className="font-medium text-slate-700">{viewJob.companyName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Contact Person</p>
                          <p className="font-medium text-slate-700">{viewJob.contactPerson}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-bold text-slate-900 mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Phone</p>
                          <p className="font-medium text-slate-700">{viewJob.phoneNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Email</p>
                          <p className="font-medium text-slate-700">{viewJob.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Location</p>
                          <p className="font-medium text-slate-700">{viewJob.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Job Metadata */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-bold text-slate-900 mb-3">Job Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Posted</p>
                          <p className="font-medium text-slate-700">
                            {new Date(viewJob.timePosted).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Job Type</p>
                          <p className="font-medium text-slate-700">{viewJob.jobType}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Views</p>
                          <p className="font-medium text-slate-700">{viewJob.clickCount}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Ad Type</p>
                          <p className="font-medium text-slate-700">
                            {viewJob.isPaid ? "Paid Advertisement" : "Free Listing"}
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
      )}

      {/* ===== EDIT MODAL ===== */}
      {editJob && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-white/30 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">Edit Job</h2>
              <button
                onClick={() => setEditJob(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Job Type</label>
                  <input
                    type="text"
                    value={editFormData.jobType}
                    onChange={(e) => setEditFormData({ ...editFormData, jobType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                  <input
                    type="text"
                    value={editFormData.duration}
                    onChange={(e) => setEditFormData({ ...editFormData, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Salary/Budget</label>
                  <input
                    type="text"
                    value={editFormData.salary}
                    onChange={(e) => setEditFormData({ ...editFormData, salary: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={editFormData.companyName}
                    onChange={(e) => setEditFormData({ ...editFormData, companyName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Contact Person</label>
                  <input
                    type="text"
                    value={editFormData.contactPerson}
                    onChange={(e) => setEditFormData({ ...editFormData, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={editFormData.phoneNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Contact</label>
                  <input
                    type="text"
                    value={editFormData.preferredContact}
                    onChange={(e) => setEditFormData({ ...editFormData, preferredContact: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as JobStatus })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ACTIVE">Active</option>
                    <option value="CLOSED">Closed</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editFormData.isUrgent}
                    onChange={(e) => setEditFormData({ ...editFormData, isUrgent: e.target.checked })}
                    className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                  />
                  <label className="text-sm font-medium text-slate-700">Mark as Urgent</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editFormData.isPaid}
                    onChange={(e) => setEditFormData({ ...editFormData, isPaid: e.target.checked })}
                    className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                  />
                  <label className="text-sm font-medium text-slate-700">Mark as Paid</label>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Job Description</label>
                  <textarea
                    value={editFormData.Jobdescription}
                    onChange={(e) => setEditFormData({ ...editFormData, Jobdescription: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Skills & Requirements</label>
                  <textarea
                    value={editFormData.SkillsAndrequirements}
                    onChange={(e) => setEditFormData({ ...editFormData, SkillsAndrequirements: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Responsibilities</label>
                  <textarea
                    value={editFormData.responsibilities}
                    onChange={(e) => setEditFormData({ ...editFormData, responsibilities: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Benefits (Optional)</label>
                  <textarea
                    value={editFormData.benefits}
                    onChange={(e) => setEditFormData({ ...editFormData, benefits: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setEditJob(null)}
                  className="px-4 py-2 text-slate-700 bg-slate-200 rounded-xl font-medium hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveJob}
                  disabled={isSaving || isProcessing}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2 min-w-[120px]"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRMATION MODAL ===== */}
      {deleteConfirmation && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {deletingId === deleteConfirmation.id ? (
                  <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                ) : (
                  <Trash2 className="w-8 h-8 text-red-600" />
                )}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                {deletingId === deleteConfirmation.id ? "Deleting Job..." : "Delete Job?"}
              </h3>
              <p className="text-slate-600 mb-6">
                {deletingId === deleteConfirmation.id ? (
                  "Please wait while we delete the job..."
                ) : (
                  <>
                    Are you sure you want to delete{" "}
                    <span className="font-bold text-slate-900">{deleteConfirmation.title}</span>?
                    <br />
                    <span className="text-red-600 font-medium">This action cannot be undone.</span>
                  </>
                )}
              </p>
              {deletingId !== deleteConfirmation.id && (
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setDeleteConfirmation(null)}
                    className="px-6 py-2.5 text-slate-700 bg-slate-200 rounded-xl font-medium hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteJob(deleteConfirmation.id)}
                    disabled={deletingId === deleteConfirmation.id || isProcessing}
                    className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg disabled:opacity-50 flex items-center gap-2"
                  >
                    {deletingId === deleteConfirmation.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Permanently"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}