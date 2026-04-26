import { CompanyCvBriefing } from "../../../components/company-recon/company-cv-briefing";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Company RECON',
    description: 'Company RECON description'
}
export default function Page() {
    return <CompanyCvBriefing />;
}
