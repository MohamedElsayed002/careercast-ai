import { ApplicationTailor } from "@/components/application-tailor"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tailor your Application",
  description: "Get your CV and Cover letter tailored with the job description"
};

const ApplicationPage = () => {
    return <ApplicationTailor />
}

export default ApplicationPage