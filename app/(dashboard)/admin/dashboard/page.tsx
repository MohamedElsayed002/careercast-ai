import { caller } from "@/trpc/server"
import { requireAdmin } from "@/utils/auth-utils"


const DashboardPage = async  () => {
    await requireAdmin()
    const data = await caller.allUsers()

    return (
        <div>
            <h1>Admin Dashboard </h1>
            {JSON.stringify(data)}
        </div>
    )
}

export default DashboardPage