import { generateObject } from "ai";
import { z } from 'zod'
import * as fs from 'fs'
import * as path from 'path'
import * as Sentry from "@sentry/nextjs";
import { createOpenAI } from "@ai-sdk/openai"
import OpenAI from "openai";
import os from 'os';
import { v4 as uuid } from 'uuid';
import prisma from "@/utils/db";
import { decrypt } from "@/lib/encryption";



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

// Schema for the summary and educational content 
const PodcastEducationalContentSchema = z.object({
    summary: z.object({
        overview: z.string().describe("A comprehensive 3-4 paragraph summary of the entire podcast debate"),
        keyPoints: z.array(z.string()).describe("5-7 main points discussed in the debate"),
        conclusion: z.string().describe("The overall conclusion or takeaway from the debate")
    }),
    vocabulary: z.array(
        z.object({
            word: z.string(),
            definition: z.string(),
            context: z.string().describe("How the word was used in the podcast"),
            example: z.string().describe("An example sentence using the word")
        })
    ).length(10),
    exercises: z.object({
        comprehensionQuestions: z.array(
            z.object({
                question: z.string(),
                answer: z.string(),
                type: z.enum(["multiple_choice", "short_answer", "true_false"])
            })
        ).length(5).describe("5 comprehension questions about the podcast content"),
        vocabularyExercises: z.array(
            z.object({
                question: z.string(),
                answer: z.string(),
                type: z.enum(["fill_in_blank", "matching", "definition"])
            })
        ).length(5).describe("5 vocabulary exercises"),
        discussionPrompts: z.array(z.string()).length(3).describe("3 thought-provoking discussion questions")
    })
});

export type PodcastEducationalContent = z.infer<typeof PodcastEducationalContentSchema>;



// Parse minutes from duration string (1, 5, 10, 20)
const parseTargetMinutes = (duration: string) => {
    const minutes = Number(duration);
    // Validate and return the duration (1, 5, 10, or 20)
    if ([1, 5, 10, 20].includes(minutes)) {
        return minutes;
    }
    return 1; // default to 1 minute
}

// Two
export async function createDebateText(
    message: string,
    duration: string = "1",
    credential: string,
    model: string) {
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
            model: openaiVercel(model),
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
        console.log('line 241', object)
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

// Helper function to remove emojis and special characters that can't be encoded in WinAnsi
function sanitizeForPDF(text: string): string {
    // Remove emojis and special Unicode characters
    return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
        .replace(/[^\x00-\xFF]/g, '') // Remove non-Latin characters
        .trim();
}

// Helper function to sanitize entire object recursively
function sanitizeObject<T>(obj: T): T {
    if (typeof obj === 'string') {
        return sanitizeForPDF(obj) as T;
    }
    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item)) as T;
    }
    if (obj !== null && typeof obj === 'object') {
        const sanitized: any = {};
        for (const [key, value] of Object.entries(obj)) {
            sanitized[key] = sanitizeObject(value);
        }
        return sanitized;
    }
    return obj;
}

