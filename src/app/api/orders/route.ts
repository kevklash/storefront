import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectDB } from "@/lib/mongoose"
import Order from "@/models/Order"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const orders = await Order.find({ customerEmail: session.user.email })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(orders)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
