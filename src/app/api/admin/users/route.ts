import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await connectDB()
    const admins = await User.find({ role: "admin" }).select("name email createdAt").lean()
    return NextResponse.json(admins)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { name, email, password } = await req.json() as { name: string; email: string; password: string }

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: "admin",
    })

    return NextResponse.json(
      { id: user._id.toString(), name: user.name, email: user.email },
      { status: 201 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 })
  }
}
