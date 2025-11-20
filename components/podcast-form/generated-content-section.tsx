"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {  Download, FileText, Music2, Volume2 } from "lucide-react"
import { toast } from "sonner"
import { usePodcastAudio } from "@/hooks/use-podcast-audio"

interface GeneratedContentSectionProps {
    audioURL?: string
    pdfURL?: string
}

export const GeneratedContentSection = ({ audioURL, pdfURL }: GeneratedContentSectionProps) => {
    const { handleAudioRef } = usePodcastAudio({
        audioURL: audioURL || ""
    })

    const downloadAudio = () => {
        if (!audioURL) return
        const link = document.createElement('a')
        link.href = audioURL
        link.download = `podcast-${Date.now()}.mp3`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success('Audio downloaded!')
    }

    const downloadPDF = () => {
        if (!pdfURL) return
        window.open(pdfURL, '_blank')
        toast.success('Opening PDF...')
    }

    if (!audioURL && !pdfURL) {
        return null
    }

    return (
        <div className="mt-8 space-y-6 py-5">
            <Card className="shadow-lg border-2 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Volume2 className="w-5 h-5 text-primary" />
                        Generated Content
                    </CardTitle>
                    <CardDescription>
                        Your podcast is ready! Listen, preview, or download below
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Audio Player */}
                    {audioURL && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Music2 className="w-5 h-5 text-primary" />
                                    Audio Podcast
                                </h3>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg border">
                                <div className="flex-1">
                                    <audio
                                        ref={handleAudioRef}
                                        src={audioURL}
                                        controls
                                        className="w-full h-10"
                                    />
                                </div>
                                <Button
                                    onClick={downloadAudio}
                                    variant="outline"
                                    size="icon"
                                    className="shrink-0 text-white"
                                >
                                    <Download className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* PDF Preview */}
                    {pdfURL && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    PDF Transcript
                                </h3>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg border">
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">
                                        PDF generated successfully
                                    </p>
                                </div>
                                <Button
                                    onClick={downloadPDF}
                                    variant="outline"
                                    className="shrink-0 text-white"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Open PDF
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
