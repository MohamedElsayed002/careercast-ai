import { Footer } from "@/components/community/footer"
import { Header } from "@/components/community/header"


const CommunityLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main>
                {/* <Header/> */}
                <main>
                    {children}
                </main>
                <Footer/>
        </main>
    )
}

export default CommunityLayout