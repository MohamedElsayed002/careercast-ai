import { Footer } from "@/components/community/footer"
import { ReviewerHeader } from "@/components/reviewer/header"


const ReviewLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            {/* <ReviewerHeader /> */}
            <main>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default ReviewLayout