export const dynamic = "force-dynamic"

import { connectDB } from "@/lib/mongoose"
import Product from "@/models/Product"
import Order from "@/models/Order"
import Link from "next/link"

async function getStats() {
  await connectDB()
  const [totalProducts, activeProducts, totalOrders, recentOrders] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Order.find().sort({ createdAt: -1 }).limit(5).lean(),
  ])
  const revenue = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: null, total: { $sum: "$total" } } },
  ])
  return {
    totalProducts,
    activeProducts,
    totalOrders,
    revenue: revenue[0]?.total ?? 0,
    recentOrders,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { label: "Total Products", value: stats.totalProducts, sub: `${stats.activeProducts} active` },
    { label: "Total Orders", value: stats.totalOrders },
    { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, sub: "excl. cancelled" },
  ]

  return (
    <div>
      <h1 className="text-xl font-bold mb-6 text-black">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs text-gray-700 mb-1">{c.label}</p>
            <p className="text-2xl font-bold text-black">{c.value}</p>
            {c.sub && <p className="text-xs text-gray-600 mt-1">{c.sub}</p>}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-sm text-black">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-gray-700 hover:text-black">View all →</Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="text-gray-700 text-sm px-5 py-6">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-700 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-medium">Order</th>
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((o: {
                _id: { toString(): string }
                orderNumber: string
                customerName: string
                status: string
                total: number
              }) => (
                <tr key={o._id.toString()} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3 font-mono text-xs text-black">{o.orderNumber}</td>
                  <td className="px-5 py-3 text-gray-700">{o.customerName}</td>
                  <td className="px-5 py-3 capitalize text-gray-700">{o.status}</td>
                  <td className="px-5 py-3 text-right font-medium text-black">${o.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
