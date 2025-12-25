import Link from "next/link"
import { Metadata } from "next"


export const metadata: Metadata = {
  title: "Job Application Tailor | Home",
  description: "Tailor your application with the job description with a cover letter!"
};


const JobApplicationTailorPage = () => {
    return (
        <div className='min-h-screen grid place-items-center'>
            <h1 className='text-5xl'>
                Job Application Tailor Page
            </h1>
            <Link href="/services/job-application-tailor/application">
                Go to Application Page
            </Link>
        </div>
    )
}

export default JobApplicationTailorPage