import { caller } from "@/trpc/server"
import { requireAuth } from "@/utils/auth-utils"
import { CVReviewList, CVReviewListProps } from "@/components/cv-reviwer/cv-review-list"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CareerCast AI | CV Reviews",
  description: "All reviews user have!"
};


const Page = async () => {
    await requireAuth()
    const data = await caller.getUserCVReview()

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-4 md:p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">My CV Reviews</h1>
                    <p className="text-muted-foreground">
                        View all your CV analysis results and track your job application progress
                    </p>
                </div>
                <CVReviewList reviews={data as CVReviewListProps} />
            </div>
        </div>
    )
}

export default Page