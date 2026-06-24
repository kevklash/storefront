import { Suspense } from "react"
import ProductGrid from "./ProductGrid"
import SearchBar from "@/components/store/SearchBar"

export const revalidate = 60

export default function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-black">Shop</h1>
      <div className="hidden sm:block">
        <Suspense fallback={<div className="w-full h-10 bg-gray-100 rounded-lg animate-pulse mb-6" />}>
          <SearchBar />
        </Suspense>
      </div>
      <Suspense fallback={<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">{Array.from({length: 8}).map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg" />)}</div>}>
        <ProductGrid searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
