/**
 * API base URL for backend requests.
 * - Development: http://localhost:5000 (or set NEXT_PUBLIC_API_URL in .env.local)
 * - Production: set NEXT_PUBLIC_API_URL to your API domain (e.g. https://api.yourdomain.com)
 */
export const API_URL =
  typeof process.env.NEXT_PUBLIC_API_URL !== "undefined" &&
  process.env.NEXT_PUBLIC_API_URL !== ""
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "") // strip trailing slash
    : "http://localhost:5000";
