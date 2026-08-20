import { NextRequest, NextResponse } from "next/server";

const protectedPath = [
  "/",

  "/blog-category-management",
  "/blog-category-management/add",
  "/blog-category-management/edit",

  "/blog-post-management",
  "/blog-post-management/add",
  "/blog-post-management/edit",

  "/member-activity",
  "/member-history",

  "/member-management",
  "/member-management/add",
  "/member-management/edit",

  "/bar-chart",
  "/line-chart",
  "/blank",
  "/calendar",
  "/profile",
  "/form-elements",
  "/basic-tables",

  "/plan-features",
  "/plan-features/add",
  "/plan-features/edit",

  "/plans-overview",
  "/plans-overview/add",
  "/plans-overview/edit",

  "/faq-plans",
  "/faq-plans/add",
  "/faq-plans/edit",

  "/alerts",
  "/avatars",
  "/badge",
  "/buttons",
  "/images",
  "/modals",
  "/videos",

  "/access-management",
  "/access-management/add",
  "/access-management/edit",

  "/admin-management",
  "/admin-management/add",
  "/admin-management/edit",

  "/activity-history",
  "/login-history",

  "/booking-management",
  "/comingSoon-management",

  "/historical-data-management",
  "/historical-data-management/add",

  "/IPO-management",
  "/IPO-management/add",

  "/indices-management",
  "/indices-management/add",
  "/indices-management/edit",

  "/logo-management",
  "/logo-management/add",
  "/logo-management/set-up",

  "/role-management",
  "/role-management/add",
  "/role-management/edit",

  "/stocks-management",
  "/stocks-management/add",
  "/stocks-management/edit",

  "/sync-management",

  "/etf-management",
  "/etf-management/add",
  "/etf-management/edit",
];

const authPath = "/sign-in";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  if (!token && pathname !== authPath) {
    return NextResponse.redirect(new URL(authPath, req.url));
  }

  if (token && pathname === authPath) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token && !protectedPath.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|icons|.*\\.css$|.*\\.js$).*)",
  ],
};

// amrit bhaiya is here
