"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/Sidebar";
import {
  MessageSquare,
  Search,
  Menu,
  Clock,
  User,
  Mail,
  AlertTriangle,
  Eye,
  Reply,
  Archive,
} from "lucide-react";
import Link from "next/link";
import AdminAuthService from "@/app/services/admin_auth";

// ====== INTERFACES ======

interface ClientOrFundi {
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
}

interface AssignedTo {
  fullName: string;
}

interface ApiTicket {
  id: string;
  subject: string;
  message: string;
  status?: string;
  priority?: string;
  category?: string;
  createdAt: string;
  replies?: unknown[];
  assignedTo?: AssignedTo;
  client?: ClientOrFundi;
  fundi?: ClientOrFundi;
}

interface UserDisplay {
  name: string;
  email: string;
  phone: string;
  type: "Client" | "Fundi" | "—";
}

type TicketStatus = "open" | "in_progress" | "urgent" | "resolved" | "closed";
type TicketPriority = "urgent" | "high" | "medium" | "low";

interface Ticket {
  id: string;
  subject: string;
  description: string;
  user: UserDisplay;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  createdAt: string;
  replies: number;
  assignedTo: string;
  raw: ApiTicket;
}

interface Admin {
  id?: string;
  _id?: string;
  email?: string;
  role?: string;
  status?: string;
  fullName?: string;
}

// =======================

