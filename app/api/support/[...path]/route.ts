import { NextRequest } from "next/server";
import { forwardRequest } from "@/app/api/_lib/backend";

interface Params {
  params: { path: string[] };
}

function toBackendPath(path: string[]) {
  return `/api/support/${path.join("/")}`;
}

export async function GET(request: NextRequest, { params }: Params) {
  return forwardRequest(request, toBackendPath(params.path));
}

export async function POST(request: NextRequest, { params }: Params) {
  return forwardRequest(request, toBackendPath(params.path));
}
