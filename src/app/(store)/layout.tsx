import type { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"
import Navbar from "@/components/store/Navbar"
import HeroBanner from "@/components/store/HeroBanner"
import BannerOnHome from "@/components/store/BannerOnHome"
import { connectDB } from "@/lib/mongoose"
import SiteSettings from "@/models/SiteSettings"

async function getStoreName(): Promise<string> {
  await connectDB()
  const doc = await SiteSettings.findOne({ key: "banner" }).select("storeName").lean<{ storeName?: string }>()
  return doc?.storeName ?? "Storefront"
}

export default async function StoreLayout({ children }: { children: ReactNode }) {
  const storeName = await getStoreName()

  return (
    <SessionProvider>
      <div className="min-h-screen bg-white">
        <Navbar storeName={storeName} />
        <BannerOnHome>
          <HeroBanner />
        </BannerOnHome>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
        <footer className="border-t border-gray-100 mt-16 py-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} {storeName}
        </footer>
      </div>
    </SessionProvider>
  )
}
