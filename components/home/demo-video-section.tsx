"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"

interface DemoVideoSectionProps {
    videoId?: string
    youtubeUrl?: string
}

export function DemoVideoSection({ videoId, youtubeUrl }: DemoVideoSectionProps) {
    const [isOpen, setIsOpen] = useState(false)

    // Extract video ID from YouTube URL if provided
    const getVideoId = () => {
        if (videoId) return videoId
        if (youtubeUrl) {
            // Handle various YouTube URL formats
            const match = youtubeUrl.match(
                /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
            )
            return match ? match[1] : null
        }
        return null
    }

    const embedVideoId = getVideoId()

    if (!embedVideoId) {
        // Fallback if no video ID provided
        return (
            <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            See How It Works
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Add a YouTube video ID or URL to show a demo video
                        </p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-5xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            See How It Works
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Watch a quick demo to see how easy it is to create professional podcasts with AI
                        </p>
                    </div>

                    {/* Video Preview */}
                    <div className="relative group">
                        {/* Video Thumbnail/Preview */}
                        <div
                            className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer shadow-2xl transform transition-all duration-300 group-hover:scale-[1.02]"
                            onClick={() => setIsOpen(true)}
                        >
                            <img
                                src={`https://img.youtube.com/vi/${embedVideoId}/maxresdefault.jpg`}
                                alt="Video thumbnail"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Fallback to standard thumbnail
                                    e.currentTarget.src = `https://img.youtube.com/vi/${embedVideoId}/hqdefault.jpg`
                                }}
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
                                    <Button
                                        size="lg"
                                        className="relative bg-white/90 hover:bg-white text-purple-600 rounded-full w-20 h-20 p-0 shadow-2xl"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setIsOpen(true)
                                        }}
                                    >
                                        <Play className="w-10 h-10 ml-1" fill="currentColor" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Video Modal */}
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogContent className="max-w-5xl w-full p-0 bg-black border-none">
                            <DialogHeader className="sr-only">
                                <DialogTitle>Demo Video</DialogTitle>
                                <DialogDescription>Watch how to use the podcast creation tool</DialogDescription>
                            </DialogHeader>
                            <div className="relative aspect-video w-full">
                                <iframe
                                    src={`https://www.youtube.com/embed/${embedVideoId}?autoplay=1&rel=0`}
                                    title="Demo Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute inset-0 w-full h-full"
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </section>
    )
}

