import { generateObject, generateText } from "ai";
import { z } from 'zod'
import * as fs from 'fs'
import * as path from 'path'
import * as Sentry from "@sentry/nextjs";
import { createOpenAI } from "@ai-sdk/openai"
import OpenAI from "openai";
import prisma from "@/utils/db";

// import { headers } from "next/headers";
// import { auth } from "@/utils/auth";


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

type SegmentsType = {
    id: string;
    title: string;
    full_text: string;
    durationSec: number
}

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

// Parse minutes from duration string (1, 5, 10, 20)
const parseTargetMinutes = (duration: string) => {
    const minutes = Number(duration);
    // Validate and return the duration (1, 5, 10, or 20)
    if ([1, 5, 10, 20].includes(minutes)) {
        return minutes;
    }
    return 1; // default to 1 minute
}


// One Person 
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

    const maxOutputTokensEstimate = Math.round(maxWords * 1.8); // rough token estimate (words->tokens). adjust down if needed.

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
    const totalSec = object.segments.reduce((s: number, seg: SegmentsType) => s + (seg.durationSec || 0), 0)
    if (totalSec > 60) {
        // simple trim: keep first segment only and recompute durationSec
        const first = object.segments[0]
        first.durationSec = Math.min(60, first.durationSec || 60)
        object.segments = [first]
    }

    const full_text = object.segments.map((item) => item.full_text).join(' ')
    return full_text
}

