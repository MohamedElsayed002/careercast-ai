"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useMemo } from "react"

interface PodcastPaginationProps {
    currentPage: number
    totalPages: number
}

export function PodcastPagination({ currentPage, totalPages }: PodcastPaginationProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        if (page === 1) {
            params.delete("page")
        } else {
            params.set("page", page.toString())
        }
        router.push(`?${params.toString()}`)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    // Generate pagination page numbers
    const paginationPages = useMemo(() => {
        const pages: (number | "ellipsis")[] = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            // Show all pages if total is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Always show first page
            pages.push(1)

            if (currentPage <= 3) {
                // Near the start
                for (let i = 2; i <= 4; i++) {
                    pages.push(i)
                }
                pages.push("ellipsis")
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                // Near the end
                pages.push("ellipsis")
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                // In the middle
                pages.push("ellipsis")
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                pages.push("ellipsis")
                pages.push(totalPages)
            }
        }

        return pages
    }, [currentPage, totalPages])

    if (totalPages <= 1) return null

    return (
        <Pagination className="mt-8">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            if (currentPage > 1) {
                                handlePageChange(currentPage - 1)
                            }
                        }}
                        className={
                            currentPage === 1
                                ? "pointer-events-none opacity-50 border"
                                : "cursor-pointer border text-white"
                        }
                    />
                </PaginationItem>

                {paginationPages.map((page, index) => {
                    if (page === "ellipsis") {
                        return (
                            <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )
                    }

                    return (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    handlePageChange(page)
                                }}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    )
                })}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            if (currentPage < totalPages) {
                                handlePageChange(currentPage + 1)
                            }
                        }}
                        className={
                            currentPage === totalPages
                                ? "pointer-events-none opacity-50 border text-white"
                                : "cursor-pointer border text-white"
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

