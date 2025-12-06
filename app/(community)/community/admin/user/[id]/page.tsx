import { UserDetails } from "@/components/user-details/user-details"
import { caller } from "@/trpc/server"
import { requireAdmin } from "@/utils/auth-utils"
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "CareerCastAI | Admin users Page",
  description: "Admin user",
};

interface PageProps {
  params: { id: string }
}

const UserPage = async ({ params }: PageProps) => {
  await requireAdmin();
  const user = await caller.getUserByAdmin({ userId: params.id });

  if (!user) {
    notFound(); 
  }

  return <UserDetails user={user} />;
};

export default UserPage;
