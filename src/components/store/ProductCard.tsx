import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/types"

export default function ProductCard({ product }: { product: Product }) {
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0)
  const outOfStock = totalStock === 0

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
            No image
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-500">Sold Out</span>
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-xs text-gray-400 uppercase tracking-wide">{product.category}</p>
        <h3 className="text-sm font-medium text-gray-900 mt-0.5 group-hover:underline">{product.name}</h3>
        <p className="text-sm text-gray-700 mt-1">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}
