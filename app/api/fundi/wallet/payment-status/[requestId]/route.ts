import { NextRequest } from "next/server";
import { forwardToBackend } from "@/app/api/_lib/backend";

type RouteContext = {
  params: Promise<{ requestId?: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { requestId = "" } = await context.params;
  return forwardToBackend(request, `/api/fundi/wallet/payment-status/${requestId}`);
}
