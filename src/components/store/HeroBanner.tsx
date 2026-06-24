import Link from "next/link"
import Image from "next/image"
import { connectDB } from "@/lib/mongoose"
import SiteSettings from "@/models/SiteSettings"
import MobileSearchToggle from "./MobileSearchToggle"

type BannerConfig = {
  imageUrl: string
  headline: string
  subtitle: string
  ctaText: string
  ctaHref: string
  enabled: boolean
}

const DEFAULT_CONFIG: BannerConfig = {
  imageUrl: "",
  headline: "New Arrivals",
  subtitle: "Discover the latest styles",
  ctaText: "Shop Now",
  ctaHref: "/",
  enabled: true,
}

async function getBannerConfig(): Promise<BannerConfig> {
  await connectDB()
  const doc = await SiteSettings.findOne({ key: "banner" }).lean<BannerConfig & { _id: unknown }>()
  if (!doc) return DEFAULT_CONFIG
  const { _id, ...rest } = doc
  void _id
  return { ...DEFAULT_CONFIG, ...rest }
}

export default async function HeroBanner() {
  const config = await getBannerConfig()
  if (!config.enabled) return null

  return (
    <div className="relative w-full h-[65vh] min-h-[400px] overflow-hidden bg-neutral-900 flex items-center justify-center">
      {config.imageUrl ? (
        <Image
          src={config.imageUrl}
          alt="Hero banner"
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-stone-900" />
      )}
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 text-center text-white px-6 max-w-2xl">
        <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-4">Collection</p>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-none mb-4">
          {config.headline}
        </h1>
        <p className="text-base sm:text-lg text-white/70 mb-8">{config.subtitle}</p>
        <Link
          href={config.ctaHref}
          className="inline-block bg-white text-black px-10 py-3 text-xs font-bold tracking-[0.2em] uppercase hover:bg-white/90 transition"
        >
          {config.ctaText}
        </Link>
      </div>
      <MobileSearchToggle />
    </div>
  )
}
