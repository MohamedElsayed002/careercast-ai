import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const voices = [
    { label: "Alloy", value: "alloy", description: "Balanced and versatile" },
    { label: "Ash", value: "ash", description: "Soft and warm" },
    { label: "Ballad", value: "ballad", description: "Emotional and soothing" },
    { label: "Cedar", value: "cedar", description: "Calm and serene" },
    { label: "Coral", value: "coral", description: "Bright and cheerful" },
    { label: "Echo", value: "echo", description: "Clear and crisp" },
    { label: "Marin", value: "marin", description: "Gentle and soothing" },
    { label: "Sage", value: "sage", description: "Smooth and professional" },
    { label: "Shimmer", value: "shimmer", description: "Bright and energetic" },
    { label: "Verse", value: "verse", description: "Deep and resonant" }
]


// Helper function to remove emojis and special characters that can't be encoded in WinAnsi
export function sanitizeForPDF(text: string): string {
    // Remove emojis and special Unicode characters
    return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
        .replace(/[^\x00-\xFF]/g, '') // Remove non-Latin characters
        .trim();
}

// Parse minutes from duration string (1, 5, 10, 20)
export const parseTargetMinutes = (duration: string) => {
    const minutes = Number(duration);
    // Validate and return the duration (1, 5, 10, or 20)
    if ([1, 5, 10, 20].includes(minutes)) {
        return minutes;
    }
    return 1; // default to 1 minute
}

// Helper function to sanitize entire object recursively
export function sanitizeObject<T>(obj: T): T {
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

