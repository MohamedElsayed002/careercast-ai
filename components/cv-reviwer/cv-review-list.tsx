"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, ArrowRight, CheckCircle, XCircle, Calendar } from "lucide-react"
import { CVReviewFreeTier, CVReviewProTier } from "@/actions/cv-reviewer"
import { Prisma } from "@/src/generated/prisma"

type CVReviewItem = {
    id: string
    userId: string
    review: Prisma.JsonValue
    createdAt: Date
}

interface CVReviewListProps {
    reviews: CVReviewItem[]
}

export const CVReviewList = ({ reviews }: CVReviewListProps) => {
    const formatDate = (dateString: string | Date | null | undefined) => {
        if (!dateString) return 'Unknown date'
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return 'Unknown date'
        }
    }

    const isProTier = (review: CVReviewFreeTier | CVReviewProTier): review is CVReviewProTier => {
        return 'recommendations' in review && 'weaknesses' in review && 'experienceMatch' in review
    }

    if (!reviews || reviews.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full blur-2xl opacity-50 animate-pulse" />
                    <div className="relative size-24 rounded-full bg-gradient-to-br from-teal-500 via-blue-500 to-cyan-500 flex items-center justify-center text-5xl animate-bounce">
                        📄
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                        No CV reviews yet!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Upload your CV and get your first AI-powered review ✨
                    </p>
                    <Link href="/reviewer/cv-reviewer">
                        <Button className="mt-4 bg-teal-600 hover:bg-teal-700 text-white">
                            Create Your First Review
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((item, idx) => {
                const review = item.review as CVReviewFreeTier | CVReviewProTier
                if (!review) return null

                const isPro = isProTier(review)

                return (
                    <Card
                        key={item.id}
                        className="group relative bg-white dark:bg-gray-900 border-2 hover:border-teal-500 dark:hover:border-teal-400 transition-all duration-300 hover:shadow-xl overflow-hidden"
                    >
                        {/* Glow effect */}
                        <div className={`absolute -inset-1 bg-gradient-to-r ${review.isGoodMatch ? 'from-green-500 to-teal-500' : 'from-red-500 to-orange-500'} rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300`} />

                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    {review.isGoodMatch ? (
                                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    ) : (
                                        <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                    )}
                                    <CardTitle className="text-lg font-bold">
                                        {review.isGoodMatch ? 'Good Match' : 'Needs Work'}
                                    </CardTitle>
                                </div>
                                {isPro && (
                                    <Badge className="bg-yellow-500 text-white">Pro</Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>{item.createdAt ? formatDate(item.createdAt) : `Review #${reviews.length - idx}`}</span>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Match Score */}
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-lg">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Match Score</span>
                                <div className="flex items-center gap-2">
                                    <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                                        {review.matchPercentage}%
                                    </div>
                                </div>
                            </div>

                            {/* Verdict Preview */}
                            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                    {review.verdict}
                                </p>
                            </div>

                            {/* Skills Summary */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-green-700 dark:text-green-300 font-medium">
                                        ✓ {review.matchedSkills?.length || 0} Matched Skills
                                    </span>
                                    <span className="text-red-700 dark:text-red-300 font-medium">
                                        ✗ {review.missingSkills?.length || 0} Missing
                                    </span>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter>
                            {/* View Details Button */}
                            <Button  className="w-full bg-teal-600 hover:bg-teal-700 text-white cursor-pointer z-50" asChild>
                                <Link href={`/community/user/cv-reviews/${item.id}`}>
                                    View Full Analysis
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )
}

