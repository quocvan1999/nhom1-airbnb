import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const url = nextUrl.clone();

  if (url.pathname.startsWith("/admin")) {
    const token: string | undefined = cookies.get("auth_a")?.value;

    if (token) {
      if (token !== btoa(`${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`)) {
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    } else {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
