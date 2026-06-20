"use client"

import Image from "next/image"
import { Trash2, Plus, Minus } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { formatPrice } from "@/lib/utils"

export default function CartSummary() {
  const { items, removeItem, updateQuantity, total } = useCartStore()

  if (!items.length) {
    return <p className="text-gray-700 text-center py-12">Your cart is empty.</p>
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={`${item.productId}-${item.size}-${item.color}`}
          className="flex gap-4 items-start border-b border-gray-100 pb-4"
        >
          <div className="relative w-20 h-24 flex-shrink-0 rounded overflow-hidden bg-gray-100">
            {item.productImage && (
              <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-black">{item.productName}</p>
            <p className="text-xs text-gray-700 mt-0.5">
              {item.size}{item.color ? ` / ${item.color}` : ""}
            </p>
            <p className="text-sm font-medium mt-1 text-black">{formatPrice(item.price)}</p>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                className="p-1 rounded hover:bg-gray-100"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm w-6 text-center text-black">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-40"
                disabled={item.quantity >= item.maxStock}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <p className="text-sm font-medium text-black">{formatPrice(item.price * item.quantity)}</p>
            <button
              onClick={() => removeItem(item.productId, item.size, item.color)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Remove item"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-between font-semibold text-sm text-black pt-2">
        <span>Subtotal</span>
        <span>{formatPrice(total())}</span>
      </div>
    </div>
  )
}
