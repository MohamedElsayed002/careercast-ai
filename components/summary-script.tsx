"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type SummaryScriptProps = {
    podcastScriptDialogue: {
        text: string;
        speaker: string
    }[];
    podcastSummaryConclusion?: string;
    podcastSummaryKeyPoints: string[];
    podcastSummaryOverview?: string;
}

export function SummaryScript({
    podcastScriptDialogue,
    podcastSummaryConclusion,
    podcastSummaryKeyPoints,
    podcastSummaryOverview
}: SummaryScriptProps) {
    const [activeTab, setActiveTab] = useState<'summary' | 'script'>('script')

    return (
        <div className="">
            {/* Tab Buttons */}
            <div className="flex gap-2 mb-8 bg-slate-100 rounded-lg p-1 w-4/5">
                <Button 
                    onClick={() => setActiveTab('summary')}
                    className={`flex-1 ${activeTab === 'summary' ? ' shadow-sm' : 'bg-transparent text-slate-600 hover:bg-slate-50'}`}
                    variant={activeTab === 'summary' ? 'default' : 'ghost'}
                >
                    Summary
                </Button>
                <Button 
                    onClick={() => setActiveTab('script')}
                    className={`flex-1 ${activeTab === 'script' ? ' shadow-sm' : 'bg-transparent text-slate-600 hover:bg-slate-50'}`}
                    variant={activeTab === 'script' ? 'default' : 'ghost'}
                >
                    Script
                </Button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-2 w-full">
                {activeTab === 'script' && (
                    <div className="space-y-6 p-2">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Podcast Script</h2>
                        {podcastScriptDialogue.length === 0 && <h1 className='dark:text-black light:text-black'>Script not available</h1>}
                        {podcastScriptDialogue.length > 0 && podcastScriptDialogue.map((item, index) => (
                            <div 
                                key={index} 
                                className={`p-4 rounded-lg ${
                                    item.speaker === 'SPEAKER1' 
                                        ? 'bg-blue-50 border-l-4 border-blue-500' 
                                        : 'bg-amber-50 border-l-4 border-amber-500'
                                }`}
                            >
                                <div className={`text-sm font-semibold mb-2 ${
                                    item.speaker === 'SPEAKER1' 
                                        ? 'text-blue-700' 
                                        : 'text-amber-700'
                                }`}>
                                    {item.speaker === 'SPEAKER1' ? 'Speaker 1' : 'Speaker 2'}
                                </div>
                                <p className="text-slate-700 leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'summary' && (
                    <div className="space-y-8 p-2">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                                {podcastSummaryOverview ? podcastSummaryOverview : "Not available"}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Points</h2>
                            <ul className="space-y-3">
                                {podcastSummaryKeyPoints.length === 0 || !podcastSummaryKeyPoints && (
                                    <h1>Key points not available</h1>
                                )}
                                {podcastSummaryKeyPoints && podcastSummaryKeyPoints.map((item, index) => (
                                    <li key={index} className="flex gap-3">
                                        <span className="text-blue-600 font-bold mt-1">•</span>
                                        <span className="text-slate-700 leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900 mb-3">Conclusion</h2>
                            <p className="text-slate-700 leading-relaxed">
                                {podcastSummaryConclusion ? podcastSummaryConclusion : "Not available" }
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}