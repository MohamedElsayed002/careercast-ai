import { User } from "@/src/generated/prisma"
import { User as UserIcon, Mail, Crown, CreditCard } from 'lucide-react';



export const UserDetails = ({ user }: { user: Partial<User> }) => {

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name : string) => {
    return name
      .split('@')[0]
      .substring(0, 2)
      .toUpperCase();
  };

    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto p-4 md:p-8">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header Section with Gradient */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>

                    {/* Profile Section */}
                    <div className="relative px-6 pb-6">
                        {/* Avatar */}
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl ring-4 ring-white">
                                {user.image ? (
                                    <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    getInitials(user.name)
                                )}
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="pt-20 text-center">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {user.name.split('@')[0]}
                            </h1>
                            <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                                <Mail className="w-4 h-4" />
                                <span>{user.email}</span>
                            </div>

                            {/* Status Badges */}
                            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                                {user.isProPodcast && (
                                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-semibold shadow-md">
                                        <Crown className="w-4 h-4" />
                                        Pro Member
                                    </span>
                                )}
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${user.subscriptionStatus === 'active'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {user.subscriptionStatus && user.subscriptionStatus.charAt(0).toUpperCase() + user.subscriptionStatus.slice(1)}
                                </span>
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${user.emailVerified
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-orange-100 text-orange-700'
                                    }`}>
                                    {user.emailVerified ? 'Email Verified' : 'Email Unverified'}
                                </span>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            {/* Account Information */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <UserIcon className="w-5 h-5 text-blue-600" />
                                    Account Information
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600">Member Since</p>
                                        <p className="text-base font-semibold text-gray-900">
                                            {formatDate(user.createdAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Role</p>
                                        <p className="text-base font-semibold text-gray-900">
                                            {user.role}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Trials Used</p>
                                        <p className="text-base font-semibold text-gray-900">
                                            {user.trialsUsed}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Subscription Information */}
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-purple-600" />
                                    Subscription Details
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600">Subscription Ends</p>
                                        <p className="text-base font-semibold text-gray-900">
                                            {formatDate(user.subscriptionEndsAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Last Payment</p>
                                        <p className="text-base font-semibold text-gray-900">
                                            {formatDate(user.lastPaymentAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <p className="text-base font-semibold text-gray-900">
                                            {user.subscriptionStatus && user.subscriptionStatus.charAt(0).toUpperCase() + user.subscriptionStatus.slice(1)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info Card */}
                <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account ID</h3>
                    <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-700 break-all">
                        {user.id}
                    </div>
                </div>
            </div>
        </div>
    )
}