import { TailoredCVFreeTier, TailoredCVProTier } from "@/actions/ai-job-application-tailor"
import { TailoredResult } from "@/components/application-tailor/tailored-result"
import { caller } from "@/trpc/server"
import { requireAuth } from "@/utils/auth-utils"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface Props {
    params: {
        id: string
    }
}

const SingleTailoredApplication = async  ({params}: Props) => {
    await requireAuth()
    const data = await caller.singleUserTailoredCV({id: params.id})

    if(!data || !data.applicationTailored) {
        notFound()
    }

    return (
        <div className='min-h-screen w-4/5 mx-auto my-10'>
            <div className="mb-6">
                <Link
                    href="/community/user/application-tailored"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to All Tailored CVs
                </Link>
            </div>
            <TailoredResult data={data.applicationTailored as TailoredCVProTier | TailoredCVFreeTier} show={false} />
        </div>
    )
}

export default SingleTailoredApplication