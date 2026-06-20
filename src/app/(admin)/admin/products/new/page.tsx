"use client"

import { useRouter } from "next/navigation"
import ProductForm from "@/components/admin/ProductForm"
import Link from "next/link"

export default function NewProductPage() {
  const router = useRouter()

  async function handleSave(data: Parameters<typeof ProductForm>[0]["onSave"] extends (d: infer D) => unknown ? D : never) {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error ?? "Failed to create product")
    }
    router.push("/admin/products")
    router.refresh()
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-700 mb-6">
        <Link href="/admin/products" className="hover:text-black">Products</Link>
        <span>/</span>
        <span className="text-black">New</span>
      </div>
      <h1 className="text-xl font-bold mb-8 text-black">New Product</h1>
      <ProductForm onSave={handleSave} />
    </div>
  )
}
