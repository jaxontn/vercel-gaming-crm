
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Construct the backend URL
        // Ensure base URL doesn't have trailing slash
        let baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1';
        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, -1);
        }

        const backendUrl = `${baseUrl}/game-completion/track.php`;

        console.log(`[Proxy] Forwarding to: ${backendUrl}`);

        const backendResponse = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await backendResponse.json();

        return NextResponse.json(data, {
            status: backendResponse.status,
        });
    } catch (error) {
        console.error("[Proxy] Error forwarding request:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
