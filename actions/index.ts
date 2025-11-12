import { openai, openaiVercel } from "@/lib/config"
import { generateObject, generateText } from "ai";
import { z } from 'zod'
import * as fs from 'fs'
import * as path from 'path'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'

// Set ffmpeg path
if (ffmpegInstaller && 'path' in ffmpegInstaller) {
    ffmpeg.setFfmpegPath((ffmpegInstaller as { path: string }).path)
}

const SYSTEM_BASE = `
    You are Podcastr Assistant - a focused assistant for Podcastr, a podcast generator web app.
    Only answer questions about the product or convert user topics into short podcast scripts.
    If the user asks unrelated factual questions that require web access, politely say you cannot browse and offer podcast help instead.
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

const DebateSchema = z.object({
    title: z.string(),
    summary: z.string(),
    dialogue: z.array(
        z.object({
            speaker: z.enum(["SPEAKER1", "SPEAKER2"]),
            text: z.string(),
        })
    )
})

// Parse minutes but cap to 1 minute by default (safe for your 1-minute goal)
const parseTargetMinutes = (message: string) => {
    const match = message.match(/(\d+)\s*minute/);
    const requested = match ? Number(match[1]) : 1;
    // enforce a hard cap at 1 minute to control cost
    return Math.max(1, Math.min(requested, 1));
}

export async function createText(message: string) {
    const targetMinutes = parseTargetMinutes(message); // will be 1
    // choose conservative words/minute to reduce tokens
    const wordsPerMin = 120;
    const targetWords = targetMinutes * wordsPerMin; // e.g., 120 words
    const minWords = Math.round(targetWords * 0.9);
    const maxWords = Math.round(targetWords * 1.1);

    const prompt = `
        ${SYSTEM_BASE}
        User: create a podcast episode about "${message}"
        CONSTRAINTS (VERY IMPORTANT):
            - The whole episode must be approximately ${targetMinutes} minute(s) long.
            - Total words: between ${minWords} and ${maxWords} words.
            - Produce a concise script. Keep language simple and brief.
            - Use 1-2 short segments only (prefer 1). Each segment should be 40-90 seconds combined.
            - Do NOT expand with long anecdotes or many examples.
            - Return ONLY valid JSON with fields: title, summary, segments (array of {id,title,full_text,durationSec}).
            - Do not include any extra explanation or text outside that JSON.
    `

    const maxOutputTokensEstimate = Math.round(maxWords * 1.6); // rough token estimate (words->tokens). adjust down if needed.

    const { object } = await generateObject({
        model: openaiVercel('gpt-4o-mini'),
        schema: EpisodeSchema,
        prompt,
        // <-- limit output tokens so model cannot generate huge text
        // If your library uses a different param name, replace with the appropriate one:
        maxOutputTokens: maxOutputTokensEstimate,
        experimental_telemetry: {
            isEnabled: true,
            recordInputs: true,
            recordOutputs: true
        }
    })

    // safety: ensure audio length <= 60s by trimming if model returns long durations
    const totalSec = object.segments.reduce((s: number, seg: any) => s + (seg.durationSec || 0), 0)
    if (totalSec > 60) {
        // simple trim: keep first segment only and recompute durationSec
        const first = object.segments[0]
        first.durationSec = Math.min(60, first.durationSec || 60)
        object.segments = [first]
    }

    const full_text = object.segments.map((item) => item.full_text).join(' ')
    return full_text
}

export async function createDebateText(message: string) {
    const targetMinutes = parseTargetMinutes(message); // will be 1
    // choose conservative words/minute to reduce tokens
    const wordsPerMin = 120;
    const targetWords = targetMinutes * wordsPerMin; // e.g., 120 words
    const minWords = Math.round(targetWords * 0.9);
    const maxWords = Math.round(targetWords * 1.1);

    const prompt = `
        ${SYSTEM_BASE}
        User: create a debate podcast episode about "${message}" between two speakers
        CONSTRAINTS (VERY IMPORTANT):
            - The whole episode must be approximately ${targetMinutes} minute(s) long.
            - Total words: between ${minWords} and ${maxWords} words.
            - Create a REALISTIC DEBATE between two people with opposing or different viewpoints.
            - Format as a natural conversation with back-and-forth dialogue.
            - Each speaker should have multiple turns (at least 3-4 exchanges each).
            - Make it sound like a real podcast debate - include natural interruptions, agreements, disagreements, and follow-up questions.
            - Keep each speaker's lines concise (1-3 sentences per turn) to allow for natural flow.
            - Return ONLY valid JSON with fields: title, summary, dialogue (array of {speaker: "SPEAKER1" or "SPEAKER2", text: "what they say"}).
            - Do not include any extra explanation or text outside that JSON.
            - Alternate between SPEAKER1 and SPEAKER2 naturally.
    `

    const maxOutputTokensEstimate = Math.round(maxWords * 1.6);

    const { object } = await generateObject({
        model: openaiVercel('gpt-4o-mini'),
        schema: DebateSchema,
        prompt,
        maxOutputTokens: maxOutputTokensEstimate,
        experimental_telemetry: {
            isEnabled: true,
            recordInputs: true,
            recordOutputs: true
        }
    })

    // Limit dialogue to ensure it fits within time constraints
    // Estimate ~2 words per second, so for 60 seconds we want ~120 words max
    let totalWords = 0;
    const limitedDialogue = [];
    for (const item of object.dialogue) {
        const words = item.text.split(/\s+/).length;
        if (totalWords + words > maxWords) {
            break;
        }
        limitedDialogue.push(item);
        totalWords += words;
    }

    return {
        title: object.title,
        summary: object.summary,
        dialogue: limitedDialogue.length > 0 ? limitedDialogue : object.dialogue.slice(0, 10) // fallback to first 10 if empty
    }
}

export async function generateAudio(text: string, voice: string) {
    // keep audio speed 1, but ensure the text length is short (<~140 words)
    const response = await openai.audio.speech.create({
        model: 'gpt-4o-mini-tts',
        voice: voice,
        input: text,
        speed: 1,
    })

    const result = await response.arrayBuffer()
    return new Uint8Array(result)
}

export async function generateDebateAudio(
    dialogue: Array<{ speaker: "SPEAKER1" | "SPEAKER2"; text: string }>,
    voice1: string,
    voice2: string
): Promise<Uint8Array> {
    // Create temporary directory for audio files
    const tempDir = path.join(process.cwd(), 'tmp', `audio-${Date.now()}`)
    await fs.promises.mkdir(tempDir, { recursive: true })

    try {
        // Generate audio for each dialogue line
        const audioFiles: string[] = []
        
        for (let i = 0; i < dialogue.length; i++) {
            const item = dialogue[i]
            const voice = item.speaker === "SPEAKER1" ? voice1 : voice2
            const audioBytes = await generateAudio(item.text, voice)
            
            // Save to temporary file
            const tempFile = path.join(tempDir, `audio-${i}.mp3`)
            await fs.promises.writeFile(tempFile, audioBytes)
            audioFiles.push(tempFile)
        }

        // Create concat file list for ffmpeg
        // Use absolute paths and normalize separators for cross-platform compatibility
        const concatFile = path.join(tempDir, 'concat.txt')
        const concatContent = audioFiles.map(file => {
            const absolutePath = path.resolve(file).replace(/\\/g, '/')
            return `file '${absolutePath}'`
        }).join('\n')
        await fs.promises.writeFile(concatFile, concatContent)

        // Merge all audio files using ffmpeg concat demuxer
        const outputFile = path.join(tempDir, 'merged.mp3')
        
        await new Promise<void>((resolve, reject) => {
            ffmpeg(concatFile)
                .inputOptions(['-f', 'concat', '-safe', '0'])
                .outputOptions(['-c', 'copy'])
                .output(outputFile)
                .on('end', () => resolve())
                .on('error', (err) => reject(err))
                .run()
        })

        // Read merged file
        const mergedAudio = await fs.promises.readFile(outputFile)
        
        // Cleanup
        await fs.promises.rm(tempDir, { recursive: true, force: true })
        
        return new Uint8Array(mergedAudio)
    } catch (error) {
        // Cleanup on error
        await fs.promises.rm(tempDir, { recursive: true, force: true }).catch(() => {})
        throw error
    }
}

export async function generateSummarize(text: string) {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'user',
                content: `Summarize the following podcast transcript into a concise brief (3-4 short paragraphs or 80-120 words) with a short title and 3 bullet "Key takeaways". Keep it simple:

                ---TRANSCRIPT---
                ${text}
                ---END---`
            }
        ],
        max_completion_tokens: 200, // reduced from 450
        temperature: 0.2
    })

    return response.choices[0].message?.content
}


export async function generateImage(prompt: string) {
    const response = await openai.images.generate({
        // model: 'dall-e-2',
        n: 1,
        size: '256x256',
        // quality: 'standard',
        prompt,
    });

    return response.data?.[0]?.url;
}