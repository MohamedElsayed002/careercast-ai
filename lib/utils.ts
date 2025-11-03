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


