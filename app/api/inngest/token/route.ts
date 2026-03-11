import { NextResponse } from "next/server";
import { getInngestSubscriptionToken } from "@/inngest/inngest-token";
import { getSession } from "@/utils/server";

export async function GET() {
  const session = await getSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await getInngestSubscriptionToken(session.user.id);
  return NextResponse.json(token);
}
