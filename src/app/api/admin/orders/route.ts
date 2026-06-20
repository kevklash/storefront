import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import Order from "@/models/Order"

export async function GET() {
  try {
    await connectDB()
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean()
    return NextResponse.json(orders)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
