import { NextRequest } from "next/server";
import { forwardToBackend } from "@/app/api/_lib/backend";

export async function POST(request: NextRequest) {
  const response = await forwardToBackend(request, "/api/fundi/logoutFundi", { method: "POST" });
  response.cookies.set("fundiToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });
  return response;
}
