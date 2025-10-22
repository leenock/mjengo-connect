"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminAuthService from "@/app/services/admin_auth";
import { ArrowLeft, User, Shield, MessageSquare, Loader2, Check } from "lucide-react";

// ===== INTERFACES & TYPES =====
type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

interface ClientOrFundi {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
}

interface AssignedTo {
  id: string;
  fullName: string;
  email: string;
}

interface Reply {
  id: string;
  message: string;
  authorName: string;
  authorId: string;
  createdAt: string;
}

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: TicketStatus;
  priority: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  client?: ClientOrFundi;
  fundi?: ClientOrFundi;
  assignedTo?: AssignedTo;
  replies: Reply[];
}
// =============================

export default function AdminTicketDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>("open");
  const [isUpdating, setIsUpdating] = useState(false);

  const loadTicket = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/support/tickets/${id}`,
        {
          headers: { ...AdminAuthService.getAuthHeaders() },
          cache: "no-store",
        }
      );
      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : { message: await res.text() };

      if (!res.ok || !contentType.includes("application/json")) {
        throw new Error(
          typeof data?.message === "string"
            ? data.message
            : "Failed to fetch ticket"
        );
      }

      const normalizedTicket = {
        ...data.ticket,
        status: (data.ticket.status || "OPEN").toLowerCase() as TicketStatus,
      };

      setTicket(normalizedTicket);
      setSelectedStatus(normalizedTicket.status);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load ticket");
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async () => {
    if (!ticket) return;
    setIsUpdating(true);
    try {
      const statusMap: Record<TicketStatus, string> = {
        open: "OPEN",
        in_progress: "IN_PROGRESS",
        resolved: "RESOLVED",
        closed: "CLOSED",
      };
      const backendStatus = statusMap[selectedStatus];

      console.log("📤 Sending to backend:", { status: backendStatus });

      const res = await fetch(
        `http://localhost:5000/api/admin/support/tickets/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...AdminAuthService.getAuthHeaders(),
          },
          body: JSON.stringify({ status: backendStatus }),
        }
      );

      // 🔥 Read as text FIRST to handle HTML/plain text errors
      const textResponse = await res.text();
      console.log("📡 Raw response:", textResponse);

      if (!res.ok) {
        let errorMessage = "Failed to update ticket";
        try {
          const json = JSON.parse(textResponse);
          errorMessage = json.message || json.error || errorMessage;
        } catch {
          // Handle HTML/plain text errors
          if (textResponse.includes("Cannot PATCH")) {
            errorMessage = "Request went to Next.js. Ensure backend is running on :5000";
          } else {
            errorMessage = textResponse || errorMessage;
          }
        }
        throw new Error(errorMessage);
      }

      await loadTicket();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (!AdminAuthService.isAuthenticated()) {
      window.location.href = "/administrator/auth/login";
      return;
    }
    loadTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:flex font-inter">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 lg:ml-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/administrator/tickets"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-white shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading ticket...
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium">
              {error}
            </div>
          ) : !ticket ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 font-medium">
              Ticket not found
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900">
                      {ticket.subject}
                    </h1>
                    <p className="text-slate-700 mt-2">{ticket.message}</p>
                  </div>
                  <div className="text-sm text-slate-500 font-medium">
                    <div>
                      Created: {new Date(ticket.createdAt).toLocaleString()}
                    </div>
                    <div>
                      Updated: {new Date(ticket.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm mt-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-700">
                      {ticket.client
                        ? `${ticket.client.firstName || ""} ${ticket.client.lastName || ""}`.trim() ||
                          ticket.client.email
                        : ticket.fundi
                        ? `${ticket.fundi.firstName || ""} ${ticket.fundi.lastName || ""}`.trim() ||
                          ticket.fundi.email
                        : "Unknown"}
                      {ticket.client
                        ? " (Client)"
                        : ticket.fundi
                        ? " (Fundi)"
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-700">
                      Assigned: {ticket.assignedTo?.fullName || "Unassigned"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-700">
                      {ticket.replies.length} replies
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-700 whitespace-nowrap">Status:</span>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as TicketStatus)}
                        className="px-2 py-1 text-sm border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-1"
                        disabled={loading}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <button
                      onClick={updateTicketStatus}
                      disabled={isUpdating || selectedStatus === ticket.status}
                      className={`px-3 py-1 text-sm rounded-lg font-medium flex items-center justify-center gap-1 transition-all ${
                        selectedStatus === ticket.status
                          ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                          : "bg-emerald-600 text-white hover:bg-emerald-700 shadow"
                      }`}
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Check className="w-3 h-3" />
                          Update Status
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 p-6">
                <h2 className="text-lg font-black text-slate-900 mb-4">
                  Conversation
                </h2>
                <div className="space-y-4">
                  {ticket.replies.map((r) => (
                    <div
                      key={r.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                        <div className="font-bold">{r.authorName}</div>
                        <div>{new Date(r.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="text-slate-800">{r.message}</div>
                    </div>
                  ))}
                  {ticket.replies.length === 0 && (
                    <div className="text-sm text-slate-500">
                      No replies yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}