import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["vi", "en"],
  defaultLocale: "vi",
});

export async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const url = nextUrl.clone();

  // Áp dụng middleware của `next-intl`
  const response = intlMiddleware(request);

  // Kiểm tra nếu đường dẫn bắt đầu bằng `/admin`
  if (url.pathname.startsWith("/admin")) {
    const token = cookies.get("auth_a")?.value;

    // Kiểm tra token
    if (!token || token !== btoa(`${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`)) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

// Cấu hình matcher cho middleware
export const config = {
  matcher: ["/admin/:path*", "/", "/(vi|en)/:path*"],
};
