import { z } from 'zod'


export const formSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be less than 100 characters"),

    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(1000, "Description must be less than 1000 characters"),

    // If it's a URL or base64, validate it:
    image: z
        .string()
        .url("Image must be a valid URL")
        .min(1, "Image is required"),

    // Voices required (usually model IDs)
    voice1: z.string().min(1, "Voice 1 is required"),
    voice2: z.string().min(1, "Voice 2 is required"),

    // Duration must be a number, not a string:
    duration: z.string(),

    credential: z
        .string()
        .min(3, "Credential must be at least 3 characters"),

    voiceSpeed: z.number()
        .min(0.8, "Minimum speed is 0.8")
        .max(1.5, "Maximum speed is 1.5"),

    imageModel: z.string().min(1, "Image model is required"),

    audioModel: z.string().min(1, "Audio model is required"),

    textModel: z.string().min(1, "Text model is required"),
});



interface UploadThingTypes {
    appUrl: string
    customId: string | null
    fileHash: string
    key: string
    lastModified: number
    name: string
    serverData: {
        uploadedBy: string
    }
    size: string
    type: string
    ufsUrl: string
    url: string
}


export interface PricingFeature {
    text: string
    icon?: React.ReactNode
}


export interface PricingTier {
    name: string
    price: string
    description: string
    features: PricingFeature[]
    badge?: string
    cta: string
    ctaAction: () => void
    popular?: boolean
}


export type Podcast = {
    id: string
    message: string
    audioUrl: string
    pdfUrl: string
    imageUrl?: string | null
    createdAt: string | Date
}

export type HomePageProps = {
    totalPodcasts: number
    recentPodcasts: Podcast[]
}

export const DebateSchema = z.object({
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
export const PodcastEducationalContentSchema = z.object({
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


export type optionsType = {
    model: string,
    n: number,
    size?: "auto" | "1024x1024" | "1536x1024" | "1024x1536" | "256x256" | "512x512" | "1792x1024" | "1024x1792" | null,
    prompt: string,
    quality?: "standard" | "hd" | "low" | "medium" | "high" | "auto" | null
}