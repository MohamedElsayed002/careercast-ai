import { PricingSection } from "./pricing-section"
import { HeroSection } from "./hero-section"
import { PodcastSection } from "./podcast-section"



export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Podcasts Section */}
      <PodcastSection/>

                  {/* Pricing Section */}
      <PricingSection />
    </div>
  )
}

