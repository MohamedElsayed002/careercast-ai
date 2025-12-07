import { caller } from "@/trpc/server"
import { requireAuth } from "@/utils/auth-utils"
import { CVReviewDetail } from "@/components/cv-reviwer/cv-review-detail"
import { CVReviewFreeTier, CVReviewProTier } from "@/actions/cv-reviewer"
import { notFound } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "CareerCast AI | Single Review",
  description: "Single Review!"
};


interface Props {
    params: {
        id: string
    }
}

const Page = async ({ params }: Props) => {
    await requireAuth()

    try {
        const data = await caller.getUserSingleReview({ reviewId: params.id })

        if (!data || !data.review) {
            notFound()
        }

        // Determine if it's Pro or Free tier based on the review structure
        const review = data.review as CVReviewFreeTier | CVReviewProTier
        const isProTier = 'recommendations' in review && 'weaknesses' in review && 'experienceMatch' in review

        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-5xl mx-auto p-4 md:p-8">
                    <CVReviewDetail
                        review={review}
                        reviewId={data.id}
                        isProTier={isProTier}
                    />
                </div>
            </div>
        )
    } catch {
        notFound()
    }
}

export default Page