"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import AdminSidebar from "@/components/admin/Sidebar";
import {
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  Menu,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  AlertTriangle,
  Download,
  Loader2,
  Trash2,
  X,
  Calendar,
  Clock,
  User,
  Sparkles,
} from "lucide-react";
import AdminAuthService from "@/app/services/admin_auth";

// ===== INTERFACES & TYPES =====
type AccountStatus = "ACTIVE" | "SUSPENDED" | "PENDING";
type SubscriptionPlan = "FREE" | "PREMIUM";
type SubscriptionStatus = "TRIAL" | "ACTIVE" | "EXPIRED" | "CANCELLED";

interface RawFundi {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  primary_skill?: string;
  experience_level?: string;
  accountStatus?: string;
  status?: string;
  createdAt?: string;
  lastLogin?: string;
  biography?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
}

interface Fundi {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  primary_skill: string;
  experience_level: string;
  accountStatus: AccountStatus;
  createdAt: string;
  lastLogin?: string;
  biography: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
}

interface EditFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  primary_skill: string;
  experience_level: string;
  accountStatus: AccountStatus;
  biography: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
}

type FilterStatus = "all" | AccountStatus;
// =====================

export default function AdminManageFundis() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [allFundis, setAllFundis] = useState<Fundi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [viewFundi, setViewFundi] = useState<Fundi | null>(null);
  const [editFundi, setEditFundi] = useState<Fundi | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    primary_skill: "",
    experience_level: "",
    accountStatus: "ACTIVE",
    biography: "",
    subscriptionPlan: "FREE",
    subscriptionStatus: "TRIAL",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  // ✅ Manual refresh trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // ✅ Load fundis with current filters
  const loadFundis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set("search", searchTerm.trim());
      if (filterStatus !== "all") params.set("accountStatus", filterStatus); // ✅ Correct field name

      const res = await fetch(
        `http://localhost:5000/api/fundi/getAllFundis?${params.toString()}`,
        {
          headers: { ...AdminAuthService.getAuthHeaders() },
          cache: "no-store",
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      let fundisList: RawFundi[] = [];
      if (Array.isArray(data)) {
        fundisList = data;
      } else if (data && Array.isArray(data.fundis)) {
        fundisList = data.fundis;
      } else if (data && Array.isArray(data.data)) {
        fundisList = data.data;
      }

      const normalizedFundis = fundisList.map((fundi) => {
        const accountStatus = fundi.accountStatus || fundi.status || "ACTIVE";
        const normalizedStatus = ["ACTIVE", "SUSPENDED", "PENDING"].includes(
          accountStatus.toUpperCase()
        )
          ? (accountStatus.toUpperCase() as AccountStatus)
          : "ACTIVE";

        const subscriptionPlan = ["FREE", "PREMIUM"].includes(
          (fundi.subscriptionPlan || "FREE").toUpperCase()
        )
          ? (fundi.subscriptionPlan!.toUpperCase() as SubscriptionPlan)
          : "FREE";

        const subscriptionStatus = [
          "TRIAL",
          "ACTIVE",
          "EXPIRED",
          "CANCELLED",
        ].includes((fundi.subscriptionStatus || "TRIAL").toUpperCase())
          ? (fundi.subscriptionStatus!.toUpperCase() as SubscriptionStatus)
          : "TRIAL";

        return {
          id: fundi.id || "",
          firstName: fundi.firstName || "",
          lastName: fundi.lastName || "",
          email: fundi.email || "",
          phone: fundi.phone || "",
          location: fundi.location || "",
          primary_skill: fundi.primary_skill || "",
          experience_level: fundi.experience_level || "",
          accountStatus: normalizedStatus,
          createdAt: fundi.createdAt || new Date().toISOString(),
          lastLogin: fundi.lastLogin || undefined,
          biography: fundi.biography || "",
          subscriptionPlan,
          subscriptionStatus,
        };
      });

      setAllFundis(normalizedFundis);
      setCurrentPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load fundis");
      console.error("Load fundis error:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterStatus]);

  // ✅ Manual refresh
  const handleManualRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // ✅ Export to CSV
  const exportToCSV = () => {
    if (allFundis.length === 0) return;

    const headers = [
      "ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Location",
      "Primary Skill",
      "Experience Level",
      "Account Status",
      "Biography",
      "Subscription Plan",
      "Subscription Status",
      "Created At",
      "Last Login",
    ];

    const rows = allFundis.map((fundi) => [
      `"${fundi.id}"`,
      `"${fundi.firstName}"`,
      `"${fundi.lastName}"`,
      `"${fundi.email}"`,
      `"${fundi.phone}"`,
      `"${fundi.location}"`,
      `"${fundi.primary_skill}"`,
      `"${fundi.experience_level}"`,
      fundi.accountStatus,
      `"${(fundi.biography || "").replace(/"/g, '""')}"`,
      fundi.subscriptionPlan,
      fundi.subscriptionStatus,
      `"${new Date(fundi.createdAt).toLocaleString()}"`,
      fundi.lastLogin ? `"${new Date(fundi.lastLogin).toLocaleString()}"` : "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `fundis_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const currentFundis = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allFundis.slice(startIndex, startIndex + itemsPerPage);
  }, [allFundis, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(allFundis.length / itemsPerPage);

  const showSuccessNotification = (message: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setSuccessMessage(message);
      setShowSuccess(true);
      setIsProcessing(false);
      setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage(null);
      }, 3000);
    }, 5000);
  };

  const deleteFundi = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(
        `http://localhost:5000/api/fundi/admin/deleteFundi/${id}`,
        {
          method: "DELETE",
          headers: { ...AdminAuthService.getAuthHeaders() },
        }
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete fundi");
      }
      await loadFundis();
      setViewFundi(null);
      setEditFundi(null);
      setDeleteConfirmation(null);
      showSuccessNotification("Fundi deleted successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete fundi");
      setIsProcessing(false);
    } finally {
      setDeletingId(null);
    }
  };

  const openViewModal = (fundi: Fundi) => setViewFundi(fundi);

  const openEditModal = (fundi: Fundi) => {
    setEditFundi(fundi);
    setEditFormData({
      firstName: fundi.firstName || "",
      lastName: fundi.lastName || "",
      email: fundi.email || "",
      phone: fundi.phone || "",
      location: fundi.location || "",
      primary_skill: fundi.primary_skill || "",
      experience_level: fundi.experience_level || "",
      accountStatus: fundi.accountStatus,
      biography: fundi.biography || "",
      subscriptionPlan: fundi.subscriptionPlan,
      subscriptionStatus: fundi.subscriptionStatus,
    });
  };

  const saveFundi = async () => {
    if (!editFundi) return;
    setIsSaving(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/fundi/admin/updateFundiAdmin/${editFundi.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...AdminAuthService.getAuthHeaders(),
          },
          body: JSON.stringify({
            ...editFormData,
            status: editFormData.accountStatus,
          }),
        }
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update fundi");
      }
      await loadFundis();
      setEditFundi(null);
      showSuccessNotification("Fundi updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update fundi");
      setIsProcessing(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadFundis();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus, loadFundis]);

  // Initial + manual refresh
  useEffect(() => {
    loadFundis();
  }, [loadFundis, refreshTrigger]);

  useEffect(() => {
  const fetchCurrentUser = async () => {
    try {
      const userData = AdminAuthService.getUserData();
      if (!userData?.id) return;

      const res = await fetch(`http://localhost:5000/api/admin/getAdmin/${userData.id}`, {
        headers: { ...AdminAuthService.getAuthHeaders() },
      });
      if (res.ok) {
        const admin = await res.json();
        setCurrentUserRole(admin.role || null);
      }
    } catch (err) {
      console.error("Failed to fetch current admin role", err);
    }
  };
  fetchCurrentUser();
}, []);

  // ===== UI HELPERS =====
  const getStatusColor = (accountStatus: AccountStatus) => {
    switch (accountStatus) {
      case "ACTIVE":
        return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg";
      case "SUSPENDED":
        return "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg";
      case "PENDING":
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg";
      default:
        return "bg-gradient-to-r from-slate-500 to-slate-600 text-white";
    }
  };

  const getStatusIcon = (accountStatus: AccountStatus) => {
    switch (accountStatus) {
      case "ACTIVE":
        return <CheckCircle className="w-4 h-4" />;
      case "SUSPENDED":
        return <Ban className="w-4 h-4" />;
      case "PENDING":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getSubscriptionColor = (status: SubscriptionStatus) => {
    switch (status) {
      case "ACTIVE":
        return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white";
      case "TRIAL":
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white";
      case "EXPIRED":
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white";
      case "CANCELLED":
        return "bg-gradient-to-r from-rose-500 to-pink-500 text-white";
      default:
        return "bg-gradient-to-r from-slate-500 to-slate-600 text-white";
    }
  };

  const getSkillBadgeColor = (skill: string) => {
    const colors = [
      "bg-gradient-to-r from-blue-500 to-cyan-500",
      "bg-gradient-to-r from-violet-500 to-purple-500",
      "bg-gradient-to-r from-emerald-500 to-teal-500",
      "bg-gradient-to-r from-amber-500 to-orange-500",
      "bg-gradient-to-r from-fuchsia-500 to-pink-500",
      "bg-gradient-to-r from-indigo-500 to-blue-500",
    ];
    const index =
      skill.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return `${colors[index]} text-white shadow-md`;
  };

  const getExperienceColor = (level: string) => {
    const levelLower = level.toLowerCase();
    if (levelLower.includes("expert") || levelLower.includes("senior")) {
      return "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white";
    } else if (
      levelLower.includes("intermediate") ||
      levelLower.includes("mid")
    ) {
      return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white";
    } else if (
      levelLower.includes("beginner") ||
      levelLower.includes("junior")
    ) {
      return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white";
    }
    return "bg-gradient-to-r from-slate-500 to-slate-600 text-white";
  };

  const getFullName = (fundi: Fundi) => {
    return `${fundi.firstName} ${fundi.lastName}`.trim() || fundi.email;
  };

  const getAvatarInitials = (fundi: Fundi) => {
    const name = getFullName(fundi);
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setViewFundi(null);
      setEditFundi(null);
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
              <p className="text-sm opacity-90">
                Please wait while we complete your request
              </p>
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
                  Manage Fundis
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-extrabold">
                  {allFundis.length} registered skilled workers
                </p>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden mb-8">
            <div className="p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-indigo-50 to-blue-50">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
                Search & Filter
              </h2>
              <p className="text-slate-600 font-extrabold">
                Find and manage fundis efficiently
              </p>
            </div>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search fundis by name, email, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) =>
                      setFilterStatus(e.target.value as FilterStatus)
                    }
                    className="w-full sm:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="all">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                  <button
                    onClick={handleManualRefresh}
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
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

          {/* Fundis Table */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Fundis Directory
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 font-medium">
                {error}
              </div>
            ) : allFundis.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 text-center">
                <p className="text-slate-600 font-medium">No fundis found.</p>
              </div>
            ) : (
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead className="bg-gradient-to-r from-indigo-500 to-blue-500">
                      <tr>
                        <th className="text-left py-5 px-6 font-black text-white text-sm uppercase tracking-wider">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Fundi</span>
                          </div>
                        </th>
                        <th className="text-left py-5 px-6 font-black text-white text-sm uppercase tracking-wider hidden md:table-cell">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>Contact</span>
                          </div>
                        </th>
                        <th className="text-left py-5 px-6 font-black text-white text-sm uppercase tracking-wider hidden lg:table-cell">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-4 h-4" />
                            <span>Skills</span>
                          </div>
                        </th>
                        <th className="text-left py-5 px-6 font-black text-white text-sm uppercase tracking-wider">
                          Status
                        </th>
                        <th className="text-left py-5 px-6 font-black text-white text-sm uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentFundis.map((fundi) => (
                        <tr
                          key={fundi.id}
                          className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300 group border-l-4 border-l-transparent hover:border-l-blue-500"
                        >
                          <td className="py-5 px-6">
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg text-lg">
                                  {getAvatarInitials(fundi)}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-white flex items-center justify-center">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      fundi.accountStatus === "ACTIVE"
                                        ? "bg-emerald-500"
                                        : fundi.accountStatus === "PENDING"
                                        ? "bg-amber-500"
                                        : "bg-rose-500"
                                    }`}
                                  />
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-slate-900 truncate text-lg group-hover:text-blue-600 transition-colors">
                                  {getFullName(fundi)}
                                </p>
                                <div className="flex items-center space-x-2 text-sm mt-1">
                                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                  <span className="font-medium text-slate-600 truncate">
                                    {fundi.location || "N/A"}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Joined:{" "}
                                  {new Date(
                                    fundi.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-6 hidden md:table-cell">
                            <div className="space-y-2 min-w-0">
                              <div className="flex items-center space-x-2 text-sm">
                                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <span className="font-medium text-slate-600 truncate hover:text-blue-600 transition-colors cursor-pointer">
                                  {fundi.email}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <span className="font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">
                                  {fundi.phone || "N/A"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-6 hidden lg:table-cell">
                            <div className="flex flex-wrap gap-2 max-w-xs">
                              <span
                                className={`px-3 py-1.5 text-xs font-bold rounded-full ${getSkillBadgeColor(
                                  fundi.primary_skill
                                )}`}
                              >
                                {fundi.primary_skill || "N/A"}
                              </span>
                              <span
                                className={`px-3 py-1.5 text-xs font-bold rounded-full ${getExperienceColor(
                                  fundi.experience_level
                                )}`}
                              >
                                {fundi.experience_level || "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="py-5 px-6">
                            <div
                              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(
                                fundi.accountStatus
                              )} shadow-md hover:shadow-lg transition-shadow`}
                            >
                              {getStatusIcon(fundi.accountStatus)}
                              <span className="capitalize font-bold">
                                {fundi.accountStatus.toLowerCase()}
                              </span>
                            </div>
                          </td>
                          <td className="py-5 px-6">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => openViewModal(fundi)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-110"
                                title="View details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openEditModal(fundi)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-110"
                                title="Edit fundi"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {currentUserRole === "SUPER_ADMIN" && (
                                <button
                                  onClick={() =>
                                    setDeleteConfirmation({
                                      id: fundi.id,
                                      name: getFullName(fundi),
                                    })
                                  }
                                  disabled={
                                    deletingId === fundi.id || isProcessing
                                  }
                                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-110 disabled:opacity-50"
                                  title="Delete fundi"
                                >
                                  {deletingId === fundi.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </button>
                              )}
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
                      {Math.min(currentPage * itemsPerPage, allFundis.length)}{" "}
                      of {allFundis.length} fundis
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(currentPage - 1, 1))
                        }
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
                                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-105"
                                : "text-slate-600 hover:bg-slate-200 hover:scale-105"
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      )}
                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(currentPage + 1, totalPages))
                        }
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
      {viewFundi && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-white/30 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">
                Fundi Details
              </h2>
              <button
                onClick={() => setViewFundi(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {getAvatarInitials(viewFundi)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {getFullName(viewFundi)}
                  </h3>
                  <div
                    className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(
                      viewFundi.accountStatus
                    )}`}
                  >
                    {getStatusIcon(viewFundi.accountStatus)}
                    <span className="capitalize">
                      {viewFundi.accountStatus.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="font-medium text-slate-700">
                      {viewFundi.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="font-medium text-slate-700">
                      {viewFundi.phone || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="font-medium text-slate-700">
                      {viewFundi.location || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Joined</p>
                    <p className="font-medium text-slate-700">
                      {new Date(viewFundi.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <h4 className="font-bold text-slate-900 mb-3">
                  Skills & Experience
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-3 py-1.5 text-sm font-bold rounded-full ${getSkillBadgeColor(
                      viewFundi.primary_skill
                    )}`}
                  >
                    {viewFundi.primary_skill || "N/A"}
                  </span>
                  <span
                    className={`px-3 py-1.5 text-sm font-bold rounded-full ${getExperienceColor(
                      viewFundi.experience_level
                    )}`}
                  >
                    {viewFundi.experience_level || "N/A"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <Sparkles className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Subscription Plan</p>
                    <p className="font-medium text-slate-700 capitalize">
                      {viewFundi.subscriptionPlan.toLowerCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">
                      Subscription Status
                    </p>
                    <p
                      className={`font-medium ${getSubscriptionColor(
                        viewFundi.subscriptionStatus
                      )} px-2 py-0.5 rounded-full`}
                    >
                      {viewFundi.subscriptionStatus}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <h4 className="font-bold text-slate-900 mb-2">Biography</h4>
                <p className="text-slate-700 whitespace-pre-line">
                  {viewFundi.biography || "No biography provided."}
                </p>
              </div>
              {viewFundi.lastLogin && (
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Last Active</p>
                    <p className="font-medium text-slate-700">
                      {new Date(viewFundi.lastLogin).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {editFundi && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-white/30 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">Edit Fundi</h2>
              <button
                onClick={() => setEditFundi(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.firstName}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.lastName}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Primary Skill
                  </label>
                  <input
                    type="text"
                    value={editFormData.primary_skill}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        primary_skill: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Experience Level
                  </label>
                  <input
                    type="text"
                    value={editFormData.experience_level}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        experience_level: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Account Status
                  </label>
                  <select
                    value={editFormData.accountStatus}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        accountStatus: e.target.value as AccountStatus,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Biography
                  </label>
                  <textarea
                    value={editFormData.biography}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        biography: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subscription Plan
                  </label>
                  <select
                    value={editFormData.subscriptionPlan}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        subscriptionPlan: e.target.value as SubscriptionPlan,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="FREE">Free</option>
                    <option value="PREMIUM">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subscription Status
                  </label>
                  <select
                    value={editFormData.subscriptionStatus}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        subscriptionStatus: e.target
                          .value as SubscriptionStatus,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="TRIAL">Trial</option>
                    <option value="ACTIVE">Active</option>
                    <option value="EXPIRED">Expired</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setEditFundi(null)}
                  className="px-4 py-2 text-slate-700 bg-slate-200 rounded-xl font-medium hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveFundi}
                  disabled={isSaving || isProcessing}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2 min-w-[120px]"
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
                {deletingId === deleteConfirmation.id
                  ? "Deleting Fundi..."
                  : "Delete Fundi?"}
              </h3>
              <p className="text-slate-600 mb-6">
                {deletingId === deleteConfirmation.id ? (
                  "Please wait while we delete the fundi..."
                ) : (
                  <>
                    Are you sure you want to delete{" "}
                    <span className="font-bold text-slate-900">
                      {deleteConfirmation.name}
                    </span>
                    ?<br />
                    <span className="text-red-600 font-medium">
                      This action cannot be undone.
                    </span>
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
                    onClick={() => deleteFundi(deleteConfirmation.id)}
                    disabled={
                      deletingId === deleteConfirmation.id || isProcessing
                    }
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
