export const dynamic = "force-dynamic"

import { connectDB } from "@/lib/mongoose"
import Order from "@/models/Order"
import type { Order as OrderType } from "@/types"
import OrderStatusSelect from "./OrderStatusSelect"
import { formatPrice } from "@/lib/utils"

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
}

async function getOrders() {
  await connectDB()
  return Order.find({}).sort({ createdAt: -1 }).lean()
}

export default async function AdminOrdersPage() {
  const orders = await getOrders() as unknown as OrderType[]

  return (
    <div>
      <h1 className="text-xl font-bold mb-6 text-black">Orders</h1>

      {!orders.length ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <p className="text-gray-700">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-semibold font-mono text-sm text-black">{order.orderNumber}</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {new Date(order.createdAt).toLocaleString("en-US", {
                      year: "numeric", month: "short", day: "numeric",
                      hour: "numeric", minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{order.customerName} · {order.customerEmail}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {order.status}
                  </span>
                  <OrderStatusSelect orderId={order._id} currentStatus={order.status} />
                </div>
              </div>

              <div className="text-sm text-gray-800 space-y-0.5 mb-3">
                {order.items.map((item, i) => (
                  <p key={i}>{item.productName} ({item.size}) × {item.quantity} — {formatPrice(item.price * item.quantity)}</p>
                ))}
              </div>

              <div className="flex flex-wrap gap-6 text-xs text-gray-600 border-t border-gray-100 pt-3">
                <span>Subtotal: {formatPrice(order.subtotal)}</span>
                <span>Shipping: {formatPrice(order.shipping)}</span>
                <span className="font-semibold text-black">Total: {formatPrice(order.total)}</span>
                <span>Ship to: {order.shippingAddress.city}, {order.shippingAddress.state}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
