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
} from "lucide-react";
import Sidebar from "@/components/job_posting/Sidebar";

export default function AddFundsPage() {
  const [currentBalance, setCurrentBalance] = useState(10000); // Initial simulated balance
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<
    "success" | "error" | null
  >(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true); // New state for page loading
  const [showMpesaModal, setShowMpesaModal] = useState(false); // State for M-Pesa modal
  const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState(""); // State for M-Pesa phone number
  const [isStkPushProcessing, setIsStkPushProcessing] = useState(false); // State for STK push loading
  const [stkPushStatus, setStkPushStatus] = useState<
    "success" | "error" | null
  >(null); // State for STK push status
  const [isOpen, setIsOpen] = useState(false); // State for sidebar visibility

  useEffect(() => {
    // Simulate initial page data loading
    const loadPageData = async () => {
      setIsLoadingPage(true);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate a quick load
      // In a real app, you'd fetch the actual currentBalance here
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
      setShowMpesaModal(true);
      setMpesaPhoneNumber(""); // Clear phone number when opening modal
      setStkPushStatus(null); // Clear STK push status
    } else {
      // For Paystack or other direct methods
      setIsProcessing(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay
        console.log("Funds added:", { amount: parsedAmount, paymentMethod });
        setCurrentBalance((prevBalance) => prevBalance + parsedAmount); // Update balance
        setTransactionStatus("success");
        setAmount("");
        setPaymentMethod("");
      } catch (error) {
        console.error("Failed to add funds:", error);
        setTransactionStatus("error");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleMpesaStkPush = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsStkPushProcessing(true);
    setStkPushStatus(null);
    const parsedAmount = Number.parseFloat(amount);

    if (!mpesaPhoneNumber || !/^\+?\d{10,15}$/.test(mpesaPhoneNumber)) {
      setStkPushStatus("error");
      setIsStkPushProcessing(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate STK push delay
      console.log("STK Push initiated:", {
        amount: parsedAmount,
        mpesaPhoneNumber,
      });
      setCurrentBalance((prevBalance) => prevBalance + parsedAmount); // Update balance
      setStkPushStatus("success");
      setAmount("");
      setPaymentMethod("");
      setMpesaPhoneNumber("");
      setTimeout(() => setShowMpesaModal(false), 1500); // Close modal after success
    } catch (error) {
      console.error("STK Push failed:", error);
      setStkPushStatus("error");
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

      {/* M-Pesa STK Push Modal */}
      {showMpesaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/30 bg-white/90 p-6 shadow-2xl backdrop-blur-xl">
            <h3 className="mb-4 text-xl font-bold text-slate-900">
              Confirm M-Pesa Payment
            </h3>
            <p className="mb-4 text-slate-600">
              You are about to add{" "}
              <span className="font-bold text-blue-600">
                Ksh {Number.parseFloat(amount).toLocaleString()}
              </span>{" "}
              to your account. Please enter your M-Pesa registered mobile number
              to initiate the STK Push.
            </p>
            <form onSubmit={handleMpesaStkPush} className="space-y-4">
              <div className="grid gap-2">
                <label
                  htmlFor="mpesaPhoneNumber"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700"
                >
                  Mobile Number (e.g., +2547XXXXXXXX)
                </label>
                <input
                  id="mpesaPhoneNumber"
                  type="tel"
                  placeholder="+2547XXXXXXXX"
                  value={mpesaPhoneNumber}
                  onChange={(e) => setMpesaPhoneNumber(e.target.value)}
                  required
                  className="flex h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:border-slate-400 focus:shadow-md"
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMpesaModal(false)}
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
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                      Initiating STK...
                    </>
                  ) : (
                    "Confirm STK Push"
                  )}
                </button>
              </div>
              {stkPushStatus === "success" && (
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-green-800 font-medium border border-green-200">
                  <CheckCircle2 className="h-6 w-6 flex-shrink-0" />
                  <span>
                    STK Push initiated successfully! Check your phone.
                  </span>
                </div>
              )}
              {stkPushStatus === "error" && (
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-800 font-medium border border-red-200">
                  <XCircle className="h-6 w-6 flex-shrink-0" />
                  <span>
                    Failed to initiate STK Push. Please check the number.
                  </span>
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
              <span className="whitespace-nowrap">
                Balance: Ksh {currentBalance.toLocaleString()}
              </span>
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
                        <option value="M-Pesa">M-Pesa</option>
                        <option value="Paystack">Paystack</option>
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
