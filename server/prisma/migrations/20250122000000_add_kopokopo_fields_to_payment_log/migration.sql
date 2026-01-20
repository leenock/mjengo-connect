-- AlterTable
-- Make receipt optional for pending payments
ALTER TABLE "PaymentLog" ALTER COLUMN "receipt" DROP NOT NULL;

-- Add KopoKopo-specific fields
ALTER TABLE "PaymentLog" ADD COLUMN IF NOT EXISTS "paymentProvider" TEXT DEFAULT 'KOPOKOPO';
ALTER TABLE "PaymentLog" ADD COLUMN IF NOT EXISTS "kopokopoPaymentRequestId" TEXT;
ALTER TABLE "PaymentLog" ADD COLUMN IF NOT EXISTS "kopokopoPaymentRequestUrl" TEXT;
ALTER TABLE "PaymentLog" ADD COLUMN IF NOT EXISTS "kopokopoTillNumber" TEXT;
ALTER TABLE "PaymentLog" ADD COLUMN IF NOT EXISTS "kopokopoCallbackUrl" TEXT;
ALTER TABLE "PaymentLog" ADD COLUMN IF NOT EXISTS "kopokopoReference" TEXT;
ALTER TABLE "PaymentLog" ADD COLUMN IF NOT EXISTS "kopokopoMetadata" JSONB;
ALTER TABLE "PaymentLog" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "PaymentLog_kopokopoPaymentRequestId_key" ON "PaymentLog"("kopokopoPaymentRequestId");
CREATE INDEX IF NOT EXISTS "PaymentLog_kopokopoPaymentRequestId_idx" ON "PaymentLog"("kopokopoPaymentRequestId");
CREATE INDEX IF NOT EXISTS "PaymentLog_status_idx" ON "PaymentLog"("status");
