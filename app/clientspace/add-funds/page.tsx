"use client";
import type React from "react";
import { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  DollarSign,
  Wallet,
  Loader2,
  Menu,
  User,
  Mail,
  Phone,
} from "lucide-react";
import Sidebar from "@/components/job_posting/Sidebar";
import ClientAuthService, {
  type ClientUserData,
} from "@/app/services/client_user";

export default function AddFundsPage() {
  const [currentBalance, setCurrentBalance] = useState(0); // Wallet balance in KES
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<
    "success" | "error" | null
  >(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true); // New state for page loading
  const [showMpesaModal, setShowMpesaModal] = useState(false); // State for M-Pesa modal
  const [currentUser, setCurrentUser] = useState<ClientUserData | null>(null);
  
  // KopoKopo STK Push form fields
  const [kopokopoData, setKopokopoData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });
  
  const [isStkPushProcessing, setIsStkPushProcessing] = useState(false); // State for STK push loading
  const [stkPushStatus, setStkPushStatus] = useState<
    "success" | "error" | null
  >(null); // State for STK push status
  const [stkPushError, setStkPushError] = useState<string>(""); // Detailed error message
  const [paymentRequestId, setPaymentRequestId] = useState<string>(""); // Store payment request ID
  const [paymentStatus, setPaymentStatus] = useState<string>(""); // Payment status from API
  const [paymentStatusDetails, setPaymentStatusDetails] = useState<any>(null); // Full status details
  const [isCheckingStatus, setIsCheckingStatus] = useState(false); // Status check loading
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false); // Balance refresh state
  const [isOpen, setIsOpen] = useState(false); // State for sidebar visibility

  // Function to fetch wallet balance from API
  const fetchWalletBalance = async () => {
    const token = ClientAuthService.getToken();
    if (!token) return;

    setIsRefreshingBalance(true);
    try {
      const response = await fetch("http://localhost:5000/api/client/wallet/balance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setCurrentBalance(data.data.balance || 0);
        }
      } else {
        console.error("Failed to fetch balance:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    } finally {
      setIsRefreshingBalance(false);
    }
  };

  // Function to check payment status
  const checkPaymentStatus = async () => {
    if (!paymentRequestId) return;

    setIsCheckingStatus(true);
    try {
      const token = ClientAuthService.getToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `http://localhost:5000/api/client/wallet/payment-status/${paymentRequestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check payment status");
      }

      const data = await response.json();
      if (data.success && data.data) {
        const status = data.data.data?.attributes?.status || "Unknown";
        setPaymentStatus(status);
        setPaymentStatusDetails(data.data);

        // If payment is successful, update balance from response or refresh
        if (status === "Success") {
          // Update balance from response if available
          if (data.wallet) {
            setCurrentBalance(data.wallet.balance || 0);
          }
          // Also refresh to ensure we have latest
          await fetchWalletBalance();
        }
      }
    } catch (error) {
      console.error("Failed to check payment status:", error);
      setPaymentStatus("Error checking status");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  useEffect(() => {
    // Load user data and page data
    const loadPageData = async () => {
      setIsLoadingPage(true);
      
      // Get user data from auth service
      const userData = ClientAuthService.getUserData();
      if (userData) {
        setCurrentUser(userData);
        // Pre-fill KopoKopo form with user data
        setKopokopoData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          phoneNumber: userData.phone || "",
          email: userData.email || "",
        });
      }
      
      // Fetch actual wallet balance from API
      await fetchWalletBalance();
      
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate a quick load
      setIsLoadingPage(false);
    };
    loadPageData();
  }, []);

  const handleAddFunds = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTransactionStatus(null); // Clear previous transaction status
    const parsedAmount = Number.parseFloat(amount);

    // Basic validation
    if (!amount || parsedAmount <= 0 || isNaN(parsedAmount)) {
      setTransactionStatus("error");
      return;
    }
    if (!paymentMethod) {
      setTransactionStatus("error");
      return;
    }

    if (paymentMethod === "M-Pesa") {
      // Open KopoKopo modal with pre-filled data
      setShowMpesaModal(true);
      setStkPushStatus(null); // Clear STK push status
      setStkPushError(""); // Clear error messages
    }
  };

  const handleMpesaStkPush = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsStkPushProcessing(true);
    setStkPushStatus(null);
    setStkPushError("");
    const parsedAmount = Number.parseFloat(amount);

    // Validation
    if (!kopokopoData.firstName?.trim()) {
      setStkPushStatus("error");
      setStkPushError("First name is required");
      setIsStkPushProcessing(false);
      return;
    }

    if (!kopokopoData.lastName?.trim()) {
      setStkPushStatus("error");
      setStkPushError("Last name is required");
      setIsStkPushProcessing(false);
      return;
    }

    if (!kopokopoData.phoneNumber || !/^\+?\d{10,15}$/.test(kopokopoData.phoneNumber)) {
      setStkPushStatus("error");
      setStkPushError("Please enter a valid phone number (e.g., +254712345678)");
      setIsStkPushProcessing(false);
      return;
    }

    // Format phone number to include country code if missing
    let formattedPhone = kopokopoData.phoneNumber.trim();
    if (!formattedPhone.startsWith("+")) {
      if (formattedPhone.startsWith("0")) {
        formattedPhone = "+254" + formattedPhone.substring(1);
      } else if (formattedPhone.startsWith("254")) {
        formattedPhone = "+" + formattedPhone;
      } else {
        formattedPhone = "+254" + formattedPhone;
      }
    }

    try {
      const token = ClientAuthService.getToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      // Prepare KopoKopo STK Push request payload
      const stkPushPayload = {
        paymentChannel: "M-PESA STK Push",
        amount: parsedAmount,
        currency: "KES",
        firstName: kopokopoData.firstName.trim(),
        lastName: kopokopoData.lastName.trim(),
        phoneNumber: formattedPhone,
        email: kopokopoData.email?.trim() || undefined, // Optional field
        metadata: {
          customerId: currentUser?.id || "",
          reference: `WALLET_TOPUP_${Date.now()}`,
          notes: `Wallet top-up of KES ${parsedAmount}`,
        },
      };

      // Make API call to backend
      const response = await fetch("http://localhost:5000/api/client/wallet/add-funds/kopokopo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(stkPushPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to initiate STK Push");
      }

      const data = await response.json();
      console.log("KopoKopo STK Push Response:", data);

      // Store payment request ID for status checking
      if (data.data?.paymentRequestId) {
        setPaymentRequestId(data.data.paymentRequestId);
      }

      // Success - STK Push initiated
      setStkPushStatus("success");
      // Note: Balance will be updated via webhook callback from KopoKopo
      // In sandbox, webhooks might not arrive, so we'll check payment status automatically
      
      // Automatically check payment status after a delay (for sandbox)
      setTimeout(async () => {
        if (paymentRequestId) {
          await checkPaymentStatus();
        }
      }, 5000); // Check after 5 seconds
      
      // Also set up periodic refresh to catch webhook updates
      const refreshInterval = setInterval(async () => {
        await fetchWalletBalance();
        // Also check payment status if we have a payment request ID
        if (paymentRequestId) {
          await checkPaymentStatus();
        }
      }, 10000); // Refresh every 10 seconds
      
      // Clear interval after 60 seconds (6 checks)
      setTimeout(() => {
        clearInterval(refreshInterval);
      }, 60000);
      
      // Reset form
      setTimeout(() => {
        setAmount("");
        setPaymentMethod("");
        // Don't close modal immediately - let user check status
      }, 2000);
    } catch (error) {
      console.error("STK Push failed:", error);
      setStkPushStatus("error");
      setStkPushError(
        error instanceof Error
          ? error.message
          : "Failed to initiate STK Push. Please try again."
      );
    } finally {
      setIsStkPushProcessing(false);
    }
  };

  if (isLoadingPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-slate-600">Loading page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-inter lg:flex">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* KopoKopo M-Pesa STK Push Modal */}
      {showMpesaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/30 bg-white/90 p-6 shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                Confirm M-Pesa Payment via KopoKopo
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                You are about to add{" "}
                <span className="font-bold text-blue-600">
                  Ksh {Number.parseFloat(amount).toLocaleString()}
                </span>{" "}
                to your wallet. Please fill in your details to initiate the STK
                Push.
              </p>
            </div>
            <form onSubmit={handleMpesaStkPush} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="grid gap-2">
                  <label
                    htmlFor="kopokopoFirstName"
                    className="text-sm font-medium leading-none text-slate-700"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      id="kopokopoFirstName"
                      type="text"
                      placeholder="John"
                      value={kopokopoData.firstName}
                      onChange={(e) =>
                        setKopokopoData({
                          ...kopokopoData,
                          firstName: e.target.value,
                        })
                      }
                      required
                      className="flex h-12 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-base ring-offset-background transition-all duration-200 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:border-slate-400 focus:shadow-md"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="grid gap-2">
                  <label
                    htmlFor="kopokopoLastName"
                    className="text-sm font-medium leading-none text-slate-700"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      id="kopokopoLastName"
                      type="text"
                      placeholder="Doe"
                      value={kopokopoData.lastName}
                      onChange={(e) =>
                        setKopokopoData({
                          ...kopokopoData,
                          lastName: e.target.value,
                        })
                      }
                      required
                      className="flex h-12 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-base ring-offset-background transition-all duration-200 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:border-slate-400 focus:shadow-md"
                    />
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div className="grid gap-2">
                <label
                  htmlFor="kopokopoPhoneNumber"
                  className="text-sm font-medium leading-none text-slate-700"
                >
                  M-Pesa Registered Phone Number{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    id="kopokopoPhoneNumber"
                    type="tel"
                    placeholder="+254712345678 or 0712345678"
                    value={kopokopoData.phoneNumber}
                    onChange={(e) =>
                      setKopokopoData({
                        ...kopokopoData,
                        phoneNumber: e.target.value,
                      })
                    }
                    required
                    className="flex h-12 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-base ring-offset-background transition-all duration-200 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:border-slate-400 focus:shadow-md"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Enter your M-Pesa registered phone number. Include country code
                  (e.g., +254) or start with 0.
                </p>
              </div>

              {/* Email (Optional) */}
              <div className="grid gap-2">
                <label
                  htmlFor="kopokopoEmail"
                  className="text-sm font-medium leading-none text-slate-700"
                >
                  Email Address <span className="text-slate-400">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="kopokopoEmail"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={kopokopoData.email}
                    onChange={(e) =>
                      setKopokopoData({
                        ...kopokopoData,
                        email: e.target.value,
                      })
                    }
                    className="flex h-12 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-base ring-offset-background transition-all duration-200 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:border-slate-400 focus:shadow-md"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowMpesaModal(false);
                    setStkPushStatus(null);
                    setStkPushError("");
                  }}
                  className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl text-base font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 h-12 px-6 py-3 shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl text-base font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 h-12 px-6 py-3 shadow-md hover:shadow-lg disabled:from-blue-400 disabled:to-indigo-500"
                  disabled={isStkPushProcessing}
                >
                  {isStkPushProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Initiating STK Push...
                    </>
                  ) : (
                    "Confirm & Initiate STK Push"
                  )}
                </button>
              </div>

              {/* Status Messages */}
              {stkPushStatus === "success" && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-3 rounded-xl bg-green-50 p-4 text-green-800 font-medium border border-green-200">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold">STK Push Initiated Successfully!</p>
                      <p className="text-sm font-normal mt-1">
                        <strong>Note:</strong> If you're using the sandbox environment, 
                        no actual STK push will appear on your phone. The payment is 
                        simulated and will be processed via webhook callback. In production, 
                        you will receive an M-Pesa prompt on your phone to enter your PIN.
                      </p>
                      {paymentRequestId && (
                        <p className="text-xs font-mono mt-2 text-green-700">
                          Payment ID: {paymentRequestId}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Check Payment Status Button */}
                  {paymentRequestId && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={checkPaymentStatus}
                          disabled={isCheckingStatus}
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 shadow-sm hover:shadow-md"
                        >
                          {isCheckingStatus ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Checking...
                            </>
                          ) : (
                            "Check Payment Status"
                          )}
                        </button>
                        {paymentStatus && (
                          <span className={`text-sm font-medium ${
                            paymentStatus === "Success" ? "text-green-700" : 
                            paymentStatus === "Failed" ? "text-red-700" : 
                            "text-blue-700"
                          }`}>
                            Status: {paymentStatus}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const token = ClientAuthService.getToken();
                            if (!token) return;
                            
                            const response = await fetch(
                              "http://localhost:5000/api/client/wallet/process-pending-payments",
                              {
                                method: "POST",
                                headers: { Authorization: `Bearer ${token}` },
                              }
                            );
                            
                            if (response.ok) {
                              const data = await response.json();
                              if (data.success) {
                                await fetchWalletBalance();
                                alert(`Processed ${data.data.updated || 0} pending payment(s)`);
                              }
                            }
                          } catch (error) {
                            console.error("Process pending payments error:", error);
                          }
                        }}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-600 text-white hover:bg-slate-700 h-8 px-3 shadow-sm hover:shadow-md"
                      >
                        Process Pending Payments (Sandbox)
                      </button>
                    </div>
                  )}

                  {/* Payment Status Details */}
                  {paymentStatusDetails && paymentStatus === "Success" && (
                    <div className="rounded-xl bg-blue-50 p-3 text-sm text-blue-800 border border-blue-200">
                      <p className="font-semibold">Payment Confirmed!</p>
                      <p className="mt-1">
                        Your wallet balance has been updated. The payment was processed successfully.
                      </p>
                    </div>
                  )}
                </div>
              )}
              {stkPushStatus === "error" && (
                <div className="mt-4 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-red-800 font-medium border border-red-200">
                  <XCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Failed to Initiate STK Push</p>
                    <p className="text-sm font-normal mt-1">
                      {stkPushError ||
                        "An error occurred. Please check your details and try again."}
                    </p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      <div className="flex-1 lg:ml-0">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="sticky top-0 z-30 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/20 bg-white/80 px-4 py-4 sm:px-6 sm:py-6 shadow-lg backdrop-blur-xl sm:mb-8 md:px-8 md:py-8">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 sm:p-3 text-slate-700 shadow-sm transition-all duration-200 hover:bg-white/60 rounded-xl lg:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <div>
                <h1 className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-lg font-black leading-tight text-transparent sm:text-xl md:text-2xl">
                  Add Funds
                </h1>
                <p className="mt-1 text-xs font-extrabold text-slate-600 sm:mt-2 sm:text-sm md:text-base">
                  Top up your account balance securely.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-normal gap-3 rounded-xl bg-gradient-to-r from-blue-500/15 to-indigo-500/15 px-3 py-2 sm:px-4 sm:py-2 text-blue-700 font-bold text-sm sm:text-base shadow-sm border border-blue-200/50 self-start sm:self-auto">
              <Wallet className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap">
                  Balance: Ksh {currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <button
                  onClick={fetchWalletBalance}
                  disabled={isRefreshingBalance}
                  className="p-1 hover:bg-blue-400/20 rounded transition-colors disabled:opacity-50"
                  title="Refresh balance"
                  aria-label="Refresh balance"
                >
                  <Loader2 className={`h-4 w-4 ${isRefreshingBalance ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex w-full flex-col items-center justify-center rounded-3xl border border-white/30 bg-white/70 p-8 shadow-2xl backdrop-blur-xl">
            <div className="w-full max-w-lg">
              <div className="space-y-1 pb-6 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-slate-900">
                  Add Prepaid Funds
                </h2>
                <p className="text-sm text-slate-600">
                  Enter the amount and select your preferred payment method.
                </p>
              </div>

              <div className="grid gap-6">
                <form onSubmit={handleAddFunds} className="space-y-5">
                  <div className="grid gap-2">
                    <label
                      htmlFor="amount"
                      className="text-sm font-semibold leading-none text-slate-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Amount (Ksh)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500">
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <input
                        id="amount"
                        type="number"
                        placeholder="e.g., 5000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="1"
                        className="flex h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 py-3 text-base ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:border-slate-400 focus:shadow-md"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label
                      htmlFor="paymentMethod"
                      className="text-sm font-semibold leading-none text-slate-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Payment Method
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500">
                        <Wallet className="h-5 w-5" />
                      </div>
                      <select
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                        className="flex h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 py-3 text-base ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:border-slate-400 focus:shadow-md appearance-none"
                      >
                        <option value="" disabled>
                          Select a method
                        </option>
                        <option value="M-Pesa">M-Pesa (via KopoKopo)</option>
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg
                          className="h-5 w-5 text-slate-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex h-12 w-full items-center justify-center whitespace-nowrap rounded-xl text-base font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-lg disabled:from-blue-400 disabled:to-indigo-500 mt-2 py-3 px-6"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                        Processing...
                      </span>
                    ) : (
                      "Add Funds"
                    )}
                  </button>
                </form>

                {transactionStatus === "success" && (
                  <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4 text-green-800 font-medium border border-green-200">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0" />
                    <span>
                      Funds added successfully! Your balance will be updated
                      shortly.
                    </span>
                  </div>
                )}
                {transactionStatus === "error" && (
                  <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-800 font-medium border border-red-200">
                    <XCircle className="h-6 w-6 flex-shrink-0" />
                    <span>
                      Failed to add funds. Please check your input and try
                      again.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
