import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function AuthRedirectPage() {
  const session = await auth()
  const role = (session?.user as { role?: string } | undefined)?.role
  redirect(role === "admin" ? "/admin" : "/")
}
