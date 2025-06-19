-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PREMIUM');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'EXPERIENCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'EXPIRED', 'CANCELLED');

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
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientPaymentLog" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
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
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "primary_skill" TEXT NOT NULL,
    "experience_level" "ExperienceLevel" NOT NULL,
    "biography" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriptionPlan" "Plan" NOT NULL DEFAULT 'FREE',
    "planStartDate" TIMESTAMP(3),
    "planEndDate" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'TRIAL',

    CONSTRAINT "Fundi_User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "fundiId" TEXT NOT NULL,
    "plan" "Plan" NOT NULL,
    "receipt" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
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

-- CreateIndex
CREATE UNIQUE INDEX "Client_User_email_key" ON "Client_User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_User_phone_key" ON "Client_User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "ClientPaymentLog_jobId_key" ON "ClientPaymentLog"("jobId");

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

-- AddForeignKey
ALTER TABLE "ClientPaymentLog" ADD CONSTRAINT "ClientPaymentLog_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientPaymentLog" ADD CONSTRAINT "ClientPaymentLog_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "Client_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_fundiId_fkey" FOREIGN KEY ("fundiId") REFERENCES "Fundi_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentLog" ADD CONSTRAINT "PaymentLog_fundiId_fkey" FOREIGN KEY ("fundiId") REFERENCES "Fundi_User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
