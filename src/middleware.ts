import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-middle-forwarded-for"       , requestHeaders.get('x-forwarded-for') ?? "");
  requestHeaders.set("x-middle-real-ip"             , requestHeaders.get('x-real-ip') ?? "");
  requestHeaders.set("x-middle-vercel-forwarded-for", requestHeaders.get('x-vercel-forwarded-for') ?? "");
  requestHeaders.set("x-middle-req_ip"              , request.ip ?? "");

  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
}

// export const config = {
//   matcher: ["/"],
// }