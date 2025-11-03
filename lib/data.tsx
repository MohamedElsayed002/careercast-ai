import { PricingFeature } from "@/types"
import {  Sparkles, Crown, Zap, Image as ImageIcon, Infinity, Upload } from "lucide-react"

export const freeFeatures: PricingFeature[] = [
    { text: "3 Free Podcasts", icon: <Zap className="w-4 h-4" /> },
    { text: "AI Voice Generation", icon: <Sparkles className="w-4 h-4" /> },
    { text: "PDF Transcripts", icon: <Sparkles className="w-4 h-4" /> },
    { text: "Upload Cover Images", icon: <Upload className="w-4 h-4" /> },
    { text: "Audio Download", icon: <Sparkles className="w-4 h-4" /> },
  ]
  
  export const proFeatures: PricingFeature[] = [
    { text: "Unlimited Podcasts", icon: <Infinity className="w-4 h-4" /> },
    { text: "AI Voice Generation", icon: <Sparkles className="w-4 h-4" /> },
    { text: "PDF Transcripts", icon: <Sparkles className="w-4 h-4" /> },
    { text: "AI Image Generation", icon: <ImageIcon className="w-4 h-4" /> },
    { text: "Upload Cover Images", icon: <Upload className="w-4 h-4" /> },
    { text: "Audio Download", icon: <Sparkles className="w-4 h-4" /> },
    { text: "Priority Support", icon: <Crown className="w-4 h-4" /> },
  ]
  