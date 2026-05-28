import { NextRequest } from "next/server";
import { forwardToBackend } from "@/app/api/_lib/backend";

interface Params {
  params: { requestId: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  return forwardToBackend(request, `/api/fundi/wallet/payment-status/${params.requestId}`);
}
