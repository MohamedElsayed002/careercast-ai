import Header from "@/components/header"
import { PodcastList } from "@/components/podcast/podcast-list"
import { caller } from "@/trpc/server"
import { requireAdmin } from "@/utils/auth-utils"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CareerCast AI | User Podcasts",
  description: "All user podcasts!"
};


const UserPodcastsPage = async ({ params }: { params: { id: string } }) => {
    await requireAdmin()
    const data = await caller.getUserPodcastsPublic({ userId: params.id })

    return (
        <div className='py-5'>
            <div className='min-h-screen w-4/5 mx-auto'>
                <div className='mb-5'>
                </div>
                <PodcastList podcasts={data} />
            </div>
        </div>
    )
}

export default UserPodcastsPage