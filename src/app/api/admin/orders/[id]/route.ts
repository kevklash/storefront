import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import Order from "@/models/Order"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const { status } = await req.json()

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(order)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
