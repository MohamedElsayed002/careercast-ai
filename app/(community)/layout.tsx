import { Footer } from "@/components/footer"


const CommunityLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main>
            {children}
            <Footer />
        </main>
    )
}

export default CommunityLayout