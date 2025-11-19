-- CreateEnum
CREATE TYPE "WalletTransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'REFUND', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "LogLevel" AS ENUM ('ERROR', 'WARNING', 'INFO', 'SUCCESS');

-- CreateEnum
CREATE TYPE "LogCategory" AS ENUM ('AUTHENTICATION', 'USER_ACTIVITY', 'JOB_MANAGEMENT', 'PAYMENT', 'DATABASE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "PriorityLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "SupportCategory" AS ENUM ('PAYMENT_ISSUES', 'ACCOUNT_VERIFICATION', 'HARASSMENT_REPORT', 'GENERAL_INQUIRY', 'OTHER');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'CLIENT', 'FUNDI');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PREMIUM');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'EXPERIENCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'EXPIRED', 'CANCELLED', 'PENDING');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'ACTIVE', 'CLOSED', 'REJECTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "Client_User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "company" TEXT,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "accountStatus" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientWallet" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientWalletTransaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "type" "WalletTransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "phone" TEXT,
    "reference" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "rawPayload" JSONB,
    "paymentLogId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientWalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientPaymentLog" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "jobId" TEXT,
    "phone" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "receipt" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "rawPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientPaymentLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "salary" TEXT NOT NULL,
    "Jobdescription" TEXT NOT NULL,
    "SkillsAndrequirements" TEXT NOT NULL,
    "responsibilities" TEXT NOT NULL,
    "benefits" TEXT,
    "companyName" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "preferredContact" TEXT NOT NULL,
    "timePosted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "postedById" TEXT NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fundi_User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "primary_skill" TEXT NOT NULL,
    "experience_level" "ExperienceLevel" NOT NULL,
    "biography" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountStatus" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "subscriptionPlan" "Plan" NOT NULL DEFAULT 'FREE',
    "planStartDate" TIMESTAMP(3),
    "planEndDate" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'TRIAL',

    CONSTRAINT "Fundi_User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedJob" (
    "id" TEXT NOT NULL,
    "fundiId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "fundiId" TEXT NOT NULL,
    "plan" "Plan" NOT NULL,
    "receipt" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'PENDING',
    "mpesaCheckoutRequestId" TEXT,
    "mpesaMerchantRequestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentLog" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "receipt" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "fundiId" TEXT,
    "rawPayload" JSONB,
    "checkoutRequestId" TEXT,
    "merchantRequestId" TEXT,
    "resultCode" INTEGER,
    "resultDesc" TEXT,
    "transactionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "password" TEXT NOT NULL,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemLog" (
    "id" TEXT NOT NULL,
    "level" "LogLevel" NOT NULL,
    "category" "LogCategory" NOT NULL,
    "message" TEXT NOT NULL,
    "details" TEXT,
    "ipAddress" TEXT,
    "source" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminId" TEXT,
    "clientId" TEXT,
    "fundiId" TEXT,

    CONSTRAINT "SystemLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobReport" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "PriorityLevel" NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "reporterId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "category" "SupportCategory" NOT NULL,
    "priority" "PriorityLevel" NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "fundiId" TEXT,
    "clientId" TEXT,
    "assignedToId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportReply" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "authorType" "UserType" NOT NULL,
    "authorName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_User_email_key" ON "Client_User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_User_phone_key" ON "Client_User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "ClientWallet_clientId_key" ON "ClientWallet"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientWalletTransaction_reference_key" ON "ClientWalletTransaction"("reference");

-- CreateIndex
CREATE INDEX "ClientWalletTransaction_walletId_idx" ON "ClientWalletTransaction"("walletId");

-- CreateIndex
CREATE INDEX "ClientWalletTransaction_paymentLogId_idx" ON "ClientWalletTransaction"("paymentLogId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientPaymentLog_receipt_key" ON "ClientPaymentLog"("receipt");

-- CreateIndex
CREATE INDEX "ClientPaymentLog_clientId_idx" ON "ClientPaymentLog"("clientId");

-- CreateIndex
CREATE INDEX "ClientPaymentLog_jobId_idx" ON "ClientPaymentLog"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "Fundi_User_email_key" ON "Fundi_User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Fundi_User_phone_key" ON "Fundi_User"("phone");

-- CreateIndex
CREATE INDEX "SavedJob_fundiId_idx" ON "SavedJob"("fundiId");

-- CreateIndex
CREATE INDEX "SavedJob_jobId_idx" ON "SavedJob"("jobId");

-- CreateIndex
CREATE INDEX "SavedJob_savedAt_idx" ON "SavedJob"("savedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SavedJob_fundiId_jobId_key" ON "SavedJob"("fundiId", "jobId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_receipt_key" ON "Subscription"("receipt");

-- CreateIndex
CREATE INDEX "Subscription_fundiId_idx" ON "Subscription"("fundiId");

-- CreateIndex
CREATE INDEX "Subscription_receipt_idx" ON "Subscription"("receipt");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentLog_receipt_key" ON "PaymentLog"("receipt");

-- CreateIndex
CREATE INDEX "PaymentLog_fundiId_idx" ON "PaymentLog"("fundiId");

-- CreateIndex
CREATE INDEX "PaymentLog_receipt_idx" ON "PaymentLog"("receipt");

-- CreateIndex
CREATE INDEX "PaymentLog_createdAt_idx" ON "PaymentLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "SystemLog_adminId_idx" ON "SystemLog"("adminId");

-- CreateIndex
CREATE INDEX "SystemLog_clientId_idx" ON "SystemLog"("clientId");

-- CreateIndex
CREATE INDEX "SystemLog_fundiId_idx" ON "SystemLog"("fundiId");

-- CreateIndex
CREATE INDEX "JobReport_reporterId_idx" ON "JobReport"("reporterId");

-- CreateIndex
CREATE INDEX "JobReport_jobId_idx" ON "JobReport"("jobId");

-- CreateIndex
CREATE INDEX "SupportTicket_fundiId_idx" ON "SupportTicket"("fundiId");

-- CreateIndex
CREATE INDEX "SupportTicket_clientId_idx" ON "SupportTicket"("clientId");

-- CreateIndex
CREATE INDEX "SupportTicket_assignedToId_idx" ON "SupportTicket"("assignedToId");

-- CreateIndex
CREATE INDEX "SupportReply_ticketId_idx" ON "SupportReply"("ticketId");

-- AddForeignKey
ALTER TABLE "ClientWallet" ADD CONSTRAINT "ClientWallet_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientWalletTransaction" ADD CONSTRAINT "ClientWalletTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "ClientWallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientWalletTransaction" ADD CONSTRAINT "ClientWalletTransaction_paymentLogId_fkey" FOREIGN KEY ("paymentLogId") REFERENCES "ClientPaymentLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientPaymentLog" ADD CONSTRAINT "ClientPaymentLog_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientPaymentLog" ADD CONSTRAINT "ClientPaymentLog_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "Client_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedJob" ADD CONSTRAINT "SavedJob_fundiId_fkey" FOREIGN KEY ("fundiId") REFERENCES "Fundi_User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedJob" ADD CONSTRAINT "SavedJob_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_fundiId_fkey" FOREIGN KEY ("fundiId") REFERENCES "Fundi_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentLog" ADD CONSTRAINT "PaymentLog_fundiId_fkey" FOREIGN KEY ("fundiId") REFERENCES "Fundi_User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemLog" ADD CONSTRAINT "SystemLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemLog" ADD CONSTRAINT "SystemLog_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client_User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemLog" ADD CONSTRAINT "SystemLog_fundiId_fkey" FOREIGN KEY ("fundiId") REFERENCES "Fundi_User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobReport" ADD CONSTRAINT "JobReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "Fundi_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobReport" ADD CONSTRAINT "JobReport_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_fundiId_fkey" FOREIGN KEY ("fundiId") REFERENCES "Fundi_User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client_User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportReply" ADD CONSTRAINT "SupportReply_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "SupportTicket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
