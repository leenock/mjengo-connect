import { NextRequest } from "next/server";
import { forwardToBackend } from "@/app/api/_lib/backend";

type RouteContext = {
  params: Promise<{ jobId?: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { jobId = "" } = await context.params;
  return forwardToBackend(request, `/api/client/jobs/${jobId}`);
}
