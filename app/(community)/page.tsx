import { ActionSection } from "@/components/community/action"
import { HeroCommunity } from "@/components/community/hero-section"
import { HowItWorksSection } from "@/components/community/how-it-works"
import { InfoCommunity } from "@/components/community/info"


const CommunityPage = () => {
    return (
        <main>
            <HeroCommunity/>
            <InfoCommunity/>
            <HowItWorksSection/>
            <ActionSection/>
        </main>
    )
}

export default CommunityPage