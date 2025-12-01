import { CVReviewType } from "@/actions/cv-reviewer"
import { AlertCircle, CheckCircle, Sparkles, XCircle } from "lucide-react"

interface CVAnalysisProps {
    analysis: CVReviewType | null
    reset: () => void
}

export const CVAnalysis = ({ reset, analysis }: CVAnalysisProps) => {
    return (
        <div className='space-y-6'>
            {!analysis ? (
                <div className='text-center py-12'>
                    <div className='inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mb-4' />
                    <p className='text-xl text-gray-700 font-semibold'>AI is analyzing your CV..</p>
                    <p className='text-gray-600 mt-2'>This may take a few seconds</p>
                </div>
            ) : analysis && (
                <div className='space-y-6'>
                    <div className={`p-6 rounded-xl border-2 ${analysis.isGoodMatch ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                        <div className='flex items-center gap-4 mb-4'>
                            {analysis.isGoodMatch ? (
                                <CheckCircle className='w-12 h-12 text-green-600' />
                            ) : (
                                <XCircle className='w-12 h-12 text-red-600' />
                            )}
                            <div>
                                <h3 className={`text-2xl font-bold ${analysis.isGoodMatch ? 'text-green-900' : 'text-red-900'}`}>
                                    {analysis.isGoodMatch ? 'Good Match!' : 'Needs Improvment'}
                                </h3>
                                <p className={`text-lg ${analysis.isGoodMatch ? 'text-green-700' : 'text-red-700'}`}>
                                    Match Score: {analysis.matchPercentage}%
                                </p>
                            </div>
                        </div>
                        <p className={`${analysis.isGoodMatch ? 'text-green-800' : 'text-red-800'}`}>
                            {analysis.verdict}
                        </p>
                    </div>

                    {/* Experience Match */}
                    {analysis.experienceMatch && (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                            <h4 className="text-lg font-bold text-indigo-900 mb-3 flex items-center gap-2">
                                📅 Experience Match
                            </h4>
                            <div className="space-y-2 text-indigo-800">
                                <p><strong>Required:</strong> {analysis.experienceMatch.yearsRequired}</p>
                                <p><strong>Your Experience:</strong> {analysis.experienceMatch.yearsInCV}</p>
                                <p className="text-sm mt-3 italic">{analysis.experienceMatch.assessment}</p>
                            </div>
                        </div>
                    )}

                    {/* Key Highlights */}
                    {analysis.keyHighlights && analysis.keyHighlights.length > 0 && (
                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                            <h4 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
                                ⭐ Key Highlights
                            </h4>
                            <ul className="space-y-2">
                                {analysis.keyHighlights.map((highlight, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-purple-800">
                                        <span className="text-purple-600 mt-1">★</span>
                                        <span>{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Skills Analysis Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Matched Skills */}
                        {analysis.matchedSkills && analysis.matchedSkills.length > 0 && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                                <h4 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    Matched Skills ({analysis.matchedSkills.length})
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.matchedSkills.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Missing Skills */}
                        {analysis.missingSkills && analysis.missingSkills.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                                <h4 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
                                    <XCircle className="w-5 h-5" />
                                    Missing Skills ({analysis.missingSkills.length})
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.missingSkills.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Strengths */}
                    {analysis.strengths && analysis.strengths.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                            <h4 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Strengths
                            </h4>
                            <ul className="space-y-3">
                                {analysis.strengths.map((strength, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-green-800">
                                        <span className="text-green-600 mt-1 font-bold">✓</span>
                                        <span className="flex-1">{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Weaknesses */}
                    {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                            <h4 className="text-lg font-bold text-yellow-900 mb-3 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" />
                                Areas for Improvement
                            </h4>
                            <ul className="space-y-3">
                                {analysis.weaknesses.map((weakness, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-yellow-800">
                                        <span className="text-yellow-600 mt-1 font-bold">⚠</span>
                                        <span className="flex-1">{weakness}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Recommendations */}
                    {analysis.recommendations && analysis.recommendations.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                            <h4 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                Recommendations
                            </h4>
                            <ul className="space-y-3">
                                {analysis.recommendations.map((rec, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-blue-800">
                                        <span className="text-blue-600 mt-1 font-bold">{idx + 1}.</span>
                                        <span className="flex-1">{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={reset}
                            className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                        >
                            Analyze Another CV
                        </button>
                    </div>

                    <div className="mt-6 p-4 bg-white rounded-xl shadow-md">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                            💡 How it works
                        </h3>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>• <strong>Step 1:</strong> Upload your CV or use dummy data to test</li>
                            <li>• <strong>Step 2:</strong> Paste the job description you&apos;re applying for</li>
                            <li>• <strong>Step 3:</strong> Get AI-powered analysis with match score and recommendations</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}