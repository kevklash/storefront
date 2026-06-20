export const dynamic = "force-dynamic"

import Link from "next/link"
import Image from "next/image"
import { connectDB } from "@/lib/mongoose"
import ProductModel from "@/models/Product"
import type { Product } from "@/types"
import DeleteProductButton from "./DeleteProductButton"
import { formatPrice } from "@/lib/utils"

async function getProducts() {
  await connectDB()
  return ProductModel.find({}).sort({ createdAt: -1 }).lean()
}

export default async function AdminProductsPage() {
  const products = await getProducts() as unknown as Product[]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-black">Products</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          + New Product
        </Link>
      </div>

      {!products.length ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <p className="text-gray-700 mb-4">No products yet.</p>
          <Link href="/admin/products/new" className="text-sm font-medium underline text-black">
            Create your first product
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-700 border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 font-medium">Product</th>
                <th className="text-left px-5 py-3 font-medium">Category</th>
                <th className="text-left px-5 py-3 font-medium">Price</th>
                <th className="text-left px-5 py-3 font-medium">Stock</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const totalStock = p.variants.reduce((s, v) => s + v.stock, 0)
                return (
                  <tr key={p._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {p.images[0] ? (
                          <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0" />
                        )}
                        <span className="font-medium text-black">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{p.category}</td>
                    <td className="px-5 py-3 text-black">{formatPrice(p.price)}</td>
                    <td className="px-5 py-3">
                      <span className={totalStock === 0 ? "text-red-500" : totalStock <= 5 ? "text-amber-600" : "text-gray-700"}>
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {p.isActive ? "Active" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/admin/products/${p._id}`} className="text-xs text-gray-500 hover:text-black">
                          Edit
                        </Link>
                        <DeleteProductButton id={p._id} name={p.name} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
