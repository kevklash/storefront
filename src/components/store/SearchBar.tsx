"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useRef } from "react"
import { Search, X } from "lucide-react"

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)
  const current = searchParams.get("search") ?? ""

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = inputRef.current?.value.trim() ?? ""
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set("search", value)
    } else {
      params.delete("search")
    }
    router.push(`/?${params}`)
  }

  function handleClear() {
    if (inputRef.current) inputRef.current.value = ""
    const params = new URLSearchParams(searchParams.toString())
    params.delete("search")
    router.push(`/?${params}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative mb-6">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        defaultValue={current}
        placeholder="Search products…"
        className="w-full pl-9 pr-10 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
      />
      {current && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
        >
          <X size={14} />
        </button>
      )}
    </form>
  )
}