export async function generateSummaryAndExercise(
    debateTitle: string,
    debateDialogue: Array<{ speaker: "SPEAKER1" | "SPEAKER2"; text: string }>,
    credential: string,
    model: string = "gpt-4o"
) {
    const openaiVercel = createOpenAI({
        apiKey: credential
    });

    // Prepare the full dialogue text for analysis
    const fullDialogue = debateDialogue
        .map((item) => `${item.speaker}: ${item.text}`)
        .join("\n\n");

    console.log('full dialogue length:', fullDialogue.length);

    // Enhanced prompt with explicit instructions
    const prompt = `You are an educational content creator analyzing a podcast debate titled "${debateTitle}".

Here is the full transcript of the debate:

${fullDialogue}

CRITICAL INSTRUCTIONS:
1. DO NOT use emojis or special Unicode characters anywhere in your response
2. Generate ALL required fields - do not stop early
3. Follow the exact schema structure provided

Generate comprehensive educational content including:

1. SUMMARY (REQUIRED - all 3 fields must be filled):
   - overview: Write a detailed 3-4 paragraph summary (400-500 words) capturing the main themes, arguments, and flow of the debate
   - keyPoints: Extract exactly 5-7 most important points discussed as an array of strings
   - conclusion: Write a 2-3 sentence summary (100-150 words) of the overall takeaway or resolution

2. VOCABULARY (REQUIRED - exactly 10 words):
   - Select 10 challenging or important words from the debate
   - For EACH word provide: word, definition, context (how used in podcast), example (a new example sentence)
   - Focus on advanced vocabulary, technical terms, or key concepts
   - DO NOT use emojis or special characters

3. EXERCISES (REQUIRED - all 3 sections must be filled):
   a) comprehensionQuestions: Create exactly 5 questions
      - Each question must have: question, answer, type (multiple_choice, short_answer, or true_false)
      - Test understanding of the debate content
   
   b) vocabularyExercises: Create exactly 5 exercises
      - Each exercise must have: question, answer, type (fill_in_blank, matching, or definition)
      - Use the vocabulary words from section 2
   
   c) discussionPrompts: Create exactly 3 thought-provoking questions
      - Each should be a complete question encouraging critical thinking

REMEMBER: 
- Generate ALL fields completely
- Use only standard ASCII characters (no emojis, no special Unicode)
- Do not stop generating until ALL sections are complete`;

    try {
        const result = await generateObject({
            model: openaiVercel(model),
            schema: PodcastEducationalContentSchema,
            prompt,
            maxOutputTokens: 6000, // Increased for complete response
            temperature: 0.7,
            experimental_telemetry: {
                isEnabled: true,
                recordInputs: true,
                recordOutputs: true
            }
        });

        // Sanitize the entire result to remove emojis
        const sanitizedResult = sanitizeObject(result.object);

        Sentry.logger.info('Generated Educational Content', {
            title: debateTitle,
            vocabularyCount: sanitizedResult.vocabulary.length,
            exerciseCount: sanitizedResult.exercises.comprehensionQuestions.length,
            hasSummary: !!sanitizedResult.summary,
            hasConclusion: !!sanitizedResult.summary?.conclusion
        });

        // Validate that all required fields are present
        if (!sanitizedResult.summary?.conclusion) {
            console.warn('Missing conclusion, using fallback');
            sanitizedResult.summary.conclusion = `This debate on ${debateTitle} provided multiple perspectives and insights into the topic.`;
        }

        if (!sanitizedResult.vocabulary || sanitizedResult.vocabulary.length < 10) {
            console.warn('Insufficient vocabulary, padding with defaults');
            const vocabLength = sanitizedResult.vocabulary?.length || 0;
            const vocabPadding = Array(10 - vocabLength).fill(null).map((_, i) => ({
                word: `term${vocabLength + i + 1}`,
                definition: "An important term from the discussion",
                context: "This term was used in the context of the debate",
                example: "This term can be used to describe the concept discussed."
            }));
            sanitizedResult.vocabulary = [...(sanitizedResult.vocabulary || []), ...vocabPadding];
        }

        if (!sanitizedResult.exercises) {
            console.warn('Missing exercises, using fallback');
            sanitizedResult.exercises = {
                comprehensionQuestions: Array(5).fill(null).map((_, i) => ({
                    question: `What was discussed about point ${i + 1} in the debate?`,
                    answer: "Based on the debate content",
                    type: "short_answer" as const
                })),
                vocabularyExercises: Array(5).fill(null).map((_, i) => ({
                    question: `Define the term used in context ${i + 1}`,
                    answer: "Definition from vocabulary",
                    type: "definition" as const
                })),
                discussionPrompts: [
                    "What were the main arguments presented?",
                    "How do the perspectives differ?",
                    "What are the implications of this discussion?"
                ]
            };
        }

        return {
            summary: sanitizedResult.summary,
            vocabulary: sanitizedResult.vocabulary,
            exercises: sanitizedResult.exercises
        };
    } catch (error: any) {
        console.error('Error generating educational content:', error);

        // Log more details about the error
        if (error.cause) {
            console.error('Error cause:', JSON.stringify(error.cause, null, 2));
        }
        if (error.text) {
            console.error('Generated text:', error.text);
        }

        Sentry.captureException(error, {
            extra: {
                debateTitle,
                dialogueLength: debateDialogue.length,
                errorMessage: error.message,
                errorCause: error.cause
            }
        });

        // Return comprehensive fallback educational content
        return {
            summary: {
                overview: `This podcast debate on "${debateTitle}" explores various perspectives and arguments. The speakers engage in a thoughtful discussion, presenting evidence and reasoning to support their viewpoints. Throughout the conversation, they examine different aspects of the topic, challenge each other's assumptions, and work toward a deeper understanding of the subject matter. The debate provides valuable insights into the complexities and nuances surrounding this important topic.`,
                keyPoints: [
                    "Multiple perspectives were presented on the topic",
                    "Speakers provided evidence and reasoning for their arguments",
                    "Key concepts and terminology were explored in depth",
                    "Counterarguments were addressed thoughtfully",
                    "The discussion maintained a balanced approach",
                    "Real-world implications were considered",
                    "The debate encouraged critical thinking about the subject"
                ],
                conclusion: `The debate on ${debateTitle} provided a comprehensive exploration of the topic, offering listeners multiple viewpoints and encouraging deeper reflection on the subject matter.`
            },
            vocabulary: Array(10).fill(null).map((_, i) => ({
                word: `concept${i + 1}`,
                definition: `An important term or concept discussed in the debate about ${debateTitle}`,
                context: `This term was used by the speakers when discussing key aspects of ${debateTitle}`,
                example: `Understanding this concept helps illuminate the broader discussion about ${debateTitle}.`
            })),
            exercises: {
                comprehensionQuestions: [
                    {
                        question: `What was the main topic of the debate about ${debateTitle}?`,
                        answer: `The debate focused on exploring different perspectives and arguments related to ${debateTitle}.`,
                        type: "short_answer" as const
                    },
                    {
                        question: `Which speaker presented the opening argument?`,
                        answer: "SPEAKER1 presented the opening perspective on the topic.",
                        type: "multiple_choice" as const
                    },
                    {
                        question: `Did both speakers agree on all points discussed?`,
                        answer: "False - the speakers presented different viewpoints and engaged in debate.",
                        type: "true_false" as const
                    },
                    {
                        question: `What evidence or examples were used in the debate?`,
                        answer: "The speakers used various examples and reasoning to support their arguments.",
                        type: "short_answer" as const
                    },
                    {
                        question: `What was the overall tone of the discussion?`,
                        answer: "The discussion was respectful and focused on exploring different perspectives.",
                        type: "short_answer" as const
                    }
                ],
                vocabularyExercises: [
                    {
                        question: `The debate explored several _____ related to the main topic.`,
                        answer: "concepts",
                        type: "fill_in_blank" as const
                    },
                    {
                        question: `Define the term used to describe the main argument in the debate.`,
                        answer: "A thesis or central claim that the speaker supports with evidence.",
                        type: "definition" as const
                    },
                    {
                        question: `Match the vocabulary term with its usage in the podcast.`,
                        answer: "Terms matched to their contextual usage in the debate.",
                        type: "matching" as const
                    },
                    {
                        question: `Complete the sentence: A counterargument is _____.`,
                        answer: "an opposing viewpoint or challenge to the main argument",
                        type: "fill_in_blank" as const
                    },
                    {
                        question: `What term describes the final thoughts or takeaway from the debate?`,
                        answer: "Conclusion or summary",
                        type: "definition" as const
                    }
                ],
                discussionPrompts: [
                    `What were the strongest arguments presented in the debate about ${debateTitle}, and why did they resonate with you?`,
                    `How might the different perspectives discussed in this debate apply to real-world situations or current events?`,
                    `If you were participating in this debate, what additional points or perspectives would you contribute to the discussion?`
                ]
            }
        };
    }
}

