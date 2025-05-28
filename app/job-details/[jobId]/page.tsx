import JobDetailsPage from "@/app/job-details-page/page";
import React from "react";

type PageProps = {
  params: Promise<{ jobId: string }>;
};

export default async function JobDetailsPageWrapper({ params }: PageProps) {
  const resolvedParams = await params; // Await the params here
  return <JobDetailsPage jobId={resolvedParams.jobId} />;
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ jobId: string }> }) {
  const resolvedParams = await params;
  return {
    title: `Job Details - Construction Job ${resolvedParams.jobId}`,
    description: "View detailed information about this construction job opportunity",
  };
}

