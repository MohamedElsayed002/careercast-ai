"use client"

import { Podcast } from "@/src/generated/prisma"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Download, FileText, Globe, Loader2, Lock, Music2 } from "lucide-react"
import { Button } from "../ui/button"
import { PodcastItem } from "./podcast-list-user"



interface SinglePodcastProps {
    p: PodcastItem
    dateLabel: string
    gradient: string
    delay: string
    isPublic: boolean
    mounted: boolean
}


export const SinglePodcast = ({p,dateLabel,gradient,delay,isPublic,mounted}: SinglePodcastProps) => {

    const queryClient = useQueryClient()
    const trpc = useTRPC()
    const getUserKey = trpc.getUser.queryOptions(undefined).queryKey;
    const getPagedKey = trpc.getPodcastsWithPagination.queryOptions({}).queryKey;
    const getHomeKey = trpc.getHomePodcast.queryOptions(undefined).queryKey;

    const { mutate, isPending } = useMutation(trpc.changePodcastStatus.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getUserKey });
            queryClient.invalidateQueries({ queryKey: getPagedKey });
            queryClient.invalidateQueries({ queryKey: getHomeKey });
            toast.success("Podcast status updated successfully!")
        },
        onError: () => {
            toast.error("Failed to update podcast status.")
        }
    }))

    return (
        <div
            key={p.id}
            className="group relative"
            style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0px)" : "translateY(20px)",
                transition: "opacity 600ms ease, transform 600ms ease",
                transitionDelay: delay,
            }}
        >
            {/* Glow effect */}
            <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300`} />

            <Card className={`relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden`}>
                {/* Image Header */}
                {p.imageUrl && p.imageUrl ? (
                    <div className="relative w-full h-48 overflow-hidden">
                        <Image
                            src={p.imageUrl}
                            alt={p.message ?? "Untitled Podcast"}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute top-4 right-4">
                            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                                {dateLabel}
                            </Badge>
                        </div>
                        {/* <div className="absolute inset-0 capitalize top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-full text-sm font-medium text-white shadow-lg"> */}
                        <Badge className="absolute top-4 left-4  bg-gradient-to-r from-purple-600 to-pink-600 text-white border-white/30 backdrop-blur-sm">
                            {p.status && p.status.toUpperCase()}
                        </Badge>
                        {/* </div> */}
                        <div className="absolute bottom-4 left-4 right-4">
                            <CardTitle className="text-lg leading-6 line-clamp-2 font-bold text-white drop-shadow-lg">
                                {p.title}
                            </CardTitle>
                        </div>
                    </div>
                ) : (
                    <CardHeader className={`bg-gradient-to-br ${gradient} p-6 text-white`}>
                        <div className="flex items-start justify-between gap-3">
                            <CardTitle className="text-lg leading-6 line-clamp-2 font-bold text-white">
                                {p.message}
                            </CardTitle>
                            <Badge className="shrink-0 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                                {dateLabel}
                            </Badge>
                        </div>
                    </CardHeader>
                )}
                <CardContent className="p-6 space-y-4">
                    {/* Status Toggle */}
                    <div className="rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 p-4 border border-gray-200/50 dark:border-gray-800/50">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg transition-all duration-300 ${isPublic
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                                    }`}>
                                    {isPublic ? (
                                        <Globe className="w-5 h-5" />
                                    ) : (
                                        <Lock className="w-5 h-5" />
                                    )}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {isPublic ? 'Public' : 'Private'}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {isPublic ? 'Anyone can view' : 'Only you can view'}
                                    </div>
                                </div>
                            </div>

                            {/* Toggle Switch */}
                            <button
                                onClick={() => mutate({ podcastId: p.id!, status: isPublic ? 'PRIVATE' : 'PUBLIC' })}
                                disabled={isPending}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${isPublic
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 focus:ring-green-500'
                                    : 'bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 focus:ring-gray-400'
                                    }`}
                            >
                                <span className="sr-only">Toggle status</span>
                                <span
                                    className={`inline-flex h-6 w-6 items-center justify-center transform rounded-full bg-white shadow-lg transition-all duration-300 ${isPublic ? 'translate-x-7' : 'translate-x-1'
                                        }`}
                                >
                                    {isPending ? (
                                        <Loader2 className="w-3 h-3 animate-spin text-gray-600" />
                                    ) : isPublic ? (
                                        <Globe className="w-3 h-3 text-green-600" />
                                    ) : (
                                        <Lock className="w-3 h-3 text-gray-600" />
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Audio Player */}
                    <div className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 border border-purple-200/50 dark:border-purple-800/50">
                        <div className="flex items-center gap-2 mb-2">
                            <Music2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Audio Podcast</span>
                        </div>
                        <audio controls src={p.audioUrl} className="w-full rounded-lg" />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <Button
                            asChild
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all"
                        >
                            <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                <FileText className="w-4 h-4" />
                                View PDF
                            </a>
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                            onClick={() => downloadPdf(p.pdfUrl ?? "")}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                    </div>
                </CardContent>

            </Card>
        </div>
    )
}

function downloadPdf(url: string) {
    fetch(url)
        .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch PDF");
            return res.blob();
        })
        .then((blob) => {
            const obj = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = obj;
            a.download = "podcast-brief.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(obj);
        })
        .catch(() => {
            window.open(url, "_blank", "noopener,noreferrer");
        });
}

