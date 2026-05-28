import { NextRequest } from "next/server";
import { forwardToBackend } from "@/app/api/_lib/backend";

interface Params {
  params: { userId: string };
}

export async function PUT(request: NextRequest, { params }: Params) {
  const body = await request.json();
  return forwardToBackend(request, `/api/fundi/updateFundi/${params.userId}`, {
    method: "PUT",
    body,
  });
}
