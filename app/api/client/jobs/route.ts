import { NextRequest } from "next/server";
import { forwardRequest, forwardToBackend } from "@/app/api/_lib/backend";

export async function GET(request: NextRequest) {
  return forwardToBackend(request, "/api/client/jobs");
}

export async function POST(request: NextRequest) {
  return forwardRequest(request, "/api/client/jobs");
}
