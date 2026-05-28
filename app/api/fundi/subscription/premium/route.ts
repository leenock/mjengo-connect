import { NextRequest } from "next/server";
import { forwardToBackend } from "@/app/api/_lib/backend";

export async function POST(request: NextRequest) {
  return forwardToBackend(request, "/api/fundi/subscription/premium", { method: "POST" });
}
