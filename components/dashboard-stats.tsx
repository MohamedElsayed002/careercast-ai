

interface DashboardStatsProps {
    totalUsers: number;
    totalPodcasts: number;
    proUsers: number;
    freeUsers: number;
}

export const DashboardStats = ({ stats }: { stats: DashboardStatsProps }) => {
    return (
        <div className="my-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl shadow-xl text-white">
                <div className="text-3xl font-bold">{stats.totalUsers}</div>
                <div className="text-purple-100 mt-1">Total Users</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-6 rounded-2xl shadow-xl text-white">
                <div className="text-3xl font-bold">{stats.totalPodcasts}</div>
                <div className="text-cyan-100 mt-1">Total Podcasts</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-2xl shadow-xl text-white">
                <div className="text-3xl font-bold">{stats.proUsers}</div>
                <div className="text-yellow-100 mt-1">Pro Users</div>
            </div>
            {/* Total Credentials */}
            <div className="bg-gradient-to-br from-green-500 to-teal-500 p-6 rounded-2xl shadow-xl text-white">
                <div className="text-3xl font-bold">{stats.freeUsers}</div>
                <div className="text-green-100 mt-1">Free Users</div>
            </div>
        </div>
    )
}