export default function AdminSupportTickets() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [search, setSearch] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadTickets = async (pageParam = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all")
        params.set("status", filterStatus.toUpperCase());
      if (filterPriority !== "all")
        params.set("priority", filterPriority.toUpperCase());
      if (search.trim()) params.set("search", search.trim());
      params.set("page", String(pageParam));
      params.set("limit", "10");

      const res = await fetch(
        `http://localhost:5000/api/admin/support/tickets?${params.toString()}`,
        {
          headers: { ...AdminAuthService.getAuthHeaders() },
          cache: "no-store",
        }
      );
      const contentType = res.headers.get("content-type") || "";
      const json = contentType.includes("application/json")
        ? await res.json()
        : { message: await res.text() };
      if (res.ok && contentType.includes("application/json")) {
        const uiTickets = (json.tickets || []).map((t: ApiTicket) => {
          const baseUser = { name: "—", email: "—", phone: "—", type: "—" as const };
          let user: UserDisplay = baseUser;

          if (t.client) {
            const name = `${t.client.firstName || ""} ${t.client.lastName || ""}`.trim() || t.client.email;
            user = {
              name,
              email: t.client.email,
              phone: t.client.phone,
              type: "Client",
            };
          } else if (t.fundi) {
            const name = `${t.fundi.firstName || ""} ${t.fundi.lastName || ""}`.trim() || t.fundi.email;
            user = {
              name,
              email: t.fundi.email,
              phone: t.fundi.phone,
              type: "Fundi",
            };
          }

          const status = (t.status || "OPEN").toLowerCase() as TicketStatus;
          const priority = (t.priority || "LOW").toLowerCase() as TicketPriority;
          const category = (t.category || "GENERAL_INQUIRY").replace(/_/g, " ");

          return {
            id: t.id,
            subject: t.subject,
            description: t.message,
            user,
            status,
            priority,
            category,
            createdAt: new Date(t.createdAt).toLocaleString(),
            replies: (t.replies || []).length,
            assignedTo: t.assignedTo?.fullName || "Unassigned",
            raw: t,
          };
        });
        setTickets(uiTickets);
        if (json.pagination) {
          setPage(json.pagination.page || 1);
          setTotalPages(json.pagination.totalPages || 1);
        } else {
          setPage(pageParam);
          setTotalPages(1);
        }
      } else {
        console.error("Failed to load tickets:", json);
        setTickets([]);
        setPage(pageParam);
        setTotalPages(1);
      }
    } catch (e) {
      console.error("Tickets fetch error:", e);
      setTickets([]);
      setPage(pageParam);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const loadAdmins = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/getAllAdmins`, {
        headers: { ...AdminAuthService.getAuthHeaders() },
      });

      if (!res.ok) {
        console.error("Failed to fetch admins. Status:", res.status, res.statusText);
        return;
      }

      const contentType = res.headers.get("content-type") || "";
      const json = contentType.includes("application/json") ? await res.json() : null;

      if (!json) {
        console.error("Admins response is not JSON");
        return;
      }

      let adminList: Admin[] = [];
      if (Array.isArray(json)) {
        adminList = json;
      } else if (Array.isArray(json.admins)) {
        adminList = json.admins;
      } else if (Array.isArray(json.data)) {
        adminList = json.data;
      } else {
        console.warn("Admins data not found in expected format:", json);
      }

      setAdmins(adminList);
    } catch (e) {
      console.error("Admins fetch error:", e);
    }
  };

  const assignTicket = async (ticketId: string, toAdminId: string) => {
    if (!toAdminId) return;
    setAssigningId(ticketId);
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/support/tickets/${ticketId}/assign`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...AdminAuthService.getAuthHeaders(),
          },
          body: JSON.stringify({ assignedToId: toAdminId }),
        }
      );
      const json = await res.json();
      if (!res.ok) {
        alert(json.message || "Failed to assign ticket");
      }
      await loadTickets(page);
    } catch (e) {
      console.error("Assign ticket error:", e);
    } finally {
      setAssigningId(null);
    }
  };

  useEffect(() => {
    loadTickets(1);
    loadAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700";
      case "in_progress":
        return "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700";
      case "urgent":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-700";
      case "resolved":
        return "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700";
      case "closed":
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700";
      default:
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
      case "high":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white";
      case "medium":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700";
      case "low":
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700";
      default:
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Payment Issues":
        "bg-gradient-to-r from-red-100 to-pink-100 text-red-700",
      "Account Verification":
        "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700",
      "Harassment Report":
        "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700",
      "General Inquiry":
        "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700",
      "Technical Support":
        "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700",
    };
    return colors[category] || "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:flex font-inter">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 lg:ml-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl mb-8 sm:mb-10 flex items-center justify-between px-6 sm:px-8 py-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-3 rounded-xl text-slate-700 hover:bg-white/60 transition-all duration-200 shadow-sm"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl sm:text-2xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  Support Tickets
                </h1>
                <p className="text-slate-600 mt-2 text-base sm:text-lg font-bold">
                  Manage customer support requests
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>3 Urgent</span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden mb-8">
            <div className="p-6 sm:p-8 border-b border-white/30 bg-gradient-to-r from-green-50 to-emerald-50">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
                Filter Tickets
              </h2>
              <p className="text-slate-600 font-bold">
                Search and manage support tickets
              </p>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tickets by subject, user, or description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") loadTickets(1);
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full sm:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="urgent">Urgent</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="w-full sm:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="all">All Priority</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <select className="w-full sm:w-auto px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium">
                    <option value="all">All Categories</option>
                    <option value="payment">Payment Issues</option>
                    <option value="verification">Account Verification</option>
                    <option value="harassment">Harassment Report</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => loadTickets(1)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tickets List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Support Tickets
              </h2>
              <div className="text-sm font-bold text-slate-600">
                {tickets.length} tickets on page {page}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-10 text-slate-500">
                Loading tickets...
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-10 text-slate-500 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30">
                No tickets found.
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                              <MessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900 text-lg">
                                {ticket.subject}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                                    ticket.status
                                  )}`}
                                >
                                  {ticket.status
                                    .replace("_", " ")
                                    .toUpperCase()}
                                </span>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(
                                    ticket.priority
                                  )}`}
                                >
                                  {ticket.priority.toUpperCase()}
                                </span>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(
                                    ticket.category
                                  )}`}
                                >
                                  {ticket.category}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-slate-600 font-medium mb-4">
                            {ticket.description}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-slate-400" />
                              <span className="font-medium text-slate-600">
                                {ticket.user.name} ({ticket.user.type})
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-slate-400" />
                              <span className="font-medium text-slate-600">
                                {ticket.user.email}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <span className="font-medium text-slate-600">
                                Created: {ticket.createdAt}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MessageSquare className="w-4 h-4 text-slate-400" />
                              <span className="font-medium text-slate-600">
                                {ticket.replies} replies • Assigned to{" "}
                                {ticket.assignedTo}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 min-w-[220px]">
                          <Link
                            href={`/administrator/tickets/${ticket.id}`}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </Link>
                          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg">
                            <Reply className="w-4 h-4" />
                            <span>Reply</span>
                          </button>
                          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-xl font-bold hover:from-slate-600 hover:to-slate-700 transition-all duration-200 shadow-lg">
                            <Archive className="w-4 h-4" />
                            <span>Close</span>
                          </button>
                          <div className="flex items-center gap-2 mt-2">
                            <select
                              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                              onChange={(e) =>
                                assignTicket(ticket.id, e.target.value)
                              }
                              disabled={assigningId === ticket.id}
                              defaultValue=""
                            >
                              <option value="" disabled>
                                {admins.length > 0
                                  ? "Assign to..."
                                  : "Loading admins..."}
                              </option>
                              {admins
                                .filter((a) => {
                                  const status = (a.status || "")
                                    .toString()
                                    .toLowerCase();
                                  return status === "active";
                                })
                                .map((a) => (
                                  <option
                                    key={a.id || a._id}
                                    value={a.id || a._id}
                                  >
                                    {a.email || "No email"} ({a.role || "Admin"})
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => {
                    if (page > 1) loadTickets(page - 1);
                  }}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    page === 1
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-white text-slate-700 hover:bg-slate-100 shadow"
                  }`}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => loadTickets(pageNum)}
                      className={`w-10 h-10 rounded-full font-medium ${
                        page === pageNum
                          ? "bg-emerald-600 text-white"
                          : "bg-white text-slate-700 hover:bg-slate-100 shadow"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}

                <button
                  onClick={() => {
                    if (page < totalPages) loadTickets(page + 1);
                  }}
                  disabled={page === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    page === totalPages
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-white text-slate-700 hover:bg-slate-100 shadow"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}