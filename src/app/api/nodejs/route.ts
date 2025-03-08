import { NextRequest } from "next/server";
import { cookies } from "next/headers";

// export const runtime = 'nodejs';
// export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const cookieStore = cookies();
    const ipCookie = cookieStore.get("test")?.value;
    const currentHeaders = request.headers;
    console.log(ipCookie);

    const response = {
        "api": {
            "x-forwarded-for"       : currentHeaders.get('x-forwarded-for') ?? "",
            "x-real-ip"             : currentHeaders.get('x-real-ip') ?? "",
            "x-vercel-forwarded-for": currentHeaders.get('x-vercel-forwarded-for') ?? "",
            "req_ip"                : request.ip ?? "",
            "cookie_ip"             : ipCookie,
        },
        "middleware": {
            "x-forwarded-for"       : currentHeaders.get('x-middle-forwarded-for') ?? "",
            "x-real-ip"             : currentHeaders.get('x-middle-real-ip') ?? "",
            "x-vercel-forwarded-for": currentHeaders.get('x-middle-vercel-forwarded-for') ?? "",
            "req_ip"                : currentHeaders.get('x-middle-req_ip') ?? "",
            "cookie_ip"             : currentHeaders.get('x-middle-cookie-ip') ?? "",
        },
    };

    console.log(response)

    return new Response(JSON.stringify(response), {
        status: 200
    });
}
