import { TailoredCVFreeTier, TailoredCVProTier } from "@/actions/ai-job-application-tailor"
import { CheckCircle, TrendingUp, FileText, Sparkles, Copy, Download, ArrowLeft, AlertCircle, Target, BarChart3, Lightbulb } from "lucide-react"
import { Button } from "../ui/button"
import { useState } from "react"
import { toast } from "sonner"

interface TailoredResultProps {
    data: TailoredCVFreeTier | TailoredCVProTier
    isPro: boolean
    onReset: () => void
}

export const TailoredResult = ({ data, isPro, onReset }: TailoredResultProps) => {
    const [copiedSection, setCopiedSection] = useState<string | null>(null)

    const copyToClipboard = (text: string, section: string) => {
        navigator.clipboard.writeText(text)
        setCopiedSection(section)
        toast.success(`${section} copied to clipboard!`)
        setTimeout(() => setCopiedSection(null), 2000)
    }

    const isProTier = (data: TailoredCVFreeTier | TailoredCVProTier): data is TailoredCVProTier => {
        return 'tailoredSections' in data
    }

    const proData = isProTier(data) ? data : null
    const freeData = !isProTier(data) ? data : null

    return (
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 dark:bg-teal-900/20 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                </div>
                <h1 className="text-4xl font-bold mb-2">CV Tailored Successfully!</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Your CV has been optimized for the job description
                </p>
            </div>

            {/* Match Score Improvement */}
            {proData?.matchAnalysis && (
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border-2 border-teal-500 dark:border-teal-400 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-teal-900 dark:text-teal-200 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6" />
                            Match Score Improvement
                        </h2>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                                +{proData.matchAnalysis.improvement}%
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Improvement</div>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Original Match</div>
                            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                                {proData.matchAnalysis.original}%
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tailored Match</div>
                            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                                {proData.matchAnalysis.tailored}%
                            </div>
                        </div>
                    </div>
                    {proData.matchAnalysis.breakdown && (
                        <div className="mt-4 grid md:grid-cols-3 gap-3">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Skills Match</div>
                                <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                    {proData.matchAnalysis.breakdown.skillsMatch}%
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Experience Match</div>
                                <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                                    {proData.matchAnalysis.breakdown.experienceMatch}%
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Keywords Match</div>
                                <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                                    {proData.matchAnalysis.breakdown.keywordsMatch}%
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {freeData?.matchScoreImprovement && (
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border-2 border-teal-500 dark:border-teal-400 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-teal-900 dark:text-teal-200 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6" />
                            Match Score Improvement
                        </h2>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                                +{freeData.matchScoreImprovement.improvement}%
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Improvement</div>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Original Match</div>
                            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                                {freeData.matchScoreImprovement.original}%
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tailored Match</div>
                            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                                {freeData.matchScoreImprovement.tailored}%
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tailored Summary */}
            {proData?.tailoredSections?.summary && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Tailored Professional Summary
                        </h2>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(proData.tailoredSections.summary, 'Summary')}
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            {copiedSection === 'Summary' ? 'Copied!' : 'Copy'}
                        </Button>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {proData.tailoredSections.summary}
                    </p>
                </div>
            )}

            {freeData?.tailoredSummary && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Tailored Professional Summary
                        </h2>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(freeData.tailoredSummary, 'Summary')}
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            {copiedSection === 'Summary' ? 'Copied!' : 'Copy'}
                        </Button>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {freeData.tailoredSummary}
                    </p>
                </div>
            )}

            {/* Tailored Experience - Pro */}
            {proData?.tailoredSections?.experience && proData.tailoredSections.experience.length > 0 && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Tailored Work Experience
                    </h2>
                    <div className="space-y-6">
                        {proData.tailoredSections.experience.map((exp, idx) => (
                            <div key={idx} className="border-l-4 border-teal-500 pl-4 space-y-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {exp.title} at {exp.company}
                                    </h3>
                                    {exp.duration && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{exp.duration}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Tailored Bullets:
                                    </h4>
                                    <ul className="space-y-2">
                                        {exp.tailoredBullets.map((bullet, bulletIdx) => (
                                            <li key={bulletIdx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                                <span className="text-teal-600 dark:text-teal-400 mt-1">•</span>
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {exp.changes && exp.changes.length > 0 && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                                            Changes Made:
                                        </h4>
                                        <ul className="space-y-1">
                                            {exp.changes.map((change, changeIdx) => (
                                                <li key={changeIdx} className="text-sm text-blue-800 dark:text-blue-300">
                                                    • {change}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tailored Experience - Free */}
            {freeData?.tailoredExperience && freeData.tailoredExperience.length > 0 && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Tailored Work Experience (First 2 Only)
                    </h2>
                    <div className="space-y-6">
                        {freeData.tailoredExperience.map((exp, idx) => (
                            <div key={idx} className="border-l-4 border-teal-500 pl-4 space-y-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {exp.originalTitle} at {exp.company}
                                    </h3>
                                </div>
                                
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Tailored Bullets:
                                    </h4>
                                    <ul className="space-y-2">
                                        {exp.tailoredBullets.map((bullet, bulletIdx) => (
                                            <li key={bulletIdx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                                <span className="text-teal-600 dark:text-teal-400 mt-1">•</span>
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills - Pro */}
            {proData?.tailoredSections?.skills && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Optimized Skills
                    </h2>
                    <div className="space-y-4">
                        {proData.tailoredSections.skills.reordered && proData.tailoredSections.skills.reordered.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Reordered by Relevance:
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {proData.tailoredSections.skills.reordered.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 rounded-full text-sm font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {proData.tailoredSections.skills.addedKeywords && proData.tailoredSections.skills.addedKeywords.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Added ATS Keywords:
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {proData.tailoredSections.skills.addedKeywords.map((keyword, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium"
                                        >
                                            + {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Top Keywords - Free */}
            {freeData?.topAddedKeywords && freeData.topAddedKeywords.length > 0 && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Top ATS Keywords Added
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {freeData.topAddedKeywords.map((keyword, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium"
                            >
                                + {keyword}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* ATS Optimization - Pro */}
            {proData?.atsOptimization && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        ATS Optimization Report
                    </h2>
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    ATS Compatibility Score
                                </span>
                                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {proData.atsOptimization.compatibilityScore}%
                                </span>
                            </div>
                        </div>

                        {proData.atsOptimization.keywordDensity && proData.atsOptimization.keywordDensity.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Keyword Density:
                                </h3>
                                <div className="grid md:grid-cols-2 gap-2">
                                    {proData.atsOptimization.keywordDensity.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2"
                                        >
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{item.keyword}</span>
                                            <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                                                {item.density}x
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {proData.atsOptimization.missingCriticalKeywords && proData.atsOptimization.missingCriticalKeywords.length > 0 && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-2 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Missing Critical Keywords:
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {proData.atsOptimization.missingCriticalKeywords.map((keyword, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded text-xs"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {proData.atsOptimization.recommendations && proData.atsOptimization.recommendations.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4" />
                                    Recommendations:
                                </h3>
                                <ul className="space-y-2">
                                    {proData.atsOptimization.recommendations.map((rec, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <span className="text-teal-600 dark:text-teal-400 mt-1">•</span>
                                            <span>{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Cover Letter - Pro */}
            {proData?.coverLetter && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Generated Cover Letter
                        </h2>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(proData.coverLetter!.content, 'Cover Letter')}
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            {copiedSection === 'Cover Letter' ? 'Copied!' : 'Copy'}
                        </Button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>Tone: <strong>{proData.coverLetter.tone}</strong></span>
                            <span>•</span>
                            <span>Words: <strong>{proData.coverLetter.wordCount}</strong></span>
                        </div>
                        <div className="prose dark:prose-invert max-w-none">
                            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {proData.coverLetter.content}
                            </div>
                        </div>
                        {proData.coverLetter.keyPoints && proData.coverLetter.keyPoints.length > 0 && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-4">
                                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                                    Key Points Addressed:
                                </h3>
                                <ul className="space-y-1">
                                    {proData.coverLetter.keyPoints.map((point, idx) => (
                                        <li key={idx} className="text-sm text-blue-800 dark:text-blue-300">
                                            • {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Changes Summary - Pro */}
            {proData?.changesSummary && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Changes Summary
                    </h2>
                    <div className="space-y-4">
                        <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4">
                            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-1">
                                {proData.changesSummary.totalChanges}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Total Changes Made</div>
                        </div>

                        {proData.changesSummary.sectionsModified && proData.changesSummary.sectionsModified.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Sections Modified:
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {proData.changesSummary.sectionsModified.map((section, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                                        >
                                            {section}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {proData.changesSummary.majorChanges && proData.changesSummary.majorChanges.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Major Changes:
                                </h3>
                                <ul className="space-y-2">
                                    {proData.changesSummary.majorChanges.map((change, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <span className="text-orange-600 dark:text-orange-400 mt-1">★</span>
                                            <span>{change}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Upgrade Prompt - Free */}
            {freeData?.upgradePrompt && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-500 dark:border-yellow-400 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-yellow-900 dark:text-yellow-200 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Unlock Full Features
                    </h2>
                    <p className="text-yellow-800 dark:text-yellow-300 mb-4">
                        {freeData.upgradePrompt.message}
                    </p>
                    {freeData.upgradePrompt.proFeatures && freeData.upgradePrompt.proFeatures.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                                Pro Features:
                            </h3>
                            <ul className="space-y-2">
                                {freeData.upgradePrompt.proFeatures.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-yellow-800 dark:text-yellow-300">
                                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                <Button
                    onClick={onReset}
                    variant="outline"
                    className="flex-1"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Tailor Another CV
                </Button>
            </div>
        </div>
    )
}

