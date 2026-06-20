import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import Product from "@/models/Product"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const product = await Product.findOne({
      $or: [{ _id: id.match(/^[0-9a-f]{24}$/) ? id : null }, { slug: id }],
      isActive: true,
    }).lean()

    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(product)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
