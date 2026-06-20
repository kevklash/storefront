"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { OrderStatus } from "@/types"

const STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"]

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: OrderStatus
}) {
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  async function handleChange(next: OrderStatus) {
    setSaving(true)
    setStatus(next)
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    })
    setSaving(false)
    router.refresh()
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value as OrderStatus)}
      disabled={saving}
      className="text-xs text-black border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-black capitalize disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
      ))}
    </select>
  )
}
