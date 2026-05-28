import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";
  const body = await request.text();
  const backendBaseUrl = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
    /\/$/,
    ""
  );

  const response = await fetch(`${backendBaseUrl}/api/fundi/loginFundi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  const nextResponse = NextResponse.json(payload, { status: response.status });
  const token = payload?.token;
  if (token && typeof token === "string") {
    nextResponse.cookies.set("fundiToken", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 2,
    });
  }
  return nextResponse;
}
