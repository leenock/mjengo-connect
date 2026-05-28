import { NextRequest } from "next/server";
import { forwardToBackend } from "@/app/api/_lib/backend";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return forwardToBackend(request, "/api/fundi/wallet/add-funds/kopokopo", {
    method: "POST",
    body,
  });
}
