import { requireAuth } from "@/utils/auth-utils"
import { Credentials } from "@/components/credentials/credentials";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "CareerCastAI | Credential Page",
    description: "Save your API credentials securely",
  };

const Page = async  () => {
    await requireAuth()
    
    return (
        <div className="min-h-screen">
            <Credentials />
        </div>
    )
}

export default Page