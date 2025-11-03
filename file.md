"use client"

import Custom from './custom'
import { authClient } from "@/utils/auth-client";
import LogoutButton from "./buttonLogout";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { data } = authClient.useSession()

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 opacity-20 animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 opacity-30" style={{
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite'
      }} />

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />

      <div className="relative z-10">
        {/* Header */}
        <nav className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              P
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              PodcastAI
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {data?.user && (
              <Link href="/user">
                <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                  My Podcasts
                </Button>
              </Link>
            )}
            <LogoutButton />
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 bg-clip-text text-transparent animate-fade-in">
              Transform Text Into
              <br />
              <span className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Stunning Podcasts
              </span>
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Create professional audio podcasts and PDF summaries instantly with AI-powered technology
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300 text-white">
              <div className="text-4xl mb-3">🎙️</div>
              <h3 className="text-xl font-bold mb-2">AI Audio</h3>
              <p className="text-purple-100">Generate high-quality audio from any text instantly</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300 text-white">
              <div className="text-4xl mb-3">📄</div>
              <h3 className="text-xl font-bold mb-2">Smart Summaries</h3>
              <p className="text-cyan-100">Automatic PDF briefs with key takeaways</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300 text-white">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-yellow-100">Create podcasts in seconds, not hours</p>
            </div>
          </div>

          {/* Podcast Creator */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-200/50 dark:border-purple-800/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                ✨
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Create Your Podcast
              </h3>
            </div>
            <Custom />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
