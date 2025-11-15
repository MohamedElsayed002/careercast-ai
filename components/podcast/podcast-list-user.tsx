"use client";

import { useEffect, useState } from "react";
import { SinglePodcast } from "./single-podcast";

export type PodcastItem = {
    id: string;
    createdAt: string;
    userId: string;
    message: string;
    title: string;
    audioUrl: string;
    status: "PUBLIC" | "PRIVATE"
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

export function PodcastListUser(props: { podcasts: PodcastItem[] }) {
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
                const isPublic = p.status === 'PUBLIC'
                return <SinglePodcast
                    key={p.id}
                    p={p}
                    mounted={mounted}
                    dateLabel={dateLabel}
                    gradient={gradient}
                    delay={delay}
                    isPublic={isPublic}
                />
            })}
        </div>
    );
}


