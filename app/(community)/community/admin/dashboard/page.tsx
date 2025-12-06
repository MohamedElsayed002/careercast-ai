import { caller } from "@/trpc/server"
import { requireAdmin } from "@/utils/auth-utils"
import { DataTableDemo } from "@/components/DataTableDemo" // adjust path
import Header from "@/components/header"
import { DashboardStats } from "@/components/dashboard-stats"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "CareerCast AI | Admin Dashboard",
  description: "Admin Dashboard Page. Statistics & All users!"
};

const DashboardPage = async () => {
    await requireAdmin()
    const [data,stats] = await Promise.all([
        caller.allUsers(),
        caller.adminDashboardStats()
    ])

    return (
        <div className="min-h-screen">
            <div className="w-4/5 mx-auto py-10">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
                <DashboardStats stats={stats}/>
                <DataTableDemo data={data} />
            </div>
        </div>
    )
}

export default DashboardPage