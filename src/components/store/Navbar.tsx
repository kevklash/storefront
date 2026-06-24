"use client"

import Link from "next/link"
import { ShoppingCart, User, Menu, X, LayoutDashboard } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { useSession } from "next-auth/react"
import { signOutAction, signInWithGoogle } from "@/app/actions/auth"
import { useState } from "react"

export default function Navbar() {
  const itemCount = useCartStore((s) => s.itemCount())
  const { data: session } = useSession()
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin"
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-xl tracking-tight text-black">
          STOREFRONT
        </Link>

        <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-gray-600 hover:text-black transition-colors">Shop</Link>
          {isAdmin && (
            <Link href="/admin" className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs rounded-lg hover:bg-gray-800 transition-colors">
              <LayoutDashboard size={13} /> Admin
            </Link>
          )}
          {session ? (
            <>
              <Link href="/orders" className="text-gray-600 hover:text-black transition-colors">My Orders</Link>
              <form action={signOutAction}>
                <button type="submit" className="text-gray-600 hover:text-black transition-colors">Sign Out</button>
              </form>
            </>
          ) : (
            <button onClick={() => signInWithGoogle()} className="text-gray-600 hover:text-black transition-colors flex items-center gap-1">
              <User size={16} /> Sign In
            </button>
          )}
          <Link href="/cart" className="relative">
            <ShoppingCart size={20} className="text-gray-700 hover:text-black transition-colors" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
        </div>

        <button className="sm:hidden text-black" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4 text-sm font-medium text-gray-900">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-gray-900 hover:text-black">Shop</Link>
          <Link href="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-900 hover:text-black">
            <ShoppingCart size={16} /> Cart {itemCount > 0 && `(${itemCount})`}
          </Link>
          {isAdmin && (
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-900 hover:text-black">
              <LayoutDashboard size={16} /> Admin Dashboard
            </Link>
          )}
          {session ? (
            <>
              <Link href="/orders" onClick={() => setMenuOpen(false)} className="text-gray-900 hover:text-black">My Orders</Link>
              <form action={signOutAction}>
                <button type="submit" className="text-left text-gray-900 hover:text-black">Sign Out</button>
              </form>
            </>
          ) : (
            <button onClick={() => signInWithGoogle()} className="text-left flex items-center gap-2 text-gray-900 hover:text-black">
              <User size={16} /> Sign In with Google
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
