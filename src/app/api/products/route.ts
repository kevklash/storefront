import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import Product from "@/models/Product"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") ?? "1")
    const limit = parseInt(searchParams.get("limit") ?? "20")

    const query: Record<string, unknown> = { isActive: true }
    if (category) query.category = category
    if (search) query.$text = { $search: search }

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ])

    return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
