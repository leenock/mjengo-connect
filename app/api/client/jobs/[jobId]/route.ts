import { NextRequest } from "next/server";
import { forwardRequest, forwardToBackend } from "@/app/api/_lib/backend";

type RouteContext = {
  params: Promise<{ jobId?: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { jobId = "" } = await context.params;
  return forwardToBackend(request, `/api/client/jobs/${jobId}`);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { jobId = "" } = await context.params;
  return forwardRequest(request, `/api/client/jobs/${jobId}`);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { jobId = "" } = await context.params;
  return forwardRequest(request, `/api/client/jobs/${jobId}`);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { jobId = "" } = await context.params;
  return forwardRequest(request, `/api/client/jobs/${jobId}`);
}
