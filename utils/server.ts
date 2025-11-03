
import { UTApi } from "uploadthing/server"
import { auth } from "./auth"
import { headers } from "next/headers"

export const utapi = new UTApi()


export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
}
