-- CreateTable
CREATE TABLE "FundiWallet" (
    "id" TEXT NOT NULL,
    "fundiId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FundiWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundiWalletTransaction" (
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

    CONSTRAINT "FundiWalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FundiWallet_fundiId_key" ON "FundiWallet"("fundiId");

-- CreateIndex
CREATE UNIQUE INDEX "FundiWalletTransaction_reference_key" ON "FundiWalletTransaction"("reference");

-- CreateIndex
CREATE INDEX "FundiWalletTransaction_walletId_idx" ON "FundiWalletTransaction"("walletId");

-- CreateIndex
CREATE INDEX "FundiWalletTransaction_paymentLogId_idx" ON "FundiWalletTransaction"("paymentLogId");

-- AddForeignKey
ALTER TABLE "FundiWallet" ADD CONSTRAINT "FundiWallet_fundiId_fkey" FOREIGN KEY ("fundiId") REFERENCES "Fundi_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundiWalletTransaction" ADD CONSTRAINT "FundiWalletTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "FundiWallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundiWalletTransaction" ADD CONSTRAINT "FundiWalletTransaction_paymentLogId_fkey" FOREIGN KEY ("paymentLogId") REFERENCES "PaymentLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
