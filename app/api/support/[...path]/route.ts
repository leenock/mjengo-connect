import { NextRequest } from "next/server";
import { forwardRequest } from "@/app/api/_lib/backend";

type RouteContext = {
  params: Promise<{ path?: string[] }>;
};

function toBackendPath(path: string[]) {
  return `/api/support/${path.join("/")}`;
}

async function resolvePath(context: RouteContext) {
  const resolved = await context.params;
  return Array.isArray(resolved?.path) ? resolved.path : [];
}

export async function GET(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, toBackendPath(await resolvePath(context)));
}

export async function POST(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, toBackendPath(await resolvePath(context)));
}
