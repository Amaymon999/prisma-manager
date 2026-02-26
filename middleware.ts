export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/leads/:path*",
    "/pipeline/:path*",
    "/companies/:path*",
    "/projects/:path*",
    "/collaborators/:path*",
    "/tasks/:path*",
    "/settings/:path*",
    "/ai/:path*"
  ]
};
