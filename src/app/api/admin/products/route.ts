import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import Product from "@/models/Product"

export async function GET() {
  try {
    await connectDB()
    const products = await Product.find({}).sort({ createdAt: -1 }).lean()
    return NextResponse.json(products)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()

    // auto-generate slug from name if not provided
    if (!body.slug) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    }

    const product = await Product.create(body)
    return NextResponse.json(product, { status: 201 })
  } catch (err: unknown) {
    console.error(err)
    if (err instanceof Error && err.message.includes("duplicate key")) {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
