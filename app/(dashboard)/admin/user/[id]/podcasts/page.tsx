import Header from "@/components/header"
import { PodcastList } from "@/components/podcast/podcast-list"
import { caller } from "@/trpc/server"
import { requireAdmin } from "@/utils/auth-utils"



const UserPodcastsPage = async ({ params }: { params: { id: string } }) => {
    await requireAdmin()
    const data = await caller.getUserPodcastsPublic({ userId: params.id })

    return (
        <div className='bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 py-5'>
            <div className='min-h-screen w-4/5 mx-auto'>
                <div className='mb-5'>
                    <Header />
                </div>
                <PodcastList podcasts={data} />
            </div>
        </div>
    )
}

export default UserPodcastsPage