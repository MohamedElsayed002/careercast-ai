import { PricingSection } from "./pricing-section"
import { HeroSection } from "./hero-section"
import { PodcastSection } from "./podcast-section"
import { DemoVideoSection } from "../demo-video.section"



export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      <DemoVideoSection
        youtubeUrl={process.env.NEXT_PUBLIC_DEMO_VIDEO_URL}
        videoId={process.env.NEXT_PUBLIC_DEMO_VIDEO_ID}
      />
      {/* Podcasts Section */}
      <PodcastSection />

      {/* Pricing Section */}
      <PricingSection />
    </div>
  )
}

