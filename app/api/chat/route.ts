import { NextResponse } from "next/server";
import { utapi } from "@/utils/server";
import { UTFile } from "uploadthing/server";
import { v4 as uuid } from 'uuid'
import { createPdfBytes } from "@/utils/pdf-utils";
import { generateAudio, generateSummarize } from "@/actions";


export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const message: string | undefined = body?.message;
        const voice: string = body?.voice || 'alloy';
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return NextResponse.json({ error: 'message is required' }, { status: 400 });
        }

        // Generate audio from text
        const audioBytes = await generateAudio(message, voice);

        const filename = `ai-audio-${uuid()}.mp3`;
        const utFile = new UTFile([audioBytes], filename, { type: 'audio/mpeg' });

        // Upload audio
        const uploadResults = await utapi.uploadFiles([utFile]);
        if (!uploadResults || uploadResults.length === 0) {
            return NextResponse.json({ error: 'UploadThing returned empty response' }, { status: 502 });
        }
        const first = uploadResults[0];
        const audioUrl = first.data?.url ?? '';

        // Generate summary and PDF
        const summary = await generateSummarize(message);
        const pdfBytes = await createPdfBytes('Podcast Summary', summary ?? "No summary generated");
        const pdfBuffer = Buffer.from(pdfBytes);
        const pdfFilename = `podcast-brief-${uuid()}.pdf`;
        const pdfUtFile = new UTFile([pdfBuffer], pdfFilename, { type: 'application/pdf' });

        const uploadPdf = await utapi.uploadFiles([pdfUtFile]);
        if (!uploadPdf || uploadPdf.length === 0) {
            return NextResponse.json({ error: 'UploadThing returned empty for PDF' }, { status: 502 });
        }
        const pdfUrl = uploadPdf?.[0]?.data?.url ?? '';

        return NextResponse.json({
            audioUrl,
            pdfUrl,
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

