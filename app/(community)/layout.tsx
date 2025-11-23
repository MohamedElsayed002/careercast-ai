import { Footer } from "@/components/footer"
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
                {children}
            </ThemeProvider>
            <Footer />
        </main>
    )
}

export default CommunityLayout