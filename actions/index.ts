import { openai, openaiVercel } from "@/lib/config"
import { generateObject, generateText } from "ai";
import { z } from 'zod'

const SYSTEM_BASE = `
    You are Podcastr Assistant - a focused assistant for Podcastr, a podcast generator web app.
    Only answer questions about the product, how to create podcast, or convert user topics into podcast scripts.
    If the user asks unrelated factual questions that require web access, politely say you cannot browse and offer podcast help instead
`

const EpisodeSchema = z.object({
    title: z.string(),
    summary: z.string(),
    segments: z.array(
        z.object({
            id: z.string(),
            title: z.string(),
            full_text: z.string(),
            durationSec: z.number()
        })
    )
})

// Helper function to parse target minutes from the user's request
const parseTargetMinutes = (message: string) => {
    const match = message.match(/(\d+)\s*minute/);
    return match ? Number(match[1]) : 20;
}

export async function createText(message: string) {
    const targetMinutes = parseTargetMinutes(message);
    const targetWords = targetMinutes * 140; // ~140 words/minute (average podcast rate)
    const prompt = `
        ${SYSTEM_BASE}
        User: create a podcast episode about ${message}
        CONSTRAINTS:
            - Write a podcast script and segments whose total length is approximately ${targetMinutes} minutes (minimum ${Math.round(targetWords * 0.9)}, up to ${Math.round(targetWords * 1.1)} words).
            - Expand each segment with detailed discussion, anecdotes, analysis, examples, and relevant info.
            - Do NOT be brief—maximize depth and richness.
            - Use at least 4-7 segments for better pacing if possible.
            - Return ONLY valid JSON with fields: title, summary, segments (array of {id,title,full_text,durationSec}).
            - The more content the better, up to the specified limit.
    `

    const { object } = await generateObject({
        model: openaiVercel('gpt-4o-mini'),
        schema: EpisodeSchema,
        prompt,
        maxOutputTokens: 200,
        experimental_telemetry: {
            isEnabled: true,
            recordInputs: true,
            recordOutputs: true
        }
    })

    const full_text = object.segments.map((item) => item.full_text).join(' ')
    return full_text
}

export async function generateAudio(text: string, voice: string) {
    const response = await openai.audio.speech.create({
        model: 'gpt-4o-mini-tts',
        voice: voice,
        input: text,
        speed: 1,
    })

    const result = await response.arrayBuffer()
    return new Uint8Array(result)
}

export async function generateSummarize(text: string) {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'user',
                content: `Summarize the following podcast transcript into a concise brief (about 6-8 short paragraphs or 150-200 words) with a short title and bullet "Key takeaways". Keep it easy to read:

                ---TRANSCRIPT---
                ${text}
                ---END---`
            }
        ],
        max_completion_tokens: 450,
        temperature: 0.4
    })

    return response.choices[0].message?.content
}


export async function generateImage(prompt: string) {
    const response = await openai.images.generate({
        model: 'dall-e-2',
        n: 1,
        size: '256x256',
        // quality: 'standard',
        prompt,
    });

    return response.data?.[0]?.url;
}
