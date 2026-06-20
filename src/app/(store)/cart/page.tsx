"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import CartSummary from "@/components/store/CartSummary"
import Button from "@/components/ui/Button"
import { useCartStore } from "@/lib/cart-store"
import { formatPrice } from "@/lib/utils"

export default function CartPage() {
  const { items, total } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleCheckout() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/cart`,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Checkout failed")
      router.push(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-black">Your Cart</h1>
      <CartSummary />
      {items.length > 0 && (
        <div className="mt-6 space-y-3">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex justify-between text-sm text-gray-700">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="flex justify-between font-bold text-base text-black border-t pt-3">
            <span>Total</span>
            <span>{formatPrice(total())}</span>
          </div>
          <Button size="lg" className="w-full mt-2" onClick={handleCheckout} loading={loading}>
            Proceed to Checkout
          </Button>
        </div>
      )}
    </div>
  )
}
