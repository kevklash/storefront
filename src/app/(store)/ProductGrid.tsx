import ProductCard from "@/components/store/ProductCard"
import type { Product } from "@/types"

async function getProducts(category?: string, search?: string) {
  const params = new URLSearchParams()
  if (category) params.set("category", category)
  if (search) params.set("search", search)

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
  const res = await fetch(`${base}/api/products?${params}`, { next: { revalidate: 60 } })
  if (!res.ok) return { products: [], total: 0 }
  return res.json()
}

const CATEGORIES = ["T-Shirts", "Hoodies", "Pants", "Shorts", "Jackets", "Accessories", "Other"]

export default async function ProductGrid({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const { category, search } = await searchParams
  const { products } = await getProducts(category, search)

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-6">
        <a
          href="/"
          className={`px-3 py-1 rounded-full text-sm border transition-colors ${!category ? "bg-black text-white border-black" : "border-gray-300 text-gray-700 hover:border-gray-500 hover:text-black"}`}
        >
          All
        </a>
        {CATEGORIES.map((c) => (
          <a
            key={c}
            href={`/?category=${encodeURIComponent(c)}`}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${category === c ? "bg-black text-white border-black" : "border-gray-300 text-gray-700 hover:border-gray-500 hover:text-black"}`}
          >
            {c}
          </a>
        ))}
      </div>

      {!products.length ? (
        <p className="text-gray-500 text-center py-16">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p: Product) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
