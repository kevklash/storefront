"use client"

import { useState } from "react"
import { useCartStore } from "@/lib/cart-store"
import Button from "@/components/ui/Button"
import type { Product, ProductVariant } from "@/types"

export default function AddToCartSection({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))] as string[]
  const hasColors = colors.length > 0

  const availableSizes = product.variants
    .filter((v) => !hasColors || !selectedColor || v.color === selectedColor)
    .filter((v) => v.stock > 0)
    .map((v) => v.size)

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && (!hasColors || v.color === selectedColor)
  ) as ProductVariant | undefined

  const inStock = selectedVariant ? selectedVariant.stock > 0 : false

  function handleAddToCart() {
    if (!selectedSize || !selectedVariant) return
    addItem({
      productId: product._id,
      productName: product.name,
      productImage: product.images[0] ?? "",
      price: product.price,
      size: selectedSize,
      color: selectedColor || undefined,
      quantity: 1,
      maxStock: selectedVariant.stock,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-5">
      {hasColors && (
        <div>
          <p className="text-sm font-medium mb-2 text-black">Color</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => { setSelectedColor(c); setSelectedSize("") }}
                className={`px-3 py-1.5 text-sm rounded border transition-colors ${selectedColor === c ? "border-black bg-black text-white" : "border-gray-300 text-black hover:border-gray-500"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-sm font-medium mb-2 text-black">Size</p>
        <div className="flex flex-wrap gap-2">
          {product.variants
            .filter((v) => !hasColors || !selectedColor || v.color === selectedColor)
            .map((v) => (
              <button
                key={`${v.size}-${v.color}`}
                onClick={() => setSelectedSize(v.size)}
                disabled={v.stock === 0}
                className={`px-3 py-1.5 text-sm rounded border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${selectedSize === v.size ? "border-black bg-black text-white" : "border-gray-300 text-black hover:border-gray-500"}`}
              >
                {v.size}
              </button>
            ))}
        </div>
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        disabled={!selectedSize || !inStock}
      >
        {added ? "Added to Cart ✓" : !selectedSize ? "Select a size" : !inStock ? "Out of Stock" : "Add to Cart"}
      </Button>

      {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
        <p className="text-xs text-amber-600">Only {selectedVariant.stock} left in stock</p>
      )}
    </div>
  )
}
