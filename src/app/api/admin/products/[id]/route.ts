import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import Product from "@/models/Product"
import { deleteImage } from "@/lib/cloudinary"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()

    const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(product)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const product = await Product.findByIdAndDelete(id)
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // clean up images from Cloudinary
    await Promise.allSettled(product.images.map((url: string) => deleteImage(url)))

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
