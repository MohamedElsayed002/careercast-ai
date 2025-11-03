import { requireAuth } from "@/utils/auth-utils"
import { UserLayout } from "./user-layout"
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Podcastr | User Page",
    description: "Get the information of the user"
  };

const UserPage = async () => {
    await requireAuth()
    return <UserLayout />
}

export default UserPage