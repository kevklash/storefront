"use client"

import { useEffect, useState } from "react"
import { useSession, signIn } from "next-auth/react"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import type { Order } from "@/types"

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/orders")
        .then((r) => r.json())
        .then((data) => setOrders(data))
        .finally(() => setLoading(false))
    } else if (status !== "loading") {
      setLoading(false)
    }
  }, [status])

  if (status === "unauthenticated") {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <h1 className="text-2xl font-bold mb-3 text-black">My Orders</h1>
        <p className="text-gray-700 mb-6">Sign in to view your order history.</p>
        <button
          onClick={() => signIn("google")}
          className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          Sign In with Google
        </button>
      </div>
    )
  }

  if (loading) {
    return <div className="py-16 text-center text-gray-700">Loading orders…</div>
  }

  if (!orders.length) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <h1 className="text-2xl font-bold mb-3 text-black">My Orders</h1>
        <p className="text-gray-700 mb-6">You haven&apos;t placed any orders yet.</p>
        <Link href="/" className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-black">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="border border-gray-200 rounded-xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-semibold text-sm text-black">{order.orderNumber}</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                {order.status}
              </span>
            </div>
            <div className="space-y-1">
              {order.items.map((item, i) => (
                <p key={i} className="text-sm text-gray-800">
                  {item.productName} ({item.size}) × {item.quantity}
                </p>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-700">Total</p>
              <p className="font-semibold text-sm text-black">{formatPrice(order.total)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
