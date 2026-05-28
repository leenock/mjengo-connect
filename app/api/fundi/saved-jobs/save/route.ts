import { NextRequest } from "next/server";
import { forwardToBackend } from "@/app/api/_lib/backend";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return forwardToBackend(request, "/api/fundi/saved-jobs/save", {
    method: "POST",
    body,
  });
}
