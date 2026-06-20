export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import Link from "next/link"
import { connectDB } from "@/lib/mongoose"
import ProductModel from "@/models/Product"
import type { Product } from "@/types"
import EditProductClient from "./EditProductClient"

async function getProduct(id: string) {
  await connectDB()
  const product = await ProductModel.findById(id).lean()
  return product
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  const serialized: Product = JSON.parse(JSON.stringify(product))

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/admin/products" className="hover:text-black">Products</Link>
        <span>/</span>
        <span className="text-black">{serialized.name}</span>
      </div>
      <h1 className="text-xl font-bold mb-8">Edit Product</h1>
      <EditProductClient product={serialized} />
    </div>
  )
}
