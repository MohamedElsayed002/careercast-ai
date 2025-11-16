import { requireAuth } from "@/utils/auth-utils"
import Header from "@/components/header";
import { Credentials } from "@/components/credentials/credentials";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Podcastr | Credential Page",
    description: "Save your API credentials securely",
  };

const Page = async  () => {
    await requireAuth()
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
            <Header/>
            <Credentials />
        </div>
    )
}

export default Page