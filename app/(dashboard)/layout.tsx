import { Footer } from "@/components/footer"
import Header from "@/components/header"
import React from "react"


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main>
            <Header />
            {children}
            <Footer />
        </main>
    )
}

export default DashboardLayout