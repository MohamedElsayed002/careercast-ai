import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import { buildPrompt } from "@/actions/briefing-schema";


export async function POST(request: Request) {
    const formData = await request.formData()
    const companyName = formData.get('companyName')
    const file = formData.get('file')

    if (!companyName || typeof companyName !== "string" || !(file instanceof File) || file.type !== "application/pdf") {
        return NextResponse.json({
            error: "Invalid inputs"
        }, { status: 400 })
    }

    const extractFormData = new FormData()
    extractFormData.append("file", file, file.name)

    // My Backend 
    const response = await fetch(process.env.PDF_EXTRACT_API_URL!, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.PDF_EXTRACT_API_TOKEN}`
        },
        body: extractFormData
    })

    if (!response.ok) {
        return NextResponse.json({
            error: "Failed to extract PDF Text"
        }, { status: 500 })
    }

    const payload = await response.json()

    const result = streamText({
        model: google("gemini-2.5-flash"),
        prompt: buildPrompt(companyName, payload.full_text),
        tools: {
            google_search: google.tools.googleSearch({}),
        }
    })

    for await (const chunk of result.textStream) {
        console.log(chunk)
    }

    const resolvedSources = await result.sources;

    for await (const s of resolvedSources) {
        console.log(s)
    }

    return new Response(
        new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder()

                // Stream text
                for await (const chunk of result.textStream) {
                    controller.enqueue(encoder.encode(chunk))
                }

                // Send sources
                const resolvedSources = await result.sources

                controller.enqueue(
                    encoder.encode("__SOURCES__" + JSON.stringify(resolvedSources))
                );

                controller.close()
            }
        }),
        {
            headers: {
                "Content-Type": "text/plain"
            }
        }
    )
}
