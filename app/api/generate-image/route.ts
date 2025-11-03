import { NextResponse } from "next/server";
import { utapi } from "@/utils/server";
import { generateImage } from "@/actions";
import { UTFile } from "uploadthing/server";
import { v4 as uuid } from 'uuid';

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const prompt: string | undefined = body?.prompt;

        if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
            return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
        }

        // Generate image from OpenAI
        const imageOpenaiUrl = await generateImage(prompt);

        if (!imageOpenaiUrl) {
            return NextResponse.json({ error: 'Image generation returned empty response' }, { status: 502 });
        }

        // Fetch the image from OpenAI URL
        const imageResponse = await fetch(imageOpenaiUrl);
        if (!imageResponse.ok) {
            throw new Error('Failed to fetch image from OpenAI');
        }

        // Convert to buffer
        const imageBuffer = await imageResponse.arrayBuffer();
        const imageBytes = new Uint8Array(imageBuffer);

        // Create UTFile and upload to UploadThing
        const imageFilename = `generated-image-${uuid()}.png`;
        const imageUtFile = new UTFile([imageBytes], imageFilename, { type: 'image/png' });

        const uploadResult = await utapi.uploadFiles([imageUtFile]);

        if (!uploadResult || uploadResult.length === 0 || !uploadResult[0]?.data?.url) {
            return NextResponse.json({ error: 'Failed to upload image to UploadThing' }, { status: 502 });
        }

        const imageUrl = uploadResult[0].data.url;

        return NextResponse.json({
            url: imageUrl
        });

    } catch {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

