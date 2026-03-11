import { getSubscriptionToken } from "@inngest/realtime";
import { inngest } from "./client";

export async function getInngestSubscriptionToken(userId: string) {
  if (!userId) {
    throw new Error("userId is required to create a subscription token");
  }

  return getSubscriptionToken(inngest, {
    channel: `user:${userId}`,
    topics: ["progress"],
  });
}
