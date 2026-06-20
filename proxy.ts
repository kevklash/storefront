import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isAdmin = pathname.startsWith("/admin")
  const isAdminApi = pathname.startsWith("/api/admin") || pathname.startsWith("/api/upload")

  if (isAdmin || isAdminApi) {
    const session = await auth()
    if (!session) {
      const loginUrl = new URL("/login", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
    const role = (session.user as { role?: string } | undefined)?.role
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin(.*)", "/api/admin(.*)", "/api/upload(.*)"],
}
