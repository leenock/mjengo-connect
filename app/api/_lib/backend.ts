import { NextRequest, NextResponse } from "next/server";

const backendBaseUrl = (() => {
  const fallback =
    process.env.NODE_ENV === "production"
      ? "https://mjengoconnect.site"
      : "http://localhost:5000";
  const value = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || fallback;
  return value.replace(/\/$/, "");
})();

interface ForwardOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
}

function isAdminScopedNonAdminPath(backendPath: string) {
  const adminClientPrefixes = [
    "/api/client/getAllClientUsers",
    "/api/client/deleteClientUser/",
    "/api/client/updateClientUser/",
  ];
  const adminFundiPrefixes = [
    "/api/fundi/getAllFundis",
    "/api/fundi/admin/",
  ];

  return (
    adminClientPrefixes.some((prefix) => backendPath.startsWith(prefix)) ||
    adminFundiPrefixes.some((prefix) => backendPath.startsWith(prefix))
  );
}

function resolveAuthHeader(request: NextRequest, backendPath: string) {
  const explicit = request.headers.get("authorization");
  if (explicit) return explicit;

  const adminToken = request.cookies.get("adminToken")?.value;
  const fundiToken = request.cookies.get("fundiToken")?.value;
  const visitorToken = request.cookies.get("visitorToken")?.value;
  let token: string | undefined;

  if (adminToken && (backendPath.startsWith("/api/admin/") || isAdminScopedNonAdminPath(backendPath))) {
    token = adminToken;
  }
  else if (backendPath.startsWith("/api/admin/")) token = adminToken;
  else if (backendPath.startsWith("/api/fundi/")) token = fundiToken;
  else if (backendPath.startsWith("/api/client/")) token = visitorToken;
  else token = adminToken || fundiToken || visitorToken;

  return token ? `Bearer ${token}` : null;
}

function buildBackendUrl(path: string, search: string) {
  return `${backendBaseUrl}${path}${search}`;
}

export async function forwardToBackend(
  request: NextRequest,
  backendPath: string,
  options: ForwardOptions = {}
) {
  const authorization = resolveAuthHeader(request, backendPath);
  const response = await fetch(buildBackendUrl(backendPath, request.nextUrl.search), {
    method: options.method || "GET",
    headers: {
      ...(authorization ? { Authorization: authorization } : {}),
      ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
    cache: "no-store",
  });

  const text = await response.text();
  const contentType = response.headers.get("content-type") || "";

  if (!text) {
    return NextResponse.json({}, { status: response.status });
  }

  if (contentType.includes("application/json")) {
    return NextResponse.json(JSON.parse(text), { status: response.status });
  }

  return new NextResponse(text, { status: response.status });
}

export async function forwardRequest(request: NextRequest, backendPath: string) {
  const authorization = resolveAuthHeader(request, backendPath);
  const contentType = request.headers.get("content-type");
  const method = request.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);
  const rawBody = hasBody ? await request.text() : undefined;

  const response = await fetch(buildBackendUrl(backendPath, request.nextUrl.search), {
    method,
    headers: {
      ...(authorization ? { Authorization: authorization } : {}),
      ...(contentType ? { "Content-Type": contentType } : {}),
    },
    ...(hasBody && rawBody ? { body: rawBody } : {}),
    cache: "no-store",
  });

  const text = await response.text();
  const responseContentType = response.headers.get("content-type") || "";

  if (!text) {
    return NextResponse.json({}, { status: response.status });
  }

  if (responseContentType.includes("application/json")) {
    return NextResponse.json(JSON.parse(text), { status: response.status });
  }

  return new NextResponse(text, { status: response.status });
}
