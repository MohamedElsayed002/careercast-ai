import { Footer } from "@/components/community/footer"
import { Features } from "@/components/reviewer/features"
import { ReviewerHeader } from "@/components/reviewer/header"
import { HeroReviewer } from "@/components/reviewer/hero"
import { HowItWorks } from "@/components/reviewer/how-it-works"
import { LiveSample } from "@/components/reviewer/live-sample"
import { Pricing } from "@/components/reviewer/pricing"
import { Testimonials } from "@/components/reviewer/testimonials"


const Page = () => {
    return (
        <div>
            <ReviewerHeader/>
            <main>
                <HeroReviewer/>
                <HowItWorks/>
                <LiveSample/>
                <Pricing/>
                <Features/>
                <Testimonials/>
            </main>
            <Footer/>
        </div>
    )
}


export default Page