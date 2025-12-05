import { Features } from "@/components/reviewer/features"
import { HeroReviewer } from "@/components/reviewer/hero"
import { HowItWorks } from "@/components/reviewer/how-it-works"
import { LiveSample } from "@/components/reviewer/live-sample"
import { Pricing } from "@/components/reviewer/pricing"
import { Testimonials } from "@/components/reviewer/testimonials"


const Page = () => {
    return (
        <div>
            <HeroReviewer />
            <HowItWorks />
            <LiveSample />
            <Pricing />
            <Features />
            <Testimonials />
        </div>
    )
}


export default Page