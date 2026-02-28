"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminAuthService from "@/app/services/admin_auth";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  DollarSign,
  Download,
  Menu,
  CheckCircle,
  UserCheck,
  Clock,
  AlertCircle,
  Wallet,
  Banknote,
} from "lucide-react";

interface PlatformStats {
  subscriptionRevenue: number;
  jobRevenue: number;
  fundiWalletBalance: number;
  clientWalletBalance: number;
  activeJobs: number;
  totalFundis: number;
  totalClients: number;
  totalJobs: number;
  closedJobs: number;
  pendingJobs: number;
}

interface JobCategory {
  name: string;
  jobs: number;
  revenue: string;
  growth: string;
}

interface RecentActivity {
  type: string;
  description: string;

  time: string;
  status: "success" | "info" | "warning";
}

interface Job {
  status?: string;
  title?: string;
  updatedAt?: string;
  createdAt?: string;
}

interface Fundi {
  firstName?: string;
  lastName?: string;
}

interface Client {
  firstName?: string;
  lastName?: string;
}

export default function AdminReports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState("30");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PlatformStats>({
    subscriptionRevenue: 0,
    jobRevenue: 0,
    fundiWalletBalance: 0,
    clientWalletBalance: 0,
    activeJobs: 0,
    totalFundis: 0,
    totalClients: 0,
    totalJobs: 0,
    closedJobs: 0,
    pendingJobs: 0,
  });
  const [topCategories, setTopCategories] = useState<JobCategory[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  // Close sidebar when clicking on overlay
  const closeSidebar = () => setSidebarOpen(false);

  // Fetch real data from APIs
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const authHeaders = AdminAuthService.getAuthHeaders();

        // Fetch all necessary data: dashboard stats (revenue, closed jobs) + fundis, clients, jobs
        const [dashboardResponse, fundisResponse, clientsResponse, jobsResponse] =
          await Promise.all([
            fetch("http://localhost:5000/api/admin/management/dashboard/stats", {
              headers: { ...authHeaders },
            }),
            fetch("http://localhost:5000/api/fundi/getAllFundis", {
              headers: { ...authHeaders },
            }),
            fetch("http://localhost:5000/api/client/getAllClientUsers", {
              headers: { ...authHeaders },
            }),
            fetch("http://localhost:5000/api/admin/jobs/jobs", {
              headers: { ...authHeaders },
            }),
          ]);

        const [dashboardData, fundisData, clientsData, jobsData] = await Promise.all([
          dashboardResponse.json(),
          fundisResponse.json(),
          clientsResponse.json(),
          jobsResponse.json(),
        ]);

        const dashboardStats = dashboardData?.stats || {};

        // Process fundis data
        const fundisList: Fundi[] = Array.isArray(fundisData)
          ? fundisData
          : fundisData?.fundis || fundisData?.data || [];

        // Process clients data
        const clientsList: Client[] = Array.isArray(clientsData)
          ? clientsData
          : clientsData?.clients || clientsData?.data || [];

        // Process jobs data
        const jobsList: Job[] = Array.isArray(jobsData)
          ? jobsData
          : jobsData?.jobs || jobsData?.data || [];

        const activeJobs = jobsList.filter(
          (job: Job) => job.status?.toUpperCase() === "ACTIVE"
        ).length;

        const pendingJobs = jobsList.filter(
          (job: Job) => job.status?.toUpperCase() === "PENDING"
        ).length;

        // Closed jobs: count only jobs with status CLOSED
        const closedJobs = jobsList.filter(
          (job: Job) => job.status?.toUpperCase() === "CLOSED"
        ).length;

        const num = (v: unknown) => {
          const n = Number(v);
          return typeof n === "number" && !Number.isNaN(n) ? n : 0;
        };

        setStats({
          subscriptionRevenue: num(dashboardStats.subscriptionRevenue),
          jobRevenue: num(dashboardStats.jobRevenue),
          fundiWalletBalance: num(dashboardStats.fundiWalletBalance),
          clientWalletBalance: num(dashboardStats.clientWalletBalance),
          closedJobs,
          activeJobs,
          totalFundis: fundisList.length,
          totalClients: clientsList.length,
          totalJobs: jobsList.length,
          pendingJobs,
        });


        // Generate recent activity from real data
        const activity: RecentActivity[] = [];

        // Add latest job completion if available
        const latestCompletedJob = jobsList
          .filter(
            (job: Job) =>
              job.status?.toUpperCase() === "COMPLETED" ||
              job.status?.toUpperCase() === "CLOSED"
          )
          .sort((a: Job, b: Job) => {
            const dateA = a.updatedAt || a.createdAt || "";
            const dateB = b.updatedAt || b.createdAt || "";
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          })[0];

        if (latestCompletedJob) {
          activity.push({
            type: "Job Completion",
            description: `Job "${latestCompletedJob.title || "Untitled"
              }" completed`,

            time: "2 hours ago",
            status: "success",
          });
        }

        // Add latest fundi registration
        const latestFundi = fundisList[fundisList.length - 1];
        if (latestFundi) {
          activity.push({
            type: "New Registration",
            description: `${latestFundi.firstName || ""} ${latestFundi.lastName || ""
              } joined as Fundi`,

            time: "4 hours ago",
            status: "info",
          });
        }

        // Add latest client registration
        const latestClient = clientsList[clientsList.length - 1];
        if (latestClient) {
          activity.push({
            type: "New Registration",
            description: `${latestClient.firstName || ""} ${latestClient.lastName || ""
              } joined as Client`,

            time: "6 hours ago",
            status: "info",
          });
        }

        // Add latest job posting
        const latestJob = jobsList[jobsList.length - 1];
        if (latestJob) {
          activity.push({
            type: "Job Posted",
            description: `New job "${latestJob.title || "Untitled"}" posted`,

            time: "8 hours ago",
            status: "info",
          });
        }

        setRecentActivity(activity);
      } catch (error) {
        console.error("Failed to fetch report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [dateRange]);

  const displayStats = [
    {
      title: "Subscription revenue",
      value: `KSh ${stats.subscriptionRevenue.toLocaleString()}`,
      change: "Premium plans",
      trend: "up" as const,
      icon: DollarSign,
      color: "text-violet-600",
      bgColor: "bg-gradient-to-r from-violet-50 to-violet-100",
      borderColor: "border-violet-200",
    },
    {
      title: "Job revenue",
      value: `KSh ${stats.jobRevenue.toLocaleString()}`,
      change: "Job payments",
      trend: "up" as const,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-r from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
    },
    {
      title: "Fundi wallet balance",
      value: `KSh ${stats.fundiWalletBalance.toLocaleString()}`,
      change: "Total in fundi wallets",
      trend: "up" as const,
      icon: Wallet,
      color: "text-cyan-600",
      bgColor: "bg-gradient-to-r from-cyan-50 to-cyan-100",
      borderColor: "border-cyan-200",
    },
    {
      title: "Client wallet balance",
      value: `KSh ${stats.clientWalletBalance.toLocaleString()}`,
      change: "Total in client wallets",
      trend: "up" as const,
      icon: Banknote,
      color: "text-sky-600",
      bgColor: "bg-gradient-to-r from-sky-50 to-sky-100",
      borderColor: "border-sky-200",
    },
    {
      title: "Total Clients",
      value: stats.totalClients.toString(),
      change: "Client accounts",
      trend: "up" as const,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-r from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
    },
    {
      title: "Jobs Closed",
      value: stats.closedJobs.toString(),
      change: "Closed listings",
      trend: "up" as const,
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-r from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
    },
    {
      title: "Active Jobs",
      value: stats.activeJobs.toString(),
      change: stats.activeJobs > 0 ? "Live" : "None",
      trend: (stats.activeJobs > 0 ? "up" : "down") as "up" | "down",
      icon: Building2,
      color: "text-amber-600",
      bgColor: "bg-gradient-to-r from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
    },
    {
      title: "Total Fundis",
      value: stats.totalFundis.toString(),
      change: "Fundi accounts",
      trend: "up" as const,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-gradient-to-r from-green-50 to-green-100",
      borderColor: "border-green-200",
    },
    {
      title: "Pending Jobs",
      value: stats.pendingJobs.toString(),
      change: stats.pendingJobs > 0 ? "Under review" : "None",
      trend: (stats.pendingJobs > 0 ? "up" : "down") as "up" | "down",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-gradient-to-r from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
    },
  ];

  const getStatusIcon = (status: "success" | "info" | "warning") => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case "info":
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:flex font-inter">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 lg:ml-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl mb-6 sm:mb-8 lg:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 rounded-xl sm:rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center justify-between sm:justify-start space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-white/60 transition-all duration-200 shadow-sm"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  Analytics & Reports
                </h1>
                <p className="text-slate-600 mt-1 text-sm sm:text-base lg:text-lg font-medium sm:font-bold">
                  {loading
                    ? "Loading platform insights..."
                    : "Platform insights and performance metrics"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 text-sm sm:text-base bg-white/70 border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium flex-1 sm:flex-none"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
                <option value="365">Last year</option>
              </select>
              <button className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg sm:rounded-xl font-bold hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg text-sm sm:text-base">
                <Download className="w-4 h-4" />
                <span className="hidden xs:inline">Export</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16 sm:py-20">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-slate-600"></div>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {/* Stats Grid - Responsive Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {displayStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.title}
                      className={`${stat.bgColor} rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border-2 ${stat.borderColor} p-4 sm:p-6 hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] min-h-[120px] sm:min-h-[140px] flex flex-col justify-between`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wider mb-1 sm:mb-2">
                            {stat.title}
                          </p>
                          <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight break-words">
                            {stat.value}
                          </p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/70 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-3 sm:ml-4 shadow-lg">
                          <Icon
                            className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ${stat.color}`}
                          />
                        </div>
                      </div>
                      <div className="flex items-center mt-2 sm:mt-4">
                        {stat.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mr-1 sm:mr-2" />
                        ) : (
                          <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-1 sm:mr-2" />
                        )}
                        <span
                          className={`text-xs sm:text-sm font-bold ${stat.trend === "up"
                            ? "text-emerald-600"
                            : "text-red-600"
                            }`}
                        >
                          {stat.change} from last period
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Revenue Chart */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/30 overflow-hidden">
                  <div className="p-4 sm:p-6 lg:p-8 border-b border-white/30 bg-gradient-to-r from-emerald-50 to-teal-50">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-1">
                      Revenue Trends
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base font-medium">
                      Subscription + job payments
                    </p>
                  </div>
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="h-48 sm:h-56 lg:h-64 bg-gradient-to-t from-emerald-50 to-white rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-400 mx-auto mb-3 sm:mb-4" />
                        <p className="text-slate-600 font-medium text-sm sm:text-base">
                          Subscription: KSh {stats.subscriptionRevenue.toLocaleString()}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2">
                          Jobs: KSh {stats.jobRevenue.toLocaleString()} • {stats.closedJobs} closed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Growth Chart */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/30 overflow-hidden">
                  <div className="p-4 sm:p-6 lg:p-8 border-b border-white/30 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-1">
                      User Growth
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base font-medium">
                      {stats.totalFundis} Fundis • {stats.totalClients} Clients
                    </p>
                  </div>
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="h-48 sm:h-56 lg:h-64 bg-gradient-to-t from-blue-50 to-white rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400 mx-auto mb-3 sm:mb-4" />
                        <p className="text-slate-600 font-medium text-sm sm:text-base">
                          Total Clients: {stats.totalClients}
                        </p>
                        <div className="flex justify-center gap-4 sm:gap-6 mt-3 sm:mt-4 text-xs sm:text-sm">
                          <span className="text-blue-600 font-medium">
                            {stats.totalFundis} Fundis
                          </span>
                          <span className="text-indigo-600 font-medium">
                            {stats.totalClients} Clients
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>



              {/* Recent Activity */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/30 overflow-hidden">
                <div className="p-4 sm:p-6 lg:p-8 border-b border-white/30 bg-gradient-to-r from-amber-50 to-orange-50">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 mb-1">
                    Recent Activity
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base font-medium sm:font-bold">
                    Latest platform transactions and events
                  </p>
                </div>
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="space-y-3 sm:space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-white/60 to-slate-50/60 rounded-xl sm:rounded-2xl hover:from-white/80 hover:to-slate-50/80 transition-all duration-300 border border-white/40"
                      >
                        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                          <div className="flex-shrink-0">
                            {getStatusIcon(activity.status)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                              {activity.type}
                            </h3>
                            <p className="text-slate-600 font-medium text-xs sm:text-sm truncate">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2 sm:ml-4">
                          <p className="font-bold text-slate-900 text-sm sm:text-base whitespace-nowrap">

                          </p>
                          <p className="text-xs text-slate-500 whitespace-nowrap">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
