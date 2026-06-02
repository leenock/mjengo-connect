import { NextRequest } from "next/server";
import { forwardToBackend } from "@/app/api/_lib/backend";

type RouteContext = {
  params: Promise<{ userId?: string }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  const { userId = "" } = await context.params;
  const body = await request.json();
  return forwardToBackend(request, `/api/fundi/updateFundi/${userId}`, {
    method: "PUT",
    body,
  });
}
