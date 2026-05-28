import { NextRequest } from "next/server";
import { forwardToBackend } from "@/app/api/_lib/backend";

export async function GET(request: NextRequest) {
  return forwardToBackend(request, "/api/fundi/wallet/balance");
}
