import { NextRequest } from "next/server";
import { forwardToBackend } from "@/app/api/_lib/backend";

type RouteContext = {
  params: Promise<{ fundiId?: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { fundiId = "" } = await context.params;
  return forwardToBackend(request, `/api/fundi/tickets/getFundiTickets/${fundiId}`);
}
