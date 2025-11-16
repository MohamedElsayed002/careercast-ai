"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function PodcastSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")

    // Debounce search query (only when searchQuery changes)
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())
            const currentSearch = params.get("search") || ""

            // Only update URL when the search value actually changed
            if (currentSearch !== searchQuery) {
                if (searchQuery) {
                    params.set("search", searchQuery)
                    params.set("page", "1") // Reset to first page only when search changes
                } else {
                    params.delete("search")
                    params.delete("page")
                }
                router.push(`?${params.toString()}`, { scroll: false })
            }
        }, 500) // 500ms debounce delay

        return () => clearTimeout(timer)
    }, [searchQuery, router])

    return (
        <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search podcasts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-base bg-white/10 dark:bg-gray-900/50 backdrop-blur-sm border-purple-300/50 dark:border-purple-700/50 focus-visible:border-purple-500 dark:focus-visible:border-purple-400"
                />
            </div>
        </div>
    )
}
