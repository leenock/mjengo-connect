-- CreateTable
CREATE TABLE "SavedJob" (
    "id" TEXT NOT NULL,
    "fundiId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedJob_fundiId_idx" ON "SavedJob"("fundiId");

-- CreateIndex
CREATE INDEX "SavedJob_jobId_idx" ON "SavedJob"("jobId");

-- CreateIndex
CREATE INDEX "SavedJob_savedAt_idx" ON "SavedJob"("savedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SavedJob_fundiId_jobId_key" ON "SavedJob"("fundiId", "jobId");

-- AddForeignKey
ALTER TABLE "SavedJob" ADD CONSTRAINT "SavedJob_fundiId_fkey" FOREIGN KEY ("fundiId") REFERENCES "Fundi_User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedJob" ADD CONSTRAINT "SavedJob_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
