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
  Building2,
} from "lucide-react";
import AdminAuthService from "@/app/services/admin_auth";

// ===== INTERFACES & TYPES =====
type AccountStatus = "ACTIVE" | "SUSPENDED" | "PENDING";

interface RawClient {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  company?: string | null;
  accountStatus?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  company: string;
  accountStatus: AccountStatus;
  createdAt: string;
  lastLogin?: string;
}

interface EditFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  company: string;
  accountStatus: AccountStatus;
}

type FilterStatus = "all" | AccountStatus;
// =====================

export default function AdminManageClients() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [viewClient, setViewClient] = useState<Client | null>(null);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    company: "",
    accountStatus: "ACTIVE",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Role-based delete
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  // Refresh trigger for Apply button
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch current admin role
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

  // Load clients
  const loadClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set("search", searchTerm.trim());
      if (filterStatus !== "all") params.set("accountStatus", filterStatus);

      const res = await fetch(
        `http://localhost:5000/api/client/getAllClientUsers?${params.toString()}`,
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
      const clientsList: RawClient[] = Array.isArray(data) ? data : [];

      const normalizedClients = clientsList.map((client) => {
        const accountStatus = client.accountStatus || (client.isActive ? "ACTIVE" : "SUSPENDED");
        const normalizedStatus = ["ACTIVE", "SUSPENDED", "PENDING"].includes(accountStatus.toUpperCase())
          ? (accountStatus.toUpperCase() as AccountStatus)
          : "ACTIVE";

        return {
          id: client.id || "",
          firstName: client.firstName || "",
          lastName: client.lastName || "",
          email: client.email || "",
          phone: client.phone || "",
          location: client.location || "",
          company: client.company || "Individual",
          accountStatus: normalizedStatus,
          createdAt: client.createdAt || new Date().toISOString(),
          lastLogin: client.updatedAt || undefined,
        };
      });

      setAllClients(normalizedClients);
      setCurrentPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load clients");
      console.error("Load clients error:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterStatus]);

  const handleManualRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const currentClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allClients.slice(startIndex, startIndex + itemsPerPage);
  }, [allClients, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(allClients.length / itemsPerPage);

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

  const deleteClient = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(
        `http://localhost:5000/api/client/deleteClientUser/${id}`,
        {
          method: "DELETE",
          headers: { ...AdminAuthService.getAuthHeaders() },
        }
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete client");
      }
      await loadClients();
      setViewClient(null);
      setEditClient(null);
      setDeleteConfirmation(null);
      showSuccessNotification("Client deleted successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete client");
      setIsProcessing(false);
    } finally {
      setDeletingId(null);
    }
  };

  const openViewModal = (client: Client) => setViewClient(client);

  const openEditModal = (client: Client) => {
    setEditClient(client);
    setEditFormData({
      firstName: client.firstName || "",
      lastName: client.lastName || "",
      email: client.email || "",
      phone: client.phone || "",
      location: client.location || "",
      company: client.company || "",
      accountStatus: client.accountStatus,
    });
  };

 const saveClient = async () => {
  if (!editClient) return;
  setIsSaving(true);
  try {
    const res = await fetch(
      `http://localhost:5000/api/client/updateClientUser/${editClient.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...AdminAuthService.getAuthHeaders(),
        },
        body: JSON.stringify(editFormData), // ✅ Just send editFormData directly
      }
    );
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update client");
    }
    await loadClients();
    setEditClient(null);
    showSuccessNotification("Client updated successfully!");
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to update client");
    setIsProcessing(false);
  } finally {
    setIsSaving(false);
  }
};

  const exportToCSV = () => {
    if (allClients.length === 0) return;
    const headers = [
      "ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Location",
      "Company",
      "Account Status",
      "Created At",
      "Last Login",
    ];
    const rows = allClients.map((client) => [
      `"${client.id}"`,
      `"${client.firstName}"`,
      `"${client.lastName}"`,
      `"${client.email}"`,
      `"${client.phone}"`,
      `"${client.location}"`,
      `"${client.company}"`,
      client.accountStatus,
      `"${new Date(client.createdAt).toLocaleString()}"`,
      client.lastLogin ? `"${new Date(client.lastLogin).toLocaleString()}"` : "",
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `clients_export_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Auto-search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadClients();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus, loadClients]);

  // Initial + manual refresh
  useEffect(() => {
    loadClients();
  }, [loadClients, refreshTrigger]);

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

  const getFullName = (client: Client) => {
    return `${client.firstName} ${client.lastName}`.trim() || client.email;
  };

  const getAvatarInitials = (client: Client) => {
    const name = getFullName(client);
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setViewClient(null);
      setEditClient(null);
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
                  Manage Clients
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-extrabold">
                  {allClients.length} registered job posters
                </p>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden mb-8">
            <div className="p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-emerald-50 to-teal-50">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">Search & Filter</h2>
              <p className="text-slate-600 font-bold">Find and manage clients efficiently</p>
            </div>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search clients by name, email, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                    className="w-full sm:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="all">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                  <button
                    onClick={handleManualRefresh}
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
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

          {/* Clients Table */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Clients Directory</h2>
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
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 font-medium">{error}</div>
            ) : allClients.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 text-center">
                <p className="text-slate-600 font-medium">No clients found.</p>
              </div>
            ) : (
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                {/* Improved Table Layout */}
                <div className="overflow-x-visible">
                  <table className="w-full table-auto min-w-full">
                    <thead className="bg-gradient-to-r from-emerald-500 to-teal-500">
                      <tr>
                        <th className="text-left py-5 px-4 font-black text-white text-sm uppercase tracking-wider w-1/4">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Client</span>
                          </div>
                        </th>
                        <th className="text-left py-5 px-4 font-black text-white text-sm uppercase tracking-wider w-1/5">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>Contact</span>
                          </div>
                        </th>
                        <th className="text-left py-5 px-4 font-black text-white text-sm uppercase tracking-wider w-1/6">
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4" />
                            <span>Company</span>
                          </div>
                        </th>
                        <th className="text-left py-5 px-4 font-black text-white text-sm uppercase tracking-wider w-1/6">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>Location</span>
                          </div>
                        </th>
                        <th className="text-left py-5 px-4 font-black text-white text-sm uppercase tracking-wider w-1/6">
                          Status
                        </th>
                        <th className="text-left py-5 px-4 font-black text-white text-sm uppercase tracking-wider w-1/6">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentClients.map((client) => (
                        <tr
                          key={client.id}
                          className="hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-all duration-300 group border-l-4 border-l-transparent hover:border-l-emerald-500"
                        >
                          {/* Client Info */}
                          <td className="py-5 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg text-sm">
                                  {getAvatarInitials(client)}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-white flex items-center justify-center">
                                  <div
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      client.accountStatus === "ACTIVE"
                                        ? "bg-emerald-500"
                                        : client.accountStatus === "PENDING"
                                        ? "bg-amber-500"
                                        : "bg-rose-500"
                                    }`}
                                  />
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-slate-900 truncate text-sm group-hover:text-emerald-600 transition-colors">
                                  {getFullName(client)}
                                </p>
                                <p className="text-xs text-slate-500 mt-1 flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {new Date(client.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Contact Info */}
                          <td className="py-5 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2 text-sm">
                                <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                <span className="font-medium text-slate-600 truncate text-xs">{client.email}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                <span className="font-medium text-slate-600 text-xs">{client.phone}</span>
                              </div>
                            </div>
                          </td>

                          {/* Company Info */}
                          <td className="py-5 px-4">
                            <div className="flex items-center space-x-2">
                              <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                              <span className="font-medium text-slate-600 text-sm truncate">{client.company}</span>
                            </div>
                          </td>

                          {/* Location */}
                          <td className="py-5 px-4">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                              <span className="font-medium text-slate-600 text-sm">{client.location}</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-5 px-4">
                            <div
                              className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(client.accountStatus)} shadow-md hover:shadow-lg transition-shadow`}
                            >
                              {getStatusIcon(client.accountStatus)}
                              <span className="capitalize">{client.accountStatus.toLowerCase()}</span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-5 px-4">
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => openViewModal(client)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-110"
                                title="View details"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => openEditModal(client)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-110"
                                title="Edit client"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              {currentUserRole === "SUPER_ADMIN" && (
                                <button
                                  onClick={() => setDeleteConfirmation({ id: client.id, name: getFullName(client) })}
                                  disabled={deletingId === client.id || isProcessing}
                                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-110 disabled:opacity-50"
                                  title="Delete client"
                                >
                                  {deletingId === client.id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-3 h-3" />
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
                      {Math.min(currentPage * itemsPerPage, allClients.length)} of {allClients.length} clients
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
                          <span key={`ellipsis-${index}`} className="px-3 py-2 text-slate-400 font-bold">
                            ...
                          </span>
                        ) : (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                              currentPage === pageNum
                                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg scale-105"
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
      {viewClient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-white/30 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">Client Details</h2>
              <button onClick={() => setViewClient(null)} className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {getAvatarInitials(viewClient)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{getFullName(viewClient)}</h3>
                  <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(viewClient.accountStatus)}`}>
                    {getStatusIcon(viewClient.accountStatus)}
                    <span className="capitalize">{viewClient.accountStatus.toLowerCase()}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="font-medium text-slate-700">{viewClient.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="font-medium text-slate-700">{viewClient.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="font-medium text-slate-700">{viewClient.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <Building2 className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Company</p>
                    <p className="font-medium text-slate-700">{viewClient.company}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Joined</p>
                    <p className="font-medium text-slate-700">{new Date(viewClient.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {viewClient.lastLogin && (
                  <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Last Active</p>
                      <p className="font-medium text-slate-700">{new Date(viewClient.lastLogin).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {editClient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-white/30 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">Edit Client</h2>
              <button onClick={() => setEditClient(null)} className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={editFormData.company}
                    onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Account Status</label>
                  <select
                    value={editFormData.accountStatus}
                    onChange={(e) => setEditFormData({ ...editFormData, accountStatus: e.target.value as AccountStatus })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setEditClient(null)}
                  className="px-4 py-2 text-slate-700 bg-slate-200 rounded-xl font-medium hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveClient}
                  disabled={isSaving || isProcessing}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2 min-w-[120px]"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {deletingId === deleteConfirmation.id ? <Loader2 className="w-8 h-8 text-red-600 animate-spin" /> : <Trash2 className="w-8 h-8 text-red-600" />}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                {deletingId === deleteConfirmation.id ? "Deleting Client..." : "Delete Client?"}
              </h3>
              <p className="text-slate-600 mb-6">
                {deletingId === deleteConfirmation.id ? (
                  "Please wait while we delete the client..."
                ) : (
                  <>
                    Are you sure you want to delete <span className="font-bold text-slate-900">{deleteConfirmation.name}</span>?<br />
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
                    onClick={() => deleteClient(deleteConfirmation.id)}
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