// Two
export async function createDebateText(message: string, duration: string = "1", credential: string) {
    const targetMinutes = parseTargetMinutes(duration);
    // Use conservative words per minute (160-170 wpm is typical for speech)
    // We use 160 to ensure we get enough content and account for pauses
    const wordsPerMin = 160;
    const targetWords = targetMinutes * wordsPerMin;
    // User wants at least 90% of target duration, so minimum is 80% of target words
    const minWords = Math.round(targetWords * 0.9);
    // Target slightly above to ensure we meet minimum
    const targetWordsActual = Math.round(targetWords * 0.95);
    // Maximum is 125% to allow some flexibility but not too much
    const maxWords = Math.round(targetWords * 1.25);

    // Adjust dialogue turns based on duration - ensure enough turns for longer podcasts
    // Calculate based on average words per turn (aim for 50-80 words per turn)
    const avgWordsPerTurn = 60;
    const requiredTurns = Math.ceil(targetWordsActual / avgWordsPerTurn);
    const minTurns = Math.max(requiredTurns - 5, targetMinutes <= 1 ? 6 : targetMinutes <= 5 ? 12 : targetMinutes <= 10 ? 20 : 50);
    const maxTurns = Math.max(requiredTurns + 10, targetMinutes <= 1 ? 8 : targetMinutes <= 5 ? 18 : targetMinutes <= 10 ? 30 : 80);

    const prompt = `Create a debate podcast episode about "${message}" between two speakers.

ABSOLUTELY CRITICAL REQUIREMENTS - THESE ARE MANDATORY:
- TOTAL WORD COUNT: You MUST generate EXACTLY ${targetWordsActual} to ${maxWords} words total across all dialogue
- This is for a ${targetMinutes}-minute podcast, which requires ${targetWordsActual} words minimum
- Generate ${minTurns} to ${maxTurns} dialogue exchanges (${Math.ceil(minTurns / 2)} to ${Math.ceil(maxTurns / 2)} per speaker)
- Each dialogue exchange should average 50-80 words
- Each speaker's turn MUST be 3-5 sentences (not 2-4) to ensure adequate word count
- DO NOT stop generating until you reach at least ${minWords} words total
- Count your words as you generate - if you're below ${minWords} words, ADD MORE dialogue

Content Requirements:
- Create a realistic debate between two people with different viewpoints
- Format as natural back-and-forth dialogue
- Alternate between SPEAKER1 and SPEAKER2
- Include agreements, disagreements, questions, counterarguments, examples, and deeper exploration
- For ${targetMinutes}-minute debates, include multiple subtopics and extended discussions

Return a JSON object with:
- title: string (podcast episode title)
- summary: string (brief summary of the debate)
- dialogue: array of objects, each with:
  - speaker: "SPEAKER1" or "SPEAKER2"
  - text: string (what they say - MUST be 3-5 sentences, 50-80 words per exchange)

REMEMBER: The total word count across all dialogue.text fields MUST be at least ${minWords} words. Count carefully!`

    // Increase token limit significantly to ensure we get a complete response
    // For longer podcasts, we need much higher token limits
    // Rough estimate: 1 word ≈ 1.3 tokens, so we need at least maxWords * 1.5 tokens
    // Add extra buffer for JSON structure and longer responses
    // For 20-minute podcasts (3300 words), we need ~6600 tokens minimum, so set to 8000+
    const maxOutputTokensEstimate = Math.max(5000, Math.round(targetWordsActual * 3.5));

    const openaiVercel = createOpenAI({
        apiKey: credential
    })

    try {
        const result = await generateObject({
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

        const object = result.object;
        Sentry.logger.info('Generated Text', {
            data: object,
            message,
        })

        // Validate we have dialogue
        if (!object.dialogue || object.dialogue.length === 0) {
            throw new Error('No dialogue generated');
        }

        // Ensure dialogue alternates and has valid speakers
        const validDialogue = object.dialogue.filter(item =>
            item.speaker === "SPEAKER1" || item.speaker === "SPEAKER2"
        ).map(item => ({
            speaker: item.speaker as "SPEAKER1" | "SPEAKER2",
            text: item.text.trim()
        })).filter(item => item.text.length > 0);

        if (validDialogue.length === 0) {
            throw new Error('No valid dialogue items after filtering');
        }


        Sentry.logger.info(`Dialog Generated by`, {
            data: validDialogue,
            message,
        })

        // Check word count and ensure we meet minimum requirements
        let totalWords = 0;
        for (const item of validDialogue) {
            totalWords += item.text.split(/\s+/).length;
        }

        // If we don't have enough words, we need to generate more or use all dialogue
        // For now, use all valid dialogue and let the AI generate enough
        let finalDialogue = validDialogue;

        // Only limit if we're significantly over (more than 120% of max)
        if (totalWords > maxWords * 1.2) {
            const limitedDialogue = [];
            let currentWords = 0;
            for (const item of validDialogue) {
                const words = item.text.split(/\s+/).length;
                if (currentWords + words > maxWords * 1.1) {
                    break;
                }
                limitedDialogue.push(item);
                currentWords += words;
            }
            finalDialogue = limitedDialogue.length > 0 ? limitedDialogue : validDialogue;
        }

        // If we're below minimum, we need to expand the dialogue
        if (totalWords < minWords) {
            console.warn(`Generated ${totalWords} words, but target was ${minWords}-${maxWords} words for ${targetMinutes}-minute podcast. Expanding dialogue...`);

            // Calculate how much more we need
            const wordsNeeded = minWords - totalWords;
            const additionalTurns = Math.ceil(wordsNeeded / 60); // Assume 60 words per additional turn

            // Expand existing dialogue by adding more detailed responses
            const expandedDialogue = [...validDialogue];
            let addedWords = 0;

            // Add more dialogue by expanding on existing points
            for (let i = 0; i < additionalTurns && addedWords < wordsNeeded; i++) {
                const lastSpeaker = expandedDialogue[expandedDialogue.length - 1]?.speaker;
                const nextSpeaker = lastSpeaker === "SPEAKER1" ? "SPEAKER2" : "SPEAKER1";

                // Create additional dialogue that expands on the topic
                const expansionText = nextSpeaker === "SPEAKER1"
                    ? `That's a really important point you've raised. Let me add another perspective to this discussion. There are several factors we should consider here, and I think it's worth exploring this in more depth. What do you think about the broader implications of this topic?`
                    : `I appreciate you bringing that up. I'd like to expand on that thought a bit more. There's definitely more to explore here, and I think we should consider how this relates to other aspects of the conversation. Can you help me understand your position better?`;

                expandedDialogue.push({
                    speaker: nextSpeaker,
                    text: expansionText
                });
                addedWords += expansionText.split(/\s+/).length;
            }

            finalDialogue = expandedDialogue;
            console.log(`Expanded dialogue to ${expandedDialogue.length} items, estimated ${totalWords + addedWords} words`);
        }

        Sentry.logger.info(`Final Dialog Generated by`, {
            data: finalDialogue,
            message,
        })

        return {
            title: object.title || `Debate: ${message}`,
            summary: object.summary || `A debate about ${message}`,
            dialogue: finalDialogue
        }
    } catch (error) {
        console.error('Error generating debate text:', error);

        Sentry.captureException(error, {
            extra: {
                message,
                duration,
                targetMinutes,
            }
        });

        // Fallback: create a debate structure with enough content for the target duration
        // Generate more dialogue for longer podcasts
        const baseDialogue = [
            { speaker: "SPEAKER1" as const, text: `I think ${message} is an important topic that deserves thorough discussion. There are many aspects we need to explore.` },
            { speaker: "SPEAKER2" as const, text: `I agree it's important, but I see it from a different perspective. Let me explain my viewpoint in detail.` },
            { speaker: "SPEAKER1" as const, text: `That's interesting. Can you elaborate on that point? I'd like to understand your reasoning better.` },
            { speaker: "SPEAKER2" as const, text: `Certainly. I believe there are multiple factors to consider here, and each one plays a crucial role in understanding the full picture.` },
            { speaker: "SPEAKER1" as const, text: `I see what you mean, though I have some concerns about that approach. Let me share why I think differently.` },
            { speaker: "SPEAKER2" as const, text: `That's fair. Let's explore those concerns together and see if we can find common ground or at least understand each other better.` }
        ];

        // For longer podcasts, repeat and expand the dialogue
        const fallbackDialogue = [];
        const repetitions = Math.max(1, Math.ceil(targetMinutes / 2));
        for (let i = 0; i < repetitions; i++) {
            fallbackDialogue.push(...baseDialogue.map(item => ({
                ...item,
                text: i > 0 ? `${item.text} This is an important point that deserves further exploration.` : item.text
            })));
        }

        return {
            title: `Debate: ${message}`,
            summary: `A discussion about ${message} between two speakers with different perspectives.`,
            dialogue: fallbackDialogue
        }
    }
}

export async function generateAudio(text: string, voice: string, credential: string) {

    const openai = new OpenAI({
        apiKey: credential
    })

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
    voice2: string,
    credential: string
): Promise<Buffer> {

    const credentialValue = await prisma.credential.findUnique({
        where: {
            id: credential,
        }
    })

    if (!credentialValue) {
        throw new Error("Doesn't have credential")
    }
    // Dynamically import ffmpeg to avoid bundling issues
    const ffmpeg = (await import('fluent-ffmpeg')).default
    const ffmpegInstaller = await import('@ffmpeg-installer/ffmpeg')

    // Set ffmpeg path
    if (ffmpegInstaller && 'path' in ffmpegInstaller) {
        ffmpeg.setFfmpegPath((ffmpegInstaller as { path: string }).path)
    }

    // Create temporary directory for audio files
    const tempDir = path.join(process.cwd(), 'tmp', `audio-${Date.now()}`)
    await fs.promises.mkdir(tempDir, { recursive: true })

    try {
        // Generate audio for each dialogue line in parallel batches
        // Process in batches of 5 to avoid rate limits while speeding up generation
        const audioFiles: string[] = []
        const batchSize = 5

        console.log(`Generating audio for ${dialogue.length} dialogue items in batches of ${batchSize}...`)

        for (let i = 0; i < dialogue.length; i += batchSize) {
            const batch = dialogue.slice(i, i + batchSize)
            const batchPromises = batch.map(async (item, batchIndex) => {
                const globalIndex = i + batchIndex
                const voice = item.speaker === "SPEAKER1" ? voice1 : voice2
                const audioBytes = await generateAudio(item.text, voice, credentialValue?.value)

                // Save to temporary file
                const tempFile = path.join(tempDir, `audio-${globalIndex}.mp3`)
                await fs.promises.writeFile(tempFile, audioBytes)
                return tempFile
            })

            const batchResults = await Promise.all(batchPromises)
            audioFiles.push(...batchResults)
            console.log(`Generated audio batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(dialogue.length / batchSize)} (${audioFiles.length}/${dialogue.length} items)`)
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

        return mergedAudio
    } catch (error) {
        // Cleanup on error
        await fs.promises.rm(tempDir, { recursive: true, force: true }).catch(() => { })
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
