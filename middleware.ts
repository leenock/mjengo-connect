import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const visitorToken = req.cookies.get("visitorToken")?.value;

  const path = req.nextUrl.pathname;

  const isVisitorDashboard = path.startsWith("/user_dashboard");
  const isVisitorLoginPage = path === "/pages/auth/login";

  const isProtectedVisitorPage = [
    "/clientspace/post-job",
    "/clientspace/newJob",
    "/clientspace/myJobs",
    "/clientspace/userProfile",
    "/clientspace/job",
  ].some((route) => path.startsWith(route));

  // Redirect to visitor login if trying to access protected visitor areas without visitor token
  if ((isVisitorDashboard || isProtectedVisitorPage) && !visitorToken) {
    return NextResponse.redirect(new URL("/auth/job-posting", req.url));
  }

  // Prevent access to visitor login if already logged in
  if (isVisitorLoginPage && visitorToken) {
    return NextResponse.redirect(new URL("/clientspace/post-job", req.url));
  }

  return NextResponse.next();
}

// Define all protected paths
export const config = {
  matcher: [
    "/clientspace/post-job/:path*",
    "/clientspace/newJob/:path*",
    "/clientspace/myJobs/:path*",
    "/clientspace/userProfile/:path*",
    "/clientspace/job/:path*",
    "/auth/job-posting",
    "/",
    "/about_us",
    "/contact-us",
    "/coming-soon",
  ],
};
