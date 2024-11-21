import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { getCookie } from "./utils/method/method";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const url = nextUrl.clone();
  const locale = cookies.get("NEXT_LOCALE")?.value || "vi";

  // Áp dụng middleware của `next-intl`
  const response = intlMiddleware(request);

  if (url.pathname.startsWith(`/${locale}/admin`)) {
    const token = cookies.get("auth_a")?.value;

    // Kiểm tra token
    if (!token || token !== btoa(`${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`)) {
      url.pathname = `/${locale}/`;
      return NextResponse.redirect(url);
    }
  }

  return response;
}

// Cấu hình matcher cho middleware
export const config = {
  matcher: ["/admin/:path*", "/", "/(vi|en)/:path*"],
};
