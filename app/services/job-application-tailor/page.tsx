import Link from "next/link"


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