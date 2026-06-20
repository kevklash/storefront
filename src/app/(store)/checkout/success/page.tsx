"use client"

import { useEffect } from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import Button from "@/components/ui/Button"

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="max-w-md mx-auto text-center py-16">
      <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
      <p className="text-gray-600 mb-2">
        Thank you for your purchase. You&apos;ll receive a confirmation email shortly.
      </p>
      <p className="text-gray-500 text-sm mb-8">
        Check your inbox for order details and tracking information once your items ship.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/orders">
          <Button variant="secondary">View My Orders</Button>
        </Link>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  )
}
