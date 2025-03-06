import { NextRequest } from "next/server";

// export const runtime = 'nodejs';
// export const runtime = 'edge';

export async function GET(request: NextRequest) {

    const currentHeaders = request.headers;

    const response = {
        "api": {
            "x-forwarded-for"       : currentHeaders.get('x-forwarded-for') ?? "",
            "x-real-ip"             : currentHeaders.get('x-real-ip') ?? "",
            "x-vercel-forwarded-for": currentHeaders.get('x-vercel-forwarded-for') ?? "",
            "req_ip"                : request.ip ?? "",
        },
        "middleware": {
            "x-forwarded-for"       : currentHeaders.get('x-middle-forwarded-for') ?? "",
            "x-real-ip"             : currentHeaders.get('x-middle-real-ip') ?? "",
            "x-vercel-forwarded-for": currentHeaders.get('x-middle-vercel-forwarded-for') ?? "",
            "req_ip"                : currentHeaders.get('x-middle-req_ip') ?? "",
        },
    };

    return new Response(JSON.stringify(response), {
        status: 200
    });
}
