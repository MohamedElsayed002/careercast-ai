import { ApplicationTailorHeader } from "@/components/application-tailor/header"
import { Footer } from "@/components/community/footer"


const Layout = ({children} : {children: React.ReactNode}) => {
    return (
        <div>
            {/* <ApplicationTailorHeader/> */}
            <main>
                {children}
            </main>
            <Footer/>
        </div>
    )
}

export default Layout