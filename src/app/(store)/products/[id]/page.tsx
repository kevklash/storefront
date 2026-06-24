import { notFound } from "next/navigation"
import Image from "next/image"
import type { Product } from "@/types"
import AddToCartSection from "./AddToCartSection"
import { formatPrice } from "@/lib/utils"

async function getProduct(id: string): Promise<Product | null> {
  const base = process.env.NEXT_PUBLIC_BASE_URL
    ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  const res = await fetch(`${base}/api/products/${id}`, { next: { revalidate: 60 } })
  if (!res.ok) return null
  return res.json()
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-16">
      <div className="space-y-3">
        {product.images.length > 0 ? (
          <>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.slice(1).map((url) => (
                  <div key={url} className="relative w-20 h-24 rounded-lg overflow-hidden bg-gray-100">
                    <Image src={url} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="aspect-[3/4] rounded-xl bg-gray-100 flex items-center justify-center text-gray-300">
            No image
          </div>
        )}
      </div>

      <div className="py-2">
        <p className="text-xs text-gray-600 uppercase tracking-widest mb-2">{product.category}</p>
        <h1 className="text-2xl font-bold text-black">{product.name}</h1>
        <p className="text-xl font-medium text-black mt-2">{formatPrice(product.price)}</p>
        <p className="text-gray-700 text-sm leading-relaxed mt-4">{product.description}</p>
        <div className="mt-8">
          <AddToCartSection product={product} />
        </div>
      </div>
    </div>
  )
}
