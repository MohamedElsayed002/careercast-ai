import { Metadata } from "next"
import { HeroSection } from "@/components/application-tailor/hero-section";
import { Features } from "@/components/application-tailor/features";
import { HowItWorks } from "@/components/application-tailor/how-it-woks";
import { LiveSample } from "@/components/application-tailor/live-sample";
import { MoreFeatures } from "@/components/application-tailor/more-features";
import { Pricing } from "@/components/application-tailor/pricing";


export const metadata: Metadata = {
  title: "Job Application Tailor | Home",
  description: "Tailor your application with the job description with a cover letter!"
};


const JobApplicationTailorPage = () => {
    return (
        <div className='min-h-screen'>
           <HeroSection/>
           <Features/>
           <HowItWorks/>
           <LiveSample/>
           <MoreFeatures/>
           <Pricing/>
        </div>
    )
}

export default JobApplicationTailorPage