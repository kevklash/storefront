"use client"

import { useRouter } from "next/navigation"
import ProductForm from "@/components/admin/ProductForm"
import type { Product } from "@/types"

export default function EditProductClient({ product }: { product: Product }) {
  const router = useRouter()

  async function handleSave(data: Parameters<typeof ProductForm>[0]["onSave"] extends (d: infer D) => unknown ? D : never) {
    const res = await fetch(`/api/admin/products/${product._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error ?? "Failed to update product")
    }
    router.push("/admin/products")
    router.refresh()
  }

  return <ProductForm product={product} onSave={handleSave} />
}
