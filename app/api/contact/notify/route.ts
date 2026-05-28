import { NextRequest } from "next/server";
import { forwardRequest } from "@/app/api/_lib/backend";

export async function POST(request: NextRequest) {
  return forwardRequest(request, "/api/contact/notify");
}
