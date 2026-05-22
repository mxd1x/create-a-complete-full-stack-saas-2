export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/leads/:path*", "/companies/:path*", "/analytics", "/settings"]
};