export async function generateAudio(
    text: string,
    voice: string,
    credential: string,
    voiceSpeed: number,
    model: string
) {

    const openai = new OpenAI({
        apiKey: credential
    })


    // keep audio speed 1, but ensure the text length is short (<~140 words)
    const response = await openai.audio.speech.create({
        model,
        voice,
        input: text,
        speed: voiceSpeed,
    })

    const result = await response.arrayBuffer()
    return new Uint8Array(result)
}

export async function generateDebateAudio(
    dialogue: Array<{ speaker: "SPEAKER1" | "SPEAKER2"; text: string }>,
    voice1: string,
    voice2: string,
    credential: string,
    voiceSpeed: number,
    audioModel: string,
): Promise<Buffer> {

    const ffmpegModule = (await import('fluent-ffmpeg')).default;
    const ffmpegInstaller = await import('@ffmpeg-installer/ffmpeg');

    // Prefer OS temp dir (writable on Vercel / serverless): /tmp on Linux
    const uniqueId = `${Date.now()}-${uuid()}`;
    const tempDir = path.join(os.tmpdir(), `podcastr-audio-${uniqueId}`);

    // set ffmpeg path if installer provides it
    if (ffmpegInstaller && 'path' in ffmpegInstaller && ffmpegInstaller.path) {
        ffmpegModule.setFfmpegPath(ffmpegInstaller.path);
    }

    // Helpful logs (will show up in Vercel function logs)
    console.log('podcastr: using temp dir:', tempDir);
    console.log('podcastr: ffmpeg path:', ffmpegInstaller?.path, 'exists?', ffmpegInstaller ? fs.existsSync(ffmpegInstaller.path) : 'no-installer');

    await fs.promises.mkdir(tempDir, { recursive: true });

    try {
        const audioFiles: string[] = [];
        const batchSize = 5;

        for (let i = 0; i < dialogue.length; i += batchSize) {
            const batch = dialogue.slice(i, i + batchSize);
            const batchPromises = batch.map(async (item, batchIndex) => {
                const globalIndex = i + batchIndex;
                const voice = item.speaker === "SPEAKER1" ? voice1 : voice2;
                const audioBytes = await generateAudio(item.text, voice, credential, voiceSpeed, audioModel); // your existing TTS call

                const tempFile = path.join(tempDir, `audio-${globalIndex}.mp3`);
                await fs.promises.writeFile(tempFile, audioBytes);
                return tempFile;
            });

            const batchResults = await Promise.all(batchPromises);
            audioFiles.push(...batchResults);
            console.log(`podcastr: generated ${audioFiles.length}/${dialogue.length} audio files`);
        }

        // create concat file list
        const concatFile = path.join(tempDir, 'concat.txt');
        const concatContent = audioFiles
            .map(file => `file '${path.resolve(file).replace(/\\/g, '/')}'`)
            .join('\n');
        await fs.promises.writeFile(concatFile, concatContent);

        const outputFile = path.join(tempDir, 'merged.mp3');

        // run ffmpeg using fluent-ffmpeg concat demuxer
        await new Promise<void>((resolve, reject) => {
            ffmpegModule(concatFile)
                .inputOptions(['-f', 'concat', '-safe', '0'])
                .outputOptions(['-y', '-c', 'copy'])
                .output(outputFile)
                .on('end', () => {
                    console.log('podcastr: ffmpeg finished merging');
                    resolve();
                })
                .on('error', (err: Error) => {
                    console.error('podcastr: ffmpeg error:', err);
                    reject(err);
                })
                .run();
        });

        const mergedAudio = await fs.promises.readFile(outputFile);

        // cleanup - remove tempDir recursively
        await fs.promises.rm(tempDir, { recursive: true, force: true }).catch(() => { });

        return mergedAudio;
    } catch (err) {
        console.error('podcastr: error in generateDebateAudio:', err);
        // best-effort cleanup
        await fs.promises.rm(tempDir, { recursive: true, force: true }).catch(() => { });
        throw err;
    }
}


type optionsType = {
    model: string,
    n: number,
    size?: "auto" | "1024x1024" | "1536x1024" | "1024x1536" | "256x256" | "512x512" | "1792x1024" | "1024x1792" | null,
    prompt: string,
    quality?: "standard" | "hd" | "low" | "medium" | "high" | "auto" | null
}

export async function generateImage(prompt: string, credential: string, model: string) {
    const credentialValue = await prisma.credential.findUnique({
        where: { id: credential }
    })

    if (!credentialValue) {
        throw new Error('Invalid credential')
    }

    const openai = new OpenAI({
        apiKey: decrypt(credentialValue?.value)
    })

    const options: optionsType = {
        model,
        n: 1,
        size: "1024x1024",
        prompt
    }

    if (model.startsWith('dall-e-3')) {
        options.quality = "standard"
    }

    const response = await openai.images.generate(options)


    return response.data?.[0]?.url;
}
