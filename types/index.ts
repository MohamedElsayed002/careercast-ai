import { z } from 'zod'

export const formSchema = z.object({
        title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
        description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
        image: z.string(),
        voice1: z.string(),
        voice2: z.string(),
        duration: z.string(),
        credential: z.string(),
        voiceSpeed: z.number().min(0.8).max(1.5).optional()
})


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