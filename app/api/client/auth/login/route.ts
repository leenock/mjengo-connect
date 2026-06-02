import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";
  const body = await request.text();
  const fallback = isProduction
    ? "https://mjengoconnect.site"
    : "http://localhost:5000";
  const backendBaseUrl = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || fallback).replace(
    /\/$/,
    ""
  );

  const response = await fetch(`${backendBaseUrl}/api/client/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  const token = payload?.accessToken || payload?.token;
  const safePayload = { ...(payload || {}) };
  delete safePayload.accessToken;
  delete safePayload.token;
  const nextResponse = NextResponse.json(safePayload, { status: response.status });
  if (token && typeof token === "string") {
    nextResponse.cookies.set("visitorToken", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 2,
    });
  }
  return nextResponse;
}
