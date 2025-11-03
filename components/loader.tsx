import { Skeleton } from "./ui/skeleton"
import { Card, CardContent } from "./ui/card"

export const PodcastsLoader = () => {
    return (
        <div className="group relative">
            {/* Glow effect skeleton */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl blur opacity-25 animate-pulse" />

            <Card className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-0 shadow-xl overflow-hidden">
                {/* Header Skeleton - Image/Gradient area */}
                <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-red-500/20 animate-pulse">
                    <Skeleton className="absolute top-4 right-4 h-6 w-20 rounded-full" />
                    <div className="absolute bottom-4 left-4 right-4 space-y-2">
                        <Skeleton className="h-5 w-3/4 rounded" />
                        <Skeleton className="h-5 w-1/2 rounded" />
                    </div>
                </div>

                <CardContent className="p-6 space-y-4">
                    {/* Audio Player Section Skeleton */}
                    <div className="rounded-xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 p-4 border border-purple-200/50 dark:border-purple-800/50">
                        <div className="flex items-center gap-2 mb-3">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-24 rounded" />
                        </div>
                        {/* Audio controls skeleton */}
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>

                    {/* Action Buttons Skeleton */}
                    <div className="flex items-center gap-3">
                        <Skeleton className="flex-1 h-9 rounded-md" />
                        <Skeleton className="flex-1 h-9 rounded-md" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}