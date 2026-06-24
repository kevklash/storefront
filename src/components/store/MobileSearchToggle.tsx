"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { useRouter } from "next/navigation"

export default function MobileSearchToggle() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = value.trim()
    router.push(q ? `/?search=${encodeURIComponent(q)}` : "/")
    setOpen(false)
    setValue("")
  }

  function handleClose() {
    setOpen(false)
    setValue("")
  }

  return (
    <div className="sm:hidden absolute bottom-6 left-0 right-0 flex justify-center z-20 px-6">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/20 transition"
        >
          <Search size={15} />
          Search products
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full max-w-sm">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-9 pr-4 py-2.5 rounded-full text-sm text-black bg-white focus:outline-none shadow-lg"
            />
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-white/70 hover:text-white transition p-1 flex-shrink-0"
          >
            <X size={20} />
          </button>
        </form>
      )}
    </div>
  )
}
