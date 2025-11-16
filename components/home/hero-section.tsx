import Link from "next/link"
import { Button } from "../ui/button"
import { ArrowRight, FileText, ImageIcon, Mic, Music2, Sparkles } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import prisma from "@/utils/db"
import Header from "../header"

export const HeroSection = async () => {

  const totalPodcasts = await prisma.podcast.count()

    return (
        <section className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white">
        {/* Animated background elements */}
        <Header />
        <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Hero Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative bg-white/10 backdrop-blur-xl rounded-full p-6 border border-white/20">
                  <Mic className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>

            {/* Hero Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
              Create Amazing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                AI Podcasts
              </span>
              in Minutes
            </h1>

            {/* Hero Description */}
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Transform your ideas into professional podcasts with AI-powered voices.
              Generate audio, PDF summaries, and stunning cover images instantly.
            </p>

            {/* Hero CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button
                asChild
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 h-auto shadow-2xl hover:shadow-3xl transition-all"
              >
                <Link href="/create-podcast" className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Create Your Podcast
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-xl text-lg px-8 py-6 h-auto"
              >
                <Link href="#podcasts" className="flex items-center gap-2">
                  Explore Podcasts
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center gap-3">
                    <Music2 className="w-8 h-8 text-yellow-300" />
                    <div className="text-left">
                      <div className="text-3xl font-bold">{totalPodcasts}</div>
                      <div className="text-sm text-white/80">Total Podcasts</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-8 h-8 text-pink-300" />
                    <div className="text-left">
                      <div className="text-3xl font-bold">AI-Generated</div>
                      <div className="text-sm text-white/80">PDF Summaries</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center gap-3">
                    <ImageIcon className="w-8 h-8 text-cyan-300" />
                    <div className="text-left">
                      <div className="text-3xl font-bold">Custom</div>
                      <div className="text-sm text-white/80">Cover Images</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>
    )
}