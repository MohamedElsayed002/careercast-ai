"use client"

import { CVReviewFreeTier, CVReviewProTier } from "@/actions/cv-reviewer"
import { AlertCircle, CheckCircle, Sparkles, XCircle, ArrowLeft, Crown } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

interface CVReviewDetailProps {
    review: CVReviewFreeTier | CVReviewProTier
    isProTier: boolean
}

export const CVReviewDetail = ({ review, isProTier }: CVReviewDetailProps) => {

    return (
        <div className='space-y-6'>
            {/* Header with Back Button */}
            <div className="flex items-center justify-between">
                <Link href="/community/user/cv-reviews">
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Reviews
                    </Button>
                </Link>
                {isProTier && (
                    <Badge className="bg-yellow-500 text-white gap-1">
                        <Crown className="w-3 h-3" />
                        Pro Analysis
                    </Badge>
                )}
            </div>

            {/* Match Summary Card */}
            <Card className={`border-2 ${review.isGoodMatch ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-400' : 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-400'}`}>
                <CardContent className="p-6">
                    <div className='flex items-center gap-4 mb-4'>
                        {review.isGoodMatch ? (
                            <CheckCircle className='w-12 h-12 text-green-600 dark:text-green-400' />
                        ) : (
                            <XCircle className='w-12 h-12 text-red-600 dark:text-red-400' />
                        )}
                        <div>
                            <h3 className={`text-2xl font-bold ${review.isGoodMatch ? 'text-green-900 dark:text-green-200' : 'text-red-900 dark:text-red-200'}`}>
                                {review.isGoodMatch ? 'Good Match!' : 'Needs Improvement'}
                            </h3>
                            <p className={`text-lg ${review.isGoodMatch ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                                Match Score: {review.matchPercentage}%
                            </p>
                        </div>
                    </div>
                    <p className={`${review.isGoodMatch ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                        {review.verdict}
                    </p>
                </CardContent>
            </Card>

            {/* Pro Tier Only: Experience Match */}
            {isProTier && 'experienceMatch' in review && review.experienceMatch && (
                <Card className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-teal-900 dark:text-teal-200 flex items-center gap-2">
                            📅 Experience Match
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-teal-800 dark:text-teal-200">
                        <p><strong>Required:</strong> {review.experienceMatch.yearsRequired}</p>
                        <p><strong>Your Experience:</strong> {review.experienceMatch.yearsInCV}</p>
                        <p className="text-sm mt-3 italic">{review.experienceMatch.assessment}</p>
                    </CardContent>
                </Card>
            )}

            {/* Pro Tier Only: Key Highlights */}
            {isProTier && 'keyHighlights' in review && review.keyHighlights && review.keyHighlights.length > 0 && (
                <Card className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-purple-900 dark:text-purple-200 flex items-center gap-2">
                            ⭐ Key Highlights
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {review.keyHighlights.map((highlight, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-purple-800 dark:text-purple-200">
                                    <span className="text-purple-600 dark:text-purple-400 mt-1">★</span>
                                    <span>{highlight}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Skills Analysis Grid */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Matched Skills */}
                {review.matchedSkills && review.matchedSkills.length > 0 && (
                    <Card className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-green-900 dark:text-green-200 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Matched Skills ({review.matchedSkills.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {review.matchedSkills.map((skill, idx) => (
                                    <Badge key={idx} className="bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Missing Skills */}
                {review.missingSkills && review.missingSkills.length > 0 && (
                    <Card className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-red-900 dark:text-red-200 flex items-center gap-2">
                                <XCircle className="w-5 h-5" />
                                Missing Skills ({review.missingSkills.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {review.missingSkills.map((skill, idx) => (
                                    <Badge key={idx} className="bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Strengths */}
            {review.strengths && review.strengths.length > 0 && (
                <Card className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-green-900 dark:text-green-200 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Strengths
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {review.strengths.map((strength, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-green-800 dark:text-green-200">
                                    <span className="text-green-600 dark:text-green-400 mt-1 font-bold">✓</span>
                                    <span className="flex-1">{strength}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Pro Tier Only: Weaknesses */}
            {isProTier && 'weaknesses' in review && review.weaknesses && review.weaknesses.length > 0 && (
                <Card className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-yellow-900 dark:text-yellow-200 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            Areas for Improvement
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {review.weaknesses.map((weakness, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-yellow-800 dark:text-yellow-200">
                                    <span className="text-yellow-600 dark:text-yellow-400 mt-1 font-bold">⚠</span>
                                    <span className="flex-1">{weakness}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Pro Tier Only: Recommendations */}
            {isProTier && 'recommendations' in review && review.recommendations && review.recommendations.length > 0 && (
                <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Recommendations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {review.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-blue-800 dark:text-blue-200">
                                    <span className="text-blue-600 dark:text-blue-400 mt-1 font-bold">{idx + 1}.</span>
                                    <span className="flex-1">{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Free Tier: Upgrade Prompt */}
            {!isProTier && 'upgradePrompt' in review && review.upgradePrompt && (
                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-400 dark:border-yellow-600">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-yellow-900 dark:text-yellow-200 flex items-center gap-2">
                            <Crown className="w-5 h-5" />
                            Upgrade to Pro for More Insights
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-yellow-800 dark:text-yellow-200">
                            {review.upgradePrompt.message}
                        </p>
                        {review.upgradePrompt.hiddenFeatures && review.upgradePrompt.hiddenFeatures.length > 0 && (
                            <div>
                                <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                                    Pro features include:
                                </p>
                                <ul className="space-y-1">
                                    {review.upgradePrompt.hiddenFeatures.map((feature, idx) => (
                                        <li key={idx} className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                                            <span className="text-yellow-600 dark:text-yellow-400">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <Link href="/reviewer/pricing">
                            <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                                <Crown className="w-4 h-4 mr-2" />
                                Upgrade to Pro
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                <Link href="/reviewer/cv-reviewer" className="flex-1">
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                        Analyze Another CV
                    </Button>
                </Link>
            </div>
        </div>
    )
}

