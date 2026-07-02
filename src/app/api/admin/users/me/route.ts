import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectDB } from "@/lib/mongoose"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { currentPassword, newPassword } = await req.json() as {
      currentPassword: string
      newPassword: string
    }

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Both fields are required" }, { status: 400 })
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 })
    }

    await connectDB()
    const user = await User.findById(session.user.id).select("+password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    if (!user.password) {
      return NextResponse.json({ error: "This account uses Google sign-in and has no password" }, { status: 400 })
    }

    const valid = await bcrypt.compare(currentPassword, user.password as string)
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    user.password = await bcrypt.hash(newPassword, 12)
    await user.save()

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
  }
}
