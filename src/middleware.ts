import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const pathname = request.nextUrl.pathname;
  const cookieIp = request.cookies.get("test");
  const clientIp = request.ip ?? requestHeaders.get("x-forwarded-for") ?? "";

  const response = NextResponse.next();

  if (!pathname.startsWith("/api")) {
    if (!cookieIp) {
      console.log("::", pathname, "::", clientIp)
      response.cookies.set("test", clientIp, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 10,
      });
    }
  }

  response.headers.set("x-middle-forwarded-for", requestHeaders.get('x-forwarded-for') ?? "");
  response.headers.set("x-middle-real-ip", requestHeaders.get('x-real-ip') ?? "");
  response.headers.set("x-middle-vercel-forwarded-for", requestHeaders.get('x-vercel-forwarded-for') ?? "");
  response.headers.set("x-middle-req_ip", request.ip ?? "");
  response.headers.set("x-middle-cookie-ip", cookieIp?.value ?? "");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"],
}