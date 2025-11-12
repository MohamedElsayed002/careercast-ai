import Link from "next/link"
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Podcastr | Login/Register Pages",
    description: "Login or Register in Podcastr website"
  };




const AuthLayout = ({children} : {children : React.ReactNode}) => {
    return (
        <div className="bg-muted flex min-h-svh flex-col justify-center items-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href='/' className='flex items-center gap-2 self-center font-medium'>
                    Podcastr
                </Link>
                {children}
            </div>
        </div>
    )
}

export default AuthLayout