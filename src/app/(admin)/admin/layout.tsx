import type { ReactNode } from "react"
import Link from "next/link"
import { Package, ShoppingBag, LayoutDashboard, ExternalLink, LogOut, Settings, Users } from "lucide-react"
import { signOutAction } from "@/app/actions/auth"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-5 border-b border-gray-100">
          <span className="font-bold text-sm text-black">Admin</span>
        </div>
        <nav className="flex-1 p-3 space-y-1 text-sm">
          <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-900 hover:bg-gray-50 hover:text-black transition-colors">
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-900 hover:bg-gray-50 hover:text-black transition-colors">
            <Package size={16} /> Products
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-900 hover:bg-gray-50 hover:text-black transition-colors">
            <ShoppingBag size={16} /> Orders
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-900 hover:bg-gray-50 hover:text-black transition-colors">
            <Settings size={16} /> Settings
          </Link>
          <Link href="/admin/admins" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-900 hover:bg-gray-50 hover:text-black transition-colors">
            <Users size={16} /> Admins
          </Link>
        </nav>
        <div className="p-3 border-t border-gray-100 space-y-1">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:text-black transition-colors">
            <ExternalLink size={13} /> View Store
          </Link>
          <form action={signOutAction}>
            <button type="submit" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:text-black transition-colors w-full">
              <LogOut size={13} /> Sign Out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
