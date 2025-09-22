import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const visitorToken = req.cookies.get("visitorToken")?.value
  const fundiToken = req.cookies.get("fundiToken")?.value
  const adminToken = req.cookies.get("adminToken")?.value // Added: Admin token

  const path = req.nextUrl.pathname

  const isClientDashboard = path.startsWith("/clientspace/post-job")
  const isClientLoginPage = path === "/auth/job-posting"

  const isFundiDashboard = path.startsWith("/clientspace/fundi/job-listings")
  const isFundiLoginPage = path === "/auth/job-listing"

  // Added: Admin login and dashboard URLs
  const isAdminDashboard = path.startsWith("/administrator/dashboard")
  const isAdminLoginPage = path === "/administrator/auth/login"

  const isProtectedClientPage = [
    "/clientspace/post-job",
    "/clientspace/newJob",
    "/clientspace/myJobs",
    "/clientspace/userProfile",
    "/clientspace/job",
    "/clientspace/payment",
    "/clientspace/add-funds",
    "/clientspace/message-admin",
  ].some((route) => path.startsWith(route))

  const isProtectedFundiPage = [
    "/clientspace/fundi/job-listings",
    "/clientspace/fundi/saved-jobs",
    "/clientspace/fundi/subscription",
    "/clientspace/fundi/userProfile",
  ].some((route) => path.startsWith(route))
  
  // Added: Protected admin URLs
  const isProtectedAdminPage = [
    "/administrator/dashboard",
    "/administrator/settings",
    "/administrator/fundis",
    "/administrator/clients",
    "/administrator/postJob",
    "/administrator/reports",
    "/administrator/tickets",
    "/administrator/moderation",
    "/administrator/system_logs",
  ].some((route) => path.startsWith(route))

  // Redirect to client login if trying to access protected client areas without client token
  if ((isClientDashboard || isProtectedClientPage) && !visitorToken) {
    return NextResponse.redirect(new URL("/auth/job-posting", req.url))
  }

  // Redirect to fundi login if trying to access protected fundi areas without fundi token
  if ((isFundiDashboard || isProtectedFundiPage) && !fundiToken) {
    return NextResponse.redirect(new URL("/auth/job-listing", req.url))
  }
  
  // Added: Redirect to admin login if trying to access protected admin areas without admin token
  if ((isAdminDashboard || isProtectedAdminPage) && !adminToken) {
    return NextResponse.redirect(new URL("/administrator/auth/login", req.url))
  }

  // Prevent access to client login if already logged in
  if (isClientLoginPage && visitorToken) {
    return NextResponse.redirect(new URL("/clientspace/post-job", req.url))
  }

  // Prevent access to fundi login if already logged in
  if (isFundiLoginPage && fundiToken) {
    return NextResponse.redirect(new URL("/clientspace/fundi/job-listings", req.url))
  }
  
  // Added: Prevent access to admin login if already logged in
  if (isAdminLoginPage && adminToken) {
    return NextResponse.redirect(new URL("/administrator/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/clientspace/post-job/:path*",
    "/clientspace/newJob/:path*",
    "/clientspace/myJobs/:path*",
    "/clientspace/userProfile/:path*",
    "/clientspace/job/:path*",
    "/clientspace/payment/:path*",
    "/clientspace/add-funds/:path*",
    "/clientspace/message-admin/:path*",
    "/auth/job-posting",

    "/clientspace/fundi/job-listings/:path*",
    "/clientspace/fundi/saved-jobs/:path*",
    "/clientspace/fundi/subscription/:path*",
    "/clientspace/fundi/userProfile/:path*",
    "/auth/job-listing",

    // Added: Matcher for all admin routes and the login page
    "/administrator/:path*",
    "/administrator/auth/login",
  ],
}