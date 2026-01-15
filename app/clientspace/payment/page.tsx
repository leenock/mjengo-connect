"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/job_posting/Sidebar";
import ClientAuthService, {
  type ClientUserData,
} from "@/app/services/client_user";
import Toast from "@/components/ui/Toast";
import {
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Briefcase,
  Menu,
  AlertCircle,
  CheckCircle,
  XCircle,
  CreditCard,
  Phone,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from "lucide-react";

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
  isUrgent: boolean;
  isPaid: boolean;
  status: "PENDING" | "ACTIVE" | "CLOSED" | "EXPIRED";
  timePosted: string;
  clickCount: number;
  postedBy: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    company: string;
  };
}

export default function PaymentsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<ClientUserData | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "loading";
  } | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedJobForPayment, setSelectedJobForPayment] =
    useState<Job | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3; // Show 3 jobs per page

  const router = useRouter();

  const fetchMyJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = ClientAuthService.getToken();
      if (!token) {
        throw new Error("Authentication required");
      }
      const response = await fetch("http://localhost:5000/api/client/my-jobs", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setToast({
        message: "Failed to load your jobs. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchWalletBalance = useCallback(async () => {
    try {
      setIsLoadingBalance(true);
      const token = ClientAuthService.getToken();
      if (!token) {
        return;
      }
      const response = await fetch("http://localhost:5000/api/client/wallet/balance", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch wallet balance");
      }
      const data = await response.json();
      if (data.success && data.data) {
        setWalletBalance(data.data.balance || 0);
      } else {
        setWalletBalance(0);
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    } finally {
      setIsLoadingBalance(false);
    }
  }, []);

  useEffect(() => {
    const userData = ClientAuthService.getUserData();
    if (userData) {
      setCurrentUser(userData);
      fetchMyJobs();
      fetchWalletBalance();
    } else {
      router.push("/auth/job-posting");
    }
  }, [router, fetchMyJobs, fetchWalletBalance]);

  const handleOpenPaymentModal = (job: Job) => {
    // Check if job is already paid
    if (job.isPaid) {
      setToast({
        message: "This job has already been paid for.",
        type: "error",
      });
      return;
    }

    // Check wallet balance
    const paymentAmount = 300;
    if (walletBalance < paymentAmount) {
      setToast({
        message: `Insufficient balance. You need Ksh ${paymentAmount.toFixed(2)} but have Ksh ${walletBalance.toFixed(2)}. Please add funds to your wallet.`,
        type: "error",
      });
      // Redirect to add funds page after a short delay
      setTimeout(() => {
        router.push("/clientspace/add-funds");
      }, 2000);
      return;
    }

    setSelectedJobForPayment(job);
    setShowPaymentModal(true);
  };

  const handleProcessPayment = async () => {
    if (!selectedJobForPayment) {
      return;
    }

    const paymentAmount = 300;

    // Double-check balance before processing
    if (walletBalance < paymentAmount) {
      setToast({
        message: `Insufficient balance. You need Ksh ${paymentAmount.toFixed(2)} but have Ksh ${walletBalance.toFixed(2)}. Please add funds to your wallet.`,
        type: "error",
      });
      setShowPaymentModal(false);
      setTimeout(() => {
        router.push("/clientspace/add-funds");
      }, 2000);
      return;
    }

    setIsProcessingPayment(true);
    setToast({
      message: `Processing payment for ${selectedJobForPayment.title}...`,
      type: "loading",
    });

    try {
      const token = ClientAuthService.getToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `http://localhost:5000/api/client/jobs/${selectedJobForPayment.id}/pay`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: paymentAmount,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment failed");
      }

      setToast({
        message: `Payment successful! ${selectedJobForPayment.title} is now published.`,
        type: "success",
      });

      // Refresh jobs and wallet balance
      await fetchMyJobs();
      await fetchWalletBalance();

      // Close modal after a short delay
      setTimeout(() => {
        setShowPaymentModal(false);
        setSelectedJobForPayment(null);
      }, 1500);
    } catch (error: any) {
      console.error("Payment error:", error);
      setToast({
        message: error.message || "Failed to process payment. Please try again.",
        type: "error",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 text-xs font-bold rounded-full flex items-center gap-1 border border-yellow-200">
            <AlertCircle className="w-3 h-3" /> Pending Review
          </span>
        );
      case "ACTIVE":
        return (
          <span className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1 border border-emerald-200">
            <CheckCircle className="w-3 h-3" /> Active
          </span>
        );
      case "CLOSED":
        return (
          <span className="px-3 py-1 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 text-xs font-bold rounded-full flex items-center gap-1 border border-gray-200">
            <XCircle className="w-3 h-3" /> Closed
          </span>
        );
      case "EXPIRED":
        return (
          <span className="px-3 py-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1 border border-red-200">
            <XCircle className="w-3 h-3" /> Expired
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const activeJobs = jobs.filter((job) => job.status === "ACTIVE"); // ← add this line here

  // Pagination calculations
  // Pagination calculations
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = activeJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(activeJobs.length / jobsPerPage);

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading payment options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:flex font-inter">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl p-6 bg-white/90 backdrop-blur-xl shadow-2xl border border-white/30">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-slate-900">
                Make Payment
              </h2>
              <p className="text-slate-600 text-sm">
                Confirm details for payment for the ad:{" "}
                <span className="font-semibold text-slate-800">
                  {selectedJobForPayment?.title}
                </span>
              </p>
            </div>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-700 font-medium">Job Title:</span>
                <span className="font-bold text-slate-900 truncate max-w-[180px]">
                  {selectedJobForPayment?.title}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-700 font-medium">Category:</span>
                <span className="font-bold text-slate-900">
                  {selectedJobForPayment?.category}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-slate-700 font-medium">Amount Due:</span>
                <span className="font-bold text-emerald-600 text-lg">
                  Ksh 300
                </span>
              </div>

              {/* Wallet Balance Display */}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-slate-700 font-medium">Your Wallet Balance:</span>
                <span className={`font-bold text-lg ${walletBalance >= 300 ? 'text-emerald-600' : 'text-red-600'}`}>
                  Ksh {walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Insufficient Balance Warning */}
              {walletBalance < 300 && (
                <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4 text-red-800 font-medium border border-red-200">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Insufficient Balance</p>
                    <p className="text-sm font-normal mt-1">
                      You need Ksh 300.00 to publish this job, but your current balance is Ksh {walletBalance.toFixed(2)}.
                    </p>
                    <button
                      onClick={() => {
                        setShowPaymentModal(false);
                        router.push("/clientspace/add-funds");
                      }}
                      className="mt-2 inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 h-9 px-4 shadow-sm hover:shadow-md transition-all"
                    >
                      Add Funds to Wallet
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Info */}
              <div className="text-xs text-slate-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="font-semibold text-slate-700 mb-1">Payment Information:</p>
                <p>• Payment will be deducted from your wallet balance</p>
                <p>• Once paid, your job will be published and appear in job listings</p>
                <p>• If your balance is insufficient, please add funds first</p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl text-base font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 h-12 px-6 py-3 shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessPayment}
                disabled={isProcessingPayment || walletBalance < 300}
                className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl text-base font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-700 hover:to-teal-800 h-12 px-6 py-3 shadow-md hover:shadow-lg disabled:from-emerald-400 disabled:to-teal-500"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" /> Confirm Payment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 lg:ml-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6 py-4 sm:py-6 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 sm:p-3 rounded-xl text-slate-700 hover:bg-white/60 transition-all duration-200 shadow-sm"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  Welcome{" "}
                  {currentUser?.firstName && currentUser?.lastName
                    ? `${currentUser.firstName} ${currentUser.lastName}`
                    : "User"}
                </h1>
                <p className="text-slate-600 mt-1 text-sm sm:text-base font-extrabold">
                  Manage payments for your job postings
                </p>
              </div>
            </div>
            {/* Wallet Balance */}
            <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-500/15 to-indigo-500/15 px-3 py-2 sm:px-4 sm:py-2 text-blue-700 font-bold text-sm sm:text-base shadow-sm border border-blue-200/50">
              <Wallet className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="whitespace-nowrap">
                Balance: Ksh {isLoadingBalance ? "..." : walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <button
                onClick={fetchWalletBalance}
                disabled={isLoadingBalance}
                className="p-1 hover:bg-blue-400/20 rounded transition-colors disabled:opacity-50"
                title="Refresh balance"
                aria-label="Refresh balance"
              >
                <Loader2 className={`h-4 w-4 ${isLoadingBalance ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Job Listings for Payment */}
          <div className="space-y-5">
            {activeJobs.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 sm:p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  No Active Jobs
                </h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  You currently have no active jobs that require payment.
                </p>
                <button
                  onClick={() => router.push("/clientspace/newJob")}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white hover:from-orange-600 hover:via-pink-600 hover:to-red-600 h-12 px-6 py-3 shadow-md hover:shadow-lg"
                >
                  Post a New Job
                </button>
              </div>
            ) : (
              <>
                {/* Jobs List */}
                <div className="space-y-4 sm:space-y-5">
                  {currentJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-white/30 p-5 sm:p-6 hover:shadow-2xl transition-all duration-300 group"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                                  {job.title}
                                </h3>
                                {getStatusBadge(job.status)}
                                {/* Show “Make Payment to Publish” if active but not paid */}
                                {job.status === "ACTIVE" && !job.isPaid && (
                                  <span className="px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 text-xs font-bold rounded-full flex items-center gap-1 border border-amber-200">
                                    <CreditCard className="w-3 h-3" /> Make
                                    Payment to Publish
                                  </span>
                                )}
                                {job.isUrgent && (
                                  <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full">
                                    Urgent
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-600 font-bold text-base mb-3">
                                {job.companyName}
                              </p>
                              <p className="text-slate-600 font-medium text-sm mb-4 leading-relaxed line-clamp-2">
                                {job.Jobdescription}
                              </p>
                            </div>
                          </div>

                          {/* Job Details Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                            <div className="flex items-center text-sm font-bold text-slate-600 p-3 bg-slate-50 rounded-lg">
                              <MapPin className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{job.location}</span>
                            </div>
                            <div className="flex items-center text-sm font-bold p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                              <DollarSign className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0" />
                              <span className="text-emerald-600 font-black truncate">
                                {job.salary}
                              </span>
                            </div>
                            <div className="flex items-center text-sm font-bold text-slate-600 p-3 bg-slate-50 rounded-lg">
                              <Clock className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{job.duration}</span>
                            </div>
                            <div className="flex items-center text-sm font-bold text-slate-600 p-3 bg-slate-50 rounded-lg">
                              <Calendar className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
                              <span className="truncate">
                                {formatDate(job.timePosted)}
                              </span>
                            </div>
                          </div>

                          {/* Requirements */}
                          <div className="mb-5">
                            <div className="flex flex-wrap gap-2">
                              {job.SkillsAndrequirements.split(",")
                                .slice(0, 3)
                                .map((skill, skillIndex) => (
                                  <span
                                    key={skillIndex}
                                    className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 text-xs font-bold rounded-lg"
                                  >
                                    {skill.trim()}
                                  </span>
                                ))}
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleOpenPaymentModal(job)}
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-700 hover:to-teal-800 h-12 px-6 py-3 shadow-md hover:shadow-lg"
                            >
                              <CreditCard className="mr-2 h-5 w-5" />
                              Make Payment
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm ${
                        currentPage === 1
                          ? "text-slate-400 cursor-not-allowed"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-600">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>

                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm ${
                        currentPage === totalPages
                          ? "text-slate-400 cursor-not-allowed"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
