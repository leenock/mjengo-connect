import { NextRequest } from "next/server";
import { forwardToBackend } from "@/app/api/_lib/backend";

interface Params {
  params: { jobId: string };
}

export async function DELETE(request: NextRequest, { params }: Params) {
  return forwardToBackend(request, `/api/fundi/saved-jobs/remove/${params.jobId}`, {
    method: "DELETE",
  });
}
