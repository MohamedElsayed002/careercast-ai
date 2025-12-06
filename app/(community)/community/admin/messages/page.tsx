import { Messages } from "@/components/messages"
import { requireAdmin } from "@/utils/auth-utils"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CareerCastAI | Admin Messages",
  description: "All messages by user",
};


const Page = async  () => {
    await requireAdmin()


    return (
        <div>
            <Messages/>
        </div>
    )
}

export default Page