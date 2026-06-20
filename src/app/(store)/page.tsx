import { Suspense } from "react"
import ProductGrid from "./ProductGrid"

export const revalidate = 60

export default function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-black">Shop</h1>
      <Suspense fallback={<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">{Array.from({length: 8}).map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg" />)}</div>}>
        <ProductGrid searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
