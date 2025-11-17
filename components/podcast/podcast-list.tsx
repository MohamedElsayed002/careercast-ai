"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {  FileText, Download, Music2 } from "lucide-react";

type PodcastItem = {
    id: string;
    createdAt: string;
    userId: string;
    message: string;
    audioUrl: string;
    audioId: string | null;
    pdfUrl: string;
    pdfId: string | null;
    imageUrl: string | null;
};

const gradientColors = [
    "from-purple-500 via-pink-500 to-red-500",
    "from-cyan-500 via-blue-500 to-indigo-500",
    "from-yellow-500 via-orange-500 to-red-500",
    "from-green-500 via-teal-500 to-cyan-500",
    "from-pink-500 via-rose-500 to-orange-500",
    "from-blue-500 via-purple-500 to-fuchsia-500",
];

export function PodcastList(props: { podcasts: PodcastItem[] }) {
    const { podcasts } = props;
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 20);
        return () => clearTimeout(t);
    }, []);

    if (!podcasts?.length) {
        return (
            <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-50 animate-pulse" />
                    <div className="relative size-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center text-5xl animate-bounce">
                        🎙️
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        No podcasts yet!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Create your first podcast and watch it appear here ✨
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {podcasts.map((p, idx) => {
                const delay = `${idx * 60}ms`;
                const created = new Date(p.createdAt);
                const dateLabel = created.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
                const gradient = gradientColors[idx % gradientColors.length];
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
                                <div className="relative w-full h-48 overflow-hidden">
                                    <Image
                                        src={p.imageUrl ? p.imageUrl : '/image.png'}
                                        alt={p.message}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                    <div className="absolute top-4 right-4">
                                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                                            {dateLabel}
                                        </Badge>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <CardTitle className="text-lg leading-6 line-clamp-2 font-bold text-white drop-shadow-lg">
                                            {p.message}
                                        </CardTitle>
                                    </div>
                                </div>
                            <CardContent className="p-6 space-y-4">
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
                                        onClick={() => downloadPdf(p.pdfUrl)}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );
            })}
        </div>
    );
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


