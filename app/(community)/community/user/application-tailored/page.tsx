import { caller } from "@/trpc/server"
import { requireAuth } from "@/utils/auth-utils"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, TrendingUp, Calendar, ArrowRight, Sparkles } from "lucide-react"
import { TailoredCVFreeTier, TailoredCVProTier } from "@/actions/ai-job-application-tailor"

const ApplicationTailoredPage = async () => {
    await requireAuth()
    const data = await caller.allUserTailoredCV()

    const isProTier = (data: any): data is TailoredCVProTier => {
        return data && 'tailoredSections' in data
    }

    const getMatchScore = (item: any) => {
        if (isProTier(item)) {
            return item.matchAnalysis?.tailored || 0
        } else {
            return item.matchScoreImprovement?.tailored || 0
        }
    }

    const getImprovement = (item: any) => {
        if (isProTier(item)) {
            return item.matchAnalysis?.improvement || 0
        } else {
            return item.matchScoreImprovement?.improvement || 0
        }
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date))
    }

    if (!data || data.length === 0) {
        return (
            <div className="min-h-screen w-4/5 mx-auto my-10">
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
                        <FileText className="w-10 h-10 text-gray-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                        No Tailored CVs Yet
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
                        You haven't tailored any CVs yet. Start by creating your first tailored CV for a job application.
                    </p>
                    <Link
                        href="/services/job-application-tailor"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-colors"
                    >
                        <Sparkles className="w-5 h-5" />
                        Create Your First Tailored CV
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-4/5 mx-auto my-10">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    My Tailored CVs
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    View and manage all your tailored CV applications
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((item) => {
                    const tailoredData = item.applicationTailored as TailoredCVFreeTier | TailoredCVProTier
                    const matchScore = getMatchScore(tailoredData)
                    const improvement = getImprovement(tailoredData)
                    const isPro = isProTier(tailoredData)
                    const hasCoverLetter = isPro && tailoredData.coverLetter

                    return (
                        <Link
                            key={item.id}
                            href={`/community/user/application-tailored/${item.id}`}
                            className="group"
                        >
                            <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-teal-500 dark:hover:border-teal-400 cursor-pointer">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                                                <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                            </div>
                                            {isPro && (
                                                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                                    Pro
                                                </Badge>
                                            )}
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(item.createdAt)}</span>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Match Score */}
                                    <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    Match Score
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                                                    {matchScore}%
                                                </div>
                                                {improvement > 0 && (
                                                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                                                        +{improvement}% improved
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Summary Preview */}
                                    {isPro && tailoredData.tailoredSections?.summary && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Summary Preview:
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                {tailoredData.tailoredSections.summary}
                                            </p>
                                        </div>
                                    )}

                                    {!isPro && tailoredData.tailoredSummary && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Summary Preview:
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                {tailoredData.tailoredSummary}
                                            </p>
                                        </div>
                                    )}

                                    {/* Features */}
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {hasCoverLetter && (
                                            <Badge variant="outline" className="text-xs">
                                                Cover Letter
                                            </Badge>
                                        )}
                                        {isPro && tailoredData.atsOptimization && (
                                            <Badge variant="outline" className="text-xs">
                                                ATS Optimized
                                            </Badge>
                                        )}
                                        {isPro && tailoredData.tailoredSections?.experience && tailoredData.tailoredSections.experience.length > 0 && (
                                            <Badge variant="outline" className="text-xs">
                                                {tailoredData.tailoredSections.experience.length} Experiences
                                            </Badge>
                                        )}
                                        {!isPro && tailoredData.tailoredExperience && tailoredData.tailoredExperience.length > 0 && (
                                            <Badge variant="outline" className="text-xs">
                                                {tailoredData.tailoredExperience.length} Experiences
                                            </Badge>
                                        )}
                                    </div>

                                    {/* View Details */}
                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between text-sm text-teal-600 dark:text-teal-400 font-medium group-hover:gap-2 transition-all">
                                            <span>View Details</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default ApplicationTailoredPage
