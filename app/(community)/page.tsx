import { ActionSection } from "@/components/community/action"
import { HeroCommunity } from "@/components/community/hero-section"
import { HowItWorksSection } from "@/components/community/how-it-works"
import { InfoCommunity } from "@/components/community/info"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CareerCast AI | Home",
  description: "CareerCast Website for generating podcast or reviewing your CV and compare it with Job description!"
};



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