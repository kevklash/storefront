"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setDeleting(true)
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
    router.refresh()
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-2 text-xs">
        <span className="text-gray-500">Delete &quot;{name}&quot;?</span>
        <button onClick={handleDelete} disabled={deleting} className="text-red-600 hover:underline font-medium">
          {deleting ? "Deleting…" : "Yes"}
        </button>
        <button onClick={() => setConfirming(false)} className="text-gray-400 hover:underline">No</button>
      </span>
    )
  }

  return (
    <button onClick={() => setConfirming(true)} className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Delete product">
      <Trash2 size={15} />
    </button>
  )
}
