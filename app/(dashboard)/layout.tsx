import { Footer } from "@/components/footer"
import React from "react"


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main>
            {children}
            <Footer />
        </main>
    )
}

export default DashboardLayout