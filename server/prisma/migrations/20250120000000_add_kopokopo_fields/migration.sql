-- AlterTable: Add KopoKopo fields to ClientPaymentLog
-- Add all new columns
ALTER TABLE "ClientPaymentLog" ADD COLUMN "paymentProvider" TEXT DEFAULT 'KOPOKOPO';
ALTER TABLE "ClientPaymentLog" ADD COLUMN "kopokopoPaymentRequestId" TEXT;
ALTER TABLE "ClientPaymentLog" ADD COLUMN "kopokopoPaymentRequestUrl" TEXT;
ALTER TABLE "ClientPaymentLog" ADD COLUMN "kopokopoTillNumber" TEXT;
ALTER TABLE "ClientPaymentLog" ADD COLUMN "kopokopoCallbackUrl" TEXT;
ALTER TABLE "ClientPaymentLog" ADD COLUMN "kopokopoReference" TEXT;
ALTER TABLE "ClientPaymentLog" ADD COLUMN "kopokopoMetadata" JSONB;

-- Add updatedAt column as nullable first (to allow setting values for existing rows)
ALTER TABLE "ClientPaymentLog" ADD COLUMN "updatedAt" TIMESTAMP(3);

-- Update existing rows: set updatedAt to createdAt for existing records
UPDATE "ClientPaymentLog" SET "updatedAt" = "createdAt";

-- Now make updatedAt NOT NULL with default for future rows
ALTER TABLE "ClientPaymentLog" ALTER COLUMN "updatedAt" SET NOT NULL;
ALTER TABLE "ClientPaymentLog" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- Make receipt nullable (for pending payments that don't have a receipt yet)
ALTER TABLE "ClientPaymentLog" ALTER COLUMN "receipt" DROP NOT NULL;

-- Create unique index on kopokopoPaymentRequestId (only for non-null values)
CREATE UNIQUE INDEX "ClientPaymentLog_kopokopoPaymentRequestId_key" 
ON "ClientPaymentLog"("kopokopoPaymentRequestId") 
WHERE "kopokopoPaymentRequestId" IS NOT NULL;

-- Create indexes for better query performance
CREATE INDEX "ClientPaymentLog_kopokopoPaymentRequestId_idx" ON "ClientPaymentLog"("kopokopoPaymentRequestId");
CREATE INDEX "ClientPaymentLog_status_idx" ON "ClientPaymentLog"("status");
