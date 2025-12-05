import { Footer } from "@/components/community/footer"
import { Header } from "@/components/community/header"
import { ThemeProvider } from "@/components/theme-provider"


const CommunityLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <Header />
                <main>
                    {children}
                </main>
                <Footer/>
            </ThemeProvider>
        </main>
    )
}

export default CommunityLayout